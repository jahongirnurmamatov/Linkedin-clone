import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async(req,res)=>{
    try {
        const {name,email,username,password} = req.body;
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message:"Email already exists"});
        }
        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({message:"Username already exists"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password should be atleast 6 characters"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = new User({name,email,username,password:hashedPassword});
        await user.save();
        
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
            expiresIn:"3d"
        });

        res.cookie("jwt-linkedin",token,{
            httpOnly:true, //prevents javascript from accessing the cookie
            maxAge:3*24*60*60*1000,
            sameSite:"none", //prevents cookie from being sent with cross-site requests
            secure: process.env.NODE_ENV==='production' //sets the cookie to be sent only over HTTPS
        }).status(201).json({message:"User created successfully"});

        // to do send welcome email using mailtrap
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Something went wrong"});
    }
}

export const login = async(req,res)=>{

}
export const logout = async(req,res)=>{

}
