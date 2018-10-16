import * as request from "request-promise";
import { resetPassword as errorMessage, errorGenerator } from "../components/error";
import {default as logger} from "../components/logger/logger";

export interface IResetPasswordService {
  newPassword: string;
  email: string;
}

export const ResetPasswordService = async (body: IResetPasswordService): Promise<any> => {
  // TODO: Implement API for update password
  const response = await request(
    `${process.env.APP_API_URL}/users/reset_password`, {
      body: JSON.stringify({
        newPassword: body.newPassword,
        email: body.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      rejectUnauthorized: false,
    },
  ).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API_URL}/resetPasswordByEmail`);
    return errorGenerator(
      err,
      err.statusCode,
      "ResetPasswordService");
  });

  return response;
};
