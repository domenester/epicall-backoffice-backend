import { Client } from "pg";
import { LOG_CALL } from "./config";
import { errorGenerator } from "../../components/error";

export class LogCall {

  client: Client;

  constructor(client: Client){
    this.client = client;
  }

  async initialize() {

    const { fields } = LOG_CALL;

    const query = await this.client.query(
      `CREATE TABLE IF NOT EXISTS ${LOG_CALL.name} (
        ${fields.id.value} UUID NOT NULL PRIMARY KEY,
        ${fields.createdAt.value} TIMESTAMP NOT NULL DEFAULT NOW(),
        ${fields.userIdFrom.value} UUID NOT NULL,
        ${fields.userIdTo.value} UUID NOT NULL,
        ${fields.type.value} INTEGER NOT NULL,
        ${fields.startedAt.value} TIMESTAMP NOT NULL,
        ${fields.endedAt.value} TIMESTAMP NOT NULL,
        ${fields.file.value} VARCHAR(255) NOT NULL,
        ${fields.status.value} INTEGER NOT NULL
      )`
    ).catch(err => err);

    return query;
  }

  async drop() {
    const query = await this.client.query(`DROP TABLE ${LOG_CALL.name}`);
    return query;
  }
}
