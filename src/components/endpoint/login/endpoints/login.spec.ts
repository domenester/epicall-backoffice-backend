// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import { login as errorMessages } from "../../../error/error-messages";
import { IRequest } from "../../endpoint.interface";
import Login from "./login";

describe("Testing Login", async () => {

  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should authenticate a valid user", async () => {
    const env = process.env;
    const login = new Login(logger);
    const body = {
        password: "123456",
        username: "daniel",
    };
    let response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${login.path}`,
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: login.method,
        rejectUnauthorized: false,
      },
    );
    response = JSON.parse(response);
    expect(response.data).to.not.be.null;
  });

  it("should throw error for an invalid user", async () => {
    const env = process.env;
    const login = new Login(logger);
    const body = {
        password: "lorem",
        username: "ipsum",
    };
    const response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${login.path}`,
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: login.method,
        rejectUnauthorized: false,
      },
    ).catch((e) => JSON.parse(e.error));
    expect(response.code).to.be.equal(401);
    expect(response.message).to.be.equal(errorMessages.unauthorized);
  });
});
