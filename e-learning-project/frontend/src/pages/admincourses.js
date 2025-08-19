import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './sidebar';import axios from "axios";

import { Plus, Edit, Trash2, Eye, Video, Search, Filter, PlayCircle, ChevronDown, ChevronUp, X, Save, Clock, CheckCircle, Upload } from "lucide-react";

const CourseAdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('basic');
  const [expandedModules, setExpandedModules] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const videoInputRefs = useRef({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    duration: '',
    status: 'Draft',
    modules: [],
    createdDate: '2025-07-03',
    enrollments: 0
  });

  const [currentModule, setCurrentModule] = useState({
    id: '',
    title: '',
    video: null,
    quiz: {
      questions: [],
      passingScore: 70
    }
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1
  });

  const categories = ['Security', 'HR & Compliance', 'Technical', 'Soft Skills', 'Leadership'];
  const questionTypes = ['multiple-choice', 'true-false', 'fill-in-blank'];

  const API_BASE_URL = 'http://localhost:5000';

  // Add a function to fetch courses and expose it for reuse
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCourses(data.map(course => ({
          ...course,
          id: course._id,
          name: course.name || 'Untitled',
          description: course.description || 'No description',
          duration: course.duration || 'N/A',
          modules: course.modules || [],
          enrollments: course.enrollments || 0,
          status: course.status || 'Draft'
        })));
      } else {
        throw new Error('Invalid data format: Expected an array');
      }
    } catch (err) {
      setError(`Error fetching mahaaa courses: ${err.message}`);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Debug: Monitor form data changes
  useEffect(() => {
    console.log("🔍 Form data changed:", {
      modulesCount: formData.modules?.length || 0,
      pendingUploads: formData.modules?.filter(m => m.video?.pendingUpload).length || 0,
      modules: formData.modules
    });
  }, [formData.modules]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      duration: '',
      status: 'Draft',
      modules: [],
      createdDate: '2025-07-03',
      enrollments: 0
    });
    setCurrentModule({
      id: '',
      title: '',
      video: null,
      quiz: {
        questions: [],
        passingScore: 70,
      }
    });
    setCurrentQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    });
    setActiveTab('basic');
    setExpandedModules({});
  };

  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        ...course,
        id: course._id
      });
    } else {
      setEditingCourse(null);
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    resetForm();
  };
  
const handleSave = async () => {
  if (!formData.name || !formData.description) {
    setError("Please fill in all required fields");
    return;
  }

  const courseData = {
    name: formData.name,
    description: formData.description,
    category: formData.category || "General",
    duration: formData.duration || "TBD",
    status: formData.status || "Draft",
    modules: (formData.modules || []).map((module) => ({
      title: module.title,
      quiz: {
        questions: (module.quiz?.questions || []).map((q) => ({
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points,
        })),
        passingScore: module.quiz?.passingScore || 0,
      },
    })),
    createdDate: formData.createdDate || "2025-07-03",
    enrollments: formData.enrollments || 0,
  };

  setIsLoading(true);
  try {
    let response, savedCourse;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    };

         console.log("🔍 Course data being saved:", courseData);
     console.log("🔍 Current form data:", formData);
     console.log("🔍 Editing course:", editingCourse);

     if (editingCourse) {
       // ✅ Update existing course
       console.log("📝 Updating existing course:", editingCourse.name, "→", formData.name);
       response = await fetch(
         `${API_BASE_URL}/api/admin/courses/${editingCourse._id}`,
         { method: "PUT", headers, body: JSON.stringify(courseData) }
       );
       if (!response.ok) throw new Error("Failed to update course");
       savedCourse = { _id: editingCourse._id }; // reuse existing course ID
       console.log("✅ Course updated successfully");
     } else {
       // ✅ Create new course
       console.log("📝 Creating new course:", formData.name);
       response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
         method: "POST",
         headers,
         body: JSON.stringify(courseData),
       });
       if (!response.ok) throw new Error("Failed to create course");
       savedCourse = await response.json(); // get new ID
       console.log("✅ Course created successfully");
     }

    console.log("✅ Course saved successfully!", savedCourse);

         // --- Upload videos if pending ---
     for (let i = 0; i < formData.modules.length; i++) {
       const module = formData.modules[i];
       if (module.video?.file && module.video?.pendingUpload) {
         console.log(`📤 Uploading video for module ${i + 1}: ${module.title}`);

         const formDataToSend = new FormData();
         formDataToSend.append("video", module.video.file);

         // Use course name instead of ID for consistent S3 folder structure
         if (!formData.name || formData.name.trim() === '') {
           console.error('❌ Course name is empty or undefined');
           alert('Course name is required for video upload');
           continue; // Skip this module
         }
         
         const courseName = formData.name.replace(/\s+/g, '_');
         const moduleNumber = i + 1;

         console.log(`📤 Course details:`, {
           originalName: formData.name,
           sanitizedName: courseName,
           moduleNumber: moduleNumber,
           moduleTitle: module.title
         });
         console.log(`📤 Uploading to: ${courseName}/Module${moduleNumber}`);

         const res = await axios.post(
           `${API_BASE_URL}/api/videos/upload-video/${courseName}/${moduleNumber}`,
           formDataToSend,
           {
             headers: {
               "Content-Type": "multipart/form-data",
               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
             },
             timeout: 30000,
           }
         );

         if (res.data.success) {
           console.log(`✅ Video uploaded for module ${i + 1} to ${courseName}/Module${moduleNumber}`);
         }
       }
     }

    alert("Course and videos saved successfully! 🎉");
    closeModal();

  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};


  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) throw new Error(`Failed to delete course: ${response.statusText}`);
        // Instead of updating state locally, re-fetch all courses for consistency
        await fetchCourses();
      } catch (err) {
        setError('Error deleting course: ' + err.message);
      }
    }
  };

  const addModule = () => {
    if (formData.modules.length >= 5) {
      alert('Maximum 5 modules allowed per course');
      return;
    }

    if (!currentModule.title) {
      alert('Please enter module title');
      return;
    }

    if (!currentModule.video) {
      alert('Please upload a video for this module');
      return;
    }

    if (currentModule.quiz.questions.length === 0) {
      alert('Please add at least one quiz question for this module');
      return;
    }

    // Simple: just add module locally
    const newModule = {
      ...currentModule,
      id: `mod${formData.modules.length + 1}`,
      video: {
        ...currentModule.video,
        pendingUpload: true // Mark for later upload
      },
      quiz: {
        ...currentModule.quiz,
        questions: [...currentModule.quiz.questions]
      }
    };

    setFormData({
      ...formData,
      modules: [...formData.modules, newModule]
    });

    setCurrentModule({
      id: '',
      title: '',
      video: null,
      quiz: {
        questions: [],
        passingScore: 70
      }
    });

    console.log("✅ Module added locally - ready for video upload");
  };

  const removeModule = (moduleIndex) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter((_, index) => index !== moduleIndex)
    });
  };

  // Test backend connection
  const testBackendConnection = async () => {
    console.log('🔍 Testing backend connection...');
    
    try {
      // Test basic connectivity
      const response = await axios.get(`${API_BASE_URL}/api/videos/health`, { timeout: 5000 });
      console.log('✅ Backend health check successful:', response.data);
      alert('Backend is accessible! ✅\n\nVideo upload service is running.');
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      
      if (error.response?.status === 404) {
        alert('Backend is running but health endpoint not found.\n\nThis might mean:\n1. Backend server needs restart\n2. Route not properly registered\n\nTry restarting your backend server.');
      } else if (error.response?.status === 500) {
        alert('Backend server error (500).\n\nThis usually means:\n1. AWS credentials are missing\n2. Environment variables not set\n3. Server configuration error\n\nCheck your backend console for errors.');
      } else if (error.code === 'ECONNREFUSED') {
        alert('Backend server is not running.\n\nPlease start your backend server first.');
      } else {
        alert(`Backend connection failed: ${error.message}\n\nStatus: ${error.response?.status || 'Unknown'}`);
      }
    }
  };

  // Simple video upload function
  const handleUploadPendingVideos = async () => {
    if (!formData.name) {
      alert('Please enter a course name first');
      return;
    }

    if (!formData.modules || formData.modules.length === 0) {
      alert('Please add at least one module with video');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📤 Starting simple video upload...');
      
      // Upload each module video to AWS S3
      for (let i = 0; i < formData.modules.length; i++) {
        const module = formData.modules[i];
        if (module.video && module.video.file) {
          console.log(`📤 Uploading video for module ${i + 1}: ${module.title}`);
          
          const formDataToSend = new FormData();
          formDataToSend.append("video", module.video.file);
          
          // Use course name and module number for S3 path
          const courseName = formData.name.replace(/\s+/g, '_');
          const moduleNumber = i + 1;
          
          const res = await axios.post(
            `${API_BASE_URL}/api/videos/upload-video/${courseName}/${moduleNumber}`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              timeout: 30000,
            }
          );

          if (res.data.success) {
            console.log(`✅ Video uploaded for module ${moduleNumber}: ${module.title}`);
            
            // Update module with S3 video data
            const updatedModules = [...formData.modules];
            updatedModules[i].video = {
              ...updatedModules[i].video,
              url: res.data.video.url,
              s3Key: res.data.video.s3Key,
              uploadedAt: res.data.video.uploadedAt,
              pendingUpload: false
            };
            
            setFormData({ ...formData, modules: updatedModules });
          }
        }
      }
      
      alert('All videos uploaded successfully to AWS S3! 🎉');
      closeModal();
      
    } catch (error) {
      console.error('Failed to upload videos:', error);
      
      if (error.response?.status === 500) {
        alert('Server error (500). Check if AWS credentials are configured in backend.');
      } else {
        alert(`Video upload failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Simple video upload function - no complex logic needed

  
 const handleVideoUpload = async (e, moduleIndex) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("video/")) {
    alert("Please select a valid video file");
    return;
  }

  // Validate file size (500MB limit)
  if (file.size > 500 * 1024 * 1024) {
    alert("Video file size must be less than 500MB");
    return;
  }

  try {
    // ✅ Handle "new module" case
    if (moduleIndex === "new") {
      setCurrentModule({
        ...currentModule,
        video: {
          file,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          type: file.type,
        },
      });
      return;
    }

    // ✅ Step 1: Ensure course is saved and has a real ID
    let courseId = editingCourse?._id || formData._id; 
    if (!courseId) {
      console.log("Saving new course before uploading video...");
      const saveRes = await axios.post(
        `${API_BASE_URL}/api/admin/courses`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      // Update state with saved course
      courseId = saveRes.data._id;
      setFormData(saveRes.data);

      console.log("Course saved, new ID:", courseId);
    }

    // ✅ Step 2: Ensure moduleId exists
    let moduleId = formData.modules[moduleIndex]?._id || formData.modules[moduleIndex]?.id;
    if (!moduleId) {
      moduleId = `temp_${Date.now()}_${moduleIndex}`;
    }

    // ✅ Step 3: Upload video to backend
    const formDataToSend = new FormData();
    formDataToSend.append("video", file);

    const res = await axios.post(
      `${API_BASE_URL}/api/videos/upload-video/${courseId}/${moduleId}`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    // ✅ Step 4: Update module with video metadata
    if (res.data.success) {
      const updatedModules = [...formData.modules];
      updatedModules[moduleIndex].video = {
        url: res.data.videoUrl, // matches backend after we fix response
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type,
        s3Key: res.data.s3Key,
        uploadedAt: res.data.uploadDate,
      };

      setFormData({ ...formData, modules: updatedModules });

      console.log("✅ Video uploaded successfully for module", moduleId);
    }
  } catch (error) {
    if (error.response) {
      console.error("Video upload failed:", error.response.data);
      alert("Upload failed: " + (error.response.data.error || "Server error"));
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("Upload failed: No response from server");
    } else {
      console.error("Error setting up request:", error.message);
      alert("Upload failed: " + error.message);
    }
  }
};


  

  const addQuestionToModule = () => {
    if (!currentQuestion.question) {
      alert('Please enter a question');
      return;
    }

    if (currentQuestion.type === 'multiple-choice' && currentQuestion.options.some(opt => !opt)) {
      alert('Please fill in all answer options for multiple-choice questions');
      return;
    }

    if (currentQuestion.type === 'true-false' && currentQuestion.correctAnswer === null) {
      alert('Please select the correct answer for true-false questions');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now(),
      options: currentQuestion.type === 'true-false' ? ['True', 'False'] : currentQuestion.options
    };

    setCurrentModule({
      ...currentModule,
      quiz: {
        ...currentModule.quiz,
        questions: [...currentModule.quiz.questions, newQuestion]
      }
    });

    setCurrentQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    });
  };

  const removeQuestionFromModule = (questionIndex) => {
    setCurrentModule({
      ...currentModule,
      quiz: {
        ...currentModule.quiz,
        questions: currentModule.quiz.questions.filter((_, index) => index !== questionIndex)
      }
    });
  };

  const toggleModuleExpansion = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (course.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-row bg-gray-50">
      <Sidebar className="w-64" />
      <div className="flex-1 p-6 main-content">
        <div className="max-w-7xl mx-auto content-container">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                <p className="text-gray-600 mt-2">Create, edit, and manage your modular e-learning courses</p>
              </div>
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                disabled={isLoading}
              >
                <Plus className="w-5 h-5" />
                <span>Create New Course</span>
              </button>
            </div>

            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Modules:</span>
                      <span className="font-medium">{course.modules?.length}/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Enrollments:</span>
                      <span className="font-medium">{course.enrollments}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Modules:</div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {(course.modules || []).map((module, index) => (
                        <div key={module._id || module.id || index} className="flex items-center text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          <PlayCircle className="w-3 h-3 mr-2 text-blue-500" />
                          <span className="flex-1 truncate">{module.title}</span>
                          <span className="text-gray-400">{module.quiz?.questions?.length || 0}Q</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(course)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors"
                      disabled={isLoading}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center justify-center transition-colors" disabled={isLoading}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredCourses.length === 0 && !isLoading && <p className="text-gray-500">No courses found.</p>}
            {isLoading && <p className="text-gray-500">Loading courses...</p>}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingCourse ? 'Edit Course' : 'Create New Course'}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {['basic', 'modules'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                          activeTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                        disabled={isLoading}
                      >
                        {tab === 'basic' ? 'Basic Info' : 'Modules & Content'}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter course name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Enter course description"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                          >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                          <input
                            type="text"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="e.g., 45 mins"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                          >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'modules' && (
                    <div className="space-y-8">
                      {formData.modules.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Course Modules ({formData.modules.length}/5)
                          </h3>
                         
                         <div className="space-y-4">
  {formData.modules.map((module, index) => (
    <div key={module.id || index} className="border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900">{module.title}</h4>
        <button
          onClick={() => removeModule(index)}
          className="text-red-600 hover:text-red-800"
          disabled={isLoading}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {module.quiz.questions.length} questions • {module.quiz.passingScore}% to pass
        {module.video && (
          <div className="mt-1">
            {module.video.pendingUpload ? (
              <span className="text-orange-600 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Video pending upload
              </span>
            ) : (
              <span className="text-green-600 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Video uploaded
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  ))}
</div>


                          </div>
                      )}


                      {formData.modules.length < 5 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Add New Module ({formData.modules.length + 1}/5)
                          </h3>
                          
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Module Title *</label>
                              <input
                                type="text"
                                value={currentModule.title}
                                onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                                placeholder="Enter module title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Module Video *</label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <input
                                  type="file"
                                  ref={ref => (videoInputRefs.current.newModule = ref)}
                                  onChange={(e) => handleVideoUpload(e, 'new')}
                                  accept="video/*"
                                  className="hidden"
                                  disabled={isLoading}
                                />

                                {currentModule.video ? (
                                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                                    <div className="flex items-center">
                                      <Video className="w-5 h-5 text-blue-600 mr-3" />
                                      <div>
                                        <p className="font-medium text-sm">{currentModule.video.name}</p>
                                        <p className="text-xs text-gray-500">{currentModule.video.size}</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => setCurrentModule({ ...currentModule, video: null })}
                                      className="text-red-600 hover:text-red-800"
                                      disabled={isLoading}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <Video className="mx-auto h-8 w-8 text-gray-400" />
                                    <div className="mt-2">
                                      <button
                                        type="button"
                                        onClick={() => videoInputRefs.current.newModule?.click()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                                        disabled={isLoading}
                                      >
                                        Upload Video
                                      </button>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">MP4, MOV, AVI up to 500MB</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium text-gray-900">Module Quiz *</h4>
                                <div className="flex items-center space-x-4">
                                  <label className="text-sm text-gray-600">
                                    Passing Score:
                                    <input
                                      type="number"
                                      value={currentModule.quiz.passingScore}
                                      onChange={(e) => setCurrentModule({
                                        ...currentModule,
                                        quiz: { ...currentModule.quiz, passingScore: parseInt(e.target.value) }
                                      })}
                                      min="50"
                                      max="100"
                                      className="ml-2 w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                      disabled={isLoading}
                                    />%
                                  </label>
                                </div>
                              </div>

                              {currentModule.quiz.questions.length > 0 && (
                                <div className="mb-4 space-y-2">
                                  {currentModule.quiz.questions.map((question, qIndex) => (
                                    <div key={question.id} className="bg-white border p-3 rounded-lg">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-1">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                              Q{qIndex + 1}
                                            </span>
                                            <span className="text-xs text-gray-500">{question.type}</span>
                                          </div>
                                          <p className="text-sm font-medium">{question.question}</p>
                                        </div>
                                        <button
                                          onClick={() => removeQuestionFromModule(qIndex)}
                                          className="text-red-600 hover:text-red-800 ml-2"
                                          disabled={isLoading}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-3">Add Quiz Question</h5>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                                    <select
                                      value={currentQuestion.type}
                                      onChange={(e) => setCurrentQuestion({ 
                                        ...currentQuestion, 
                                        type: e.target.value,
                                        options: e.target.value === 'true-false' ? ['True', 'False'] : ['', '', '', '']
                                      })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      disabled={isLoading}
                                    >
                                      {questionTypes.map(type => (
                                        <option key={type} value={type}>{type.replace('-', ' ').toUpperCase()}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                                    <input
                                      type="text"
                                      value={currentQuestion.question}
                                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                                      placeholder="Enter question text"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      disabled={isLoading}
                                    />
                                  </div>

                                  {currentQuestion.type === 'multiple-choice' && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options *</label>
                                      {currentQuestion.options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2 mb-2">
                                          <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                              const newOptions = [...currentQuestion.options];
                                              newOptions[index] = e.target.value;
                                              setCurrentQuestion({ ...currentQuestion, options: newOptions });
                                            }}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={isLoading}
                                          />
                                          <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={currentQuestion.correctAnswer === index}
                                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                                            disabled={isLoading}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {currentQuestion.type === 'true-false' && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                                      <div className="flex space-x-4">
                                        {['True', 'False'].map((option, index) => (
                                          <label key={option} className="flex items-center space-x-2">
                                            <input
                                              type="radio"
                                              name="correctAnswer"
                                              checked={currentQuestion.correctAnswer === index}
                                              onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                                              disabled={isLoading}
                                            />
                                            <span>{option}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {currentQuestion.type === 'fill-in-blank' && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                                      <input
                                        type="text"
                                        value={currentQuestion.options[0]}
                                        onChange={(e) => setCurrentQuestion({ 
                                          ...currentQuestion, 
                                          options: [e.target.value, '', '', ''],
                                          correctAnswer: 0
                                        })}
                                        placeholder="Enter correct answer"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={isLoading}
                                      />
                                    </div>
                                  )}

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                                    <input
                                      type="number"
                                      value={currentQuestion.points}
                                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })}
                                      min="1"
                                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      disabled={isLoading}
                                    />
                                  </div>

                                  <button
                                    onClick={addQuestionToModule}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                    disabled={isLoading}
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Question</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <button
                                onClick={addModule}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                disabled={isLoading}
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add Module</span>
                              </button>
                              
                              {/* Debug info - remove this later */}
                              <div className="text-xs text-gray-500 mb-2">
                                Debug: {formData.modules?.length || 0} modules, 
                                {formData.modules?.filter(m => m.video?.pendingUpload).length || 0} pending uploads
                                <br />
                                Modules: {formData.modules?.map(m => `${m.title} (${m.video?.pendingUpload ? 'pending' : 'uploaded'})`).join(', ') || 'none'}
                              </div>
                              
                              {/* Simple instruction message */}
                              {formData.modules?.some(m => m.video?.pendingUpload) && (
                                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                                  <div className="flex items-center">
                                    <Video className="w-4 h-4 mr-2" />
                                    <span className="font-medium">Ready to Upload Videos!</span>
                                  </div>
                                  <p className="mt-1 text-blue-700">
                                    Add your course name and modules, then click "Upload Videos to AWS S3" to store them in the cloud.
                                  </p>
                                </div>
                              )}
                              
                              {formData.modules && formData.modules.some(m => m.video?.pendingUpload) && (
                                <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span className="font-medium">Videos Pending Upload</span>
                                  </div>
                                  <p className="mt-1 text-orange-700">
                                    Some modules have videos that need to be uploaded to AWS S3.
                                  </p>
                                  <div className="space-y-2">
                                    
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 border-t border-gray-200 pt-4 flex justify-end space-x-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                   <button
  onClick={handleSave}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
  disabled={isLoading}
>
  {isLoading ? (
    <span>Saving...</span>
  ) : (
    <>
      <Save className="w-4 h-4" />
      <span>Save Course</span>
    </>
  )}
</button>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseAdminDashboard;