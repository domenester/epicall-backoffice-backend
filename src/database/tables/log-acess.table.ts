import { Client } from "pg";
import { LOG_ACCESS } from "./config";
import { errorGenerator } from "../../components/error";

export class LogAccess {

  client: Client;

  constructor(client: Client){
    this.client = client;
  }

  async initialize() {

    const { fields } = LOG_ACCESS;

    const query = await this.client.query(
      `CREATE TABLE IF NOT EXISTS ${LOG_ACCESS.name} (
        ${fields.id.value} UUID NOT NULL PRIMARY KEY,
        ${fields.userId.value} UUID NOT NULL,
        ${fields.createdAt.value} TIMESTAMP NOT NULL,
        ${fields.isLogoff.value} BOOLEAN NOT NULL
      )`
    ).catch(err => err);

    return query;
  }

  async drop() {
    const query = await this.client.query(`DROP TABLE ${LOG_ACCESS.name}`);
    return query;
  }
}
