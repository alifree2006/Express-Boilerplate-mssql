import { Schema, model } from "mongoose";
import { Ticket } from "./interface";

const ticketSchema = new Schema<Ticket>(
  {
    subject: { type: String, required: false },
    lastMessageText: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "role", required: false },
    operatorId: { type: Schema.Types.ObjectId, ref: "user" },
    waiting: { type: String, enum: ["user", "operator"], default: "user" },
    open: { type: Boolean, default: true },
    ticketNumber: { type: Number },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

var autoPopulateLead = function (next: any) {
  this.populate("userId departmentId operatorId");
  next();
};

ticketSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

ticketSchema.set("toObject", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});

ticketSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();

    ret.user = ret.userId;
    delete ret.userId;
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});
export default model<Ticket>("ticket", ticketSchema);
