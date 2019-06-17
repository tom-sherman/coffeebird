const fs = require('fs')
const path = require('path')

module.exports.loadExample = example => {
  const examplePath = path.join(__dirname, '..', 'examples', example)
  return fs.readFileSync(examplePath, { encoding: 'utf8' })
}
