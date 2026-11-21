import express, { type Request, type Application, type Response } from "express";
import "dotenv/config";
import { userRoute } from "./modules/users/user-route";
import { profileRoute } from "./modules/profile/profile-route";
import { authRoute } from "./modules/auth/auth-route";
const app : Application = express();
import fs from "fs";


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  // console.log('Method -> URL -> Time:', req.method, req.url, Date.now());
  const log = `Method : ${req.method} | URL : ${req.url} | Time : ${Date.now()}\r\n`;

  fs.appendFile("logger.txt", log, (err) => {
    if (err) {
      console.error("Logging failed:", err);
    } else {
      console.log("Log saved successfully!");
    }
  });

  next();
});


app.use("/api/v1/users", userRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/auth", authRoute);


app.get('/', (req : Request, res : Response) => {
  res.status(200).json({
    success : true,
    message : "This is root route",
    author : "Rafiul Talukdar"
  });
});


export default app;