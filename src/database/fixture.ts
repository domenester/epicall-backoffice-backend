import { Client } from "pg";
import { LogAccess, LogCall, LogConference, LogConferenceParticipant } from "./tables";

export default async (client: Client) => {
  const logAccess = new LogAccess(client);
  await logAccess.initialize().catch(err => err);

  const logCall = new LogCall(client);
  await logCall.initialize();

  const logConference = new LogConference(client);
  await logConference.initialize();

  const logConferenceParticipant = new LogConferenceParticipant(client);
  await logConferenceParticipant.initialize();
}