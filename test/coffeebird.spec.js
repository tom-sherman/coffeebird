/* global it, expect */
const { transpile } = require('../src/coffeebird')
const { loadExample } = require('./util')

it('transform', () => {
  const helloWorld = loadExample('hello-world.coffeebird')
  expect(transpile(helloWorld)).toMatchInlineSnapshot(`
		"<?xml version=\\"1.0\\" encoding=\\"utf-8\\"?>
		<rbl:kb xmlns:rbl=\\"http://rbl.io/schema/RBLang\\">
			<concept name=\\"Person\\" type=\\"string\\" />
			<concept name=\\"Country\\" type=\\"string\\" />
			<concept name=\\"Language\\" type=\\"string\\" />

			<rel name=\\"speaks\\" subject=\\"Person\\" object=\\"Language\\" plural=\\"false\\" allowUnknown=\\"false\\" askable=\\"all\\" />
			<rel name=\\"lives in\\" subject=\\"Person\\" object=\\"Country\\" plural=\\"false\\" allowUnknown=\\"false\\" askable=\\"all\\" />
			<rel name=\\"national language\\" subject=\\"Country\\" object=\\"Language\\" plural=\\"false\\" allowUnknown=\\"false\\" askable=\\"none\\" />

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

			<relinst type=\\"speaks\\" cf=\\"75\\" minimumRuleCertainty=\\"60\\">
				<condition rel=\\"lives in\\" subject=\\"%S\\" object=\\"%COUNTRY\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
				<condition rel=\\"national language\\" subject=\\"%COUNTRY\\" object=\\"%O\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
			</relinst>

		</rbl:kb>"
	`)

  const helloWorldExtended = loadExample('hello-world-extended.coffeebird')
  expect(transpile(helloWorldExtended)).toMatchInlineSnapshot(`
    "<?xml version=\\"1.0\\" encoding=\\"utf-8\\"?>
    <rbl:kb xmlns:rbl=\\"http://rbl.io/schema/RBLang\\">
    <!--  The purpose of this example is to show all of the features of Coffeebird. -->

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

    	<relinst type=\\"speaks\\" cf=\\"100\\">
    		<condition rel=\\"lives in\\" subject=\\"%S\\" object=\\"%COUNTRY\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
    		<condition expression=\\"(%COUNTRY = 'Ireland')\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
    		<condition expression=\\"'Irish'\\" value=\\"%O\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
    	</relinst>

    </rbl:kb>"
  `)
})
