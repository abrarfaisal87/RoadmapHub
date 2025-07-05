import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth =  async (req,res,next)=>{
    const authHeader = req.headers.authorization;


    if(!authHeader?.startsWith('Bearer')){
        return res.status(401).json({success:false,message:"No token"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded; // making user id and email available in controller
        next();
    } catch (error) {
        return res.status(401).json({success:false,message:"Invalid token"})
    }
}