import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";
import enums from "../enums";

const UserDeleteSchema = {
  userId: joi.string().required().error(validationErrorFunction),
};

export const UserDeleteValidation = ( body: any ) => {
  return joi.validate(body, UserDeleteSchema)
  .catch( (err) => errorGenerator(err.message, 401, "UserDeleteValidation"));
};
