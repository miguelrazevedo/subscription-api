# Project Overview

A Node.js backend server that provides secure routes and robust authentication.

## Features

-   Built with Express.js for routing and middleware support
-   User authentication using JSON Web Tokens (JWT)
-   Role-based authorization to control access
-   Centralized error handling for consistent error responses
-   Middleware for logging, input validation, and request parsing
-   Uses MongoDB for data storage and management
-   Arcjet for API rate limit

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` with credentials (e.g., JWT_SECRET)
4. Start the server: `npm start`

## Authentication & Authorization

-   Users receive JWTs upon successful login
-   Protected routes require valid tokens
-   Role checks ensure only authorized users

## Middlewares

-   Logging middleware for request details
-   Error-handling middleware to capture and handle exceptions
-   Validation middleware for request bodies and parameters

## Error Handling

Errors are passed through custom middleware that responds with the proper error message.

## Environment Variables

The following variables are setup in the `.env.js` which imports the variables from the `.env` file:

-   `PORT`: Number,
-   `NODE_ENV`: 'production | environment',
-   `DB_URI`: 'String',
-   `JWT_ACCESS_SECRET`: 'String',
-   `JWT_ACCESS_EXPIRES_IN`: 'String',
-   `JWT_REFRESH_SECRET`: 'String',
-   `JWT_REFRESH_EXPIRES_IN`: 'String',
-   `ARCJET_KEY`: 'String',
-   `ARCJET_ENV`: 'production | environment',

## Postman collection

An example of a Postman collection is included in the `postman-collection` folder to test the API.
