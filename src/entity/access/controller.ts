import c_controller from "@core/controller";
import accessService from "./service";
import accessSchema from "./schema";
import { ExistRoleAccess } from "./interface";
class controller extends c_controller {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the accessController class extended of the main parent class baseController.
   *
   * @param service - accessService
   *
   * @beta
   */
  constructor(service: any) {
    super(service);
  }

  async haveAccess({ roleId, requestId }: ExistRoleAccess): Promise<boolean> {
    const founded = await this.findOne({ filters: { roleId, requestId } });
    if (founded) return true;
    return false;
  }
}

export default new controller(new accessService(accessSchema));
