import {ENV} from "../config/env.js"
import jwt from "jsonwebtoken"

export function verifyToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.sendStatus(401);
    }
    
    jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or Expired Session" });
        }
        req.user = decoded; 
        next();
    });
}