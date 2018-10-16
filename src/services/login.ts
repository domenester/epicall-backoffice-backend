import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../components/error";
import {default as logger} from "../components/logger/logger";

export interface ILoginServiceInput {
  username: string;
  password: string;
}

export const LoginService = async (body: ILoginServiceInput): Promise<any> => {
  const response = await request(
    `${process.env.APP_API_URL}/login`, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      rejectUnauthorized: false,
    },
  ).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API_URL}/login`);
    return errorGenerator(
      errorMessage.unauthorized,
      err.statusCode,
      "Login");
  });
  
  try {
    return JSON.parse(response);
  } catch(err) {
    return response || true;
  }
};
