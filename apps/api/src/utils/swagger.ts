/**
 * ============================================
 * DuitDiary API - Swagger Configuration
 * ============================================
 * OpenAPI/Swagger documentation for all API endpoints
 * 
 * Access at: http://localhost:3000/api/v1/docs
 * ============================================
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DuitDiary API - Expense Tracking',
      version: '1.0.0',
      description: 'REST API for personal finance management and expense tracking',
      contact: {
        name: 'DuitDiary Team',
        url: 'https://github.com/andri5/duitdiary',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'https://api.duitdiary.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
            icon: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Expense: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            amount: { type: 'number', format: 'decimal' },
            description: { type: 'string' },
            categoryId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date' },
            receiptUrl: { type: 'string', format: 'url' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
