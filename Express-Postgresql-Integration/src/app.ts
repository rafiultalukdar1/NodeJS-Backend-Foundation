import express, { type Request, type Application, type Response } from "express";
import "dotenv/config";
import { userRoute } from "./modules/users/user-route";
const app : Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/users", userRoute)


app.get('/', (req : Request, res : Response) => {
  res.status(200).json({
    success : true,
    message : "This is root route",
    author : "Rafiul Talukdar"
  });
});


export default app;