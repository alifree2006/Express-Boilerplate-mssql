import { Create, Id, QueryFind, Update } from "@/core/interface";
import c_controller from "../../core/controller";
import ticketSchema from "./schema";
import ticketService from "./service";
import ticketCtrl from "@entity/ticket/controller";
import requestCtrl from "@entity/request/controller";
import accessCtrl from "@entity/access/controller";
import { Request } from "@entity/request/interface";
import isOnlyLettersAndNumbers from "@/utils/isOnlyLettersAndNumbers";
import { TicketMessage, TicketMessagePayload } from "./interface";
import { Ticket } from "@entity/ticket/interface";

class controller extends c_controller {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the ticketController class extended of the main parent class baseController.
   *
   * @param service - ticketService
   *
   * @beta
   */
  constructor(service: any) {
    super(service);
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != "object") return {};
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != "string") continue;
      if (key == "message") {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ["$message"],
            },
            regex: filters.message,
            options: "i",
          },
        };
        delete filters.message;
      }
      if (key == "id") {
        filters._id = value;
        delete filters.id;
      }
    }
    return filters;
  }

  async create(payload: Create) {
    const ticketMessagePayload: TicketMessagePayload = payload.params;

    let openTicketMessage = false;
    const ticket = await ticketCtrl.findById({
      id: ticketMessagePayload.parentId,
    });
    if (!ticket)
      throw new Error(`Ticket ${ticketMessagePayload.parentId} dosn't exist`);
    if (ticketMessagePayload.userId === ticket.userId.id)
      openTicketMessage = true;
    const open: boolean = openTicketMessage;
    const isOperator = !openTicketMessage;
    let waiting = openTicketMessage ? "operator" : "user";

    const newTicketMessage: TicketMessage = await super.create({
      params: { ...payload.params, isOperator },
    });

    ticketCtrl.findOneAndUpdate({
      filters: ticket.id,
      params: { open, waiting, lastMessageText: newTicketMessage.message },
    });

    return newTicketMessage;
  }

  async find(payload: QueryFind) {
    const ticketMessages = await super.find(payload);
    const ticket = await ticketCtrl.findById({ id: payload.filters.parentId });
    return { ...ticketMessages, ticket };
  }
}

const ticketMessageCtrl = new controller(new ticketService(ticketSchema));
export default ticketMessageCtrl;
