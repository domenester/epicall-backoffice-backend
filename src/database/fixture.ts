import * as sequelize from "sequelize";
import { Client } from "pg";
import { LogAccess, LogCall, LogConference, LogConferenceParticipant } from "./tables";

export default async (seq: sequelize.Sequelize) => {
  // const logAccess = new LogAccess(seq);
  // await logAccess.initialize().catch(err => err);

  // const logCall = new LogCall(seq);
  // await logCall.initialize();

  // const logConference = new LogConference(seq);
  // await logConference.initialize();

  // const logConferenceParticipant = new LogConferenceParticipant(client);
  // await logConferenceParticipant.initialize();
}