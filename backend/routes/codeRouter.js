import {Router} from "express"
import {codeSubmitHandler,userCodeHandler,compileCodeHandler} from "../controllers/codeController.js"
import { authMiddleware } from "../middleware/authmiddleware.js";
const codeRouter=new Router();

codeRouter.post('/submit',authMiddleware,codeSubmitHandler);
codeRouter.post('/self',authMiddleware,userCodeHandler);
codeRouter.post('/compile',compileCodeHandler)

export default codeRouter;