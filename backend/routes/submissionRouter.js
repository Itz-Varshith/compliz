import {Router} from "express"
import { getAllSubmission, getAllSubmissionForAQuestion } from "../controllers/submissionControllr.js";

const submssionRouter=new Router();

submssionRouter.get("/one/:qNumber",getAllSubmissionForAQuestion);
submssionRouter.get("/all",getAllSubmission)

export default submssionRouter;