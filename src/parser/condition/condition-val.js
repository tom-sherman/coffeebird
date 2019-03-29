const P = require('parsimmon')
const { _, Variable } = require('../shared')
const { Expression } = require('./condition-expr')
const { ConditionDictionary } = require('./condition-dictionary')

const ConditionVal = P.seqObj(
  ['assignment', Variable.trim(_)],
  P.string('=').trim(_),
  ['expression', Expression.trim(_)],
  ['options', ConditionDictionary.fallback({})]
)

module.exports = {
  ConditionVal
}
