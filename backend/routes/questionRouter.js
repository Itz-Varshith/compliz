import {Router} from "express";
import { createQuestionHandler, fetchQuestionHandler, fetchAllQuestions }from "../controllers/questionController.js"
const questionRouter= new Router();

questionRouter.get('/one/:qNumber',fetchQuestionHandler);
questionRouter.get('/all',fetchAllQuestions);
questionRouter.post('/new',createQuestionHandler);

export default questionRouter;