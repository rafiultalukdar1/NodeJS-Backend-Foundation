import { Request, Response } from "express";
import { authService } from "./auth-service";

const loginUser = async (req : Request, res : Response) => {
    try {
        const result = await authService.loginUserIntoDB(req.body);

        const { refreshToken } = result;

        res.cookie("refreshToken", refreshToken, {
            secure : false, // http -> false, https -> true
            httpOnly : true, // prevent xxs attact
            sameSite : "lax",
            // maxAge: use for token time line 
            path : "/",
            domain : "localhost", // example.com or rafiultalukdar.com
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });

    } catch (error : any) {
        res.status(500).json({
            success : false,
            message : error?.message,
            error : error,
        });
    }
};

export const authController = {
    loginUser
};