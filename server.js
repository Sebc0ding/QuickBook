// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const corsMiddleware = require('./middleware/cors');
const logger = require('./middleware/logger');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');
const { authMiddleware } = require('./middleware/auth');

// Set up port and initialize Express app
const PORT = process.env.PORT || 3001;
const app = express();

// Apply basic middleware
app.use(logger);
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to specific routes
app.use('/api/', apiLimiter);
app.use('/api/users/login', authLimiter);
app.use('/api/users/signup', authLimiter);

// Configure Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  formatError: (err) => {
    if (err.originalError && err.originalError.name === 'ServerError') {
      console.error('Server error:', err);
    }
    return err;
  },
  cache: "bounded",
  persistedQueries: false,
});

// Main server startup function
const startApolloServer = async () => {
  try {
    // Start Apollo Server
    console.log("Starting Apollo Server...");
    await server.start();
    console.log("Apollo Server started successfully");
    
    // Apply Apollo middleware
    server.applyMiddleware({ app });
    console.log(`Apollo middleware applied at ${server.graphqlPath}`);
    
    // Set up static file serving and routes based on environment
    if (process.env.NODE_ENV === 'production') {
      // Serve static files from React build
      console.log("Running in production mode, serving React app...");
      app.use(express.static(path.join(__dirname, '../client/build')));
      
      // For any route except /graphql, serve the React app
      app.get('*', (req, res, next) => {
        if (req.path === server.graphqlPath) {
          return next();
        }
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
      });
    } else {
      // In development, just show API message for root
      app.get('/', (req, res) => {
        res.send('AI Appointment Booking API is running. Use /graphql for queries.');
      });
    }
    
    // Apply error handling middleware
    app.use(notFound);
    app.use(errorHandler);
    
    // Wait for database connection
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    // Once database is connected, start listening for requests
    db.once('open', () => {
      console.log("MongoDB connection established successfully");
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at ${server.graphqlPath}`);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startApolloServer();
