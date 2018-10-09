// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import UserEnums from "./user-enums";
import UserApi from "../user.api";
import enums from "../enums";

describe("Testing Users Enums", async () => {

  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should return user enums", async () => {
    const env = process.env;
    const userApi = new UserApi(logger);
    const userEnums = new UserEnums(logger);

    let response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${userApi.path}${userEnums.path}`,
      {
        method: userEnums.method
      },
    );
    response = JSON.parse(response);
    expect(response.data).to.be.deep.equal(enums);
  });
});
