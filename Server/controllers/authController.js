import express from 'express';
import pool from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

export const signup = async (req, res)=>{

    const {email,password} = req.body;
    //checking if user exists

    try {
        const existingUser = await pool.query('SELECT * FROM \"users\" WHERE email = $1',[email]);
        if(existingUser.rows.length > 0){
            return res.status(400).json({message: 'User already exists'});
        }


        //password hashing
        const hashedPassword = await hashPassword(password);

        //inserting the user into database
        const result = await pool.query('INSERT INTO \"users\" (email,password_hash) VALUES ($1,$2) RETURNING id, email',[email,hashedPassword]);

        const user = result.rows[0];

        //generating JWT token
        const token = generateToken({id:user.id, email:user.email});

        res.status(201).json({
            success:true,
            message: "User created successfully",
            token,
            user:{
                id: user.id,
                email: user.email
            }       
        })

    } catch (error) {
        console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Signup failed" });
    }
}


export const login = async (req,res)=>{
     const {email,password} = req.body;

     try {
        //find user by email
        const result = await pool.query('SELECT * FROM \"users\" WHERE email = $1',[email]);
        const user = result.rows[0];

        if(!user){
            return res.status(400).json({success:false,message:"user not found" })
        }

        //compare password
        const isMatch = await comparePassword(password,user.password_hash);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid credentials"});
        }

        const token = generateToken({id:user.id, email:user.email});

        res.json({
            success:true,
            message:"login Successful",
            token,
            user:{
                id: user.id,
                email: user.email
            }


        })
     } catch (error) {
        console.error("login error:",error)
        res.status(500).json({ success: false, message: "Login failed" });
     }
}
