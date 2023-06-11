import hash from "@utils/hash";
import { Schema, model } from "mongoose";
import { User } from "./interface";
import userCtrl from "@entity/user/controller";

const userSchema = new Schema<User>(
  {
    roles: [{ type: Schema.Types.ObjectId, ref: "role", required: true }],
    mobile: { type: String },
    mobileVerified: { type: Boolean, default: false },
    email: { type: String, unique: true },
    emailVerified: { type: Boolean, default: false },
    passwordHash: { type: String, required: true },
    firstName: String,
    lastName: String,
    country: String,
    state: String,
    city: String,
    address: String,
    about: String,
    image: { type: Schema.Types.ObjectId, ref: "file" },
    language: String,
    darkMode: Boolean,
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await hash(this.passwordHash);
  }
  next();
});

// userSchema.set("toObject", { virtuals: true, getters: true });
// // // Duplicate the ID field.
// userSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

var autoPopulateLead = function (next: any) {
  this.populate("image roles");
  next();
};

userSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

userSchema.set("toObject", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    ret.name =
      ret.firstName && ret.lastName
        ? `${ret.firstName} ${ret.lastName}`
        : ret.email;
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});

userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    ret.name =
      ret.firstName && ret.lastName
        ? `${ret.firstName} ${ret.lastName}`
        : ret.email;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.deleted;
  },
});

export default model<User>("user", userSchema);
