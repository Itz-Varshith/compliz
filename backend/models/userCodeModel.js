import {model, Schema, models} from "mongoose"

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
},{timestamps:true});

const userCode=models?.userCode || model("userCode",userCodeSchema);

export default userCode;