const P = require('parsimmon')
const { _, Num, Str, Bool, Variable, Enum } = require('../shared')
const { ConditionDictionary } = require('./condition-dictionary')

const Operator = Enum(
  '+',
  '-',
  '*',
  '/',
  '==',
  '!=',
  '>=',
  '<=',
  '>',
  '<',
  '&&',
  '||'
)

const Basic = P.alt(Num, Str, Bool, Variable)

const Expression = P.seqObj(
  ['left', Basic.trim(_)],
  ['operator', Operator.trim(_)],
  ['right', P.lazy(() => P.alt(Expression, Basic))]
).or(Basic)

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
