import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";

const LoginSchema = {
  password: joi.string().required().error(validationErrorFunction),
  username: joi.string().required().error(validationErrorFunction),
};

export const LoginValidation = ( body: any ) => {
  return joi.validate(body, LoginSchema)
  .catch( (err) => errorGenerator(err.message, 401, "LoginValidation"));
};
