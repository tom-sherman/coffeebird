const { createAttrs } = require('./shared')

const transformConcept = concept => {
  let { name, options: { type = 'string', behaviour } = {} } = concept

  if (behaviour === 'mutuallyExclusive') {
    behaviour = 'mutually-exclusive'
  }

  return `\t<concept ${createAttrs({ name, type, behaviour })} />`
}

module.exports = {
  transformConcept
}
