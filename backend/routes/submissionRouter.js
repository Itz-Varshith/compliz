import {Router} from "express"
import { getAllSubmission, getAllSubmissionForAQuestion } from "../controllers/submissionControllr.js";
import {authMiddleware} from "../middleware/authmiddleware.js";
const submssionRouter=new Router();

submssionRouter.get("/one/:qNumber",authMiddleware,getAllSubmissionForAQuestion);
submssionRouter.get("/all",authMiddleware,getAllSubmission)

export default submssionRouter;