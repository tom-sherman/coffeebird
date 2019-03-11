const P = require('parsimmon')
const {
  _,
  Variable,
  Dictionary,
  KeyValuePair,
  Str,
  Enum,
  Int,
  Bool,
  Num
} = require('./shared')
const { RelName } = require('./relationship')
const { InstanceName } = require('./instance')

const ConditionBehaviour = Enum('mandatory', 'optional')

const ConditionKeyValuePairs = {
  alt: Str,
  behaviour: ConditionBehaviour,
  weight: Int
}

const ConditionDictionary = Dictionary(
  Object.entries(ConditionKeyValuePairs).map(([key, value]) =>
    KeyValuePair(P.string(key), value)
  )
).fallback({})

const ConditionSubjectObject = P.alt(Str, Num, Bool, Variable)

const ConditionSep = P.string(';')

const ConditionRel = P.seqObj(
  ['subject', ConditionSubjectObject.trim(_)],
  P.string('-'),
  ['rel', RelName.trim(_)],
  P.string('-'),
  ['object', ConditionSubjectObject.trim(_)]
)

const ConditionExpr = null

const ConditionVal = null

const Condition = null

module.exports = {
  Condition,
  ConditionRel,
  ConditionVal,
  ConditionDictionary,
  ConditionExpr,
  ConditionSubjectObject
}
