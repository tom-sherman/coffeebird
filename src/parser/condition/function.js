const P = require('parsimmon')
const { Expression } = require('./expression')
const { _ } = require('../shared')

const FunctionArgumentSeparator = P.string(',')

const Wildcard = P.string('*')

const FunctionName = P.regexp(/[a-zA-Z]+/)

const FunctionArguments = P.alt(Wildcard, Expression)
  .sepBy(FunctionArgumentSeparator)
  .trim(_)

const FunctionCall = P.seqObj(
  ['function', FunctionName],
  P.string('('),
  ['arguments', FunctionArguments],
  P.string(')')
)

module.exports = {
  FunctionCall,
  FunctionArguments
}
