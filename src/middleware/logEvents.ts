import { NextFunction, Request, Response } from "express";
import format from "date-fns/format";
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message: string, logName: string) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "OPTIONS") {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");

    console.log(`${req.method} ${req.path} | `, req?.query);
  }
  next();
};

export { logger, logEvents };
