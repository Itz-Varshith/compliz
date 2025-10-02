import Question from "../models/questionModel.js";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const fetchAllQuestions = async (req, res) => {
  try {
    const allObjs = await prisma.question.findMany({
      where: { questionId: { not: 0 } },
    });

    let questions = [];
    for (const q of allObjs) {
      const ques = await Question.findById(q.questionUUID); 
      if (ques) {
        questions.push({ title:ques.title,topics:ques.topics, questionNumber: q.questionId });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching all questions",
      error,
    });
  }
};


const createQuestionHandler = async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.title ||
      !data.description ||
      !data.examples ||
      !data.hints ||
      !data.timeLimit ||
      !data.memoryLimit ||
      !data.constraints ||
      !data.topics ||
      !data.testCases ||
      !Array.isArray(data.testCases) ||
      !Array.isArray(data.constraints) ||
      !Array.isArray(data.topics) ||
      !Array.isArray(data.examples) ||
      !Array.isArray(data.hints)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Provide all the necessary fields and make sure data types match",
      });
    }

    const newQuestion = new Question({
      title: data.title, //Pass as String
      description: data.description, // Pass as String
      examples: data.examples, // Pass as array of objects with data as input:,output:,explanation:
      hints: data.hints, //Pass as Array
      topics: data.topics, // Pass as an Array of String
      constraints: data.constraints, // Pass as an Array of Strings
      timeLimit: data.timeLimit, // Pass from the frontend as Integer
      memoryLimit: data.memoryLimit, // Pass from frontend as integer
      testCases : data.testCases
    });

    await newQuestion.save();
    const nq = await prisma.question.create({
      data: {
        questionUUID: newQuestion._id,
      },
    });
    console.log(nq);
    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating question",
    });
  }
};

const fetchQuestionHandler = async (req, res) => {
  try {
    const qNumber = req.params.qNumber;
    if (!qNumber) {
      return res.status(400).json({
        success: false,
        message: "Provide the question number to fetch",
      });
    }
    const qId = await prisma.question.findFirst({
      where: { questionId: parseInt(qNumber, 10) },
    });
    if (!qId) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }
    const qUUID = qId.questionUUID;
    const questionData = await Question.findById(qUUID);
    if (!questionData) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Question fetched successfully",
      questionData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching question",
      error: error,
    });
  }
};

export { createQuestionHandler, fetchQuestionHandler, fetchAllQuestions };
