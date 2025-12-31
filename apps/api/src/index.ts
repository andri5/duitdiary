/**
 * ============================================
 * DuitDiary API - Main Entry Point
 * ============================================
 * Express.js server initialization and configuration.
 * 
 * @author DuitDiary Team
 * @version 1.0.0
 * @see README.md for documentation
 * ============================================
 */

import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/index.js';
import { rateLimitAuth, rateLimitAPI } from './middlewares/rateLimit.middleware.js';

// Initialize Express application
const app = express();

// ==================== MIDDLEWARE ====================

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/v1/auth', rateLimitAuth);
app.use('/api/v1', rateLimitAPI);

// ==================== ROUTES ====================

// API v1 routes
app.use('/api/v1', routes);

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 DuitDiary API - Diary Keuanganmu Setiap Hari',
    version: '1.0.0',
    docs: '/api/v1/health',
  });
});

// ==================== ERROR HANDLING ====================

// Global error handler
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    error: {
      code: 'NOT_FOUND',
    },
  });
});

// ==================== SERVER STARTUP ====================

const PORT = config.port;

app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║   🚀 DuitDiary API Server                            ║');
  console.log('║   ─────────────────────────────────────────────────   ║');
  console.log(`║   📡 Running on: http://localhost:${PORT}              ║`);
  console.log(`║   🌍 Environment: ${config.nodeEnv.padEnd(28)}║`);
  console.log('║   📚 API Docs: /api/v1/health                        ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
});

export default app;
