// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import UserNew from "./user-new";
import UserApi from "../user.api";
import enums from "../enums";
import { JsonWebTokenError } from "jsonwebtoken";

const requestService = async (body: any) => {
  const env = process.env;
  const userApi = new UserApi(logger);
  const userNew = new UserNew(logger);

  let response = await request(
    `http://${env.NODE_HOST}:${env.NODE_PORT}${userApi.path}${userNew.path}`,
    {
      method: userNew.method,
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

describe("Testing User New", async () => {
  
  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should throw error because name is empty", async () => {

    const body = {
      name: "",
      racf: "Valid Racf",
      ext: "12345",
      email: "validemail@valid.com",
      section: "Valid Section",
      perfil: "Administrador"
    };

    let response = await requestService(body);

    expect(response.code).to.be.equal(401);
  });

  it("should throw error because racf is empty", async () => {

    const body = {
      name: "Valid Name",
      racf: "",
      ext: "12345",
      email: "validemail@valid.com",
      section: "Valid Section",
      perfil: "Administrador"
    };

    let response = await requestService(body);

    expect(response.code).to.be.equal(401);
  });

  it("should throw error because ext is empty", async () => {

    const body = {
      name: "Valid Name",
      racf: "Valid Racf",
      ext: "",
      email: "validemail@valid.com",
      section: "Valid Section",
      perfil: "Administrador"
    };

    let response = await requestService(body);

    expect(response.code).to.be.equal(401);
  });

  it("should throw error because email is invalid", async () => {

    const body = {
      name: "Valid Name",
      racf: "Valid Racf",
      ext: "12345",
      email: "validemail@valid.",
      section: "Valid Section",
      perfil: "Administrador"
    };

    let response = await requestService(body);

    expect(response.code).to.be.equal(401);
  });

  it("should throw error because section is empty", async () => {

    const body = {
      name: "Valid Name",
      racf: "Valid Racf",
      ext: "12345",
      email: "validemail@valid.com",
      section: "",
      perfil: "Administrador"
    };

    let response = await requestService(body);

    expect(response.code).to.be.equal(401);
  });

  it("should throw error because perfil value isn't in enum", async () => {

    const body = {
      name: "Valid Name",
      racf: "Valid Racf",
      ext: "12345",
      email: "validemail@valid.com",
      section: "Valid Section",
      perfil: "Anyvalue"
    };

    let response = await requestService(body);

    expect(response.code).to.be.equal(401);
  });

  it("should add new user", async () => {

    const body = {
      name: "Valid Name",
      racf: "Valid Racf",
      ext: "12345",
      email: "validemail@valid.com",
      section: "Valid Section",
      perfil: "Administrador"
    };

    let response = await requestService(body);

    expect(response.data).to.be.deep.equal('Not implemented yet');
  });
});
