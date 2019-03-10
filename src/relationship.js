const P = require('parsimmon')
const { _, Dictionary, KeyValuePair, Int, Bool, Enum } = require('./shared')
const { ConceptName } = require('./concept')

const RelName = P.regexp(/[a-z ]*[a-z]+/)

const Askable = Enum(
  'all',
  'none',
  'secondFormObject',
  'secondFormSubject'
)

const CanAdd = Enum(
  'all',
  'none',
  'subject',
  'object'
)

const RelKeyValuePairs = {
  cf: Int,
  plural: Bool,
  allowUnknown: Bool,
  askable: Askable,
  allowCf: Bool,
  canAdd: CanAdd
}

const RelDictionary = Dictionary(
  Object.entries(RelKeyValuePairs)
    .map(([ key, value ]) => KeyValuePair(P.string(key), value))
).fallback({})

const Rel = P.seqObj(
  P.string('rel'),

  [ 'subject', ConceptName.trim(_) ],

  P.string('-').trim(_),

  [ 'name', RelName.trim(_) ],

  P.string('-').trim(_),

  [ 'object', ConceptName.trim(_) ],

  [ 'options', RelDictionary.or(P.notFollowedBy(RelDictionary)).trim(_) ]
).skip(P.end)

module.exports = {
  RelName,
  Askable,
  CanAdd,
  RelDictionary,
  Rel
}
