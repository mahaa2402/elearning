const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/common_courses');
const Quiz = require('./models/Quiz');

async function createQuizzes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const course = await Course.findOne({ title: 'POSH' });

    if (!course) {
      throw new Error('Course "POSH" not found');
    }

    const quizzes = course.modules.map(module => {
      const questions = Array.from({ length: 10 }, (_, index) => ({
        question: `Question ${index + 1} for ${module.name}`,
        type: 'multiple-choice',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        points: 1
      }));

      return {
        courseId: course._id,
        mo_id: module.m_id,
        questions,
        passingScore: 70
      };
    });

    const createdQuizzes = await Quiz.insertMany(quizzes);
    console.log('Quizzes created:', createdQuizzes.length);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding quizzes:', error.message);
  }
}

createQuizzes();
