// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import * as jwt from "jsonwebtoken";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import { resetPassword as errorMessages } from "../../../error/error-messages";
import { IRequest } from "../../endpoint.interface";
import PasswordApi from "../password.api";
import ResetPassword from "./reset-password";
import { sleep } from "../../../../utils/sleep";

// tslint:disable-next-line:max-line-length
// const userMock = {page_size: 1, data: {owner_id: "e4a45df3222c8117121681c58d1a2e59", account_id: "8cef5d0c7fc31791ffa3c6f65c9a7669", reseller_id: "8cef5d0c7fc31791ffa3c6f65c9a7669", is_reseller: true, account_name: "admin", language: "en-US", apps: []}, revision: "automatic", timestamp: "2018-10-01T23:10:58", version: "4.2.44", node: "HHyS9t67FruojBj-iSQKEA", request_id: "dede3e4bc9555fe2dac7c05dd1603c87", status: "success", auth_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJiZGY5ZTJjMDI3ZTk1ZGU2YzhjMzU0NmRkMmJhZTNmIn0.eyJpc3MiOiJrYXpvbyIsImlkZW50aXR5X3NpZyI6IldrSDdHTjA4Ml9oSU54UGUtdWJlYWlWbXRmUEw0Ml9UdVlJdm9hRDVtTE0iLCJhY2NvdW50X2lkIjoiOGNlZjVkMGM3ZmMzMTc5MWZmYTNjNmY2NWM5YTc2NjkiLCJvd25lcl9pZCI6ImU0YTQ1ZGYzMjIyYzgxMTcxMjE2ODFjNThkMWEyZTU5IiwibWV0aG9kIjoiY2JfdXNlcl9hdXRoIiwiZXhwIjoxNTM4NDM5MDU4fQ.hiYdzOZ2Z88Zk-eWRccjzHMT1YUT5WVOmXVLUzouVFoPGQ1mH4ZWj7DsVO17AsfIgz1UqGi-EhqLRB-WLBZ4ZnXT5rwt82CTDUuZE2JEiH7zKRWGF89Bst-5E3EqMwlENWmcXD-hUmUk1xj1DRjN5aNzGsRVt5xO-DmzeOFSWYTWbQn_ZPbLdi5EAnHI8yzTWQ4N42BZ_nRvoQ184y5VZd7EIhT8d9U9i1jIdgZWICHxzbfucLiRr90Az2_Pj4h5NrwvqsKzJvHglpO2ksb3yEoq-XWw1EUmvTcSUnu97llX5kdu95WgAK41KUtHpRtrhVqsEvstDNQoe-PQowkMyQ"};

describe("Testing Reset Password", async () => {

  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should throw error because token is invalid", async () => {
    const env = process.env;
    const passwordApi = new PasswordApi(logger);
    const resetPassword = new ResetPassword(logger);
    const body = {
        password: "123456",
        token: "anyinvalidtoken",
    };

    const response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${passwordApi.path}${resetPassword.path}`,
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: resetPassword.method,
        rejectUnauthorized: false,
      },
    ).catch((e) => JSON.parse(e.error));
    expect(response.code).to.be.equal(400);
    expect(response.message).to.be.equal(errorMessages.invalidToken);
  });

  it("should throw error because token expired", async () => {
    const env = process.env;
    const passwordApi = new PasswordApi(logger);
    const resetPassword = new ResetPassword(logger);
    const body = {
        password: "123456",
        token: jwt.sign(
          { email: "AnyEmail@gmail.com" },
          process.env.JWT_SECRET,
          { expiresIn: 1 }
        )
    };

    await sleep(1000);

    const response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${passwordApi.path}${resetPassword.path}`,
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: resetPassword.method,
        rejectUnauthorized: false,
      },
    ).catch((e) => JSON.parse(e.error));
    expect(response.code).to.be.equal(400);
    expect(response.message).to.be.equal(errorMessages.expiredToken);
  });

  it("should reset password", async () => {
    const env = process.env;
    const passwordApi = new PasswordApi(logger);
    const resetPassword = new ResetPassword(logger);
    const body = {
        password: "123456",
        token: jwt.sign(
          { email: "daniel@itau.com.br" },
          process.env.JWT_SECRET,
          { expiresIn: 60 * 10 }
        )
    };

    let response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${passwordApi.path}${resetPassword.path}`,
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: resetPassword.method,
        rejectUnauthorized: false,
      },
    ).catch((e) => JSON.parse(e.error));
    response = JSON.parse(response);
    expect(response.data).to.be.true
  });
});
