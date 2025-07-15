// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Admin = require('./models/Admin');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/Admin');
const courseRoutes = require('./routes/Course');
const employeeRoutes = require('./routes/Employee');
const assignedTaskRoutes = require('./routes/AssignedTask');
const progressRoutes = require('./routes/progressRoutes');
const { createAssignedTask, getAssignedTasks, getAssignedTaskById, updateAssignedTaskProgress, deleteAssignedTask } = require('./controllers/Admin');

const app = express();


console.log('🔧 Starting E-learning Server...');

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'X-Access-Token', 'X-Auth-Token', 'access-token'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced debug middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log(`   Body: ${JSON.stringify(req.body, null, 2)}`);
  }
  console.log('   ========================\n');
  next();
});

// MongoDB connection
const mongoURI = 'mongodb+srv://mahaashri:mahaashri%40123@e-learning-platform.wx1swy3.mongodb.net/elearning?retryWrites=true&w=majority';

// Create default admin account if none exists (for testing)
const createDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const defaultAdmin = new Admin({
        name: 'Default Admin',
        email: 'admin@elearning.com',
        password: hashedPassword
      });
      await defaultAdmin.save();
      console.log('✅ Default admin created - Email: admin@elearning.com, Password: admin123');
    }
  } catch (err) {
    console.error('❌ Error creating default admin:', err);
  }
};

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    createDefaultAdmin();
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Admin routes at /api/admin/*
app.use('/api', adminRoutes); // ADDED: Also mount admin routes directly at /api/* for frontend compatibility
app.use('/api/courses', courseRoutes);
app.use('/api', employeeRoutes);
app.use('/api', assignedTaskRoutes);
app.use('/api/progress', progressRoutes);

// Test and Health Routes
app.get('/', (req, res) => {
  console.log('🏠 Home route accessed');
  res.json({ 
    message: '🌐 E-learning backend is running...',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /',
      'GET /health',
      'GET /test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/admin/* (Admin routes with /admin prefix)',
      'GET /api/* (Admin routes with direct /api prefix)',
      'GET /api/assignedtasks (Available)',
      'GET /api/assigned-courses (Available)',
      'GET /api/employees (Available)'
    ]
  });
});

app.get('/health', (req, res) => {
  console.log('🏥 Health check accessed');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    port: process.env.PORT || 5000,
    availableRoutes: {
      auth: '/api/auth/*',
      admin: ['/api/admin/*', '/api/*'],
      courses: '/api/courses/*',
      assignedTasks: '/api/assignedtasks',
      assignedCourses: '/api/assigned-courses'
    }
  });
});

app.get('/test', (req, res) => {
  console.log('🧪 Test route accessed');
  res.json({ message: 'Test route working!', timestamp: new Date().toISOString() });
});

// Error Handling
app.use((req, res, next) => {
  console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /api/assignedtasks',
      'GET /api/assigned-courses', 
      'GET /api/employees',
      'GET /api/admin/assignedtasks',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error('💥 Unexpected error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Available routes:`);
  console.log(`   - GET /api/assignedtasks ✅`);
  console.log(`   - GET /api/assigned-courses ✅`);
  console.log(`   - GET /api/employees ✅`);
  console.log(`   - GET /api/admin/assignedtasks ✅`);
  console.log(`   - POST /api/auth/login ✅`);
  console.log(`   - POST /api/auth/register ✅`);
  console.log(`   - GET /health ✅`);
  console.log(`   - GET /test ✅`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  server.close();
  await mongoose.connection.close();
  console.log('📴 Server and database connections closed');
  process.exit(0);
});