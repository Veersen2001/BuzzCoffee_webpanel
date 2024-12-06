import dotenv from "dotenv";
import { ConnectionOptions } from "mongoose";

dotenv.config({ path: ".env" });

const mongoOpts: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
};

const mongoConfig = {
  url: process.env.DATABASE_URL,
  configs: mongoOpts,
};

export default mongoConfig;
