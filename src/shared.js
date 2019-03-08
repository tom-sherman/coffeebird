const P = require('parsimmon')

const Num = P.regexp(/\d+\.?(\d+)?/).map(Number)

const Int = P.regexp(/\d+/).map(Number)

function Keyword () {
  return P.alt(
    P.string('rel'),
    P.string('concept')
  )
}

function KeyValuePair (key, value) {
  return P.seq(
    key.trim(P.optWhitespace)
      .skip(P.string('=').trim(P.optWhitespace)),
    value.trim(P.optWhitespace)
  )
}

function Dictionary (keyValuePairs) {
  return P.string('(')
    .then(
      P.sepBy(P.alt(...keyValuePairs), P.string(','))
    )
    .skip(P.string(')'))
    .map(result => result.reduce((prev, [ key, val ]) => {
      prev[key] = val
      return prev
    }, {}))
}

const Identifier = P.regexp(/[a-zA-Z]+/)

const Bool = Enum('true', 'false')

function Enum (...strings) {
  return P.alt(
    ...strings.map(s => P.string(s))
  )
}

const Comment = P.string('//')
  .then(P.noneOf('\n').many())
  .map(result => result.join(''))

module.exports = {
  Num,
  Int,
  Keyword,
  KeyValuePair,
  Dictionary,
  Identifier,
  Bool,
  Enum,
  Str: require('./string'),
  Comment
}
