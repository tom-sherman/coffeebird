const P = require('parsimmon')

const concept = require('./concept')
const rel = require('./relationship')

console.log(
  rel.Rel.parse(`rel Person - speaks - Language`)
)
