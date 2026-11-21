import { NextFunction, Request, Response } from "express";
import fs from 'fs';

const logger = async (req : Request, res : Response, next : NextFunction) => {
    
    const log = `Method : ${req.method} | URL : ${req.url} | Time : ${Date.now()}\r\n`;

    fs.appendFile("logger.txt", log, (err) => {
        if (err) {
            // console.error("Logging failed:", err);
        } else {
            // console.log("Log saved successfully!");
        }
    });

    next();
};

export default logger;