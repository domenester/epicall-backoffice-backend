import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";

// tslint:disable-next-line:array-type
export const UserProfilePicture = async (userId: string): Promise<any> => {
  const response = await request(
    `${process.env.APP_API}/photos/${userId}.jpg`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      rejectUnauthorized: false,
    },
  ).then( res => res.data || res ).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API}/photos/${userId}.jpg`);
    return errorGenerator(
      err,
      err.statusCode,
      "GetProfilePhoto");
  });

  try {
    return JSON.parse(response);
  } catch (err) {
    return response;
  }
};
