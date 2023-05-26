import { model, Schema } from "mongoose";
import { Log } from "./interface";
const logSchema = new Schema<Log>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId },
    ip: { type: String },
    allowed: { type: Boolean, required: true },
    success: { type: Boolean, default: false },
    previousValues: { type: Object },
    variables: { type: Object },
    error: { type: Object },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<Log>("log", logSchema);
