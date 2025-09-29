import mongoose, { Schema,model } from "mongoose";

const questionSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    qId:{
        type:Number,
        required:true,
    },
    description: {
        type: String,
        required: true
    },
    examples: {
        type: Array,
        default: [],
        required: true
    },
    hints: {
        type: Array,
        default: []
    },
    accepted_submissions: {
        type: Number,
        default: 0
    },
    total_submissions: {
        type: Number,
        default: 0
    }
}, { timestamps: true, minimize: false });

const Question = mongoose.models?.Question || model("Question", questionSchema);

export default Question;
