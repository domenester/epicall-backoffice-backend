import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";
import { IUser } from "../../interfaces";

// tslint:disable-next-line:array-type
export const UserNew = async (user: IUser): Promise<any> => {
  //TODO: remove this line when perfil have CRUD
  // delete user.perfil;
  const response = await request(
    `${process.env.APP_API_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(user),
      rejectUnauthorized: false,
    },
  ).then( res => {
    let resParsed;
    try {
      resParsed = JSON.parse(res);
    } catch (err) {
      resParsed = res;
    }
    return resParsed;
  }).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API_URL}/users`);
    return errorGenerator(
      err,
      err.statusCode,
      "UserNew");
  });

  try {
    return JSON.parse(response);
  } catch (err) {
    return response;
  }
};
