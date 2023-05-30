import { Schema, Types } from "mongoose";

export {
  Model,
  // IReqDataSources,
  ServerResponse,
  QueryResponse,
  Pagination,
  Create,
  QueryFind,
  QueryFindById,
  QueryFindOne,
  Update,
  Delete,
  QueryResult,
  Location,
  Id,
};

// req contetnt interface
// type ReqDataSources {
//   readonly ip: string;
//   readonly user: IUser;
// }

// All mongoose interfaces extends from this interface
type Model = {
  id: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: Boolean;
};

// All server response interface
type ServerResponse<T> = {
  ok: number;
  message: string;
  data: QueryResponse<T>;
};

type QueryResponse<T> = {
  data: T[];
  nextPage: number;
  totalPages: number;
  totalDocument: number;
};

type Pagination = {
  page: number | "off";
  perPage: number;
};

type Log = {
  variables?: any;
  successful: boolean;
  error: any;
};

// DB Query interfaces

type Create = {
  params: any;
  saveLog?: boolean;
};
type QueryFind = {
  filters?: any & { orderBy?: string; order?: string };
  pagination?: Pagination;
  saveLog?: boolean;
  sort?: any;
  populate?: string;
};
type QueryFindById = {
  id: any;
  saveLog?: boolean;
};
type QueryFindOne = {
  filters: any;
  populate?: string;
  saveLog?: boolean;
};
type Update = {
  filters: any;
  params: any;
  saveLog?: boolean;
};
type Delete = {
  filters: Id[];
  saveLog?: boolean;
};

type QueryResult = {
  data: any;
  nextPage: number;
  totalPages: number;
  totalDocument: number;
};

type Location = {
  lat: string;
  long: string;
};

type Id = Schema.Types.ObjectId;
