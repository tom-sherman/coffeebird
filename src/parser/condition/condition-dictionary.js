const P = require('parsimmon')
const { Dictionary, KeyValuePair, Str, Enum, Int } = require('../shared')

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
)

module.exports = {
  ConditionBehaviour,
  ConditionKeyValuePairs,
  ConditionDictionary
}
