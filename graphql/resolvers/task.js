const Task = require('../../models/Task');
const { TaskTC } = require('../types');

const taskResolvers = {
  Query: {
    taskMany: {
      type: [TaskTC],
      resolve: async () => {
        return await Task.find({}).populate('assignedTo');
      },
    },
    taskById: {
      type: TaskTC,
      args: { _id: 'MongoID!' },
      resolve: async (_, { _id }) => {
        return await Task.findById(_id).populate('assignedTo');
      },
    },
  },
  Mutation: {
    taskCreate: {
      type: TaskTC,
      args: {
        title: 'String!',
        description: 'String!',
        assignedTo: 'MongoID!',
        dueDate: 'Date!',
      },
      resolve: async (_, { title, description, assignedTo, dueDate }) => {
        const task = new Task({ title, description, assignedTo, dueDate });
        return await task.save();
      },
    },
    taskUpdate: {
      type: TaskTC,
      args: {
        _id: 'MongoID!',
        title: 'String',
        description: 'String',
        status: 'String',
      },
      resolve: async (_, { _id, title, description, status }) => {
        return await Task.findByIdAndUpdate(_id, { title, description, status }, { new: true });
      },
    },
  },
};

module.exports = taskResolvers;
