const P = require('parsimmon')
const { _, Dictionary, KeyValuePair, Enum } = require('./shared')

const ConceptName = P.regexp(/[a-zA-Z]+/)

const ConceptType = Enum('string', 'number', 'date', 'truth')

const ConceptBehaviour = P.string('mutuallyExclusive')

const ConceptKeysValuePairs = {
  type: ConceptType,
  behaviour: ConceptBehaviour
}

const ConceptDictionary = Dictionary(
  Object.entries(ConceptKeysValuePairs).map(([key, value]) =>
    KeyValuePair(P.string(key), value)
  )
)

const Concept = P.seqObj(
  P.string('concept'),
  P.whitespace,
  ['name', ConceptName],
  ['options', P.optWhitespace.then(ConceptDictionary).fallback({})]
)

module.exports = {
  Concept,
  ConceptDictionary,
  ConceptName,
  ConceptType,
  ConceptBehaviour
}
