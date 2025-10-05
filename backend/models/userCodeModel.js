import {model, Schema} from "mongoose"

const userCodeSchema=new Schema({
    userId:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    submissionData:{
        type:JSON
    },
    name :{
        type:String,
        required:true
    }
},{timestamps:true});

const userCode=mongoose.models?.userCode || model("userCode",userCodeSchema);

export default userCode;