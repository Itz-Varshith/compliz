import {Router} from "express"
import {codeSubmitHandler,userCodeHandler,compileCodeHandler,getSavedCodes,runExampleTestCases} from "../controllers/codeController.js"
import { authMiddleware } from "../middleware/authmiddleware.js";
const codeRouter=new Router();

codeRouter.post('/submit',authMiddleware,codeSubmitHandler);
codeRouter.post('/self',authMiddleware,userCodeHandler);
codeRouter.post('/compile',compileCodeHandler)
codeRouter.get("/saved",authMiddleware,getSavedCodes)
codeRouter.post("/run-example-test-cases",authMiddleware,runExampleTestCases)
export default codeRouter;