const P = require('parsimmon')
const { InstanceName } = require('./instance')
const { RelName } = require('./relationship')
const { Condition, ConditionSep } = require('./condition')
const { _, Dictionary, Int, Str, Enum } = require('./shared')

const RuleBehaviour = Enum('topDownStrict', 'topDown')

const RuleDictionary = Dictionary({
  cf: Int,
  alt: Str,
  minimumRuleCertainty: Int,
  behaviour: RuleBehaviour
})

const RuleSubject = InstanceName.trim(_).skip(P.string('-'))

const RuleObject = P.string('-').then(InstanceName.trim(_))

const Rule = P.seqObj(
  ['subject', RuleSubject.fallback(null)],
  ['rel', RelName.trim(_)],
  ['object', RuleObject.fallback(null)],
  ['options', RuleDictionary.fallback({})],
  P.string('{').trim(_),
  [
    'conditions',
    Condition.sepBy(ConditionSep)
      .skip(ConditionSep.times(0, 1))
      .trim(_)
  ],
  P.string('}')
)

module.exports = {
  Rule,
  RuleDictionary,
  RuleSubject,
  RuleObject
}
