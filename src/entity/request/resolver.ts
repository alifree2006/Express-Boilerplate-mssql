import { NextFunction, Request, Response } from "express";
import requestCtrl from "@entity/request/controller";
import express from "express";
import createDir from "@/utils/createDirectory";
import { RequestGroup, RequestPayload } from "../request/interface";
import getPaginationFiltersFromQuery from "@/utils/getPagenationFiltersFromQuery";
const router = express.Router();
const multer = require("multer");

module.exports = resolver;
const API_V = process.env.API_VERSION;
const entity = `request`;

function resolver(app: any) {
  // create request group request
  const fileGroupRequestPaylod: RequestGroup = {
    parentSlug: null,
    description: "",
    slug: "request",
    title: "Action",
  };
  requestCtrl.create({ params: fileGroupRequestPaylod });

  // resolve get roles
  const getRolesRequestPaylod: RequestPayload = {
    title: "List of requests",
    path: "/panel/allRequests",
    method: "GET",
    slug: "get_requests_panel",
    parentSlug: "request",
    dependencies: [],
  };
  requestCtrl.create({ params: getRolesRequestPaylod });
  app.get(
    `/${API_V}/panel/allRequests`,
    async (req: Request, res: Response) => {
      try {
        const { filters, pagination } = getPaginationFiltersFromQuery(
          req.query
        );
        const foundedRequests = await requestCtrl.findAll({
          filters,
          pagination,
        });
        res.json(foundedRequests);
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Unable to get list of requests." });
      }
    }
  );
}
