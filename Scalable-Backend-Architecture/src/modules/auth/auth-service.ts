import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payLoad : {email : string; password : string}) => {

    const {email, password} = payLoad;

    const user = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    // Check if the user exist
    if (user.rowCount === 0) {
        throw new Error("Invalid credentials!");
    }

    // Check if the password match
    const matchPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!matchPassword) {
        throw new Error("Invalid credentials!");
    }

    // Check the user status
    if (!user.rows[0].is_active) {
        throw new Error("Access Blocked!");
    }

    // If pass all then generate jwt token
    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_sectret, {
        expiresIn : "1d",
    });

    const { password: _password, ...safeUser } = user.rows[0];

    const refreshToken = jwt.sign(jwtPayload, config.refresh_sectret, {
        expiresIn : "7d",
    });

    return { accessToken, refreshToken, user: safeUser, };
};


const generateAccessToken = async (token: string) => {

    if (!token) {
        throw new Error("Unauthorized access!");
    }

    // Verify refresh token
    const decode = jwt.verify( token, config.refresh_sectret ) as JwtPayload;

    const user = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [decode.email]
    );

    if (user.rowCount === 0) {
        throw new Error("User not found!");
    }

    if (!user.rows[0].is_active) {
        throw new Error("Forbidden!");
    }

    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
    };

    // Generate new access token
    const accessToken = jwt.sign( jwtPayload, config.jwt_sectret, {
        expiresIn: "1h",
    });

    return { accessToken };
};


export const authService = {
    loginUserIntoDB,
    generateAccessToken,
};