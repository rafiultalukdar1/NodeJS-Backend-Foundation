import { Request, Response } from "express";
import { authService } from "./auth-service";
import sendResponse from "../../utils/sencResponse";

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

        sendResponse(res, {
            statusCode : 200,
            success: true,
            message: "Login successful",
            data: result,
        });

    } catch (error : any) {
        sendResponse(res, {
            statusCode : 500,
            success : false,
            message : error?.message,
            error : error,
        });
    }
};


const generateToken = async (req : Request, res : Response) => {
    try {
        // console.log("New Refresh Token:", req.cookies);
        const result = await authService.generateAccessToken(req.cookies.refreshToken);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Access token generated successfully!",
            data: result,
        });

    } catch (error : any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error?.message || "Something went wrong!",
            error: error,
        });
    }
};


export const authController = {
    loginUser,
    generateToken,
};