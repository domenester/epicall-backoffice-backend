import * as pg from "pg";
// import * as sequelize from "sequelize";
import * as winston from "winston";
import {default as Logger} from "../components/logger/logger";
import { errorGenerator } from "../components/error";
import FixtureTables from "./fixture";
import { LogAccess, LogCall, LogConference, LogConferenceParticipant } from "./tables";
import * as sequelize from "sequelize";

export class Database {

  private logger: winston.Logger;
  private uri: string;
  private sequelize: sequelize.Sequelize;

  constructor(uri: string) {
    this.logger = Logger;
    this.uri = uri;
    this.sequelize = new sequelize(this.uri);
  }
}
