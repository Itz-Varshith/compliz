import axios from "axios";
import userCode from "../models/userCodeModel.js";
import { PrismaClient } from "../generated/prisma/index.js";
import { userAgentFromString } from "next/server.js";

const JUDGE0_URL = "https://judge0-extra-ce.p.rapidapi.com/submissions";
const RAPIDAPI_KEY = "f3d1f6ff3fmsh79b2f7c81c667afp178068jsnc83724e53be9";
const RAPIDAPI_HOST = "judge0-extra-ce.p.rapidapi.com";


const prisma=new PrismaClient();


const codeSubmitHandler = async (req, res) => {
 
};

const userCodeHandler = async (req, res) => {
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
    const userId=data.userId;
    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Provide the language for the code",
      });
    }

    // Here update the language ID based on the language from the input
    // For now the only language support is for CPP cause fetching the lanuguage IDs for other languages is not happening.
    const submission = await axios.post(
      JUDGE0_URL,
      { language_id: 54, source_code: code, stdin: userInput },
      {
        params: { base64_encoded: "false", wait: "true", fields: "*" },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
      }
    );
    if(userId){
      const newUserSubmission=new userCode({
        userId:userId,
        code:code,
        language:language,
        submissionData:submission.data
      });
      await newUserSubmission.save();
      await prisma.userCodes.create({
        data:{
          userId:userId,
          codeUUID:newUserSubmission._id
        }
      })
    }
  
    return res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submission:submission.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while running code",
      error: error,
    });
  }
};

export { codeSubmitHandler, userCodeHandler };
