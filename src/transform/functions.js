const ow = require('ow')

const transformFunction = fn => {
  const matchedFunction = RBLANG_FUNCTIONS[fn.function]
  if (typeof matchedFunction === 'undefined') {
    throw new Error(`"${fn.function}" is not a function.`)
  }

  // Ensure that all of the arguments are the correct type
  for (let index = 0; index < fn.arguments.length; index++) {
    const argument = fn.arguments[index]
    const matchedArgument = matchedFunction.arguments[index]
    // Will throw if `argument` isn't the correct type.
    matchedArgument.type(argument)
  }

  return 'yay!'
}

const functionArguments = args => ow.object.exactShape({ ...args })

const functionValidator = shape => ow.create(ow.object.exactShape(shape))

const variable = ow.object.exactShape({ name: ow.string })

const variableOrNumber = ow.any(variable, ow.number)
const variableOrString = ow.any(variable, ow.string)

const RBLANG_FUNCTIONS = {
  round: {
    transform: fn => `round(${fn.arguments.join(',')})`,
    validate: functionValidator({
      function: ow.string.equals('round'),
      arguments: functionArguments([
        variableOrNumber,
        ow.any(variableOrNumber, ow.undefined)
      ])
    })
  },
  countRelationshipInstances: {
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
  transformFunction,
  RBLANG_FUNCTIONS
}
