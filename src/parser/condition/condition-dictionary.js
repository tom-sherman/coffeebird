const { Dictionary, Str, Enum, Int } = require('../shared')

const ConditionBehaviour = Enum('mandatory', 'optional')

const ConditionDictionary = Dictionary({
  alt: Str,
  behaviour: ConditionBehaviour,
  weight: Int
})

module.exports = {
  ConditionBehaviour,
  ConditionDictionary
}
