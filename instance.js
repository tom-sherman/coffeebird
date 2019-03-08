const P = require('parsimmon')
const { Str, Identifier, Dictionary } = require('./shared')
const { ConceptName } = require('./concept')

const InstanceName = Str
const InstanceType = ConceptName

const Instance = P.seqObj(
  [ 'type', InstanceType.trim(P.optWhitespace) ],
  P.string('('),
  [ 'name', InstanceName.trim(P.optWhitespace) ],
  P.string(')')
).skip(P.end)

module.exports = {
  Instance,
  InstanceName,
  InstanceType
}
