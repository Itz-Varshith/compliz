import Question from "../models/questionModel.js";

const fetchQuestionHandler = async (req, res) => {
  try {
    const qId = req.query.qId;
    if (!qId) {
      return res.status(400).json({
        success: false,
        message: "Question ID not provided",
      });
    }

    const question = await Question.findOne({qId});
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found in the Database",
      });
    }

    return res.json({
      success: true,
      message: `Question with ID ${qId} fetched successfully`,
      question,
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
      !Array.isArray(data.examples) ||
      !Array.isArray(data.hints)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Provide all the necessary fields and make sure data types match",
      });
    }
    const questions=await Question.find();
    var maxNum=-1;
    for(const question of questions){
        if(question.qId>maxNum){
            maxNum=question.qId;
        }
    }
    const newQuestion = new Question({
      title: data.title,
      description: data.description,
      examples: data.examples,
      hints: data.hints,
      qId:maxNum+1
    });

    await newQuestion.save();

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
