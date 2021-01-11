import { ApolloError } from "apollo-server-express";
import { hash, compare } from "bcryptjs";
import { issueToken, serializeUser } from "../../functions";
import {
  UserAuthenticationRules,
  UserRegisterationRules,
} from "../../validators/";

export default {
  Query: {
    getAuthUserProfile: async (_, {}, { userContext }) => userContext,
    authenticateUser: async (parent, { username, password }, { User }) => {
      // Find user by username
      // Check for password
      // Issue new Auth Token

      await UserAuthenticationRules.validate(
        { username, password },
        { abortEarly: false }
      );
      try {
        let user;
        user = await User.findOne({ username });
        if (!user) throw new ApolloError("username not found");
        const isMath = await compare(password, user.password);
        if (!isMath) throw new ApolloError("Invalid Password");

        // convert Mongo Object to Javascript Object
        user = user.toObject();
        user.id = user._id;
        user = serializeUser(user);
        const token = await issueToken(user);
        return {
          token,
          user: user,
          success: user !== null && token !== null ? true : false,
        };
      } catch (err) {
        throw new ApolloError(err.message, 403);
      }
    },
  },
  Mutation: {
    registerUser: async (parent, { input }, { User }) => {
      // First check if username is already taken
      // check if email is taken
      // If false for above Create a new User Instance
      // Hash password
      // Save user to db
      // Issue Authentication token

      await UserRegisterationRules.validate(input, { abortEarly: false });
      try {
        const { username, email } = input;
        let user;
        user = await User.findOne({ username });
        if (user) throw new ApolloError("username is already taken");
        user = await User.findOne({ email });
        if (user) throw new ApolloError("email is already taken");
        user = new User(input);
        user.password = await hash(input.password, 10);
        let result = await user.save();
        result = result.toObject();
        result.id = result._id;
        result = serializeUser(result);
        const token = await issueToken(result);
        return {
          token,
          user: result,
          success: result !== null && token !== null ? true : false,
        };
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
  },
};
