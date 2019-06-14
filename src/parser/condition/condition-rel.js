const P = require('parsimmon')
const { _, Variable, Str, Bool, Num } = require('../shared')
const { RelName } = require('../relationship')
const { ConditionDictionary } = require('./condition-dictionary')

const ConditionSubjectObject = P.alt(Str, Num, Bool, Variable)

const ConditionRel = P.seqObj(
  ['subject', ConditionSubjectObject.trim(_)],
  P.string('-'),
  ['rel', RelName.trim(_)],
  P.string('-'),
  ['object', ConditionSubjectObject.trim(_)],
  ['options', ConditionDictionary.fallback({})]
).map(result => {
  result.type = 'rel'
  return result
})

module.exports = {
  ConditionRel,
  ConditionSubjectObject
}
