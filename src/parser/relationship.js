const P = require('parsimmon')
const { _, Dictionary, Str, Bool, Enum } = require('./shared')
const { ConceptName } = require('./concept')

const RelName = P.regexp(/[a-z ]*[a-z]+/)

const Askable = Enum('all', 'none', 'secondFormObject', 'secondFormSubject')

const CanAdd = Enum('all', 'none', 'subject', 'object')

const RelDictionary = Dictionary({
  plural: Bool,
  allowUnknown: Bool,
  askable: Askable,
  allowCf: Bool,
  canAdd: CanAdd,
  group: Str,
  firstForm: Str,
  secondFormObject: Str,
  secondFormSubject: Str
})

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
