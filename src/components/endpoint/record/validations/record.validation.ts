import * as joi from "joi";
import { validationErrorFunction } from "../../../../utils/validation";
import { errorGenerator } from "../../../error/error";

const RecordListSchema = joi.object().keys({
  userId: joi.string().optional().error(validationErrorFunction),
  ext: joi.string().optional().regex(/^\d+$/).max(10).error(validationErrorFunction),
  start: joi.date().optional().error(validationErrorFunction),
  end: joi.date().optional().min(joi.ref('start')).error(validationErrorFunction)
}).allow([{}, null]);

export const RecordListValidation = ( body: any ) => {
  return joi.validate(body, RecordListSchema)
  .catch( (err) => errorGenerator(err.message, 401, "RecordListValidation"));
};
