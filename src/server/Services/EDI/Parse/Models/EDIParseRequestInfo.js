import { Joi, ValidationNew } from 'common-core/Validation'

export const EDIParseRequestInfo = Joi.object({
  RawEDI: Joi.string().required(),
  Map: Joi.array().items(
    Joi.object({
      SetField: Joi.string().required(),
      WithQuery: Joi.string().required()
    })
  )
})

EDIParseRequestInfo.new = ValidationNew(EDIParseRequestInfo, {
  Map: []
})
