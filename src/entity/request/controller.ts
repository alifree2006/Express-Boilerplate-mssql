import { Create } from "@/core/interface";
import baseController from "@core/controller";
import accessCtrl from "@entity/access/controller";
import roleCtrl from "@entity/role/controller";
import { request } from "http";
import { RequestPayload } from "./interface";
import requestSchema from "./schema";
import requestService from "./service";

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the requestController class extended of the main parent class baseController.
   *
   * @param service - requestService
   *
   * @beta
   */
  constructor(service: any) {
    super(service);
  }

  async existRequest(slug: string) {
    const request = await this.findOne({ filters: { slug } });
    return request;
  }

  async create(payload: Create): Promise<any> {
    const { params } = payload;
    const existRequest = await this.existRequest(params.slug);
    if (existRequest) return existRequest;
    // const superAdminRole = await roleCtrl.getRoleBySlug("super_admin");
    const request = await super.create(payload);
    // accessCtrl.create({
    //   params: { roleId: superAdminRole.id, requestId: request.id },
    // });
    return request;
  }
}

export default new controller(new requestService(requestSchema));
