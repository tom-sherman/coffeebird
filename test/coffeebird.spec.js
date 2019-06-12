const { transpile } = require('../src/coffeebird')

it('transform', () => {
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

speaks (cf: 100, behaviour: topDownStrict) {
  %S - lives in - %COUNTRY;
  %COUNTRY == "\\"Ireland's\\"";
  %O = "Irish";
}
`

  const transformed = transpile(input)

  expect(transformed).toMatchInlineSnapshot(`
    "<?xml version=\\"1.0\\" encoding=\\"utf-8\\"?>
    <rbl:kb xmlns:rbl=\\"http://rbl.io/schema/RBLang\\">

    	<concept name=\\"Person\\" type=\\"string\\" />
    	<concept name=\\"Country\\" type=\\"string\\" />
    	<concept name=\\"Language\\" type=\\"string\\" />

    	<rel name=\\"speaks\\" subject=\\"Person\\" object=\\"Language\\" plural=\\"false\\" allowUnknown=\\"false\\" askable=\\"all\\" />
    	<rel name=\\"lives in\\" subject=\\"Person\\" object=\\"Country\\" plural=\\"false\\" allowUnknown=\\"false\\" askable=\\"all\\" />
    	<rel name=\\"national language\\" subject=\\"Country\\" object=\\"Language\\" plural=\\"false\\" allowUnknown=\\"false\\" askable=\\"secondFormObject\\" />

    	<concinst name=\\"Fred\\" type=\\"Person\\" />
    	<concinst name=\\"English\\" type=\\"Language\\" />
    	<concinst name=\\"French\\" type=\\"Language\\" />
    	<concinst name=\\"German\\" type=\\"Language\\" />
    	<concinst name=\\"England\\" type=\\"Country\\" />
    	<concinst name=\\"France\\" type=\\"Country\\" />
    	<concinst name=\\"Germany\\" type=\\"Country\\" />

    	<relinst type=\\"national language\\" subject=\\"England\\" object=\\"English\\" cf=\\"100\\" />
    	<relinst type=\\"national language\\" subject=\\"France\\" object=\\"French\\" cf=\\"100\\" />
    	<relinst type=\\"lives in\\" subject=\\"Fred\\" object=\\"England\\" cf=\\"100\\" />

    	<relinst type=\\"speaks\\" cf=\\"50\\">
    		<condition rel=\\"lives in\\" subject=\\"%S\\" object=\\"%COUNTRY\\" weight=\\"0\\" behaviour=\\"mandatory\\" />
    		<condition rel=\\"has national language\\" subject=\\"%COUNTRY\\" object=\\"%O\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
    	</relinst>

    	<relinst type=\\"speaks\\" cf=\\"100\\" behaviour=\\"top-down-strict\\">
    		<condition rel=\\"lives in\\" subject=\\"%S\\" object=\\"%COUNTRY\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
    		<condition expression=\\"%COUNTRY = '\\"Ireland\\\\'s\\"'\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
    		<condition expression=\\"'Irish'\\" value=\\"%O\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
    	</relinst>

    </rbl:kb>"
  `)
})
