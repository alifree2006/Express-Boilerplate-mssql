import c_controller from "@core/controller";
import { File } from "./interface";

import fileSchema from "./schema";
import fileService from "./service";
import { NextFunction, Response } from "express";
import createDir from "@/utils/createDirectory";
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const extractFrames = require("ffmpeg-extract-frames");

class controller extends c_controller {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the fileController class extended of the main parent class baseController.
   *
   * @param service - fileService
   *
   * @beta
   */
  constructor(service: any) {
    super(service);
  }
  async handleUpload() {
    const maxSize = 25 * 1024 * 1024; // max size = 25 mg
    const storage = multer.diskStorage({
      destination: (req: any, file: any, cb: any) => {
        cb(null, "./src/uploads/temp");
      },
      filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "." + file.originalname.split(".").pop());
      },
    });
    const upload = multer({ storage: storage, limits: { fileSize: maxSize } });

    const uploadFile = upload.fields([{ name: "file", maxCount: 1 }]);
    return uploadFile;
  }

  async saveFileInfo(req: any, res: Response, next: NextFunction) {
    let previewPath: string = "";
    let filePath: string = "";
    let url: string = "";
    let directory: string = "";
    const yearNumber = new Date().getFullYear();
    const monthNumber = new Date().getMonth();
    const dayNumber = new Date().getDate();
    if (req.files["file"]) {
      const { filename: file } = req.files["file"][0];
      const mimeType: string = req.files["file"][0].mimetype;

      // for images
      if (mimeType == "image/jpeg" || mimeType == "image/png") {
        url = `/uploads/images/${yearNumber}/${monthNumber}/${dayNumber}/${file}`;
        directory = `./src/uploads/images/${yearNumber}/${monthNumber}/${dayNumber}`;
        await createDir(directory);
        filePath = path.resolve(directory, file);
        await sharp(req.files["file"][0].path)
          .resize(750, 750, {
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          .jpeg({ quality: 90 })
          .toFile(filePath);
        fs.unlinkSync(req.files["file"][0].path);
      }
      // for svg
      else if (mimeType == "image/svg+xml") {
        url = `/uploads/images/${yearNumber}/${monthNumber}/${dayNumber}/${file}`;
        directory = `./src/uploads/images/${yearNumber}/${monthNumber}/${dayNumber}`;
        await createDir(directory);
        filePath = path.resolve(directory, file);
        let oldPath = req.files["file"][0].path;
        fs.rename(oldPath, filePath, function (err: any) {
          if (err) throw err;
        });
      }

      // for movies
      else if (mimeType == "video/mp4") {
        url = `/uploads/movies/${yearNumber}/${monthNumber}/${dayNumber}/${file}`;
        directory = `./src/uploads/movies/${yearNumber}/${monthNumber}/${dayNumber}`;
        await createDir(directory);
        filePath = path.resolve(directory, file);
        let oldPath = req.files["file"][0].path;
        await fs.rename(oldPath, filePath, function (err: any) {
          if (err) throw err;
        });

        // to snap shop from frame 1

        const preview = "pre_" + req.files["file"][0].filename + ".jpg";
        previewPath = `${directory}/${preview}`;
        await extractFrames({
          input: filePath,
          output: previewPath,
          offsets: [0],
        });
      }

      // for audios
      else if (
        mimeType == "audio/mpeg" ||
        mimeType == "audio/mp4" ||
        mimeType == "audio/webm"
      ) {
        url = `/uploads/audios/${yearNumber}/${monthNumber}/${dayNumber}/${file}`;
        directory = `./src/uploads/audios/${yearNumber}/${monthNumber}/${dayNumber}`;
        await createDir(directory);
        filePath = path.resolve(directory, file);
        let oldPath = req.files["file"][0].path;
        fs.rename(oldPath, filePath, function (err: any) {
          if (err) throw err;
        });
      }
    }

    req.body.file = req.files["file"] ? req.files["file"][0].filename : null;
    let fileInfo: File = await this.create({
      params: {
        url,
        mimeType: req.files["file"][0].mimetype,
        size: req.files["file"][0].size,
        previewPath,
      },
    });
    res.json(fileInfo);
  }
}

export default new controller(new fileService(fileSchema));
