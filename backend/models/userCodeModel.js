import {model, Schema} from "mongoose"

const userCodeSchema=new Schema({
    userId:{
        type:Number,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:Number,
        required:true
    },
    submissionData:{
        type:JSON
    }
},{timestamps:true});

const userCode=mongoose.models?.userCode || model("userCode",userCodeSchema);

export default userCode;