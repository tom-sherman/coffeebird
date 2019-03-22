const P = require('parsimmon')
const { _, Dictionary, KeyValuePair, Str, Bool, Enum } = require('./shared')
const { ConceptName } = require('./concept')

const RelName = P.regexp(/[a-z ]*[a-z]+/)

const Askable = Enum('all', 'none', 'secondFormObject', 'secondFormSubject')

const CanAdd = Enum('all', 'none', 'subject', 'object')

const RelKeyValuePairs = {
  plural: Bool,
  allowUnknown: Bool,
  askable: Askable,
  allowCf: Bool,
  canAdd: CanAdd,
  firstForm: Str,
  secondFormObject: Str,
  secondFormSubject: Str
}

const RelDictionary = Dictionary(
  Object.entries(RelKeyValuePairs).map(([key, value]) =>
    KeyValuePair(P.string(key), value)
  )
)

const Rel = P.seqObj(
  P.string('rel'),

  P.whitespace,

  ['subject', ConceptName.trim(_)],

  P.string('-').trim(_),

  ['name', RelName.trim(_)],

  P.string('-').trim(_),

  ['object', ConceptName],

  ['options', P.whitespace.then(RelDictionary).fallback({})]
)

module.exports = {
  RelName,
  Askable,
  CanAdd,
  RelDictionary,
  Rel
}
