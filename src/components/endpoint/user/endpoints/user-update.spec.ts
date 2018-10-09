// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import UserUpdate from "./user-update";
import UserApi from "../user.api";
import enums from "../enums";
import { JsonWebTokenError } from "jsonwebtoken";

const requestService = async (body: any) => {
  const env = process.env;
  const userApi = new UserApi(logger);
  const userUpdate = new UserUpdate(logger);

  let response = await request(
    `http://${env.NODE_HOST}:${env.NODE_PORT}${userApi.path}${userUpdate.path}`,
    {
      method: userUpdate.method,
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

  it("should update an user", async () => {

    const body = {
      id: "e4a45df3222c8117121681c58d1a2e59",
      user: {
        name: "Valid Name",
        racf: "Valid Racf",
        ext: "12345",
        email: "validemail@valid.com",
        section: "Valid Section",
        perfil: "Administrador"
      }
    };

    let response = await requestService(body);

    expect(response.data).to.be.deep.equal('Not implemented yet');
  });

  it.skip("should update an user with just some fields", async () => {

    const body = {
      id: "e4a45df3222c8117121681c58d1a2e59",
      user: {
        name: "Valid Name"
      }
    };

    let response = await requestService(body);

    expect(response.data).to.be.deep.equal('Not implemented yet');
  });

  it("should throw error because no user id was passed", async () => {

    const body = {
      user: {
        name: "Valid Name",
        racf: "Valid Racf",
        ext: "12345",
        email: "validemail@valid.com",
        section: "Valid Section",
        perfil: "Administrador"
      }
    };

    let response = await requestService(body);

    expect(response.code).to.be.equal(401);
  });

  it("should throw error because no user was passed", async () => {

    const body = {
      id: "e4a45df3222c8117121681c58d1a2e59",
      user: {}
    };

    let response = await requestService(body);

    expect(response.code).to.be.equal(401);
  });
});
