import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import routes from "./routes";

import mongoConfig from "./config/mongo";
mongoose.connect(mongoConfig.url, mongoConfig.configs);
dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(routes);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use(
  cors({
    origin: ['http://localhost:5173'], // Adjust this to the frontend's origin
    credentials: true,
  })
);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
