import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || my_personal_jwt_secret;
const EXPIRES_IN = '7d';

export const generateToken = (payload) =>{
    return jwt.sign(payload,JWT_SECRET,{expiresIn: EXPIRES_IN});
}