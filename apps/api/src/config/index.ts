/**
 * ============================================
 * DuitDiary API - Configuration
 * ============================================
 * Centralized configuration loaded from environment variables.
 * All configuration values should be accessed through this module.
 * 
 * @see .env.example for available environment variables
 * ============================================
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration object
 * @description Contains all configuration values for the application
 */
export const config = {
  /**
   * Server Configuration
   */
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  /**
   * Database Configuration
   * @see https://www.prisma.io/docs/concepts/database-connectors/postgresql
   */
  databaseUrl: process.env.DATABASE_URL || '',

  /**
   * JWT Authentication Configuration
   */
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  /**
   * File Upload Configuration
   */
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
  },

  /**
   * CORS / Frontend Configuration
   */
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  appUrl: process.env.APP_URL || process.env.CORS_ORIGIN || 'http://localhost:5173',
} as const;

/**
 * Type for the configuration object
 */
export type Config = typeof config;
