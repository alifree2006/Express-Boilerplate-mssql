import { Id, Model } from "@core/interface";
import { User } from "@entity/user/interface";

export type TicketMessage = Model & {
  parentId: Id;
  userId: Id;
  isOperator: boolean;
  message: string;
  fileIds: Id[];
};

export type TicketMessagePayload = Omit<
  TicketMessage,
  "id" | "createdAt" | "updatedAt" | "deleted"
>;
