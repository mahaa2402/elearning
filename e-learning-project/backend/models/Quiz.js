const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, required: true }, // module._id inside Course

  title: { type: String, required: true },

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

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
