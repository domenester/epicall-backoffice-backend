// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import { requestPassword as errorMessages } from "../../../error/error-messages";
import { IRequest } from "../../endpoint.interface";
import { default as RequestPassword } from "./request-password";

describe("Testing Request Password", async () => {

  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should throw error when email don't exist", async () => {
    const env = process.env;
    const body = {
        email: "domenester@gmail.com",
    };
    const requestPassword = new RequestPassword(logger);
    const response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${requestPassword.path}`,
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: requestPassword.method,
        rejectUnauthorized: false,
      },
    ).catch((e) => JSON.parse(e.error));
    expect(response.code).to.be.equal(401);
    expect(response.message).to.be.equal(errorMessages.emailNotFound);
  });

});
