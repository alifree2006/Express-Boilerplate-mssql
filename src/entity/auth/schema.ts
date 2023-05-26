import { Schema, model } from "mongoose";
import { Auth } from "./interface";

const authSchema = new Schema<Auth>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    refreshToken: { type: String, unique: true },
    accessToken: { type: String, unique: true },
    deviceUUID: { type: String, unique: false },
    origin: { type: String, unique: false },
    platform: { type: String, unique: false },
    app: { type: String, unique: false },
    userAgent: { type: String, unique: false },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

authSchema.set("toObject", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
  },
});

authSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    ret.user = ret.userId;
    delete ret.roleIds;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<Auth>("auth", authSchema);
