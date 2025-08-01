// const mongoose = require('mongoose');

// const quizSchema = new mongoose.Schema({
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   mo_id: { type: String, required: true },
//   questions: [
//     {
//       question: { type: String, required: true },
//       type: {
//         type: String,
//         enum: ['multiple-choice', 'true-false', 'fill-in-blank'],
//         default: 'multiple-choice'
//       },
//       options: [String],
//       correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
//       points: { type: Number, default: 1 }
//     }
//   ],
//   passingScore: { type: Number, default: 70 },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });


// // 📌 Static function to get all titles
// quizSchema.statics.getAllTitles = async function () {
//   const titles = await this.find({}, 'title').lean();
//   return titles.map(q => q.title);
// };

// const Quiz = mongoose.model('Quiz', quizSchema);

// module.exports = Quiz;



const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  mo_id: {
    type: String,
    required: true  // Will be validated to match a Course's module ID
  },
  questions: [
    {
      question: { type: String, required: true },
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'fill-in-blank'],
        default: 'multiple-choice'
      },
      options: [String],
      correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
      points: { type: Number, default: 1 }
    }
  ],
  passingScore: { type: Number, default: 70 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Validate that mo_id exists in the course's modules
quizSchema.pre('save', async function (next) {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.courseId);

  if (!course) {
    return next(new Error('Invalid courseId: Course not found'));
  }

  const moduleExists = course.modules.some(mod => mod.m_id === this.mo_id);

  if (!moduleExists) {
    return next(new Error(`Invalid mo_id: Module '${this.mo_id}' not found in course '${this.courseId}'`));
  }

  next();
});

quizSchema.statics.getQuestionsByCourseAndModule = async function (courseId, moduleId) {
  return this.findOne({ courseId, mo_id: moduleId }, { questions: 1, _id: 0 });
};

// New method to get questions in batches
quizSchema.statics.getQuestionsByCourseAndModuleBatch = async function (courseId, moduleId, attemptNumber ) { //attemptnumber ==1 changeddd
  const quiz = await this.findOne({ courseId, mo_id: moduleId }, { questions: 1, _id: 0 });
  
  if (!quiz || !quiz.questions) {
    return null;
  }

  const questions = quiz.questions;
  
  // For first attempt, return first 5 questions
  if (attemptNumber === 1) {
    return { questions: questions.slice(0, 5) };
  }
  
  // For retake (attempt 2), return next 5 questions (questions 6-10)
  if (attemptNumber === 2) {
    return { questions: questions.slice(5, 10) };
  }
  
  // For any other attempt, return all questions
  return { questions: questions };
};


const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
