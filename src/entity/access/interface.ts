import { Id, Model } from "@core/interface";
import { Types } from "mongoose";

export type Access = Model & {
  roleId: Id;
  requestId: Id;
};

export type ExistRoleAccess = {
  roleId: Id;
  requestId: Id;
};
