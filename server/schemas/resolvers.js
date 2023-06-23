const { GraphQLError } = require('graphql');

const { User } = require('../models');
const { checkToken, signToken } = require('../utils/auth');

const unauthenticatedError = new GraphQLError('Login failed.', {
    extensions: {
        code: 'UNAUTHENTICATED',
    },
})

const protectedError = new GraphQLError('Please log in.', {
    extensions: {
        code: 'PROTECTED',
    },
});

const notFoundError = new GraphQLError('No user found.', {
    extensions: {
        code: 'NOT_FOUND',
    },
});

module.exports = {
  Query: {
    me: async (parent, args, context) => {
        const { username } = checkToken(context.token) ?? {};
        if (!username) throw protectedError;

        const user = await User.findOne({ $or: [{ username }] });
        if (!user) throw notFoundError
        
        return user;
    },
  },
  Mutation: {
    login: async (parent, { username, password }, context) => {
        const user = await User.findOne({ $or: [{ username }] });
        const correctPw = await user?.isCorrectPassword(password);

        if (!user || !correctPw) throw unauthenticatedError;
                
        const token = signToken(user);
        return { token, user };
    },
    addUser: async (parent, { username, email, password }, context) => {
        if (!checkToken(context.token)) throw protectedError;

        const user = User.create({ username, email, password });

        const token = signToken(user);
        return { token, user };
    },
    saveBook: async (parent, { title, bookId, image, link }, context) => {
        const { _id } = checkToken(context.token) ?? {};
        if (!_id) throw protectedError;

        const updatedUser = await User.findOneAndUpdate(
            { _id },
            { $addToSet: { savedBooks: { title, bookId, image, link } } },
            { new: true, runValidators: true }
        );
        if (!updatedUser) throw notFoundError;

        return updatedUser;
    },
    removeBook: async (parent, { bookId }, context) => {
        const { _id } = checkToken(context.token) ?? {};
        if (!_id) throw protectedError;

        const updatedUser = await User.findOneAndUpdate(
            { _id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
        );
        if (!updatedUser) throw notFoundError;

        return updatedUser;
    }
  },
};
