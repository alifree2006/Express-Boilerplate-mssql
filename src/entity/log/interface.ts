import { Model } from "@core/interface";
import { Types } from "mongoose";

export type Log = Model & {
  userId: Types.ObjectId;
  requestId: Types.ObjectId;
  targetId?: Types.ObjectId;
  ip: string;
  allowed: boolean;
  success?: boolean;
  previousValues?: object;
  variables?: object;
  error?: any;
};

export type LogPayload = Omit<Log, "id">;
