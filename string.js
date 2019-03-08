const P = require('parsimmon')

// all the characters which can be escaped
const Escape = P.string('\\')
  .then(P.oneOf('\\"\''))

const NonEscape = P.noneOf('\\\"\0\n\r\v\t\b\f')

const Character = NonEscape.or(Escape)

const Str = Character.many()
  .wrap(P.string('"'), P.string('"'))
  .map(result => result.join(''))

module.exports = Str
