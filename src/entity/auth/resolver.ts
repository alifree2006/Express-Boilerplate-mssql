import { Request, Response } from "express";
import { RequestGroup, RequestPayload } from "@entity/request/interface";
import requestCtrl from "@entity/request/controller";
import userCtrl from "./controller";
import loginLimiter from "@/middleware/loginLimiter";

module.exports = resolver;
const API_V = process.env.API_VERSION;

function resolver(app: any) {
  // create authentication group request
  const accessGroupRequestPaylod: RequestGroup = {
    parentSlug: null,
    description: "",
    slug: "authentication",
    title: "Authentication",
  };
  requestCtrl.create({ params: accessGroupRequestPaylod });

  // resolve register
  const registerRequestPaylod: RequestPayload = {
    path: "/register",
    method: "POST",
    slug: "register",
    parentSlug: "authentication",
    dependencies: [],
    title: "Register",
  };
  requestCtrl.create({ params: registerRequestPaylod });
  app.post(`/${API_V}/register`, (req: Request, res: Response) => {
    res.json("Hello register!");
  });

  // always allowed path
  // resolve Authentication
  const authRequestPaylod: RequestPayload = {
    path: "/auth",
    parentSlug: "authentication",
    method: "POST",
    slug: "auth",
    title: "Authentication",
    dependencies: [],
  };
  requestCtrl.create({ params: authRequestPaylod });

  app.post(`/${API_V}/auth`, loginLimiter, (req: Request, res: Response) => {
    try {
      userCtrl.auth(req, res);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  });

  // resolve refreshAccessToken
  // always allowed path
  const refreshRequestPaylod: RequestPayload = {
    path: "/auth/refresh",
    parentSlug: "authentication",
    method: "GET",
    slug: "auth_refresh",
    title: "Refresh access tocken",
    dependencies: [],
  };
  requestCtrl.create({ params: refreshRequestPaylod });

  app.get(`/${API_V}/auth/refresh`, (req: Request, res: Response) => {
    try {
      userCtrl.refreshToken(req, res);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  });

  // resolve /user/profile - get user info by aaccessToken
  // always allowed path
  const getPropfileRequestPaylod: RequestPayload = {
    path: "/auth/profile",
    parentSlug: "authentication",
    method: "GET",
    slug: "auth_profile",
    title: "Get profile",
    description: "Get user profile info by himself",
    dependencies: [],
  };
  requestCtrl.create({ params: getPropfileRequestPaylod });

  app.get(`/${API_V}/auth/profile`, (req: Request, res: Response) => {
    userCtrl.getUserProfileFromAccessToken(req, res);
  });
}
