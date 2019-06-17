const { transformConcept } = require('./concept')
const { transformRelationship } = require('./relationship')
const { transformInstance } = require('./instance')
const { transformFact } = require('./fact')
const { transformRule } = require('./rule')

module.exports = function transformNode(node) {
  switch (node.name) {
    case 'concept': {
      return transformConcept(node.value)
    }
    case 'relationship': {
      return transformRelationship(node.value)
    }
    case 'instance': {
      return transformInstance(node.value)
    }
    case 'fact': {
      return transformFact(node.value)
    }
    case 'rule': {
      return transformRule(node.value)
    }
    case 'comment': {
      return `<!-- ${node.value} -->`
    }
  }
}
