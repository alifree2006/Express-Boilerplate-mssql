import c_controller from "@core/controller";
import roleCtrl from "@entity/role/controller";
import accessCtrl from "@entity/access/controller";
import userService from "./service";
import userSchema from "./schema";
import { User } from "./interface";
import { Create, Id, QueryFind } from "@/core/interface";
import { Role } from "@entity/role/interface";

class controller extends c_controller {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the userController class extended of the main parent class baseController.
   *
   * @param service - userService
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
      if (
        key == "userName" ||
        key == "fullName" ||
        key == "email" ||
        key == "mobile"
      )
        filters[key] = { $regex: new RegExp(value, "i") };
      if (key == "name") {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ["$firstName", "$email", "$lastName", "$mobile"],
            },
            regex: filters.name,
            options: "i",
          },
        };
        delete filters.name;
      }

      if (key == "orderBy" && value == "name") {
        filters.orderBy = "firstName";
      }
      if (key == "id") {
        filters._id = value;
        delete filters.id;
      }
    }
    return filters;
  }

  async create(payload: Create): Promise<any> {
    try {
      let foundUser = await this.findOne({
        filters: { email: payload.params.email },
      });
      if (foundUser) throw new Error("Duplicate email.");
      foundUser = await this.findOne({
        filters: { mobile: payload.params.mobile },
      });
      if (foundUser) throw new Error("Duplicate mobile.");
      await super.create(payload);
    } catch (error: any) {
      throw new Error(error?.message || "Unable to create user.");
    }
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters);
    return super.find(payload);
  }

  async getSuperAdmin() {
    const roleSuperAdmin = await roleCtrl.getRoleBySlug("super_admin");
    if (!roleSuperAdmin) throw new Error("Role super admin is deleted.");
    const userSuperAdmin = await this.findOne({
      filters: { roles: roleSuperAdmin.id },
    });
    return userSuperAdmin;
  }

  async getListAccess(userId: Id) {
    const listAccess: string[] = [];
    const user = await this.findById({ id: userId });
    for (let i = 0; i < user.roles.length; i++) {
      const role: Role = user.roles[i];
      const accesses = await accessCtrl.findAll({
        filters: { roleId: role.id },
        populate: "requestId",
      });
      for (let j = 0; j < accesses.data.length; j += 1) {
        const request = accesses.data[j].requestId;
        if (listAccess.indexOf(request.slug) === -1)
          listAccess.push(request.slug);
      }
    }
    return listAccess;
  }

  async getUserWithAccesses(userId: Id) {
    let user: any = await this.findById({ id: userId });
    const listAccess = await this.getListAccess(userId);
    user = { ...user.toObject(), accesses: listAccess };
    return user;
  }
}

export default new controller(new userService(userSchema));
