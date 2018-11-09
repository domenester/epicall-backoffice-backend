import * as winston from "winston";
import {default as Logger} from "../components/logger/logger";
import * as sequelize from "sequelize";
import { fixtureTables } from "./fixture";

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

export default async (uri: string) => {
  const db = new Database(uri);
  await fixtureTables(uri);
  return db;
}