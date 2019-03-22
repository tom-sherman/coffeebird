const P = require('parsimmon')
const { InstanceName } = require('./instance')
const { RelName } = require('./relationship')
const { _, Dictionary, KeyValuePair, Int } = require('./shared')

const FactDictionary = Dictionary([KeyValuePair(P.string('cf'), Int)])

const Fact = P.seqObj(
  ['subject', InstanceName.trim(_)],
  P.string('-'),
  ['rel', RelName.trim(_)],
  P.string('-').trim(_),
  ['object', InstanceName],
  ['options', P.optWhitespace.then(FactDictionary).fallback({})]
)

module.exports = {
  Fact,
  FactDictionary
}
