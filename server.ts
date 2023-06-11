import "module-alias/register";
import mongoose from "mongoose";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
const cors = require("cors");
import corsOptions from "@/config/corsOptions";
import verifyJWT from "@/middleware/verifyJWT";
const cookieParser = require("cookie-parser");
import haveAccess from "@/middleware/haveAccess";
import { logger } from "@/middleware/logEvents";
import errorHandler from "@/middleware/errorHandler";
import initialize from "@/core/initialize";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "src", "/public")));
app.use("/uploads", express.static("src/uploads"));

app.use(verifyJWT);
app.use(haveAccess);
// routes and resolvers
require("@core/resolver")(app);
require("@entity/file/resolver")(app);
require("@entity/auth/resolver")(app);
require("@entity/verify/resolver")(app);
require("@entity/request/resolver")(app);
require("@entity/access/resolver")(app);
require("@entity/role/resolver")(app);
require("@entity/user/resolver")(app);
require("@entity/ticket/resolver")(app);
require("@entity/ticketMessage/resolver")(app);

app.all("*", (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "src", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

// mongodb connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async (result) => {
    await initialize();
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));

// require("crypto").randomBytes(48, function (err: any, buffer: any) {
//   console.log(buffer.toString("hex"));
// });
