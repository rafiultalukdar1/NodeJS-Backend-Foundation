import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = async (req: Request, res: Response, next: NextFunction) => {

    // 01. Check if the token exists
    // 02. Verify Token
    // 03. Check if the user exists
    // 04. Is the user status Active

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized!",
        });
    }

    const decode = jwt.verify(token, config.jwt_sectret) as JwtPayload;

    const user = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [decode.email]
    );

    if (user.rowCount === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found!",
        });
    }

    if (!user.rows[0].is_active) {
        return res.status(403).json({
            success: false,
            message: "Forbidden!",
        });
    }

    req.user = decode;


    next();
};

export default auth;