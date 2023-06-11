import { rateLimit } from "express-rate-limit";
import { logEvents } from "./logEvents";

const ResetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1hour
  max: 5, // Limit each IP to 5 login requests per window per hour
  message: {
    message:
      "Too many reset password request from this IP, please try again after a 1 hour pause",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "resetPassLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default ResetPasswordLimiter;
