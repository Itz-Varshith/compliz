import {Router} from "express"
import {codeSubmitHandler} from "../controllers/codeController.js"
const codeRouter=new Router();

codeRouter.post('/submit',codeSubmitHandler);

export default codeRouter;