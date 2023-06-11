import { model, Schema } from "mongoose";
import { Verify } from "./interface";

const verifySchema = new Schema<Verify>(
  {
    type: { type: String, enum: ["EMAIL", "MOBILE", "DRP"], required: true },
    origin: { type: String, required: true },
    code: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

verifySchema.set("toObject", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
  },
});

verifySchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});
export default model<Verify>("verify", verifySchema);
