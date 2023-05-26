import { Model } from "@core/interface";
import { Types } from "mongoose";

export type Role = Model & {
  title: string;
  slug: string;
  description: string;
  acceptTicket?: boolean;
  titleInTicket?: string;
  active: boolean;
};

export type RolePayload = Omit<Role, "id">;
