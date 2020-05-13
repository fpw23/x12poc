import _ from 'lodash'
import { MessageBuilder } from 'common-core/FunctionResult'
import { NodeVM } from 'vm2'
import { X12Parser, X12QueryEngine } from 'node-x12'

const QueryMode = {
  All: 1,
  Segment: 2,
  Value: 3
}

function AddMessageError (results) {
  return (text, section) => {
    results.push(MessageBuilder.Error(text, section))
  }
}

function AddMessageRule (results) {
  return (text, field, section) => {
    results.push(MessageBuilder.Rule(text, field, section))
  }
}

function AddMessageInfo (results) {
  return (text, section) => {
    results.push(MessageBuilder.Info(text, section))
  }
}

function AddMessageWarning (results) {
  return (text, section) => {
    results.push(MessageBuilder.Warning(text, section))
  }
}

function EngineQueryAll (engine, interchange) {
  return (query, mode = QueryMode.Value) => {
    const ret = engine.query(interchange, query)
    if (mode > 1) {
      return _.map(ret, (r) => {
        if (mode === QueryMode.Segment) {
          return _.concat((r.segment || {}).tag, _.map((r.segment || {}).elements, (e) => e.value))
        } else {
          return r.values.length > 0 ? r.values : r.value
        }
      })
    } else {
      return engine.query(interchange, query)
    }
  }
}

function EngineQueryFirst (engine, interchange) {
  return (query, mode = QueryMode.Value) => {
    const ret = _.first(engine.query(interchange, query))
    if (mode > 1) {
      if (ret) {
        if (mode === QueryMode.Segment) {
          return _.concat((ret.segment || {}).tag, _.map((ret.segment || {}).elements, (e) => e.value))
        } else {
          return ret.values.length > 0 ? ret.values : ret.value
        }
      }
    } else {
      return ret
    }
  }
}

export class EDIParseScriptRunner {
  constructor (script = '', edi = '') {
    this.script = script
    this.edi = edi
    this.messages = []
    this.result = {}
  }

  process () {
    this.messages = []
    this.result = {}

    if (_.isString(this.script) === false) {
      AddMessageError(this.messages)('Script can not be empty')
      return false
    }

    const messages = []

    const parser = new X12Parser(true)
    const interchange = parser.parse(this.edi)
    const engine = new X12QueryEngine()
    const data = {}

    const vm = new NodeVM({
      sandbox: {
        AddMessageRule: AddMessageRule(messages),
        AddMessageError: AddMessageError(messages),
        AddMessageInfo: AddMessageInfo(messages),
        AddMessageWarning: AddMessageWarning(messages),
        data: data,
        edi: interchange,
        queryAll: EngineQueryAll(engine, interchange),
        queryFirst: EngineQueryFirst(engine, interchange)
      },
      require: {
        external: ['lodash', 'node-x12', 'moment']
      }
    })

    try {
      const fullScript = `
            const _ = require('lodash')
            const { X12QueryEngine, X12Interchange, X12FunctionalGroup, X12Transaction, X12Segment, X12Element } = require('node-x12')
            const moment = require('moment')
            ${this.script}`
      vm.run(fullScript, __filename)
      this.messages = messages
      this.result = data
      return true
    } catch (error) {
      AddMessageError(this.messages)(error.message)
      return false
    }
  }
}
