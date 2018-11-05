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
import { logAccessQuery, logConferenceQuery, logCallQuery, logConferenceParticipantQuery } from "./test/queries.spec";

describe("Testing Reports", async () => {

  const env = process.env;
  const reportApi = new ReportApi(logger);
  const reportList = new ReportList(logger);

  const requestReportService = async (body: any) => {
    const response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${reportApi.path}${reportList.path}`,
      {
        body: JSON.stringify(body),
        method: reportList.method,
        headers: { "Content-Type": "application/json" },
        rejectUnauthorized: false
      },
    );
    return JSON.parse(response);
  }

  const client = new Client(process.env.DATABASE_URI);
  client.connect().catch(err => errorGenerator(err));

  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should insert initial datas", async () => {
    await client.query(logAccessQuery()).catch(err => err);
    await client.query(logCallQuery()).catch(err => err);
    await client.query(logConferenceQuery()).catch(err => err);
    await client.query(logConferenceParticipantQuery()).catch(err => err);
  });

  it("should return all reports", async () => {
    let response = await requestReportService({});
    expect(response.data.length).to.be.equal(2);
  });

  it("should return reports by date", async () => {
    let response = await requestReportService({
      start: "2018-10-24T03:00:00.000Z",
      end: "2018-10-25T03:00:00.000Z"
    });
    expect(response.data.length).to.be.equal(1);
  });

  it("should return reports by user", async () => {
    let response = await requestReportService({
      users: [
        "bc3357ba817994aa764471ccff6a375d"
      ]
    });
    expect(response.data.length).to.be.equal(2);
  });

  it("should return reports by user and date", async () => {
    let response = await requestReportService({
      users: [
        "bc3357ba817994aa764471ccff6a375d"
      ],
      start: "2018-10-24T03:00:00.000Z",
      end: "2018-10-25T03:00:00.000Z"
    });
    expect(response.data.length).to.be.equal(1);
  });

  it("should return reports by grouping", async () => {
    let response = await requestReportService({
      grouping: "hour"
    });
    expect(response.data.length).to.be.equal(3);
  });

  it("should drop tables used for tests", async () => {
    await dropTables(client).catch(err => err);
  });
});
