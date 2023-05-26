import { Schema, model } from "mongoose";
import { File, UsedPlace } from "./interface";

const usedPlaceSchema = new Schema<UsedPlace>(
  {
    entity: String,
    id: Schema.Types.ObjectId,
  },
  { _id: false }
);

const fileSchema = new Schema<File>(
  {
    usedPlaces: [usedPlaceSchema],
    title: String,
    url: String,
    previewPath: String,
    mimeType: String,
    size: Number,
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

fileSchema.set("toObject", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
  },
});

fileSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    ret.url = `${process.env.FILE_HOST_DOMAIN}${ret.url}`;
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});

export default model<File>("file", fileSchema);
