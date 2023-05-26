import { Schema, model } from "mongoose";
import { Access } from "./interface";

const accessSchema = new Schema<Access>(
  {
    roleId: { type: Schema.Types.ObjectId, ref: "role", required: true },
    requestId: { type: Schema.Types.ObjectId, ref: "request", required: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<Access>("access", accessSchema);
