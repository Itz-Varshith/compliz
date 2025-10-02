import mongoose, { Schema, model } from "mongoose";

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    examples: {
      type: [
        {
          input: { type: String, required: true },
          output: { type: String, required: true },
          explanation: { type: String, required: true },
        },
      ],
      default: [],
      required: true,
    },
    constraints: {
      type: [String],
      required: true,
    },
    topics: {
      type: [String],
      required: true,
    },
    hints: {
      type: Array,
      default: [],
    },
    accepted_submissions: {
      type: Number,
      default: 0,
    },
    total_submissions: {
      type: Number,
      default: 0,
    },
    timeLimit: {
      type: Number,
      default: 1000,
    },
    memoryLimit: {
      type: Number,
      default: 256000,
    },
    testCases: [{ input: String, output: String }],
  },
  { timestamps: true, minimize: false }
);

const Question = mongoose.models?.Question || model("Question", questionSchema);

export default Question;
