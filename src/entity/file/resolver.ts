import { NextFunction, Request, Response } from "express";
import fileCtrl from "./controller";
import requestCtrl from "@entity/request/controller";
import express from "express";
import createDir from "@/utils/createDirectory";
import { RequestGroup, RequestPayload } from "../request/interface";
const router = express.Router();
const multer = require("multer");

module.exports = resolver;
const API_V = process.env.API_VERSION;
const entity = `file`;

const maxSize = 25 * 1024 * 1024; // max size = 25 mg
const storage = multer.diskStorage({
  destination: async (req: any, file: any, cb: any) => {
    await createDir("./src/uploads/temp");
    cb(null, "./src/uploads/temp");
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.originalname.split(".").pop());
  },
});
const upload = multer({ storage: storage, limits: { fileSize: maxSize } });

const uploadFile = upload.fields([{ name: "file", maxCount: 1 }]);

router.post(
  "/upload",
  uploadFile,
  (req: Request, res: Response, next: NextFunction) => {
    fileCtrl.saveFileInfo(req, res, next);
  }
);

function resolver(app: any) {
  // create authentication group request
  const fileGroupRequestPaylod: RequestGroup = {
    parentSlug: null,
    description: "",
    slug: "file",
    title: "File",
  };
  requestCtrl.create({ params: fileGroupRequestPaylod });

  // resolve upload file
  // always allowed path
  const uploadFileRequestPaylod: RequestPayload = {
    title: "Upload File",
    path: "/file/upload",
    parentSlug: "file",
    method: "POST",
    slug: "upload_file",
    dependencies: [],
  };
  requestCtrl.create({ params: uploadFileRequestPaylod });

  const uploadFile = fileCtrl.handleUpload();

  app.use(`/${API_V}/${entity}`, router);
}
