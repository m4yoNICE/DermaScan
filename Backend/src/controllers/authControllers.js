import pool from "./config/db.js";
import bcrypt from "bcryptjs";


export async function login(req, res){

    try{
    const { email, password } = req.body; 
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if(rows.length === 0){
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);    
    if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    
    res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email } });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
}

export async function register(req, res){
    try{
    const { email, password } = req.body; 
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if(rows.length > 0){
        return res.status(400).json({ error: "Email already made!" });
    }
    const passwordhash = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (email, password) VALUES (?, ?)",[email, hashedPassword]);
    res.status(201).json({ message: "User registered successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
}