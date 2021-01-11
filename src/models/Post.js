import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 128 },
    content: { type: String, required: true, maxlength: 128 },
    author: { type: Schema.Types.ObjectId, ref: "Users" },
    featureImage: { type: String },
  },
  { timestamps: true }
);

export const Post = model("Posts", PostSchema);
