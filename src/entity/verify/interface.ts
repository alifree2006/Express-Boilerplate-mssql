import { Model } from "@core/interface";

export type Verify = Model & {
  type: "MOBILE" | "EMAIL" | "DRP"; // DRP = Deactive Reset Password
  origin: string;
  code: string;
  attempts: number;
  active?: boolean;
};

export type VerifyEmail = {
  email: string;
  verifyCode: string;
};

export type IsVerifyCodeValid = {
  type: "MOBILE" | "EMAIL" | "DRP"; // DRP = Deactive Reset Password
  origin: string;
  code: string;
};

export type VerifyPayload = Omit<Verify, "id">;
