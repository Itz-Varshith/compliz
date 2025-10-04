import express from 'express';
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./helpers/mongo_config.js"
import codeRouter from './routes/codeRouter.js';
import questionRouter from "./routes/questionRouter.js"
import authRouter from "./routes/authRouter.js"
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(express.json());
app.use(cors());// Need to configure for the frontend in order to avoid the CORS issues.


connectDB();

app.get('/', (req, res) => {
    res.send('Backend is running for compliz');
});

// This is the router which handles everything related to storing and submitting and retrieving the code that has been submitted.
app.use('/code',codeRouter);

// This is the router which handles everythig related to questions i.e it helps in fetching the question and saving new questions.
app.use('/question',questionRouter);

// This is the route for saving the user details into the prisma database
app.use('/auth',authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});