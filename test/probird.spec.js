const assert = require('assert')
const { ProBird } = require('../src/probird')

it('transform', function() {
  const transformed = ProBird.parse(`
concept Person (type = string)
concept Country (type = string)
concept Language (type = string)

rel Person - speaks - Language
rel Person - lives in - Country
rel Country - national language - Language (
  askable = secondFormObject
)

Person("Fred")
Language("English")
Language("French")
Language("German")
Country("England")
Country("France")
Country("Germany")

"England" - national language - "English" (cf = 100)
"France" - national language - "French"
"Fred" - lives in - "England"
`)

  assert.ok(transformed.status)
})
