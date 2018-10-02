import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";
import { getByEmail } from "./getByEmail";

export const emailExists = async (email: string): Promise<boolean> => {
  const userByEmail = await getByEmail(email);
  return userByEmail.length > 0;
};
