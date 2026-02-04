const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Collaborative Notes & Tasks API',
      version: '1.0.0',
      description: 'AUT for API Testing Platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            email: { type: 'string', format: 'email', description: 'User email' },
            role: { type: 'string', enum: ['USER', 'ADMIN'], description: 'User role' },
            isActive: { type: 'boolean', description: 'User active status' },
            createdAt: { type: 'string', format: 'date-time', description: 'User creation timestamp' },
          },
          example: {
            _id: '60d0fe4f5e3e2a001c8a1b00',
            email: 'user@example.com',
            role: 'USER',
            isActive: true,
            createdAt: '2021-06-21T10:00:00.000Z',
          },
        },
        Notebook: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Notebook ID' },
            name: { type: 'string', description: 'Name of the notebook' },
            owner: { type: 'string', description: 'ID of the user who owns the notebook' },
            isArchived: { type: 'boolean', description: 'Whether the notebook is archived' },
            createdAt: { type: 'string', format: 'date-time', description: 'Notebook creation timestamp' },
          },
          example: {
            _id: '60d0fe4f5e3e2a001c8a1b01',
            name: 'My First Notebook',
            owner: '60d0fe4f5e3e2a001c8a1b00',
            isArchived: false,
            createdAt: '2021-06-21T10:05:00.000Z',
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
        Note: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Note ID' },
            title: { type: 'string', description: 'Title of the note' },
            content: { type: 'string', description: 'Content of the note' },
            notebookId: { type: 'string', description: 'ID of the notebook this note belongs to' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Tags associated with the note' },
            createdAt: { type: 'string', format: 'date-time', description: 'Note creation timestamp' },
          },
          example: {
            _id: '60d0fe4f5e3e2a001c8a1b02',
            title: 'Meeting Agenda',
            content: 'Discuss project milestones and deadlines.',
            notebookId: '60d0fe4f5e3e2a001c8a1b01',
            tags: ['meeting', 'project'],
            createdAt: '2021-06-21T10:10:00.000Z',
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Task ID' },
            description: { type: 'string', description: 'Description of the task' },
            status: { type: 'string', enum: ['OPEN', 'DONE'], description: 'Current status of the task' },
            notebookId: { type: 'string', description: 'ID of the notebook this task belongs to' },
            createdAt: { type: 'string', format: 'date-time', description: 'Task creation timestamp' },
          },
          example: {
            _id: '60d0fe4f5e3e2a001c8a1b03',
            description: 'Finish project report',
            status: 'OPEN',
            notebookId: '60d0fe4f5e3e2a001c8a1b01',
            createdAt: '2021-06-21T10:15:00.000Z',
          },
        },
        AuditLog: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Audit Log ID' },
            entity: { type: 'string', description: 'Entity type that the log refers to' },
            action: { type: 'string', description: 'Action performed (e.g., CREATE, UPDATE, DELETE)' },
            userId: { type: 'string', description: 'ID of the user who performed the action' },
            details: { type: 'object', description: 'Details of the change or action' },
            timestamp: { type: 'string', format: 'date-time', description: 'Timestamp of the audit log entry' },
          },
          example: {
            _id: '60d0fe4f5e3e2a001c8a1b04',
            entity: 'User',
            action: 'LOGIN',
            userId: '60d0fe4f5e3e2a001c8a1b00',
            details: { ip: '192.168.1.1' },
            timestamp: '2021-06-21T10:20:00.000Z',
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
