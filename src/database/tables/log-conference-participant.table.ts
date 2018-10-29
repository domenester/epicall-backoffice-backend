import { Client } from "pg";
import { LOG_CONFERENCE_PARTICIPANT, LOG_CONFERENCE } from "./config";
import { errorGenerator } from "../../components/error";

export class LogConferenceParticipant {

  client: Client;

  constructor(client: Client){
    this.client = client;
  }

  async initialize() {

    const { fields } = LOG_CONFERENCE_PARTICIPANT;

    const query = await this.client.query(
      `CREATE TABLE IF NOT EXISTS ${LOG_CONFERENCE_PARTICIPANT.name} (
        ${fields.id.value} UUID NOT NULL PRIMARY KEY,
        ${fields.createdAt.value} TIMESTAMP NOT NULL DEFAULT NOW(),
        ${fields.userId.value} UUID NOT NULL,
        ${fields.idConference.value} UUID NOT NULL REFERENCES ${LOG_CONFERENCE.name},
        ${fields.gotInAt.value} TIMESTAMP NOT NULL,
        ${fields.gotOutAt.value} TIMESTAMP NOT NULL,
        ${fields.status.value} INTEGER
      )`
    ).catch(err => err);

    return query;
  }

  async drop() {
    const query = await this.client.query(`DROP TABLE ${LOG_CONFERENCE_PARTICIPANT.name} CASCADE`);
    return query;
  }
}
