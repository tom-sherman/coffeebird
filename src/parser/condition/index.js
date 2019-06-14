const P = require('parsimmon')
const { ConditionRel, ConditionSubjectObject } = require('./condition-rel')
const { ConditionDictionary } = require('./condition-dictionary')
const { ConditionExpr } = require('./condition-expr')
const { ConditionVal } = require('./condition-val')

const ConditionSep = P.string(';')

const Condition = P.alt(ConditionRel, ConditionVal, ConditionExpr)

module.exports = {
  Condition,
  ConditionRel,
  ConditionVal,
  ConditionExpr,
  ConditionSep,
  ConditionSubjectObject,
  ConditionDictionary
}
