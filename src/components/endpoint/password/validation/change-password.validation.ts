import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";

const ChangePasswordSchema = {
  newPassword: joi.string().required().disallow([joi.ref("password")]).error(validationErrorFunction),
  password: joi.string().required().error(validationErrorFunction),
  userId: joi.string().required().error(validationErrorFunction),
  username: joi.string().required().error(validationErrorFunction),
};

export const ChangePasswordValidation = ( body: any ) => {
  return joi.validate(body, ChangePasswordSchema)
  .catch( (err) => errorGenerator(err.message, 401, "ChangePasswordValidation"));
};
