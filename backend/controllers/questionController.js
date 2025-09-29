

const fetchQuestionHandler=async (req,res)=>{
    try {
        const qId=req.query.qId;
        console.log(qId);
        return res.json({
            success:true,
            message:`This is the question ID you have asked for, `
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error while fetching question"
        })
    }
}
const createQuestionHandler=async (req,res)=>{

}

export {createQuestionHandler,fetchQuestionHandler}