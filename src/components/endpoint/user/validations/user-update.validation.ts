import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";
import enums from "../enums";

const UserUpdateSchema = {
  id: joi.string().required().error(validationErrorFunction),
  user: joi.object().keys({
    name: joi.string().max(100).error(validationErrorFunction),
    racf: joi.string().max(10).error(validationErrorFunction),
    extension: joi.string().regex(/^\d+$/).required().max(10).error(validationErrorFunction),
    email: joi.string().email().max(255).error(validationErrorFunction),
    department: joi.string().max(100).error(validationErrorFunction),
    perfil: joi.string().valid(enums.perfil.values).error(validationErrorFunction)
  }).disallow([{}, null])
};

export const UserUpdateValidation = ( body: any ) => {
  return joi.validate(body, UserUpdateSchema)
  .catch( (err) => errorGenerator(err.message, 401, "UserUpdateValidation"));
};
