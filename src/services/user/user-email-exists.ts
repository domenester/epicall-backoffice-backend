import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";
import { UserByEmail } from "./user-by-email";

export const UserEmailExists = async (email: string): Promise<boolean> => {
  const userByEmail = await UserByEmail(email).catch(err => err);
  if (userByEmail instanceof Error) { return Promise.reject(userByEmail); }
  return userByEmail.length > 0;
};
