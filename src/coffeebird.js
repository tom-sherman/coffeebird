const P = require('parsimmon')
const { Concept, Fact, Rel, Instance, Rule } = require('./parser')
const {
  transformConcept,
  transformFact,
  transformInstance,
  transformRelationship,
  transformRule
} = require('./transform')
const { _, Comment } = require('./parser/shared')

const EmptyLine = P.newline.atLeast(2)

function reduceLines(lines) {
  return lines.join('\n')
}

function parse(input) {
  return P.alt(
    Concept.node('Concept'),
    Fact.node('Fact'),
    Instance.node('Instance'),
    Rel.node('Relationship'),
    Rule.node('Rule')
  )
    .skip(Comment.many())
    .sepBy(P.newline.many())
    .trim(_)
    .parse(input)
}

function transpile(input) {
  const result = P.alt(
    P.newline,
    Concept.map(transformConcept),
    Rule.map(transformRule),
    Fact.map(transformFact),
    Instance.map(transformInstance),
    Rel.map(transformRelationship)
  )
    .skip(Comment.many())
    .many()
    .tie()
    .tryParse(input)

  return (
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<rbl:kb xmlns:rbl="http://rbl.io/schema/RBLang">\n' +
    result +
    '\n' +
    '</rbl:kb>'
  )
}

module.exports = {
  parse,
  transpile
}
