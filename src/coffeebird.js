const P = require('parsimmon')
const { Concept, Fact, Rel, Instance, RuleNode } = require('./parser')
const transformNode = require('./transform')
const { _, Comment } = require('./parser/shared')

const parsers = [
  Comment.node('comment'),
  Concept.node('concept'),
  RuleNode,
  Fact.node('fact'),
  Instance.node('instance'),
  Rel.node('relationship')
]

const CoffeebirdParser = P.alt(...parsers)
  .sepBy(P.newline.many())
  .trim(_)

function parse(input) {
  return CoffeebirdParser.parse(input)
}

function transpile(input) {
  const transformParsers = parsers.map(p => p.map(transformNode))
  const result = P.alt(P.newline, ...transformParsers)
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
  transpile,
  CoffeebirdParser
}
