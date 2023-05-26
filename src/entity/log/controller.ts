import c_controller from "@core/controller";
import logService from "./service";
import logSchema from "./schema";
import { Types } from "mongoose";
import { Id } from "@/core/interface";

// note: If this controller extends from the core controller infinity circular will be happen
class controller {
  private service: any;
  private requestId: any;
  private userId: any;
  private allowed: any;
  private variables: string;
  private targetId: any;
  private success: boolean;
  private error: any;
  private previousValues: string;
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the logController class extended of the main parent class baseController.
   *
   * @param service - logService
   *
   * @beta
   */
  constructor(service: any) {
    this.service = service;
    this.variables = "";
    this.previousValues = "";
    this.success = false;
  }

  setRequest(requestId: any) {
    this.requestId = requestId;
  }
  setUser(userId: any) {
    this.userId = userId;
  }
  setAllowed(allowed: any) {
    this.allowed = allowed;
  }

  setVariables(variables: object) {
    this.variables = JSON.stringify(variables);
  }

  setTarget(id: Types.ObjectId) {
    this.targetId = id;
  }

  setResultStatus(success: boolean) {
    this.success = success;
  }
  setError(error: any) {
    this.error = error;
  }
  setPreviousValues(previousValues: any) {
    this.previousValues = JSON.stringify(previousValues);
  }

  print() {
    console.log("Log values:", {
      requestId: this.requestId,
      userId: this.userId,
      allowed: this.allowed,
      variables: this.variables,
      targetId: this.targetId,
      success: this.success,
      error: this.error,
    });
  }

  save() {
    this.service.create({
      requestId: this.requestId,
      userId: this.userId,
      allowed: this.allowed,
      variables: this.variables,
      targetId: this.targetId,
      success: this.success,
      error: this.error,
    });
  }
}

export default new controller(new logService(logSchema));
