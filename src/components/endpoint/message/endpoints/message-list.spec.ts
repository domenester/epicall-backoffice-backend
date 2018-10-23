// tslint:disable:no-unused-expression

import { expect } from "chai";
import "mocha";
import * as request from "request-promise";
import { promisify } from "util";
import {default as logger} from "../../../../components/logger/logger";
import server from "../../../../server";
import { login as errorMessages } from "../../../error/error-messages";
import { IRequest } from "../../endpoint.interface";
import MessageList from "./message-list";
import MessageApi from "../message.api";

describe("Testing Messages", async () => {

  const env = process.env;
  const messageApi = new MessageApi(logger);
  const messageList = new MessageList(logger);

  before( async () => {
    await server.start();
  });

  after( async () => {
    server.stop();
  });

  it("should return all messages", async () => {

    let response = await request(
      `http://${env.NODE_HOST}:${env.NODE_PORT}${messageApi.path}${messageList.path}`,
      {
        method: messageList.method
      },
    );
    response = JSON.parse(response);
    expect(response.data).to.be.equal("Not implemented yet");
  });
});
