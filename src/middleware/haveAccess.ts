import { NextFunction, Request, Response } from "express";
import authCtrl from "@entity/auth/controller";
import requestCtrl from "@entity/request/controller";
import log from "@entity/log/controller";
import alwaysAllowedPath from "@/utils/alwaysAllowedPath";
import removePathVersion from "@/utils/removePathVersion";

const haveAccess = async (req: any, res: Response, next: NextFunction) => {
  if (req.userId) log.setUser(req.userId);

  const alwaysAllowed: boolean = await alwaysAllowedPath(req.path);
  const requestPath = removePathVersion(req.path);

  const request = await requestCtrl.findOne({
    filters: { method: req.method, path: requestPath },
  });
  log.setRequest(request.id);

  const allowed: boolean = await authCtrl.checkingPermissionToDoRequest({
    userId: req.userId,
    method: req.method,
    path: requestPath,
  });

  log.setAllowed(allowed);

  if (alwaysAllowed) {
    next();
    return;
  }
  log.setAllowed(alwaysAllowed || allowed);
  if (!allowed) return res.sendStatus(405); // not allowed
  next();
  return;
};

export default haveAccess;
