const P = require('parsimmon')
const { Concept, Fact, Rel, Instance } = require('./parser')
const {
  transformConcept,
  transformFact,
  transformInstance,
  transformRelationship,
  transformDocument
} = require('./transform')
const { _, Comment } = require('./parser/shared')

const noop = result => result

function parserFactory({ transformers = {}, transform = false } = {}) {
  const {
    concept: transConcept = transformConcept,
    fact: transFact = transformFact,
    instance: transInstance = transformInstance,
    relationship: transRel = transformRelationship,
    document: transDoc = transformDocument
  } = transformers

  return P.alt(
    Concept.map(transform ? transConcept : noop),
    Fact.map(transform ? transFact : noop),
    Instance.map(transform ? transInstance : noop),
    Rel.map(transform ? transRel : noop)
  )
    .skip(Comment.many())
    .sepBy(P.newline.many())
    .trim(_)
    .map(transform ? transDoc : noop)
}

module.exports = {
  parserFactory,
  ProBird: parserFactory({ transform: true })
}
