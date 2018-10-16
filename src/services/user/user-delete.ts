import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";

// tslint:disable-next-line:array-type
export const UserDelete = async (userId: string): Promise<any> => {
  const response = await request(
    `${process.env.APP_API_URL}/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      rejectUnauthorized: false,
    },
  ).then( res => true)
  .catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API_URL}/users`);
    return errorGenerator(
      err,
      err.statusCode,
      "ListUsers");
  });

  return response;
};
