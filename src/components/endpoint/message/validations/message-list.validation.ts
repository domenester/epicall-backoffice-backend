import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";

const MessageListSchema = {
  users: joi.array().items(joi.string()).optional()
};

export const MessageListValidation = ( body: any ) => {
  return joi.validate(body, MessageListSchema)
  .catch( (err) => errorGenerator(err.message, 401, "MessageListValidation"));
};
