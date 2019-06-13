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

const variableValidator = ow.string.matches(/%[A-Z_]+/)

const RBLANG_FUNCTIONS = {
  round: {
    transform: fn => `round(${fn.arguments.join(',')})`,
    validate: functionValidator({
      function: ow.string.equals('round'),
      arguments: functionArguments([ow.number, ow.optional.number])
    })
  },
  countRelationshipInstances: {
    validate: functionValidator({
      function: ow.string.equals('countRelationshipInstances'),
      arguments: functionArguments([
        ow.any(variableValidator, ow.string),
        ow.string,
        ow.any(variableValidator, ow.string)
      ])
    })
  }
}

module.exports = {
  transformFunction,
  RBLANG_FUNCTIONS
}
