import * as pg from "pg";
import * as winston from "winston";
import {default as Logger} from "../components/logger/logger";
import { errorGenerator } from "../components/error";
import FixtureTables from "./fixture";


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

export default (uri: string) => new Database(uri);
