const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  employeeEmail: { type: String, required: true },
  courseTitle: { type: String, required: true },
  date: { type: String, required: true },
  module: { type: String, default: 'Information Security & Data Protection' }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Check if model already exists before creating it
module.exports = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
