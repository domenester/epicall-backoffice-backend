import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";
import RecordsMock from "./mocks";

export const RecordList = async (filter: object): Promise<any> => {
  return RecordsMock();
};
