const createAttrs = obj =>
  Object.entries(obj)
    .filter(([_, value]) => typeof value !== 'undefined')
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

function transformConcept(concept) {
  const { name, options: { type = 'string', behaviour } = {} } = concept

  return `\t<concept ${createAttrs({ name, type, behaviour })} />`
}

function transformRelationship(rel) {
  const {
    subject,
    name,
    object,
    options: {
      askable = 'all',
      plural = false,
      allowUnknown = false,
      canAdd,
      allowCf
    } = {}
  } = rel

  return `\t<rel ${createAttrs({
    name,
    subject,
    object,
    plural,
    allowUnknown,
    askable,
    canAdd,
    allowCf
  })} />`
}

function transformInstance(instance) {
  const { name, type } = instance
  return `\t<concinst ${createAttrs({ name, type })} />`
}

function transformFact(fact) {
  const { subject, rel, object, options: { cf = 100 } = {} } = fact
  return `\t<relinst ${createAttrs({ type: rel, subject, object, cf })} />`
}

module.exports = {
  createAttrs,
  transformConcept,
  transformFact,
  transformInstance,
  transformRelationship
}
