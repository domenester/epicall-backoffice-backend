import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../components/error";
import {default as logger} from "../components/logger/logger";

export const LoginService = async (body: any): Promise<any> => {
  const response = await request(
    `${process.env.APP_API}/login`, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      rejectUnauthorized: false,
    },
  ).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API}/login`);
    return errorGenerator(
      errorMessage.unauthorized,
      err.statusCode,
      "Login");
  });

  return response;
};
