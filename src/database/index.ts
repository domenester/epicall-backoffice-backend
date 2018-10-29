import * as pg from "pg";
import * as winston from "winston";
import {default as Logger} from "../components/logger/logger";
import { errorGenerator } from "../components/error";
import FixtureTables from "./fixture";
import { LogAccess, LogCall, LogConference, LogConferenceParticipant } from "./tables";


class Database {

  private logger: winston.Logger;
  private uri: string;
  private client: pg.Client;

  constructor(uri: string) {
    this.logger = Logger;
    this.uri = uri;
  }

  public async start() {
    this.client = new pg.Client(this.uri);
    this.client.connect().catch(err => errorGenerator(err));
    await FixtureTables(this.client);
  }
}

export const dropTables = async (client: pg.Client) => {
  const { NODE_ENV } = process.env;
  if ( NODE_ENV === "test" || !NODE_ENV ) {

    const logAccessTable = new LogAccess(client);
    const logCallTable = new LogCall(client);
    const logConferenceTable = new LogConference(client);
    const logConferenceParticipantTable = new LogConferenceParticipant(client);

    const dropedTables = await Promise.all([
      logAccessTable.drop(),
      logCallTable.drop(),
      logConferenceTable.drop(),
      logConferenceParticipantTable.drop()
    ]);

    return dropedTables;
  }
}

export default (uri: string) => new Database(uri);
