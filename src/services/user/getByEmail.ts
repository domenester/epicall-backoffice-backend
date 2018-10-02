import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";

// tslint:disable-next-line:array-type
export const getByEmail = async (email: string): Promise<Array<any>> => {
  const response = await request(
    `${process.env.APP_API}/users`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      rejectUnauthorized: false,
    },
  ).then( (res) => {
    if (!res.data || res.data.length < 1) { return []; }
    return res.data.filter( (user: any) => {
      return user.data.email === email;
    });
  }).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API}/users`);
    return errorGenerator(
      err,
      err.statusCode,
      "GetUserByEmail");
  });

  return response;
};
