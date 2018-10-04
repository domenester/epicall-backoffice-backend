import * as request from "request-promise";
import { changePassword as errorMessage, errorGenerator } from "../components/error";
import {default as logger} from "../components/logger/logger";

export interface IChangePasswordServiceInput {
  userId: string;
  newPassword: string;
  password: string;
  username: string;
}

export const ChangePasswordService = async (body: IChangePasswordServiceInput): Promise<any> => {
  const response = await request(
    `${process.env.APP_API_URL}/users/${body.userId}/update_password`, {
      body: JSON.stringify({
        newPassword: body.newPassword,
        password: body.password,
        username: body.username,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      rejectUnauthorized: false,
    },
  ).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API_URL}/users/<userId>/update_password`);
    return errorGenerator(
      errorMessage.unauthorized,
      err.statusCode,
      "changePassword");
  });

  return response;
};
