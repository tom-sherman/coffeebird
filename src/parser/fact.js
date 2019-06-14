const P = require('parsimmon')
const { InstanceName } = require('./instance')
const { RelName } = require('./relationship')
const { _, Dictionary, Int, Num, Bool } = require('./shared')

const FactDictionary = Dictionary({ cf: Int })
const SubjectObject = P.alt(InstanceName, Num, Bool)

const Fact = P.seqObj(
  ['subject', SubjectObject.trim(_)],
  P.string('-'),
  ['rel', RelName.trim(_)],
  P.string('-').trim(_),
  ['object', SubjectObject],
  ['options', P.optWhitespace.then(FactDictionary).fallback({})]
)

module.exports = {
  Fact,
  FactDictionary
}
