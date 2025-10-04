import {Router} from 'express'
import {saveUserCredentials} from "../controllers/authController.js"
const authRouter = new Router();

authRouter.post('/save',saveUserCredentials);

export default authRouter