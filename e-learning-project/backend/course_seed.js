const mongoose = require('mongoose');
const Course = require('./models/common_courses'); // adjust the path as needed
require('dotenv').config();

async function createCourse() {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI); 
    await mongoose.connect(process.env.MONGO_URI)

    const newCourse = new Course({
      title: 'POSH',
      modules: [
        {
          m_id: 'POSH01',
          name: 'Foundations – The Why Behind POSH',
          duration: 60,
          description: 'Learn about variables, data types, and memory.',
          lessons: 4
        },
        {
          m_id: 'POSH02',
          name: 'Who’s Protected & What Counts as Harassment',
          duration: 90,
          description: 'If-else, loops, and switch-case in depth.',
          lessons: 4
        },
        {
          m_id: 'POSH03',
          name: 'How to File a Complaint – And What Happens Next',
          duration: 90,
          description: 'If-else, loops, and switch-case in depth.',
          lessons: 4
        },
         {
          m_id: 'POSH04',
          name: 'Employer’s Role & Confidentiality Matters',
          duration: 90,
          description: 'If-else, loops, and switch-case in depth.',
          lessons: 4
        }
      ]
    });

    const savedCourse = await newCourse.save();
    console.log('Course created:', savedCourse);

    //mongoose.connection.close(); // Close connection after saving
  } catch (error) {
    console.error('Error creating course:', error);
  }
}

createCourse();
