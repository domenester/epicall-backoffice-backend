// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as Logger} from "../../../../components/logger/logger";
import server from "../../../../server";
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
    const login = new Login(Logger());
    const body = {
        password: "123456",
        username: "daniel",
    };
    let response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}/login`,
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        rejectUnauthorized: false,
      },
    );
    response = JSON.parse(response);
    expect(response.auth_token).to.not.be.null;
    expect(response.data).to.not.be.null;
  });

  it("should throw error for an invalid user", async () => {
    const env = process.env;
    const login = new Login(Logger());
    const body = {
        password: "lorem",
        username: "ipsum",
    };
    let response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}/login`,
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        rejectUnauthorized: false,
      },
    );
    response = JSON.parse(response);
    expect(response.code).to.be.equal(401);
  });
});
