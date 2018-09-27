// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import server from "./server";

describe("Testing Server", () => {

  it("should start server", async () => {
    await server.start();
  });

  it("should request '/' and return any body", async () => {
    const env = process.env;

    if (!env.NODE_HOST) { throw new Error("NODE_HOST env not defined"); }
    if (!env.NODE_PORT) { throw new Error("NODE_PORT env not defined"); }

    const body = await request(`http://${env.NODE_HOST}:${env.NODE_PORT}/`);
    expect(body).to.not.be.null;
  });

  it("should stop server", () => {
    server.stop();
  });

});
