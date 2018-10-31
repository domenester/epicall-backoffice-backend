import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { MessageListValidation } from "../validations/message-list.validation";
import { MessageService } from "../../../../services";
import { messageTreeFormat } from "./utils/message-format";

export default class MessageList implements IEndpoint<Request, {}> {
  public path = "/list";
  public method: Verb = "get";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest) => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await MessageListValidation(req.parameters);

    if (validation instanceof Error) { return validation; }

    const listMessage = await MessageService.list(req.parameters || {});
    if (listMessage instanceof Error) { return listMessage; }

    const treeFormat = messageTreeFormat(listMessage);

    return {data: treeFormat};
  }
}
