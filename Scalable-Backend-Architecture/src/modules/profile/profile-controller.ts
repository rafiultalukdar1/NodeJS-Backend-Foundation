import { Request, Response } from "express";
import { profileService } from "./profile-service";
import sendResponse from "../../utils/sencResponse";

const createProfile = async (req : Request, res : Response) => {
    try {
        const result = await profileService.createProfileIntoDB(req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Profile created",
            data: result.rows[0],
        });

    } catch (error : any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error?.message || "Something went wrong!",
            error: error,
        });
    }
}

export const profileController = {
    createProfile,
};