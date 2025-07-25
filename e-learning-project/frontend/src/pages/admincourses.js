import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './sidebar';
import { Plus, Edit, Trash2, Eye, Video, Search, Filter, PlayCircle, ChevronDown, ChevronUp, X, Save } from "lucide-react";

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
      setError('Please fill in all required fields');
      return;
    }
    if (formData.modules.length === 0) {
      setError('Please add at least one module to the course');
      return;
    }

    const courseData = {
      name: formData.name,
      description: formData.description,
      category: formData.category || 'General',
      duration: formData.duration || 'TBD',
      status: formData.status || 'Draft',
      modules: formData.modules.map(module => ({
        _id: module._id,
        title: module.title,
        video: module.video || null,
        quiz: {
          questions: module.quiz.questions.map(q => ({
            question: q.question,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points
          })),
          passingScore: module.quiz.passingScore
        }
      })),
      createdDate: formData.createdDate || '2025-07-03',
      enrollments: formData.enrollments || 0
    };

    setIsLoading(true);
    try {
      let response;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      };

      if (editingCourse) {
        response = await fetch(`${API_BASE_URL}/api/admin/courses/${editingCourse._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(courseData)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
          method: 'POST',
          headers,
          body: JSON.stringify(courseData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save course: ${errorData.message || 'Unknown error'}`);
      }

      // Instead of updating state locally, re-fetch all courses for consistency
      await fetchCourses();
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

    const newModule = {
      ...currentModule,
      id: `mod${formData.modules.length + 1}`,
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
  };

  const removeModule = (moduleIndex) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter((_, index) => index !== moduleIndex)
    });
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoData = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
      };
      setCurrentModule({
        ...currentModule,
        video: videoData
      });
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
                        <div key={module.id} className="flex items-center text-xs text-gray-600 bg-gray-50 p-2 rounded">
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
                              <div key={module.id} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                                      <p className="text-sm text-gray-600">
                                        Video: {module.video?.name} • Quiz: {module.quiz.questions.length || module.quiz.questions} questions
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => toggleModuleExpansion(index)}
                                      className="text-gray-400 hover:text-gray-600"
                                      disabled={isLoading}
                                    >
                                      {expandedModules[index] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                    <button
                                      onClick={() => removeModule(index)}
                                      className="text-red-600 hover:text-red-800"
                                      disabled={isLoading}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                {expandedModules[index] && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h5 className="font-medium text-gray-900 mb-2">Video Content</h5>
                                        <div className="bg-white p-3 rounded border">
                                          <div className="flex items-center">
                                            <Video className="w-4 h-4 text-blue-600 mr-2" />
                                            <span className="text-sm">{module.video?.name}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <h5 className="font-medium text-gray-900 mb-2">Quiz Questions</h5>
                                        <div className="bg-white p-3 rounded border">
                                          <div className="text-sm text-gray-600">
                                            {module.quiz.questions.length || module.quiz.questions} questions • {module.quiz.passingScore}% to pass
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
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
                                  ref={ref => videoInputRefs.current.module = ref}
                                  onChange={handleVideoUpload}
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
                                        onClick={() => videoInputRefs.current.module?.click()}
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

                            <button
                              onClick={addModule}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                              disabled={isLoading}
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add Module</span>
                            </button>
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