const P = require('parsimmon')
const { _, Variable } = require('../shared')
const { RelName } = require('../relationship')
const { InstanceName } = require('../instance')
const { Expression } = require('./condition-expr')

const FunctionArgumentSeparator = P.string(',')

function FunctionCall(name, ...args) {
  return P.lazy(() =>
    P.seqObj(
      ['function', P.string(name).trim(_)],
      ['arguments', FunctionArguments(...args)]
    )
  )
}

// TODO: Optional arguments

function FunctionArguments(...args) {
  const lastArg = args.splice(args.length - 1, 1)[0]
  // Our arguments parser must be lazy as an argument can be an expression, not just literal values.
  // This creates a circular reference as an expression can itself contain function call
  return P.string('(')
    .then(
      P.seq(
        ...args.map(arg => arg.trim(_).skip(FunctionArgumentSeparator)),
        lastArg.trim(_)
      )
    )
    .skip(P.string(')'))
}

const Wildcard = P.string('*')

const InstanceOrWildcard = P.alt(Wildcard, Variable, InstanceName)

const rblangFunctions = () => ({
  countRelationshipInstances: FunctionCall(
    'countRelationshipInstances',
    InstanceOrWildcard,
    RelName,
    InstanceOrWildcard
  ),
  sumObjects: FunctionCall('sumObjects', InstanceOrWildcard, RelName, Wildcard)
  // round: FunctionCall('round', Expression)
})

module.exports = {
  FunctionCall,
  FunctionArguments,
  rblangFunctions
}
