import { Request, Response } from "express";
import requestCtrl from "@entity/request/controller";
import { RequestGroup, RequestPayload } from "@/entity/request/interface";
import verifyCtrl from "./controller";
import ResetPasswordLimiter from "@/middleware/ResetPasswordLimiter";

module.exports = resolver;
const API_V = process.env.API_VERSION;
const entity = `verify`;

function resolver(app: any) {
  // create verify group request
  const verifyGroupRequestPaylod: RequestGroup = {
    parentSlug: null,
    description: "",
    slug: "verify",
    title: "Verify",
  };
  requestCtrl.create({ params: verifyGroupRequestPaylod });

  // resolve verify email
  // always allowed
  const verifyEmailRequestPaylod: RequestPayload = {
    title: "Verify email",
    path: "/auth/verify-email",
    method: "POST",
    slug: "verify_email",
    parentSlug: "verify",
    dependencies: [],
  };
  requestCtrl.create({ params: verifyEmailRequestPaylod });
  app.post(
    `/${API_V}/auth/verify-email`,
    async (req: Request, res: Response) => {
      try {
        await verifyCtrl.verifyEmail(req.body);
        res.json({ msg: "Verify done." });
      } catch (error: any) {
        res
          .status(400)
          .json({ msg: error.message || "Unable to verify email." });
      }
    }
  );

  // resolve set / reset password
  // always allowed
  const getRolesRequestPaylod: RequestPayload = {
    title: "Set / Reset password",
    path: "/auth/reset-password-request",
    method: "POST",
    slug: "reset_password_request",
    parentSlug: "verify",
    dependencies: [],
  };
  requestCtrl.create({ params: getRolesRequestPaylod });
  app.post(
    `/${API_V}/auth/reset-password-request`,
    ResetPasswordLimiter,
    async (req: Request, res: Response) => {
      try {
        await verifyCtrl.resetPasswordByEmail(req.body);
        res.json({ msg: "Request done." });
      } catch (error: any) {
        res
          .status(400)
          .json({ msg: error.message || "Unable to do this request." });
      }
    }
  );
}
