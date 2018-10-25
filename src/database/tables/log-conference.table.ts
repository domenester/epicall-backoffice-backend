import { Client } from "pg";
import { LOG_CONFERENCE } from "./config";
import { errorGenerator } from "../../components/error";

export class LogConference {

  client: Client;

  constructor(client: Client){
    this.client = client;
  }

  async initialize() {

    const { fields } = LOG_CONFERENCE;

    const query = await this.client.query(
      `CREATE TABLE IF NOT EXISTS ${LOG_CONFERENCE.name} (
        ${fields.id.value} UUID NOT NULL PRIMARY KEY,
        ${fields.userIdFrom.value} UUID NOT NULL,
        ${fields.startedAt.value} TIMESTAMP NOT NULL,
        ${fields.endedAt.value} TIMESTAMP NOT NULL,
        ${fields.file.value} VARCHAR(255) NOT NULL,
        ${fields.status.value} INTEGER NOT NULL
      )`
    ).catch(err => err);

    return query;
  }

  async drop() {
    const query = await this.client.query(`DROP TABLE ${LOG_CONFERENCE.name}`);
    return query;
  }
}
