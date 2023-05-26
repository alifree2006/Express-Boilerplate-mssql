import { Types } from "mongoose";
import { Id, Pagination, QueryFind, QueryResponse } from "./interface";

const defaultPagination: Pagination = {
  page: 0,
  perPage: 15,
};

export default class service {
  private model: any;
  constructor(model: any) {
    this.model = model;
  }

  async find(
    filters = {},
    pagination: Pagination = defaultPagination,
    sort = { createdAt: -1 }
  ): Promise<QueryResponse<any>> {
    const page: number = pagination.page as number;
    let skip: number = pagination.page != 0 ? page * pagination.perPage : 0;
    filters = { ...filters, deleted: false };
    let result: any = await this.model
      .find(filters)
      .sort(sort)
      .skip(skip)
      .limit(pagination.perPage);

    const totalDocument: number = await this.model.countDocuments(filters);
    let nextPage: number =
      page * pagination.perPage >= totalDocument ? 0 : page + 1;
    const totalPages: number = Math.ceil(totalDocument / pagination.perPage);

    if (!result.length || result.length == totalDocument) nextPage = 0;
    return { data: result, nextPage, totalPages, totalDocument };
    //    return result
  }

  async findAll(
    filters = {},
    sort = { createdAt: -1 },
    populate?: string
  ): Promise<QueryResponse<any>> {
    filters = { ...filters, deleted: false };
    let result: any;
    if (populate)
      result = await this.model.find(filters).populate(populate).sort(sort);
    else result = await this.model.find(filters).sort(sort);

    const totalDocument: number = await this.model.countDocuments(filters);
    let nextPage: number = 0;
    const totalPages: number = 1;
    return { data: result, nextPage, totalPages, totalDocument };
  }

  async findById(_id: string) {
    return this.model.findById({ _id, deleted: false });
  }
  async findOne(filters: object = {}, populate?: string) {
    if (typeof filters === "string" || filters instanceof Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      filters = {
        _id: filters,
      };
    }
    if (populate) {
      return await this.model
        .findOne({ ...filters, deleted: false })
        .populate(populate);
    }
    return await this.model.findOne({ ...filters, deleted: false });
  }
  async create(data: object) {
    return this.model.create(data);
  }
  async findOneAndUpdate(filters: any, data: object) {
    const _this = this;
    if (typeof filters === "string" || filters instanceof Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      filters = {
        _id: filters,
      };
    }
    filters = { ...filters, deleted: false };
    return this.model.findOneAndUpdate(filters, data, { new: true });
  }

  async updateMany(filters: any, data: object, options: object = {}) {
    filters = { ...filters, deleted: false };
    return this.model.updateMany(filters, data, options);
  }
  async countDocuments(filters: any): Promise<number> {
    if (typeof filters === "string" || filters instanceof Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      filters = {
        _id: filters,
      };
    }
    filters = { ...filters, deleted: false };
    console.log("count filters:", filters);
    return this.model.countDocuments(filters);
  }

  async delete(ids: Id[]) {
    try {
      const result: any = await this.model.updateMany(
        {
          _id: { $in: ids },
        },
        { deleted: true },
        { multi: true }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
