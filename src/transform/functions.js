const ow = require('ow')

const defaultFunctionTransform = fn => `${fn.name}(${fn.arguments.join(', ')})`

const functionArguments = args => ow.object.exactShape({ ...args })

const functionValidator = shape => ow.create(ow.object.exactShape(shape))

const variable = ow.object.exactShape({ name: ow.string })

const variableOrNumber = ow.any(variable, ow.number)
const variableOrString = ow.any(variable, ow.string)

const RBLANG_FUNCTIONS = {
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
  }
}

module.exports = {
  defaultFunctionTransform,
  RBLANG_FUNCTIONS
}
