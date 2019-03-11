const P = require('parsimmon')

const _ = P.optWhitespace

const Num = P.regexp(/\d+\.?(\d+)?/).map(Number)

const Int = P.regexp(/\d+/).map(Number)

function Keyword() {
  return P.alt(P.string('rel'), P.string('concept'))
}

function KeyValuePair(key, value) {
  return P.seq(key.trim(_).skip(P.string('=').trim(_)), value.trim(_))
}

function Dictionary(keyValuePairs) {
  return P.string('(')
    .then(P.sepBy(P.alt(...keyValuePairs), P.string(',')))
    .skip(P.string(')'))
    .map(result =>
      result.reduce((prev, [key, val]) => {
        prev[key] = val
        return prev
      }, {})
    )
}

const Bool = Enum('true', 'false').map(b => (b === 'true' ? true : false))

function Enum(...strings) {
  return P.alt(...strings.map(s => P.string(s)))
}

const Comment = P.string('//')
  .then(P.noneOf('\n').many())
  .map(result => result.join(''))

const Variable = P.string('%')
  .then(P.regex(/[A-Z_]+/))
  .map(result => ({ name: result }))

module.exports = {
  _,
  Num,
  Int,
  Keyword,
  KeyValuePair,
  Dictionary,
  Bool,
  Enum,
  Str: require('./string'),
  Comment,
  Variable
}
