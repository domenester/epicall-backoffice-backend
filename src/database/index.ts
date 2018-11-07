import * as winston from "winston";
import {default as Logger} from "../components/logger/logger";
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
