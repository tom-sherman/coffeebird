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

const Expression = P.seqObj(
  ['left', P.alt(Num, Str, Bool, Variable).trim(_)],
  ['operator', Operator.trim(_)],
  ['right', P.lazy(() => P.alt(Expression, Num, Str, Bool, Variable))]
).or(P.alt(Num, Str, Bool, Variable))

const ConditionExpr = P.seqObj(
  ['expression', Expression.trim(_)],
  ['options', ConditionDictionary.fallback({})]
).map(result => ((result.type = 'expr'), result))

module.exports = {
  ConditionExpr,
  Expression
}
