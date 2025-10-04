import { PrismaClient } from "../generated/prisma/index.js"

const prisma=new PrismaClient();

const saveUserCredentials=async(req,res)=>{
try {
    const data=req.body;
    console.log("Recieved data",data)
    await prisma.user.upsert({
        where:{
            userId:data.id
        },
        create:{
            userId:data.id,
            userName:data.name,
            userEmail:data.email
        },
        update:{
            userName:data.name,
            userEmail:data.email
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