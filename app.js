const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const { limiter } = require('./middleware/rateLimit');
// const rateLimit = require('express-rate-limit'); // Will configure per route or globally later
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));

// Apply global rate limiting conditionally
if (process.env.DISABLE_RATE_LIMIT !== 'true') {
    app.use(limiter);
}

// Swagger Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Expose json for easy consumption
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Basic Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/notebooks', require('./routes/notebook.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use(require('./middleware/error'));

module.exports = app;
