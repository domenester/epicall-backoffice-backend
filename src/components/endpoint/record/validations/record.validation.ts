import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";

const RecordListSchema = joi.object().keys({
  userId: joi.string().optional().error(validationErrorFunction),
  ext: joi.string().optional().regex(/^\d+$/).max(10).error(validationErrorFunction),
  date: joi.object().optional().keys({
    start: joi.date().required(),
    end: joi.date().required().min(joi.ref('start'))
  })
}).allow([{}, null]);

export const RecordListValidation = ( body: any ) => {
  return joi.validate(body, RecordListSchema)
  .catch( (err) => errorGenerator(err.message, 401, "RecordListValidation"));
};
