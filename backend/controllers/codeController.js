import axios from "axios";
import userCode from "../models/userCodeModel.js";
import { PrismaClient } from "../generated/prisma/index.js";
import Question from "../models/questionModel.js";

const JUDGE0_URL = "https://judge0-extra-ce.p.rapidapi.com/submissions";
const RAPIDAPI_KEY = "626adfbb29msh20b0d11197cde51p1b5deejsndd5d79fcb72e";
const RAPIDAPI_HOST = "judge0-extra-ce.p.rapidapi.com";

const prisma = new PrismaClient();

const codeSubmitHandler = async (req, res) => {
  try {
    const data = req.body;
    const code = data.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Provide the code",
      });
    }
    const language = data.language;
    if (!language) {
      return res.status(400).response({
        success: false,
        message: "Provide the code's language",
      });
    }
    const languageMap = {
      cpp: 2,
      c: 1,
      java: 4,
      python: 26,
    };

    const languageId = languageMap[language.toLowerCase()];
    if (!languageId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language",
      });
    }
    const qId=data.qNumber;
    const a=await prisma.question.findFirst({where:{questionId:parseInt(qId)}});
    const ques=await Question.findById(a.questionUUID);
    const submission = await axios.post(
      JUDGE0_URL,
      { language_id: languageId, source_code: code, stdin:ques.testCases.input, time_limit:(ques.timeLimit),memory_limit:ques.memoryLimit*1000 },
      {
        params: { base64_encoded: "false", wait: "true", fields: "*" },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
      }
    );
    let isPassed=false;
    if(submission.data.stdout==ques.testCases.output){
      isPassed=true
    }
    await prisma.submissions.create({
  data: {
    code: code,
    memoryUsed: submission.data.memory ?? 0,
    timeUsed: parseInt(submission.data.time) || 0,
    verdict: submission.data.status.description,
    langId: language,
    userID: { connect: { userId: req.user.userId } },
    questionID: { connect: { questionId: parseInt(qId) } },
    isPassed:isPassed 
  }
});

    return res.status(200).json({
      success:true,
      message:"Code submitted successfully",
      submission:submission.data,
      isPassed
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting question",
      error: error,
    });
  }
};

const userCodeHandler = async (req, res) => {
  try {
    console.log("Hello");
    
    const data = req.body;
    const code = data.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Provide the code to run",
      });
    }
    const userInput = data.input;
    const language = data.language;
    const userId = req.user.userId;
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"User ID required to run and save code",
      })
    }
    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Provide the language for the code",
      });
    }
    const languageMap = {
      cpp: 2,
      c: 1,
      java: 4,
      python: 26,
    };

    const languageId = languageMap[language.toLowerCase()];
    if (!languageId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language",
      });
    }
    const submission = await axios.post(
      JUDGE0_URL,
      { language_id: languageId, source_code: code, stdin: userInput },
      {
        params: { base64_encoded: "false", wait: "true", fields: "*" },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
      }
    );
    if (userId) {
      const newUserSubmission = new userCode({
        userId: userId,
        code: code,
        language: language,
        submissionData: submission.data,
      });
      await newUserSubmission.save();
      await prisma.userCodes.create({
        data: {
          userId: userId,
          codeUUID: newUserSubmission._id,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submission: submission.data,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server error while running code",
      error: error,
    });
  }
};


const compileCodeHandler=async(req,res)=>{
   try {
    const data = req.body;
    const code = data.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Provide the code to run",
      });
    }
    const userInput = data.input;
    const language = data.language;
    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Provide the language for the code",
      });
    }
    const languageMap = {
      cpp: 2,
      c: 1,
      java: 4,
      python: 26,
    };

    const languageId = languageMap[language.toLowerCase()];
    if (!languageId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language",
      });
    }
    const submission = await axios.post(
      JUDGE0_URL,
      { language_id: languageId, source_code: code, stdin: userInput },
      {
        params: { base64_encoded: "false", wait: "true", fields: "*" },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
      }
    );
   
    return res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submission: submission.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while running code",
      error: error,
    });
  }
}
export { codeSubmitHandler, userCodeHandler, compileCodeHandler };
