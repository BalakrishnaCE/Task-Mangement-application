const { schemaComposer } = require('graphql-compose');
const userResolvers = require('./resolvers/user');
const taskResolvers = require('./resolvers/task');

schemaComposer.Query.addFields(userResolvers.Query);
schemaComposer.Query.addFields(taskResolvers.Query);
schemaComposer.Mutation.addFields(userResolvers.Mutation);
schemaComposer.Mutation.addFields(taskResolvers.Mutation);

const schema = schemaComposer.buildSchema();
module.exports = schema;
