// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import UserDelete from "./user-delete";
import UserApi from "../user.api";
import enums from "../enums";
import { JsonWebTokenError } from "jsonwebtoken";

const requestService = async (body: any) => {
  const env = process.env;
  const userApi = new UserApi(logger);
  const userDelete = new UserDelete(logger);

  let response = await request(
    `http://${env.NODE_HOST}:${env.NODE_PORT}${userApi.path}${userDelete.path}`,
    {
      method: userDelete.method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      rejectUnauthorized: false
    },
  ).catch((e) => JSON.parse(e.error));

  if ( response instanceof Error ) return response;

  let responseParsed: any;
  try {
    responseParsed = JSON.parse(response);
  } catch (err) { responseParsed = response; }
  return responseParsed;
}

describe("Testing User Update", async () => {
  
  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should delete an user", async () => {

    const body = {
      userId: "e4a45df3222c8117121681c58d1a2e59"
    };

    let response = await requestService(body);

    expect(response.data).to.be.deep.equal('Not implemented yet');
  });
});
