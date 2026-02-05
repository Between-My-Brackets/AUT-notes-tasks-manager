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
            _id: { type: 'number', description: 'User ID' },
            email: { type: 'string', format: 'email', description: 'User email' },
            isActive: { type: 'boolean', description: 'User active status' },
            createdAt: { type: 'string', format: 'date-time', description: 'User creation timestamp' },
          },
          example: {
            _id: 1,
            email: 'user@example.com',
            isActive: true,
            createdAt: '2021-06-21T10:00:00.000Z',
          },
        },
        Notebook: {
          type: 'object',
          properties: {
            _id: { type: 'number', description: 'Notebook ID' },
            name: { type: 'string', description: 'Name of the notebook' },
            owner: { type: 'number', description: 'ID of the user who owns the notebook' },
            isArchived: { type: 'boolean', description: 'Whether the notebook is archived' },
            createdAt: { type: 'string', format: 'date-time', description: 'Notebook creation timestamp' },
          },
          example: {
            _id: 101,
            name: 'My First Notebook',
            owner: 1,
            isArchived: false,
            createdAt: '2021-06-21T10:05:00.000Z',
          },
        },
        Blog: {
          type: 'object',
          properties: {
            _id: { type: 'number', description: 'Blog ID' },
            title: { type: 'string', description: 'Title of the blog' },
            content: { type: 'string', description: 'Content of the blog' },
            notebookId: { type: 'number', description: 'ID of the notebook this blog belongs to' },
            createdAt: { type: 'string', format: 'date-time', description: 'Blog creation timestamp' },
          },
          example: {
            _id: 201,
            title: 'Meeting Agenda',
            content: 'Discuss project milestones and deadlines.',
            notebookId: 101,
            createdAt: '2021-06-21T10:10:00.000Z',
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'number', description: 'Task ID' },
            description: { type: 'string', description: 'Description of the task' },
            status: { type: 'string', enum: ['OPEN', 'DONE'], description: 'Current status of the task' },
            notebookId: { type: 'number', description: 'ID of the notebook this task belongs to' },
            createdAt: { type: 'string', format: 'date-time', description: 'Task creation timestamp' },
          },
          example: {
            _id: 301,
            description: 'Finish project report',
            status: 'OPEN',
            notebookId: 101,
            createdAt: '2021-06-21T10:15:00.000Z',
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
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
  apis: ['./routes/*.js', './routes/blog.routes.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
