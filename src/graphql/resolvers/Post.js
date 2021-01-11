import { ApolloError } from "apollo-server-express";
import { NewPostRules } from "../../validators/";
export default {
  Query: {
    listPosts: async (parent, { input }, { Post }) => {
      const data = await Post.find().populate("author");
      return data;
    },
    getPost: async (parent, { id }, { Post }) => {
      const post = await Post.findById(id);
      const data = {
        success: post !== null ? true : false,
        post: post,
      };
      return data;
    },
  },
  Mutation: {
    createPost: async (parent, { input }, { Post, userContext }) => {
      await NewPostRules.validate(input, { abortEarly: false });
      try {
        const post = await Post.create({ ...input, author: userContext._id });
        await post.populate("author").execPopulate();
        const data = {
          success: post !== null ? true : false,
          post: post,
        };
        if (!data.success) throw new ApolloError("Unable to create post");
        return data;
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
    updatePost: async (parent, { id, input }, { Post, userContext }) => {
      await NewPostRules.validate(input, { abortEarly: false });
      try {
        const post = await Post.findOneAndUpdate(
          { _id: id, author: userContext._id.toString() },
          { ...input },
          { new: true }
        ).populate("author");
        const data = {
          success: post !== null ? true : false,
          post,
          userContext,
        };
        if (!data.success)
          throw new ApolloError(
            "Can't update post that you are not the author of"
          );
        return data;
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
    deletePost: async (parent, { id }, { Post, userContext }) => {
      try {
        const post = await Post.findOneAndDelete({
          _id: id,
          author: userContext._id.toString(),
        }).populate("author");
        const data = { success: post !== null ? true : false };
        if (!data.success)
          throw new Error("Can't delete post that you are not the author of");
        return data;
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
  },
};
