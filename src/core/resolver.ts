import { Request, Response } from "express";
import { Router } from "express";
import path = require("path");

function resolver(app: any) {
  const router = Router();
  router.get("^/$|/index(.html)?", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  });

  app.use("/", router);
}

module.exports = resolver;
