import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";
import * as stream from "stream";

const Readable = stream.Readable;

const UserProfilePictureSchema = {
  file: joi.object().type(Readable),
};

export const UserProfilePictureValidation = ( body: any ) => {
  return joi.validate(body, UserProfilePictureSchema)
  .catch( (err) => errorGenerator(err.message, 401, "UserProfilePictureValidation"));
};
