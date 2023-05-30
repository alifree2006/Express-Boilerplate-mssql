import { Request, Response } from "express";
import { RequestGroup, RequestPayload } from "@entity/request/interface";
import ticketCtrl from "./controller";
import requestCtrl from "@entity/request/controller";
import getPaginationFiltersFromQuery from "@/utils/getPagenationFiltersFromQuery";
import { Id } from "@/core/interface";
module.exports = resolver;

const API_V = process.env.API_VERSION;
function resolver(app: any) {
  // create ticket group request
  const ticketGroupRequestPaylod: RequestGroup = {
    parentSlug: null,
    description: "",
    slug: "ticket",
    title: "Ticket",
  };
  requestCtrl.create({ params: ticketGroupRequestPaylod });

  // resolve get tickets
  const getTicketsRequestPaylod: RequestPayload = {
    title: "List of all users tickets",
    path: "/panel/tickets",
    method: "GET",
    slug: "get_tickets_panel",
    parentSlug: "ticket",
    dependencies: [
      "get_roles_panel",
      "get_users_panel",
      "get_ticket_messages_panel",
      "create_ticket_message_panel",
    ],
  };
  requestCtrl.create({ params: getTicketsRequestPaylod });
  app.get(`/${API_V}/panel/tickets`, async (req: Request, res: Response) => {
    try {
      const { filters, pagination } = getPaginationFiltersFromQuery(req.query);
      const foundedTickets = await ticketCtrl.find({ filters, pagination });
      res.json(foundedTickets);
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "Unable to get tickets." });
    }
  });

  // Resolve create ticket
  const createTicketPayload: RequestPayload = {
    title: "Create ticket",
    path: `/panel/ticket`,
    method: "POST",
    slug: "create_ticket_panel",
    parentSlug: "ticket",
    dependencies: [
      "get_roles_panel",
      "ticket_messages_panel",
      "get_ticket_messages_panel",
      "create_ticket_message_panel",
    ],
  };
  requestCtrl.create({ params: createTicketPayload });
  app.post(`/${API_V}/panel/ticket`, async (req: any, res: Response) => {
    try {
      await ticketCtrl.create({
        params: { ...req.body, userId: req.userId },
      });
      res.json({ msg: "Ticket created" });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  });

  // Resolve create ticket
  const updateTicketPanelPayload: RequestPayload = {
    title: "Update ticket in Panel",
    path: `/panel/ticket`,
    method: "PATCH",
    slug: "update_ticket_panel",
    parentSlug: "ticket",
    dependencies: [
      "get_roles_panel",
      "ticket_messages_panel",
      "get_ticket_messages_panel",
      "create_ticket_message_panel",
    ],
  };
  requestCtrl.create({ params: updateTicketPanelPayload });
  app.patch(`/${API_V}/panel/ticket`, async (req: any, res: Response) => {
    try {
      await ticketCtrl.findOneAndUpdate({
        filters: req.body.ticketId,
        params: { ...req.body },
      });
      res.json({ msg: "Ticket Update" });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  });
}
