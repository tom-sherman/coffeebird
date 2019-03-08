const P = require('parsimmon')
const { Dictionary, KeyValuePair, Identifier, Enum } = require('./shared')


const ConceptName = Identifier

const ConceptType = Enum(
  'string',
  'number',
  'date',
  'truth'
)

const ConceptBehaviour = P.string('mutuallyExclusive')

const ConceptKeysValuePairs = {
  type: ConceptType,
  behaviour: ConceptBehaviour
}

const ConceptDictionary = Dictionary(
  Object.entries(ConceptKeysValuePairs)
    .map(([ key, value ]) => KeyValuePair(P.string(key), value))
).fallback({})

const Concept = P.seqObj(
  P.string('concept'),
  [ 'name', ConceptName.trim(P.optWhitespace) ],
  [ 'options', ConceptDictionary.or(P.notFollowedBy(ConceptDictionary)).trim(P.optWhitespace) ]
).skip(P.end)

module.exports = {
  Concept,
  ConceptDictionary,
  ConceptName,
  ConceptType,
  ConceptBehaviour
}
