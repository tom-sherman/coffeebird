const { createAttrs } = require('./shared')

function transformInstance(instance) {
  const { name, type } = instance
  return `\t<concinst ${createAttrs({ name, type })} />`
}

module.exports = {
  transformInstance
}
