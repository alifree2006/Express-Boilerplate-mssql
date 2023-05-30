import { Request, Response } from "express";
import { RequestGroup, RequestPayload } from "@entity/request/interface";
import ticketMessageCtrl from "./controller";
import requestCtrl from "@entity/request/controller";
import getPaginationFiltersFromQuery from "@/utils/getPagenationFiltersFromQuery";
import { Id } from "@/core/interface";
module.exports = resolver;

const API_V = process.env.API_VERSION;
function resolver(app: any) {
  // create ticketMessage group request
  const ticketMessageGroupRequestPaylod: RequestGroup = {
    parentSlug: null,
    description: "",
    slug: "ticket_message",
    title: "Ticket Message",
  };
  requestCtrl.create({ params: ticketMessageGroupRequestPaylod });

  // resolve get ticketMessages
  const getTicketMessagesRequestPaylod: RequestPayload = {
    title: "List of ticket Messages in panel",
    path: "/panel/ticketMessages",
    method: "GET",
    slug: "get_ticket_messages",
    parentSlug: "ticket_message",
    dependencies: ["get_tickets_panel"],
  };
  requestCtrl.create({ params: getTicketMessagesRequestPaylod });
  app.get(
    `/${API_V}/panel/ticketMessages`,
    async (req: Request, res: Response) => {
      try {
        const { filters, pagination } = getPaginationFiltersFromQuery(
          req.query
        );
        const foundedTicketMessages = await ticketMessageCtrl.find({
          filters,
          pagination,
        });
        res.json(foundedTicketMessages);
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Unable to get ticket messages." });
      }
    }
  );

  // Resolve create ticketMessage
  const createTicketMessagePayload: RequestPayload = {
    title: "Create ticket Message in panel",
    path: `/panel/ticketMessage`,
    method: "POST",
    slug: "create_ticket_message",
    parentSlug: "ticket_message",
    dependencies: ["get_roles_panel"],
  };
  requestCtrl.create({ params: createTicketMessagePayload });
  app.post(`/${API_V}/panel/ticketMessage`, async (req: any, res: Response) => {
    console.log("{ ...req.body, userId: req.userId }:", {
      ...req.body,
      userId: req.userId,
    });
    try {
      await ticketMessageCtrl.create({
        params: { ...req.body, userId: req.userId },
      });
      res.json({ msg: "Ticket message created" });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  });
}
