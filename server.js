const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const schema = require('./graphql/schema');
const dotenv = require('dotenv');
const cors = require('cors');
const auth = require('./middleware/auth');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON body parsing

// Create the Apollo Server instance
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return { req }; // Pass req in the context
  }, // Include user in the context
});

// Start the server and apply middleware
const startServer = async () => {
  await server.start(); // Wait for the server to start
  server.applyMiddleware({ app }); // Apply the Apollo middleware to the Express app

  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

// Call the function to start the server
startServer();
