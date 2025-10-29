const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import utilities and routes
const database = require('./utils/database');
const { createResponse, createErrorResponse } = require('./utils/helpers');

// Import routes
const storiesRoutes = require('./routes/stories');
const chaptersRoutes = require('./routes/chapters');
const charactersRoutes = require('./routes/characters');
const agentsRoutes = require('./routes/agents');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3001', // React dev server (default)
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Same origin
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: createErrorResponse('Too many requests from this IP, please try again later.', 429),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await database.healthCheck();
    const geminiHealth = await require('./utils/gemini').healthCheck();
    
    const overallStatus = dbHealth.status === 'healthy' && geminiHealth.status === 'healthy' ? 'healthy' : 'unhealthy';
    
    res.status(overallStatus === 'healthy' ? 200 : 503).json(createResponse(
      overallStatus === 'healthy',
      {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        services: {
          database: dbHealth,
          gemini: geminiHealth
        },
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      },
      overallStatus === 'healthy' ? 'All services are healthy' : 'Some services are unhealthy'
    ));
  } catch (error) {
    console.error('Health check error:', error.message);
    res.status(503).json(createErrorResponse('Health check failed', 503));
  }
});

// API routes
app.use('/api/stories', storiesRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/agents', agentsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json(createResponse(true, {
    message: 'Story Writing Collaboration System API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      stories: '/api/stories',
      chapters: '/api/chapters',
      characters: '/api/characters',
      agents: '/api/agents'
    },
    documentation: 'https://github.com/your-repo/story-writing-api'
  }, 'Welcome to the Story Writing API'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(createErrorResponse(
    `Route ${req.originalUrl} not found`,
    404,
    { availableRoutes: ['/health', '/api/stories', '/api/chapters', '/api/characters', '/api/agents'] }
  ));
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json(createErrorResponse(
      'Validation Error',
      400,
      { errors }
    ));
  }
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json(createErrorResponse(
      `${field} already exists`,
      400
    ));
  }
  
  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json(createErrorResponse(
      'Invalid ID format',
      400
    ));
  }
  
  // Default error
  res.status(error.status || 500).json(createErrorResponse(
    error.message || 'Internal server error',
    error.status || 500
  ));
});

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
async function startServer() {
  try {
    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await database.connect();
    
    // Start the server
    app.listen(PORT, () => {
      console.log('🚀 Story Writing API Server Started!');
      console.log(`📍 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
      console.log('✨ Ready to create amazing stories!');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
