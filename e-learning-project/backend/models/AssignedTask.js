const mongoose = require('mongoose');

const assignedTaskSchema = new mongoose.Schema({
  taskTitle: { type: String, required: true },
  description: { type: String, required: true },
  module: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  deadline: { type: Date, required: true },
  estimatedHours: { type: Number },
  reminderDays: { type: Number, default: 3 },
  assignedBy: {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true }
  },
  assignees: [{
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    employeeDepartment: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['assigned', 'in-progress', 'completed', 'overdue'], 
      default: 'assigned' 
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    progress: { type: Number, default: 0 },
    notes: { type: String }
  }],
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reminderSent: { type: Boolean, default: false },
  reminderSentAt: { type: Date },
  totalAssignees: { type: Number, default: 0 },
  completedCount: { type: Number, default: 0 },
  averageCompletionTime: { type: Number }
});

// Pre-save middleware to calculate totals
assignedTaskSchema.pre('save', function(next) {
  this.totalAssignees = this.assignees.length;
  this.completedCount = this.assignees.filter(assignee => assignee.status === 'completed').length;
  this.updatedAt = new Date();
  next();
});

const AssignedTask = mongoose.model('AssignedTask', assignedTaskSchema);

module.exports = AssignedTask; 