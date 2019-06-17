const { createAttrs } = require('./shared')

function transformFact(fact) {
  const { subject, rel, object, options: { cf = 100 } = {} } = fact
  return `\t<relinst ${createAttrs({ type: rel, subject, object, cf })} />`
}

module.exports = {
  transformFact
}
