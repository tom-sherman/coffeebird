const ow = require('ow')

const defaultFunctionTransform = fn => `${fn.name}(${fn.arguments.join(', ')})`

const functionArguments = args => ow.object.exactShape({ ...args })

const functionValidator = shape => ow.create(ow.object.exactShape(shape))

const variable = ow.object.exactShape({ name: ow.string })

const variableOrNumber = ow.any(variable, ow.number)
const variableOrString = ow.any(variable, ow.string)

const RBLANG_FUNCTIONS = {
  countRelationshipInstances: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('countRelationshipInstances'),
      arguments: functionArguments([
        variableOrString,
        ow.string,
        variableOrString
      ])
    })
  },
  isSubset: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('isSubset'),
      arguments: functionArguments([
        variableOrString,
        ow.string,
        variableOrString,
        variableOrString,
        ow.string,
        variableOrString
      ])
    })
  },
  min: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('min'),
      arguments: ow.array.ofType(variableOrNumber)
    })
  },
  max: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('max'),
      arguments: ow.array.ofType(variableOrNumber)
    })
  },
  round: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('round'),
      arguments: functionArguments([
        variableOrNumber,
        ow.any(variableOrNumber, ow.undefined)
      ])
    })
  },
  ceil: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('ceil'),
      arguments: functionArguments([variableOrNumber])
    })
  },
  floor: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('floor'),
      arguments: functionArguments([variableOrNumber])
    })
  },
  abs: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('abs'),
      arguments: functionArguments([variableOrNumber])
    })
  },
  sqrt: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('sqrt'),
      arguments: functionArguments([variableOrNumber])
    })
  },
  factorial: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('factorial'),
      arguments: functionArguments([variableOrNumber])
    })
  },
  tan: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('tan'),
      arguments: functionArguments([variableOrNumber])
    })
  },
  csc: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('csc'),
      arguments: functionArguments([variableOrNumber])
    })
  },
  cot: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('cot'),
      arguments: functionArguments([variableOrNumber])
    })
  },
  sec: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('sec'),
      arguments: functionArguments([variableOrNumber])
    })
  },
  atan: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('atan'),
      arguments: functionArguments([variableOrNumber])
    })
  }
}

module.exports = {
  defaultFunctionTransform,
  RBLANG_FUNCTIONS
}
