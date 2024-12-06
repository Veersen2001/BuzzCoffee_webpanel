import { Request, Response } from "express";
import User from "../models/User";

import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcryptConfig from "../config/bcrypt";

const SESSION_EXPIRY_TIME = 86400; // 24 hours in seconds
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface CustomRequest extends Request {
  user?: {
    userId: string | null;
    verified: boolean;
  };
}

const userController = {
  create: async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        password: passwordBody,
        role,
        profileImage,
      } = req.body;

      if (!name || !email || !passwordBody || !role) {
        return res.status(400).json({ message: "Missing data" });
      }

      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const isUserExists = await User.findOne({ email }).exec();

      if (isUserExists) {
        return res.status(401).json({ message: "User Already Exists" });
      }

      const password = await bcrypt.hash(passwordBody, bcryptConfig.salt);
      const access_token = crypto.randomBytes(64).toString("hex");
      const session_expiry = new Date(Date.now() + SESSION_EXPIRY_TIME * 1000);
      console.log("token",access_token);
      

      const newUser = await new User({
        name,
        email,
        password,
        access_token,
        role,
        session_expiry,
        profileImage: profileImage || "https://github.com/shadcn.png",
      }).save();

      return res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Missing Data" });
      }

      const user = await User.findOne({ email }).exec();

      if (!user) {
        return res.status(401).json({ message: "Email or Password is Wrong!" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email or Password is Wrong!" });
      }

      let sessionExpiry = user.get("session_expiry");
      if (new Date() > sessionExpiry) {
        sessionExpiry = new Date(Date.now() + SESSION_EXPIRY_TIME * 1000);
        user.set("session_expiry", sessionExpiry);
        await user.save();
      }

      const access_token = jwt.sign(
        { userId: user._id, sessionExpiry: sessionExpiry.getTime() },
        JWT_SECRET,
        { expiresIn: SESSION_EXPIRY_TIME }
      );

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        access_token: access_token,
        role: user.role,
        session_expiry: sessionExpiry.toISOString(),
        profileImage: user.profileImage,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  verifyToken: async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      jwt.verify(
        token,
        JWT_SECRET,
        async (err, decoded: JwtPayload | undefined) => {
          if (err || !decoded) {
            return res
              .status(401)
              .json({ message: "Invalid or expired token" });
          }

          const user = await User.findById(decoded.userId)
            .select("-password -access_token")
            .exec();

          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

          return res.status(200).json(user);
        }
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  select: async (req: Request, res: Response) => {
    try {
      const { id: _id } = req.params;
      const noSelect = ["-password", "-email", "-access_token"];
      if (_id) {
        const user = await User.findOne({ _id }, noSelect).exec();
        return res.status(200).json(user);
      } else {
        const users = await User.find({}, noSelect).exec();
        return res.status(200).json(users);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default userController;
