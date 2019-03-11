const P = require('parsimmon')
const { InstanceName } = require('./instance')
const { RelName } = require('./relationship')
const { _, Dictionary, KeyValuePair, Int } = require('./shared')

const FactDictionary = Dictionary([KeyValuePair(P.string('cf'), Int)]).fallback(
  {}
)

const Fact = P.seqObj(
  ['subject', InstanceName.trim(_)],
  P.string('-'),
  ['rel', RelName.trim(_)],
  P.string('-'),
  ['object', InstanceName.trim(_)],
  ['options', FactDictionary.trim(_)]
).skip(P.end)

module.exports = {
  Fact,
  FactDictionary
}
