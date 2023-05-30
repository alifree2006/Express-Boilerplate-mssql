import { Request, Response } from "express";
import { RequestGroup, RequestPayload } from "@entity/request/interface";
import roleCtrl from "./controller";
import requestCtrl from "@entity/request/controller";
import getPaginationFiltersFromQuery from "@/utils/getPagenationFiltersFromQuery";
import { Id } from "@/core/interface";
module.exports = resolver;

const API_V = process.env.API_VERSION;
function resolver(app: any) {
  // create role group request
  const roleGroupRequestPaylod: RequestGroup = {
    parentSlug: null,
    description: "",
    slug: "role",
    title: "Role",
  };
  requestCtrl.create({ params: roleGroupRequestPaylod });

  // resolve get roles
  const getRolesRequestPaylod: RequestPayload = {
    title: "List of roles",
    path: "/panel/roles",
    method: "GET",
    slug: "get_roles_panel",
    parentSlug: "role",
    dependencies: [],
  };
  requestCtrl.create({ params: getRolesRequestPaylod });
  app.get(`/${API_V}/panel/roles`, async (req: Request, res: Response) => {
    try {
      const { filters, pagination } = getPaginationFiltersFromQuery(req.query);
      const foundedRoles = await roleCtrl.find({ filters, pagination });
      res.json(foundedRoles);
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "Unable to get roles." });
    }
  });

  // Resolve create role
  const createRolePayload: RequestPayload = {
    title: "Create role",
    path: `/panel/role`,
    method: "POST",
    slug: "create_role_panel",
    parentSlug: "role",
    dependencies: ["get_requests", "get_accesses"],
  };
  requestCtrl.create({ params: createRolePayload });
  app.post(`/${API_V}/panel/role`, async (req: any, res: Response) => {
    try {
      await roleCtrl.create({
        params: req.body,
      });
      res.json({ msg: "Role created" });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  });

  // Resolve update role
  const updateRoleRequestPayload: RequestPayload = {
    title: "Update role",
    path: `/panel/role`,
    method: "PATCH",
    slug: "update_role_panel",
    parentSlug: "role",
    dependencies: [
      "get_roles_panel",
      "get_requests_panel",
      "get_accesses_panel",
    ],
  };
  requestCtrl.create({ params: updateRoleRequestPayload });
  app.patch(`/${API_V}/panel/role`, (req: any, res: Response) => {
    console.log("update role:", req.body);
    if (!req.body?.id)
      return res.status(400).json({ msg: "Id in update is required." });
    roleCtrl.update({ filters: req.body.id, params: req.body });
    res.json({ msg: "Update role done" });
  });

  // Resolve delete role
  const deleteRoleRequestPayload: RequestPayload = {
    title: "Delete role",
    path: `/panel/roles`,
    method: "DELETE",
    slug: "delete_role_panel",
    parentSlug: "role",
    dependencies: ["get_roles_panel"],
  };
  requestCtrl.create({ params: deleteRoleRequestPayload });
  app.delete(`/${API_V}/panel/roles`, async (req: any, res: Response) => {
    if (!req.body?.ids && !req.body?.id)
      return res
        .status(400)
        .json({ msg: "Ids in delete is required.[ids: <Array of ids>]" });
    let filters: Id[];
    if (req.body?.id) filters = [req.body?.id];
    else filters = req.body?.ids;
    if (filters.length) roleCtrl.delete({ filters });
    res.json({ msg: "Delete role done." });
  });
}
