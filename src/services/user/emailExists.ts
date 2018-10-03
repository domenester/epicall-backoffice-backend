import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";
import { getByEmail } from "./getByEmail";

export const emailExists = async (email: string): Promise<boolean> => {
  const userByEmail = await getByEmail(email).catch(err => err);
  if (userByEmail instanceof Error) { return Promise.reject(userByEmail); }
  return userByEmail.length > 0;
};
