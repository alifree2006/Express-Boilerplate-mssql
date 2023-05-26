import { Request, Response } from "express";
import { RequestGroup, RequestPayload } from "@entity/request/interface";
import accessCtrl from "./controller";
import requestCtrl from "@entity/request/controller";
import getPaginationFiltersFromQuery from "@/utils/getPagenationFiltersFromQuery";
import { Id } from "@/core/interface";
module.exports = resolver;
const API_V = process.env.API_VERSION;

function resolver(app: any) {
  // create access group request
  const accessGroupRequestPaylod: RequestGroup = {
    parentSlug: null,
    description: "",
    slug: "access",
    title: "Accesses",
  };
  requestCtrl.create({ params: accessGroupRequestPaylod });

  // resolve create access
  const createAccessRequestPaylod: RequestPayload = {
    path: "/access",
    parentSlug: "access",
    method: "POST",
    slug: "create_access",
    title: "Create Access",
    dependencies: ["get_roles", "get_requests"],
  };
  requestCtrl.create({ params: createAccessRequestPaylod });
  app.post(`/${API_V}/access`, async (req: Request, res: Response) => {
    try {
      await accessCtrl.create({ params: req?.body });
      res.json({ msg: "Acccess created." });
    } catch (error: any) {
      res.status(400).json({ msg: error?.message });
    }
  });

  // resolve get access
  const getAccessRequestPaylod: RequestPayload = {
    path: "/accesses",
    parentSlug: "access",
    method: "GET",
    slug: "get_accesses",
    title: "Accesses List",
    dependencies: [],
  };
  requestCtrl.create({ params: getAccessRequestPaylod });
  app.get(`/${API_V}/accesses`, async (req: Request, res: Response) => {
    try {
      const { filters, pagination } = getPaginationFiltersFromQuery(req.query);
      const foundedAccesses = await accessCtrl.find({ filters, pagination });
      res.json(foundedAccesses);
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "Unable to get accesses." });
    }
  });

  // resolve delet access
  const deleteAccessRequestPaylod: RequestPayload = {
    path: "/accesses",
    parentSlug: "access",
    method: "DELETE",
    slug: "delete_accesses",
    title: "Delete Access",
    dependencies: ["get_accesses"],
  };
  requestCtrl.create({ params: getAccessRequestPaylod });
  app.delete(`/${API_V}/accesses`, async (req: any, res: Response) => {
    if (!req.body?.ids && !req.body?.id)
      return res
        .status(400)
        .json({ msg: "Ids in delete is required.[ids: <Array of ids>]" });
    let filters: Id[];
    if (req.body?.id) filters = [req.body?.id];
    else filters = req.body?.ids;
    if (filters.length) accessCtrl.delete({ filters });
    res.json({ msg: "Delete done." });
  });
}
