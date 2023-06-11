import { Id, Model } from "@core/interface";
import { Role } from "@entity/role/interface";

export type User = Model & {
  roles: Id[] | Role[];
  accesses?: string[];
  mobile?: string;
  mobileVerified: boolean;
  email: string;
  emailVerified: boolean;
  passwordHash: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  address: string;
  about: string;
  image: Id;
  language: string;
  darkMode: boolean;
  active: boolean;
};

export type HaveAccessPayload = {
  userId?: Id;
  method: "POST" | "GET" | "PUT" | "DELETE";
  path: string;
};

export type ChangePassword = {
  userId: Id;
  oldPassword: string;
  newPassword: string;
};
