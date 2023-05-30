import { Create, Id, QueryFind, Update } from "@/core/interface";
import c_controller from "../../core/controller";
import ticketSchema from "./schema";
import ticketService from "./service";
import ticketMessageCtrl from "../ticketMessage/controller";
import accessCtrl from "@entity/access/controller";
import { Request } from "@entity/request/interface";
import isOnlyLettersAndNumbers from "@/utils/isOnlyLettersAndNumbers";
import { Ticket, TicketPayload } from "./interface";

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
      if (key == "subject") {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ["$subject", "$lastMessageText"],
            },
            regex: filters.subject,
            options: "i",
          },
        };
        delete filters.subject;
      }
      if (key == "id") {
        filters._id = value;
        delete filters.id;
      }
    }
    return filters;
  }

  async create(payload: Create) {
    const ticketPayload: TicketPayload = payload.params;
    const count = await this.countAll();
    const newTicket: Ticket = await super.create({
      params: { ...payload.params, ticketNumber: count },
    });
    ticketMessageCtrl.create({
      params: {
        ...payload.params,
        parentId: newTicket.id,
      },
    });
    return newTicket;
  }

  async update(payload: Update) {
    await super.findOneAndUpdate(payload);
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters);
    return super.find(payload);
  }
}

const ticketCtrl = new controller(new ticketService(ticketSchema));
export default ticketCtrl;
