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

  if (!request && !alwaysAllowed) {
    console.log(`Uneccepted request:`, {
      method: req.method,
      path: requestPath,
    });
    return res.status(500).json({ msg: `Uneccepted request.` }); // not allowed
  }

  if (!alwaysAllowed) {
    log.setRequest(request.id);

    const allowed: boolean = await authCtrl.checkingPermissionToDoRequest({
      userId: req.userId,
      method: req.method,
      path: requestPath,
    });

    log.setAllowed(allowed);
    if (!allowed) return res.sendStatus(405); // not allowed
    next();
    return;
  }
  log.setAllowed(alwaysAllowed);
  if (alwaysAllowed) {
    next();
    return;
  }
};

export default haveAccess;
