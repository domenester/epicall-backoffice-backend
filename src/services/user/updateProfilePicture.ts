import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";
import * as fs from "fs";

// tslint:disable-next-line:array-type
export const updateProfilePicture = async (userId: string, file: any): Promise<any> => {
  const response = await request(
    `${process.env.APP_API_URL}/upload_photo`, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      formData: {
        id: userId,
        File: file
      },
      method: "POST",
      rejectUnauthorized: false,
    },
  ).then( res => res.data || res ).catch( (err) => {
    logger.error(`Error requesting for: ${process.env.APP_API_URL}/upload_photo`);
    return errorGenerator(
      err,
      err.statusCode,
      "UpdateProfilePhoto");
  });

  try {
    return JSON.parse(response);
  } catch (err) {
    return response;
  }
};
