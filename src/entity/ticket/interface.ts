import { Id, Model } from "@core/interface";
import { User } from "@entity/user/interface";

export type Ticket = Model & {
  userId: User;
  ticketNumber: number;
  departmentId: Id;
  operatorId?: Id;
  subject?: string;
  lastMessageText?: string;
  waiting: "user" | "operator";
  open: boolean;
};

export type TicketPayload = Omit<
  Ticket,
  "id" | "createdAt" | "updatedAt" | "deleted"
>;
