import { Request, Response } from "express";
import { RequestGroup, RequestPayload } from "@entity/request/interface";
import requestCtrl from "@entity/request/controller";
import userCtrl from "./controller";
import roleCtrl from "@entity/role/controller";
import getPaginationFiltersFromQuery from "@/utils/getPagenationFiltersFromQuery";
import { Id } from "@/core/interface";

module.exports = resolver;
const API_V = process.env.API_VERSION;

function resolver(app: any) {
  // create role group request
  const userGroupRequestPaylod: RequestGroup = {
    parentSlug: null,
    description: "",
    slug: "user",
    title: "User",
  };
  requestCtrl.create({ params: userGroupRequestPaylod });

  // resolve get users
  const getUsersRequestPaylod: RequestPayload = {
    title: "List of users",
    path: "/users",
    method: "GET",
    slug: "get_users",
    parentSlug: "user",
    dependencies: ["get_roles"],
  };
  requestCtrl.create({ params: getUsersRequestPaylod });
  app.get(`/${API_V}/users`, async (req: Request, res: Response) => {
    try {
      const { filters, pagination } = getPaginationFiltersFromQuery(req.query);
      const foundedUsers = await userCtrl.find({ filters, pagination });
      console.log("foundedUsers:", foundedUsers);
      console.log({ filters, pagination });
      res.json(foundedUsers);
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "Unable to get users." });
    }
  });

  // Resolve create user
  const createUserPayload: RequestPayload = {
    title: "Create user",
    path: `/user`,
    method: "POST",
    slug: "create_user",
    parentSlug: "user",
    dependencies: ["get_roles"],
  };
  requestCtrl.create({ params: createUserPayload });
  app.post(`/${API_V}/user`, async (req: any, res: Response) => {
    try {
      await userCtrl.create({
        params: { ...req.body, passwordHash: req.body.password },
      });
      res.json({ msg: "User created" });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  });

  // Resolve update current user by himself
  const updateSelfUserPayload: RequestPayload = {
    title: "Update himself",
    description: "Update user information by himself",
    path: `/selfUser`,
    method: "PATCH",
    slug: "update_userself",
    parentSlug: "user",
    dependencies: [],
  };
  requestCtrl.create({ params: updateSelfUserPayload });
  app.patch(`/${API_V}/selfUser`, (req: any, res: Response) => {
    userCtrl.findOneAndUpdate({ filters: req.userId, params: req.body });
    res.json({ msg: "Update done" });
  });

  // Resolve update user
  const updateUserPayload: RequestPayload = {
    title: "Update user",
    path: `/user`,
    method: "PATCH",
    slug: "update_user",
    parentSlug: "user",
    dependencies: ["get_users", "get_roles"],
  };
  requestCtrl.create({ params: updateUserPayload });
  app.patch(`/${API_V}/user`, (req: any, res: Response) => {
    if (!req.body?.id)
      return res.status(400).json({ msg: "Id in update is required." });
    userCtrl.findOneAndUpdate({ filters: req.body.id, params: req.body });
    res.json({ msg: "Update user done" });
  });

  // Resolve delete users
  const deleteUserPayload: RequestPayload = {
    title: "delete user",
    path: `/users`,
    method: "DELETE",
    slug: "delete_user",
    parentSlug: "user",
    dependencies: ["get_users"],
  };
  requestCtrl.create({ params: deleteUserPayload });
  app.delete(`/${API_V}/users`, async (req: any, res: Response) => {
    if (!req.body?.ids && !req.body?.id)
      return res
        .status(400)
        .json({ msg: "Ids in delete is required.[ids: <Array of ids>]" });
    let filters: Id[];
    if (req.body?.id) filters = [req.body?.id];
    else filters = req.body?.ids;
    const userSuperAdmin = await userCtrl.getSuperAdmin();
    filters = filters.filter((id) => id != userSuperAdmin.id);
    if (filters.length) userCtrl.delete({ filters });
    res.json({ msg: "Delete user(s) done." });
  });
}
