import { model, Schema } from "mongoose";
import { Request } from "./interface";

const actionSchema = new Schema<Request>(
  {
    parentSlug: { type: String || null, ref: "request", default: null },
    path: { type: String, required: false },
    title: { type: String, required: true },
    method: { type: String, required: false },
    slug: { type: String, required: true, unique: true },
    dependencies: [{ type: String, default: [] }],
    description: { type: String, required: false, default: "" },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

actionSchema.set("toObject", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
  },
});

actionSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});
export default model<Request>("request", actionSchema);
