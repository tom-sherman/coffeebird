const P = require('parsimmon')
const { _ } = require('../shared')
const { Expression } = require('./expression')
const { ConditionDictionary } = require('./condition-dictionary')

const ConditionExpr = P.seqObj(
  ['expression', Expression.trim(_)],
  ['options', ConditionDictionary.fallback({})]
).map(result => {
  result.type = 'expr'
  return result
})

module.exports = {
  ConditionExpr,
  Expression
}
