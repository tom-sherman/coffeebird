const P = require('parsimmon')
const { InstanceName } = require('./instance')
const { RelName } = require('./relationship')
const { Dictionary, KeyValuePair, Int } = require('./shared')

const FactDictionary = Dictionary([
  KeyValuePair(P.string('cf'), Int)
]).fallback({})

const Fact = P.seqObj(
  [ 'subject', InstanceName.trim(P.optWhitespace) ],
  P.string('-'),
  [ 'rel', RelName.trim(P.optWhitespace) ],
  P.string('-'),
  [ 'object', InstanceName.trim(P.optWhitespace) ],
  [ 'options', FactDictionary.or(P.notFollowedBy(FactDictionary)).trim(P.optWhitespace) ]
).skip(P.end)


module.exports = {
  Fact,
  FactDictionary
}
