const P = require('parsimmon')
const { _, Str } = require('./shared')
const { ConceptName } = require('./concept')

const InstanceName = Str
const InstanceType = ConceptName

const Instance = P.seqObj(
  ['type', InstanceType.trim(_)],
  P.string('('),
  ['name', InstanceName.trim(_)],
  P.string(')')
).skip(P.end)

module.exports = {
  Instance,
  InstanceName,
  InstanceType
}
