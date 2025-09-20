import { findUserByEmail, createUser } from "../services/authServices.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {ENV} from "../config/env.js"

export async function login(req, res){
    try{
        const { email, password } = req.body; 
        const user = await findUserByEmail(email);
        if(!user){
            return res.status(401).json({error: "Invalid Credentials"})
        } 
        const isValid = await bcrypt.compare(password, user.password);    
        if (!isValid){
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const payload = { id: user.id, email: user.email }; // keep it minimal
        const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "15m" });
        res.status(200).json({ 
            message: "Login successful", 
            user: { id: user.id, email: user.email },
            token
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Server error" })
    }
}

export async function register(req, res){
    try{
    const { email, password } = req.body; 
    const existingUser = await findUserByEmail(email);
    if(existingUser){
            return res.status(400).json({error: "Email already registered"});
        }
    await createUser(email, password);
    res.status(201).json({ message: "User registered successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
}