import * as request from "request-promise";
import { errorGenerator, login as errorMessage } from "../../components/error";
import {default as logger} from "../../components/logger/logger";
import { Client } from "pg";

export const MessageService = async (filter: object): Promise<any> => {
  const { DATABASE_URI_GENESIS } = process.env;
  const client = new Client(DATABASE_URI_GENESIS);
  client.connect().catch((err: any) => errorGenerator(err));
  const queryMessage = await client.query(`
    SELECT * FROM messages 
    WHERE "messageType" = 'text'
    ORDER BY "from" ASC, "createdAt" ASC`)
  .catch((err: any) => err);
  client.end();
  return queryMessage.rows || [];
};
