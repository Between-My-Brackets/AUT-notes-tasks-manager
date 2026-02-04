# Collaborative Notes & Tasks API (AUT)

This project is a backend API for a collaborative notes and tasks application, designed to be used as an Application Under Test (AUT) for an API testing platform.

## Features & Recent Improvements

This project has been updated with several key improvements focusing on security, stability, documentation, and automated testing.

### Core Project Fixes
*   **Security:** A critical privilege escalation vulnerability was resolved, preventing users from self-assigning administrative roles. Global API rate limiting has also been enabled to protect against brute-force attacks.
*   **Stability:** The application is now more resilient, as it no longer crashes on unhandled promise rejections.

### API Documentation
The entire API is documented using Swagger/OpenAPI. You can view the interactive documentation by running the server and navigating to:
**[http://localhost:3000/docs](http://localhost:3000/docs)**

### Database Seeding
The project includes a comprehensive seeding script to populate the database with realistic sample data. To seed the database, run:
```bash
npm run seed
```

## Automated API Testing

This project includes a fully automated API testing pipeline powered by **Newman** (the command-line runner for Postman).

### How it Works
The pipeline automatically:
1.  Generates a Postman Collection from the project's `swagger.json` specification.
2.  Creates a Postman Environment file with the base URL for the API.
3.  Executes all API requests defined in the collection using Newman.
4.  Generates a detailed HTML report of the test results.

### How to Run the Tests

1.  **Start the server** in one terminal:
    ```bash
    npm start
    ```
2.  **Run the test pipeline** in a separate terminal:
    ```bash
    npm test
    ```

After the run, a detailed report will be available at `test/report.html`.
