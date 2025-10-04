import {Router} from "express";
import { createQuestionHandler, fetchQuestionHandler, fetchAllQuestions }from "../controllers/questionController.js"
import { authMiddleware } from "../middleware/authmiddleware.js";
const questionRouter= new Router();

questionRouter.get('/one/:qNumber',authMiddleware,fetchQuestionHandler);
questionRouter.get('/all',fetchAllQuestions);
questionRouter.post('/new',createQuestionHandler);

export default questionRouter;