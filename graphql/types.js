const { schemaComposer } = require('graphql-compose');
const User = require('../models/User');
const Task = require('../models/Task');
const { composeWithMongoose } = require('graphql-compose-mongoose');

// Create User and Task Type Composers
const UserTC = composeWithMongoose(User);
const TaskTC = composeWithMongoose(Task);

// Define UserLogin type for login response
schemaComposer.createObjectTC({
  name: 'UserLogin',
  fields: {
    token: 'String!',
    user: UserTC,
  },
});

// Export Type Composers
module.exports = { UserTC, TaskTC };
