import {Router} from "express"
import {codeSubmitHandler,userCodeHandler} from "../controllers/codeController.js"
const codeRouter=new Router();

codeRouter.post('/submit',codeSubmitHandler);
codeRouter.post('/self',userCodeHandler);


export default codeRouter;