/* global it, expect */
const { transpile, parse } = require('../src/coffeebird')

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
				<condition expression=\\"(%COUNTRY = '\\"Ireland\\\\'s\\"')\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
				<condition expression=\\"'Irish'\\" value=\\"%O\\" weight=\\"100\\" behaviour=\\"mandatory\\" />
			</relinst>

		</rbl:kb>"
	`)

  expect(parse(input).value).toMatchInlineSnapshot(`
    Array [
      Object {
        "end": Object {
          "column": 30,
          "line": 2,
          "offset": 30,
        },
        "name": "Concept",
        "start": Object {
          "column": 1,
          "line": 2,
          "offset": 1,
        },
        "value": Object {
          "name": "Person",
          "options": Object {
            "type": "string",
          },
        },
      },
      Object {
        "end": Object {
          "column": 16,
          "line": 3,
          "offset": 46,
        },
        "name": "Concept",
        "start": Object {
          "column": 1,
          "line": 3,
          "offset": 31,
        },
        "value": Object {
          "name": "Country",
          "options": Object {},
        },
      },
      Object {
        "end": Object {
          "column": 32,
          "line": 4,
          "offset": 78,
        },
        "name": "Concept",
        "start": Object {
          "column": 1,
          "line": 4,
          "offset": 47,
        },
        "value": Object {
          "name": "Language",
          "options": Object {
            "type": "string",
          },
        },
      },
      Object {
        "end": Object {
          "column": 31,
          "line": 6,
          "offset": 110,
        },
        "name": "Relationship",
        "start": Object {
          "column": 1,
          "line": 6,
          "offset": 80,
        },
        "value": Object {
          "name": "speaks",
          "object": "Language",
          "options": Object {},
          "subject": "Person",
        },
      },
      Object {
        "end": Object {
          "column": 32,
          "line": 7,
          "offset": 142,
        },
        "name": "Relationship",
        "start": Object {
          "column": 1,
          "line": 7,
          "offset": 111,
        },
        "value": Object {
          "name": "lives in",
          "object": "Country",
          "options": Object {},
          "subject": "Person",
        },
      },
      Object {
        "end": Object {
          "column": 2,
          "line": 10,
          "offset": 217,
        },
        "name": "Relationship",
        "start": Object {
          "column": 1,
          "line": 8,
          "offset": 143,
        },
        "value": Object {
          "name": "national language",
          "object": "Language",
          "options": Object {
            "askable": "secondFormObject",
          },
          "subject": "Country",
        },
      },
      Object {
        "end": Object {
          "column": 15,
          "line": 12,
          "offset": 233,
        },
        "name": "Instance",
        "start": Object {
          "column": 1,
          "line": 12,
          "offset": 219,
        },
        "value": Object {
          "name": "Fred",
          "type": "Person",
        },
      },
      Object {
        "end": Object {
          "column": 20,
          "line": 13,
          "offset": 253,
        },
        "name": "Instance",
        "start": Object {
          "column": 1,
          "line": 13,
          "offset": 234,
        },
        "value": Object {
          "name": "English",
          "type": "Language",
        },
      },
      Object {
        "end": Object {
          "column": 19,
          "line": 14,
          "offset": 272,
        },
        "name": "Instance",
        "start": Object {
          "column": 1,
          "line": 14,
          "offset": 254,
        },
        "value": Object {
          "name": "French",
          "type": "Language",
        },
      },
      Object {
        "end": Object {
          "column": 19,
          "line": 15,
          "offset": 291,
        },
        "name": "Instance",
        "start": Object {
          "column": 1,
          "line": 15,
          "offset": 273,
        },
        "value": Object {
          "name": "German",
          "type": "Language",
        },
      },
      Object {
        "end": Object {
          "column": 19,
          "line": 16,
          "offset": 310,
        },
        "name": "Instance",
        "start": Object {
          "column": 1,
          "line": 16,
          "offset": 292,
        },
        "value": Object {
          "name": "England",
          "type": "Country",
        },
      },
      Object {
        "end": Object {
          "column": 18,
          "line": 17,
          "offset": 328,
        },
        "name": "Instance",
        "start": Object {
          "column": 1,
          "line": 17,
          "offset": 311,
        },
        "value": Object {
          "name": "France",
          "type": "Country",
        },
      },
      Object {
        "end": Object {
          "column": 19,
          "line": 18,
          "offset": 347,
        },
        "name": "Instance",
        "start": Object {
          "column": 1,
          "line": 18,
          "offset": 329,
        },
        "value": Object {
          "name": "Germany",
          "type": "Country",
        },
      },
      Object {
        "end": Object {
          "column": 52,
          "line": 20,
          "offset": 400,
        },
        "name": "Fact",
        "start": Object {
          "column": 1,
          "line": 20,
          "offset": 349,
        },
        "value": Object {
          "object": "English",
          "options": Object {
            "cf": 100,
          },
          "rel": "national language",
          "subject": "England",
        },
      },
      Object {
        "end": Object {
          "column": 40,
          "line": 21,
          "offset": 440,
        },
        "name": "Fact",
        "start": Object {
          "column": 1,
          "line": 21,
          "offset": 401,
        },
        "value": Object {
          "object": "French",
          "options": Object {},
          "rel": "national language",
          "subject": "France",
        },
      },
      Object {
        "end": Object {
          "column": 30,
          "line": 22,
          "offset": 470,
        },
        "name": "Fact",
        "start": Object {
          "column": 1,
          "line": 22,
          "offset": 441,
        },
        "value": Object {
          "object": "England",
          "options": Object {},
          "rel": "lives in",
          "subject": "Fred",
        },
      },
      Object {
        "end": Object {
          "column": 2,
          "line": 27,
          "offset": 571,
        },
        "name": "Rule",
        "start": Object {
          "column": 1,
          "line": 24,
          "offset": 472,
        },
        "value": Object {
          "conditions": Array [
            Object {
              "object": Object {
                "name": "COUNTRY",
              },
              "options": Object {
                "weight": 0,
              },
              "rel": "lives in",
              "subject": Object {
                "name": "S",
              },
              "type": "rel",
            },
            Object {
              "object": Object {
                "name": "O",
              },
              "options": Object {},
              "rel": "has national language",
              "subject": Object {
                "name": "COUNTRY",
              },
              "type": "rel",
            },
          ],
          "object": null,
          "options": Object {
            "cf": 50,
          },
          "rel": "speaks",
          "subject": null,
        },
      },
      Object {
        "end": Object {
          "column": 2,
          "line": 33,
          "offset": 694,
        },
        "name": "Rule",
        "start": Object {
          "column": 1,
          "line": 29,
          "offset": 573,
        },
        "value": Object {
          "conditions": Array [
            Object {
              "object": Object {
                "name": "COUNTRY",
              },
              "options": Object {},
              "rel": "lives in",
              "subject": Object {
                "name": "S",
              },
              "type": "rel",
            },
            Object {
              "expression": Array [
                "Equal",
                Object {
                  "name": "COUNTRY",
                },
                "\\"Ireland's\\"",
              ],
              "options": Object {},
              "type": "expr",
            },
            Object {
              "assignment": Object {
                "name": "O",
              },
              "expression": "Irish",
              "options": Object {},
              "type": "val",
            },
          ],
          "object": null,
          "options": Object {
            "behaviour": "topDownStrict",
            "cf": 100,
          },
          "rel": "speaks",
          "subject": null,
        },
      },
    ]
  `)
})
