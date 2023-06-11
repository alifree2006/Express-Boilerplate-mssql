import { Id, Model } from "@core/interface";

export type Auth = Model & {
  userId: Id;
  deviceUUID?: string;
  origin?: string;
  refreshToken: string;
  accessToken: string;
  platform?: string;
  app: string;
  userAgent?: string;
  active: boolean;
};

export type DisablePreviuosDeviceAuth = {
  userId: Id;
  deviceUUID: string;
};

export type Logout = DisablePreviuosDeviceAuth;

export type UpdateAccessToken = {
  userId: Id;
  deviceUUID: string;
  refreshToken: string;
  accessToken: string;
};

export type RegisterPaylod = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SetNewPasswordByEmailResetType = {
  email: string;
  password: string;
  verifyCode: string;
};
