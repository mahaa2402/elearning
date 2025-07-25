const express = require('express');
const router = express.Router();
const Common_Course = require('../models/common_courses');
const {getcourse}=require('../controllers/User')

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



module.exports = router;
