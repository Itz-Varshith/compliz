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
      input: { type: String,  },
      output: { type: String },
      explanation: { type: String,  },
      
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
    testCases: { input: String, output: String },
    solutionCode:{
      type: String,
      required: true,
    }
  },
  { timestamps: true, minimize: false }
);

const Question = mongoose.models?.Question || model("Question", questionSchema);

export default Question;
