const createAttrs = obj =>
  Object.entries(obj)
    .filter(([_, value]) => typeof value !== 'undefined' && value !== null)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

module.exports = {
  createAttrs
}
