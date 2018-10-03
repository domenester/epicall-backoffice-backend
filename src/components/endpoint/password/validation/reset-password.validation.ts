import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";

const ResetPasswordSchema = {
  password: joi.string().required().error(validationErrorFunction),
  token: joi.string().required().error(validationErrorFunction),
};

export const ResetPasswordValidation = ( body: any ) => {
  return joi.validate(body, ResetPasswordSchema)
  .catch( (err) => errorGenerator(err.message, 401, "ResetPasswordValidation"));
};
