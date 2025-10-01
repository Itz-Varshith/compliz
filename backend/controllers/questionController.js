import Question from "../models/questionModel.js";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const fetchQuestionHandler = async (req, res) => {
  try {
    const qId = req.query.qId;
    if (!qId) {
      return res.status(400).json({
        success: false,
        message: "Question ID not provided",
      });
    }

    const question = await prisma.question.findFirst({ questionId: qId });
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found in the Database",
      });
    }
    const q = await Question.findOne({ _id: question.questionUUID });
    return res.json({
      success: true,
      message: `Question with ID ${qId} fetched successfully`,
      question: q,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching question",
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
      title: data.title,//Pass as String
      description: data.description,// Pass as String
      examples: data.examples,// Pass as array of objects with data as input:,output:,explanation:
      hints: data.hints,//Pass as Array
      topics:data.topics, // Pass as an Array of String
      constraints : data.constraints, // Pass as an Array of Strings
      timeLimit: (data.timeLimit),// Pass from the frontend as Integer
      memoryLimit: data.memoryLimit,// Pass from frontend as integer
    });

    await newQuestion.save();
    const nq=await prisma.question.create({
      data:{
        questionUUID:newQuestion._id
      },
    })
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

export { createQuestionHandler, fetchQuestionHandler };
