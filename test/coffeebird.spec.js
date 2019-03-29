const assert = require('assert')
const { transpile } = require('../src/coffeebird')

it('transform', function() {
  const input = `
concept Person (type: string)
concept Country
concept Language (type: string)

rel Person - speaks - Language
rel Person - lives in - Country
rel Country - national language - Language (
  askable: secondFormObject
)

Person("Fred")
Language("English")
Language("French")
Language("German")
Country("England")
Country("France")
Country("Germany")

"England" - national language - "English" (cf: 100)
"France" - national language - "French"
"Fred" - lives in - "England"

speaks (cf: 50) {
  %S - lives in - %COUNTRY (weight: 0);
  %COUNTRY - has national language - %O
}
`

  const transformed = transpile(input)

  assert.ok(transformed)
})
