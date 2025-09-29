import {Router} from "express";
import {fetchQuestionHandler, createQuestionHandler} from "../controllers/questionController.js"
const questionRouter= new Router();

questionRouter.get('/',fetchQuestionHandler);
questionRouter.post('/new',createQuestionHandler);

export default questionRouter;