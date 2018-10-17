import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";
import userNormalizer from "../../normalizer/user.normalizer";

// tslint:disable-next-line:array-type
export const UserById = async (userId: string): Promise<any> => {
  const response = await request(
    `${process.env.APP_API_URL}/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      rejectUnauthorized: false,
    },
  ).then( res => {
    return userNormalizer(JSON.parse(res.data));
  }).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API_URL}/users`);
    return errorGenerator(
      err,
      err.statusCode,
      "GetUserById");
  });

  return response;
};
