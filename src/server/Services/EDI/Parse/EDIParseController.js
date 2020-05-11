import { GenericControllerMethod } from 'common-core/Controller'
import { FunctionResultStatus } from 'common-core/FunctionResult'
import { EDIParseRequestInfo } from './Models/index'
import { X12Parser, X12QueryEngine } from 'node-x12'
import _ from 'lodash'

export const EDIParse = GenericControllerMethod({
  name: 'EDIParse',
  inputModel: EDIParseRequestInfo,
  processor: async function (requestInfo, ret, config) {
    const parser = new X12Parser(true)

    const interchange = parser.parse(requestInfo.RawEDI)

    const val = {}

    if (requestInfo.Map.length > 0) {
      const engine = new X12QueryEngine()

      for (const mapItem of requestInfo.Map) {
        const results = engine.query(interchange, mapItem.WithQuery)

        results.forEach((result) => {
          _.set(val, mapItem.SetField, result.values.length > 0 ? result.values : result.value)
        })
      }
    }

    ret.ReturnValue = JSON.stringify(val)
    ret.Status = FunctionResultStatus.Success
  }
})

export default EDIParse
