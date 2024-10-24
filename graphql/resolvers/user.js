const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserTC } = require('../types');

const userResolvers = {
  Query: {
    userById: {
      type: UserTC,
      args: { _id: 'MongoID!' },
      resolve: async (_, { _id }) => {
        return await User.findById(_id);
      },
    },
    userMany: {
      type: [UserTC],
      resolve: async () => {
        return await User.find({});
      },
    },
    currentUser: {
      type: UserTC,
      resolve: async (_, __, { req }) => {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null; // Extract token from headers
        if (!token) {
          throw new Error('Authentication token is required');
        }

        // Verify the token and extract user ID
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          throw new Error('Invalid token');
        }

        // Find and return the user by ID
        return await User.findById(decoded.userId);
      },
    },
  },
  Mutation: {
    userRegister: {
      type: UserTC,
      args: {
        username: 'String!',
        fullname: 'String!',
        password: 'String!',
        email: 'String!',
        role: 'String!',
      },
      resolve: async (_, { username, password, email, role, fullname }) => {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email, role, fullname });
        await user.save();
        return user;
      },
    },
    userLogin: {
      type: 'UserLogin!',
      args: {
        username: 'String!',
        password: 'String!',
      },
      resolve: async (_, { username, password }) => {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
        return { token, user };
      },
    },
  },
};

module.exports = userResolvers;
