import { PrismaClient } from "../generated/prisma/index.js";
import Question from "../models/questionModel.js";

const prisma = new PrismaClient();

const getAllSubmissionForAQuestion = async (req, res) => {
  try {
    console.log("Inside")
    const qNumber = req.params.qNumber;
    const userId = req.user.userId;
    if (!qNumber || !userId) {
      return res.status(400).json({
        success: false,
        message: "Provide all the details",
      });
    }

    const allSubmissions = await prisma.submissions.findMany({
      where: {
        userId: userId,
        questionId: parseInt(qNumber), 
      },
    });
    console.log(allSubmissions);

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      allSubmissions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching submissions",
      error,
    });
  }
};

const getAllSubmission = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }


    const submissions = await prisma.submissions.findMany({
      where: { userId },
      include: {
        questionID: {
          select: { questionUUID: true }, 
        },
      },
    });

    const questionUUIDs = submissions.map(
      (sub) => sub.questionID?.questionUUID
    ).filter(Boolean); 
    const questions = await Question.find({
      _id: { $in: questionUUIDs },
    });

    return res.status(200).json({
      success: true,
      message: "Fetched all submissions successfully",
      submissions,
      questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching submissions",
      error,
    });
  }
};

export { getAllSubmissionForAQuestion, getAllSubmission };
