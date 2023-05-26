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

export type UpdateAccessToken = {
  userId: Id;
  deviceUUID: string;
  refreshToken: string;
  accessToken: string;
};
