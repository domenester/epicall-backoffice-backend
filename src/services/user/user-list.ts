import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";
import userNormalizer from "../../normalizer/user.normalizer";

// tslint:disable-next-line:array-type
export const UserList = async (): Promise<any> => {
  const response = await request(
    `${process.env.APP_API_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      rejectUnauthorized: false,
    },
  ).then( res => {
    let resParsed = JSON.parse(res);
    return resParsed.data.map( (u: any) => userNormalizer(u)) || [];
  }).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API_URL}/users`);
    return errorGenerator(
      err,
      err.statusCode,
      "ListUsers");
  });

  try {
    return JSON.parse(response);
  } catch (err) {
    return response;
  }
};
