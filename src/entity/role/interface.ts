import { Id, Model } from "@core/interface";
import { Types } from "mongoose";

export type Role = Model & {
  title: string;
  slug?: string;
  description: string;
  acceptTicket?: boolean;
  titleInTicket?: string;
  // requestsIds?: Id[];
  active: boolean;
};

export type RolePayload = { requests: Id[] } & Omit<Role, "id">;
