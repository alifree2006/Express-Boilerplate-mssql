import alwaysAllowedPath from "@/utils/alwaysAllowedPath";
import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = async (req: any, res: Response, next: NextFunction) => {
  const alwaysAllowed: boolean = await alwaysAllowedPath(req.path);
  if (alwaysAllowed) {
    next();
    return;
  }
  const authHeader = req.headers["authorization"]; // authorization == accessToken
  if (!authHeader) return res.sendStatus(401); // Unahthorized
  // console.log(authHeader); // Bearer token
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: any, decoded: any) => {
      if (err) return res.sendStatus(403); //invalid token
      req.userId = decoded.userId;
      next();
    }
  );
};

export default verifyJWT;
