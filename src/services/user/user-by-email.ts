import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";

// tslint:disable-next-line:array-type
export const UserByEmail = async (email: string): Promise<Array<any>> => {
  const response = await request(
    `${process.env.APP_API_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      rejectUnauthorized: false,
    },
  ).then( (res) => {
    const resParsed = JSON.parse(res);
    if (!resParsed.data || resParsed.data.length < 1) { return []; }
    return resParsed.data.filter( (user: any) => {
      return user.email === email;
    });
  }).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API_URL}/users`);
    return errorGenerator(
      err,
      err.statusCode,
      "GetUserByEmail");
  });

  return response;
};
