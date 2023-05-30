import { Create, Id, QueryFind, Update } from "@/core/interface";
import c_controller from "../../core/controller";
import roleSchema from "./schema";
import roleService from "./service";
import requestCtrl from "@entity/request/controller";
import accessCtrl from "@entity/access/controller";
import { Request } from "@entity/request/interface";
import isOnlyLettersAndNumbers from "@/utils/isOnlyLettersAndNumbers";
import { RolePayload } from "./interface";

class controller extends c_controller {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the roleController class extended of the main parent class baseController.
   *
   * @param service - roleService
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
      if (key == "title") {
        console.log("filters.title:", filters.title);
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ["$title", "$titleInTicket"],
            },
            regex: filters.title,
            options: "i",
          },
        };
        delete filters.title;
      }
      if (key == "id") {
        filters._id = value;
        delete filters.id;
      }
    }
    return filters;
  }

  async create(payload: Create) {
    // check dependencies accesses
    const requestsIds = payload.params.requests;
    for (let i = 0; i < requestsIds?.length; i += 1) {
      const requestId = requestsIds[i];
      const requestFound: Request = await requestCtrl.findById({
        id: requestId,
      });

      if (!requestFound) throw new Error("Unvalid request added to the role.");
      for (let j = 0; j < requestFound.dependencies.length; j += 1) {
        const dependencySlug = requestFound.dependencies[j];
        const dependencyFound: Request = await requestCtrl.findOne({
          filters: { slug: dependencySlug },
        });
        if (!dependencyFound)
          throw new Error(`Request with ${dependencySlug} slug don't exist.`);
        if (!requestsIds.includes(dependencyFound.id)) {
          throw new Error(
            `${requestFound.title} need to access ${dependencyFound.title}`
          );
        }
      }
    }
    // end of check dependencies

    // create role
    if (!isOnlyLettersAndNumbers(payload.params.title))
      throw new Error("The title should contain only letters and numbers.");
    const slug = payload.params.title.replace(" ", "_");
    const roleFinded = await this.getRoleBySlug(slug);
    console.log("roleFinded:", roleFinded);
    if (roleFinded) return roleFinded;
    const { title, acceptTicket, titleInTicket, active, description } =
      payload.params;
    const newRole = await super.create({
      params: { title, slug, acceptTicket, titleInTicket, active, description },
      saveLog: true,
    });
    console.log("new role:", newRole);
    // save accesses
    if (requestsIds.length > 0) this.saveAccessesRole(newRole.id, requestsIds);
    return newRole;
  }

  async update(payload: Update) {
    await super.findOneAndUpdate(payload);
    this.saveAccessesRole(payload.filters, payload.params.requests);
  }

  async saveAccessesRole(roleId: Id, RequestsId: Id[]) {
    for (let i = 0; i < RequestsId.length; i += 1) {
      const requestId = RequestsId[i];
      accessCtrl.create({ params: { roleId, requestId } });
    }
  }

  async getRoleBySlug(slug: string) {
    return this.findOne({ filters: { slug } });
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters);
    const foundedRole = await super.find(payload);
    if (foundedRole.totalDocument > 1 || foundedRole.totalDocument == 0)
      return foundedRole;

    const accesses = await accessCtrl.findAll({
      filters: { roleId: foundedRole.data[0].id },
    });
    const accessesList = [];
    for (let i = 0; i < accesses.totalDocument; i += 1) {
      const access = accesses.data[i];
      accessesList.push(access.requestId);
    }
    const _foundedRole = {
      ...foundedRole.data[0].toJSON(),
      accesses: accessesList,
    };
    foundedRole.data[0] = _foundedRole;
    return foundedRole;
  }
}

const roleCtrl = new controller(new roleService(roleSchema));
export default roleCtrl;
