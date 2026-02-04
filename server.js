require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const fs = require('fs');
const swaggerSpec = require('./utils/swagger');

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Save Swagger JSON
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Log the error and continue without crashing the application immediately.
    // In a production environment, you might want to send alerts or implement a graceful shutdown.
    // For now, we'll just log and keep the server running.
});
