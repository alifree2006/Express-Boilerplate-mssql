import { Id, Model } from "@core/interface";
import { Types } from "mongoose";
import { type } from "os";

export type Request = Model & {
  parentSlug: string | null;
  path: string;
  method: "POST" | "GET" | "PATCH" | "DELETE";
  title: string;
  slug: string;
  dependencies: string[];
  description?: string;
  active?: boolean;
};

export type RequestGroup = {
  parentSlug: string | null;
  description?: string;
  slug: string;
  title: string;
};

export type RequestPayload = Omit<Request, "id">;
