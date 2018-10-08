// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import { login as errorMessages } from "../../../error/error-messages";
import { IRequest } from "../../endpoint.interface";
import UserList from "./user-list";
import UserApi from "../user.api";

describe("Testing Users", async () => {

  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should return all users", async () => {
    const env = process.env;
    const userApi = new UserApi(logger);
    const userList = new UserList(logger);

    let response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${userApi.path}${userList.path}`,
      {
        method: userList.method
      },
    );
    response = JSON.parse(response);
    expect(response.data).to.be.not.null;
  });
});
