const P = require('parsimmon')
const { Dictionary, Enum } = require('./shared')

const ConceptName = P.regexp(/[a-zA-Z]+/)

const ConceptType = Enum('string', 'number', 'date', 'truth')

const ConceptBehaviour = P.string('mutuallyExclusive')

const ConceptDictionary = Dictionary({
  type: ConceptType,
  behaviour: ConceptBehaviour
})

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
