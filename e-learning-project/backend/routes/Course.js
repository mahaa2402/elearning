const express = require('express');
const router = express.Router();
const Common_Course = require('../models/common_courses');
const {getcourse}=require('../controllers/User')

 const Quiz=require('../models/Quiz');
// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses', message: err.message });
  }
});

// POST /api/courses - Create a new course
router.post('/', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create course', message: err.message });
  }
});

router.get('/getcourse', async (req, res) => {
  try {
    const courseSummaries = await Common_Course.getCourseInfoWithoutModules();
    console.log("hello")
    res.status(200).json(courseSummaries);
  } catch (error) {
    console.error('Error fetching course summaries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/getcoursedetailpage',getcourse)

router.post('/questions', async (req, res) => {  // POST /api/quiz/questions
  const { courseId, moduleId, attemptNumber = 1 } = req.body;

  if (!courseId || !moduleId) {
    return res.status(400).json({ error: 'courseId and moduleId are required' });
  }

  try {
    // Use the new batch method to get questions based on attempt number
    const quiz = await Quiz.getQuestionsByCourseAndModuleBatch(courseId, moduleId, attemptNumber);
    
    console.log("the quiz is", quiz);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz.questions); // returns the array of questions
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
