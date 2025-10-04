import { PrismaClient } from "../generated/prisma/index.js"

const prisma=new PrismaClient();

const saveUserCredentials=async(req,res)=>{
try {
    const data=req.body;
    console.log("Recieved data",data)
    await prisma.user.upsert({
        where:{
            userId:data.user.id
        },
        create:{
            userId:data.user.id,
            userName:data.user.user_metadata.full_name,
            userEmail:data.user.email
        },
        update:{
            userName:data.user.user_metadata.full_name,
            userEmail:data.user.email
        }
    })
    return res.status(200).json({
        success:true,
        message:"User data saved successfully",
    })
} catch (error) {
    console.error(error);
    return res.status(500).json({
        success:false,
        message:"Server error while saving user",
        error
    })
}
}

export {saveUserCredentials}