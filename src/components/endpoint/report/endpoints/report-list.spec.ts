// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import { login as errorMessages } from "../../../error/error-messages";
import { IRequest } from "../../endpoint.interface";
import ReportList from "./report-list";
import ReportApi from "../report.api";
import { Client } from "pg";
import { errorGenerator } from "../../../error";
import { dropTables } from "../../../../database";

describe("Testing Reports", async () => {

  const env = process.env;
  const reportApi = new ReportApi(logger);
  const reportList = new ReportList(logger);

  before( async () => {
    await server.start();
  });

  after( async () => {
    const client = new Client(process.env.DATABASE_URI);
    client.connect().catch(err => errorGenerator(err));
    await dropTables(client);
    server.stop();
  });

  it("should return all reports", async () => {

    let response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${reportApi.path}${reportList.path}`,
      {
        method: reportList.method
      },
    );
    response = JSON.parse(response);
    expect(response.data.length).to.be.equal(0);
  });
});
