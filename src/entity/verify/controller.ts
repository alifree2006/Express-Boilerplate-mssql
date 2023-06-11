import GenerateRandomNumber from "@/utils/generateRandomNumber";
import SendEmail, { MailOptions } from "@/utils/sendEmail";
import baseController from "@core/controller";
import userCtrl from "../user/controller";
import { IsVerifyCodeValid, VerifyEmail, VerifyPayload } from "./interface";
import verifySchema from "./schema";
import verifyService from "./service";

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the verifyController class extended of the main parent class baseController.
   *
   * @param service - verifyService
   *verifyCtrl
   * @beta
   */
  constructor(service: any) {
    super(service);
  }

  async sendEmailVerifyCode(email: string) {
    const verifyCode: number = GenerateRandomNumber(
      Number(process.env.VERIFY_CODE_LENGTH) || 6
    );
    const mailOptions: MailOptions = {
      to: email,
      subject: `Email verification in ${process.env.APP_NAME}`,
      html: htmlVerifyEmailTemplate({
        appName: process.env.APP_NAME || "",
        code: String(verifyCode),
      }),
    };
    SendEmail(mailOptions);
    const verifyPayload: VerifyPayload = {
      code: String(verifyCode),
      origin: email,
      type: "EMAIL",
      attempts: 0,
    };
    await this.create({ params: verifyPayload });
  }

  async verifyEmail({ email, verifyCode }: VerifyEmail) {
    const isValidCode = await this.isVerifyCodeValid({
      type: "EMAIL",
      code: verifyCode,
      origin: email,
    });
    if (!isValidCode) throw new Error("Unvalid code.");
    await userCtrl.setEmailIsVerified(email);
  }

  async isVerifyCodeValid({ type, code, origin }: IsVerifyCodeValid) {
    var d = new Date();
    d.setMinutes(d.getMinutes() - Number(process.env.VALID_VERIFY_CODE_TIME));
    const verify = await this.findOne({
      filters: {
        type,
        code,
        origin: origin,
        createdAt: { $gte: d },
        active: true,
      },
    });
    if (!verify) return false;
    this.deactiveAllVerifyCode(origin);
    return true;
  }

  async deactiveAllVerifyCode(origin: string) {
    await this.updateMany({
      filters: {
        origin,
        active: true,
      },
      params: { active: false },
    });
  }

  async resetPasswordByEmail({ email }: { email: string }) {
    const userFound = await userCtrl.findOne({
      filters: { active: true, email },
    });
    if (!userFound) throw new Error("Don't exist user.");
    const verifyCode: number = GenerateRandomNumber(8);

    const mailOptions: MailOptions = {
      to: email,
      subject: `Set / Reset password ${process.env.APP_NAME}`,
      html: htmlVerifyResetPasswordTemplate({
        userName: userFound.name,
        appName: process.env.APP_NAME || "",
        code: String(verifyCode),
      }),
    };

    SendEmail(mailOptions);
    const verifyPayload: VerifyPayload = {
      code: String(verifyCode),
      origin: email,
      type: "EMAIL",
      attempts: 0,
    };
    await this.create({ params: verifyPayload });
  }
}

const verifyCtrl = new controller(new verifyService(verifySchema));
export default verifyCtrl;

const htmlVerifyResetPasswordTemplate = ({
  userName,
  appName,
  code,
}: {
  userName: string;
  appName: string;
  code: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Set / Reset password</title>
  <style>
    /* Define your custom styles here */
    body {
        font-family: Arial, sans-serif;
        color: #636363;
        background-color: #fda92c;
        font-size: 16px;
        padding: 16px 0;
    }
    
    .container {
        box-shadow: 2px 2px 8px #f4a124;
      max-width: 500px;
      margin: 0 auto;
      padding: 20px 20px 20px 20px;
      background-color: #ffffff;
      border-radius: 8px;
    }
    
    .header {
        color: #ffffff;
    background-color: #fda92d;
    padding: 16px;
    border-radius: 8px;
    }
    .footer{
        text-align: center;
    }
    .brand {
      text-decoration: none;
      color: #fda92d;
      font-weight: bold;
    }
    
    p {
        line-height: 24px;
    }
    
    .verification-code {
        font-size: 18px;
        font-weight: bold;
        color: #000;
        background-color: #fff1db;
        border-radius: 8px;
        display: inline-block;
        padding: 16px;
    }
    
    .signature {
      margin-top: 30px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
        <h1>${appName}</h1>
        <p>Set / Reset Password</p>
    </div>
    <h3>Dear ${userName},</h3>
    <p>We have received a request to reset your password for your account. For this purpose please use the verification code provided below:</p>
    <span class="verification-code">${code}</span>
    <p>After successfully resetting your password, you will be able to log in with your new credentials.</p>
     <p> If you did not initiate this password reset request, please disregard this email and ensure the security of your account.</p>
     <p class="signature">Thank you for your attention to this matter, <a href="${process.env.APP_DOMAIN}" class="brand">${appName}</a> support team.</p>
    <hr style="background-color: #e0e3ed;    border-color: #ffffff;"/>
    <div class="footer">

    <p>If you have any questions or need assistance, feel free to reach out to our support team: <a style="color:#fda92d!important" href="mailto:${process.env.SUPPORT_EMAIL}" target="_blank">${process.env.SUPPORT_EMAIL}</a></p>
        
    </div>
  </div>
</body>
</html>`;
};
const htmlVerifyEmailTemplate = ({
  appName,
  code,
}: {
  appName: string;
  code: string;
}) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      /* Define your custom styles here */
      body {
          font-family: Arial, sans-serif;
          color: #636363;
          background-color: #fda92c;
          font-size: 16px;
          padding: 16px 0;
      }
      
      .container {
          box-shadow: 2px 2px 8px #f4a124;
        max-width: 500px;
        margin: 0 auto;
        padding: 20px 20px 20px 20px;
        background-color: #ffffff;
        border-radius: 8px;
      }
      
      .header {
          color: #ffffff;
      background-color: #fda92d;
      padding: 16px;
      border-radius: 8px;
      }
      .footer{
          text-align: center;
      }
      .brand {
        text-decoration: none;
        color: #fda92d;
        font-weight: bold;
      }
      
      p {
          line-height: 24px;
      }
      
      .verification-code {
          font-size: 18px;
          font-weight: bold;
          color: #000;
          background-color: #fff1db;
          border-radius: 8px;
          display: inline-block;
          padding: 16px;
      }
      
      .signature {
        margin-top: 30px;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
          <h1>${appName}</h1>
          <p>Email verification code</p>
      </div>
      <p>Thanks for signing up! We just need to verify your email address to get you started. Please use the <b>following verification code</b> to confirm your account:</p>
      <span class="verification-code">${code}</span>
      <p class="signature">The best, <a href="${process.env.APP_DOMAIN}" class="brand">${appName}</a> support team.</p>
      <hr style="background-color: #e0e3ed;    border-color: #ffffff;"/>
      <div class="footer">
  
      <p>If you have any questions or need assistance, feel free to reach out to our support team: <a style="color:#fda92d!important" href="mailto:${process.env.SUPPORT_EMAIL}" target="_blank">${process.env.SUPPORT_EMAIL}</a></p>
          
      </div>
    </div>
  </body>
  </html>
  `;
};
