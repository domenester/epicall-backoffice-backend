import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";

const RequestPasswordSchema = {
  email: joi.string().email().error(validationErrorFunction),
};

export const RequestPasswordValidation = ( body: any ) => {
  return joi.validate(body, RequestPasswordSchema)
  .catch( (err) => errorGenerator(err.message, 401, "RequestPasswordValidation"));
};
