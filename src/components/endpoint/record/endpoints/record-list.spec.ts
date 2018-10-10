// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import { login as errorMessages } from "../../../error/error-messages";
import { IRequest } from "../../endpoint.interface";
import RecordList from "./record-list";
import RecordApi from "../record.api";

describe("Testing Records", async () => {

  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should return all records", async () => {
    const env = process.env;
    const recordApi = new RecordApi(logger);
    const recordList = new RecordList(logger);

    let response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${recordApi.path}${recordList.path}`,
      {
        method: recordList.method
      },
    );
    response = JSON.parse(response);
    expect(response.data).to.be.not.null;
  });
});
