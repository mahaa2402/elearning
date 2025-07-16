// const mongoose = require('mongoose');

// const courseSchema = new mongoose.Schema(
//     {
//         title: { type: String, required: true },


//     }
// )

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    modules: [
      {
        m_id:{ type: String, required: true },
        name: { type: String, required: true },        // Module title or name
        duration: { type: Number, required: true },    // Duration in minutes/hours
        description: { type: String },                 // Optional: brief description
        lessons: { type: Number, required: true }                     
      }
    ]
  }
  
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
