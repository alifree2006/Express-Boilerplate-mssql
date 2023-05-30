import { Schema, model } from "mongoose";
import { TicketMessage } from "./interface";

const ticketMessageSchema = new Schema<TicketMessage>(
  {
    parentId: { type: Schema.Types.ObjectId },
    message: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    isOperator: { type: Boolean },
    fileIds: [{ type: Schema.Types.ObjectId, ref: "file", default: [] }],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

var autoPopulateLead = function (next: any) {
  this.populate("userId fileIds");
  next();
};

ticketMessageSchema
  .pre("findOne", autoPopulateLead)
  .pre("find", autoPopulateLead);

ticketMessageSchema.set("toObject", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});

ticketMessageSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    ret.attachments = ret.fileIds;

    ret.user = ret.userId;
    delete ret.userId;
    delete ret.fileIds;
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});

export default model<TicketMessage>("ticketMessage", ticketMessageSchema);
