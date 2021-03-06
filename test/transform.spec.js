/* global describe, it, expect */
const { transformConcept } = require('../src/transform/concept')
const { transformRelationship } = require('../src/transform/relationship')
const { transformInstance } = require('../src/transform/instance')
const { transformFact } = require('../src/transform/fact')
const { transformRule } = require('../src/transform/rule')
const { transformCondition } = require('../src/transform/condition')
const {
  Concept,
  Rel,
  Instance,
  Fact,
  Rule,
  Condition
} = require('../src/parser')

describe('transform', () => {
  it('should transform concepts', () => {
    const inputs = [
      ['concept Language', '\t<concept name="Language" type="string" />'],
      ['concept Language ()', '\t<concept name="Language" type="string" />'],
      ['concept Foo (type: string)', '\t<concept name="Foo" type="string" />'],
      ['concept Foo( type: truth )', '\t<concept name="Foo" type="truth" />'],
      [
        'concept Foo(\n\ttype: number\n)',
        '\t<concept name="Foo" type="number" />'
      ],
      [
        'concept Foo (behaviour: mutuallyExclusive)',
        '\t<concept name="Foo" type="string" behaviour="mutually-exclusive" />'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Concept.map(transformConcept).parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should transform relationships', () => {
    const inputs = [
      [
        'rel Person - speaks - Language',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="all" />'
      ],
      [
        'rel Person - speaks - Language ()',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="all" />'
      ],
      [
        'rel Person - speaks - Language (askable:none)',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="none" />'
      ],
      [
        'rel Person - speaks - Language (askable: none, group: "a,b")',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="none" group="a,b" />'
      ],
      [
        'rel Person - speaks - Language (\n\taskable: none,\n\tcanAdd: none\n)',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="none" canAdd="none" />'
      ]
    ]

    for (const [input, expected] of inputs) {
      expect(Rel.map(transformRelationship).tryParse(input)).toEqual(expected)
    }
  })

  it('should transform relationships with question wording', () => {
    const inputs = [
      [
        'rel Person - speaks - Language (firstForm: "Does %S live in %O?")',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="all">\n' +
          '\t\t<firstForm>Does %S live in %O?</firstForm>\n' +
          '\t</rel>'
      ],
      [
        'rel Person - speaks - Language (firstForm: "Does %S live in %O?", secondFormObject:"Where does %S live?")',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="all">\n' +
          '\t\t<firstForm>Does %S live in %O?</firstForm>\n' +
          '\t\t<secondFormObject>Where does %S live?</secondFormObject>\n' +
          '\t</rel>'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Rel.map(transformRelationship).parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should transform instances', () => {
    const { status, value } = Instance.map(transformInstance).parse(
      'Person("Dave")'
    )
    expect(status).toBe(true)
    expect(value).toBe('\t<concinst name="Dave" type="Person" />')
  })

  it('should transform facts', () => {
    const inputs = [
      [
        '"Dave" - speaks - "English"',
        '\t<relinst type="speaks" subject="Dave" object="English" cf="100" />'
      ],
      [
        '"Dave" - speaks - "English" (cf: 90)',
        '\t<relinst type="speaks" subject="Dave" object="English" cf="90" />'
      ],
      [
        '"Dave" - has age - 18',
        '\t<relinst type="has age" subject="Dave" object="18" cf="100" />'
      ],
      [
        '"Dave" - is eligible - true',
        '\t<relinst type="is eligible" subject="Dave" object="true" cf="100" />'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Fact.map(transformFact).parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should transform conditions', () => {
    const inputs = [
      [
        '%S - speaks - %LANG',
        '\t\t<condition rel="speaks" subject="%S" object="%LANG" weight="100" behaviour="mandatory" />'
      ],
      [
        '%S - speaks - %LANG (behaviour: optional)',
        '\t\t<condition rel="speaks" subject="%S" object="%LANG" weight="100" behaviour="optional" />'
      ],
      [
        '%S - speaks - %LANG (behaviour: optional, weight: 50)',
        '\t\t<condition rel="speaks" subject="%S" object="%LANG" weight="50" behaviour="optional" />'
      ],
      [
        '%FOO = 0',
        '\t\t<condition expression="0" value="%FOO" weight="100" behaviour="mandatory" />'
      ],
      [
        '%FOO = 3 * %BAR',
        '\t\t<condition expression="(3 * %BAR)" value="%FOO" weight="100" behaviour="mandatory" />'
      ],
      [
        '%FOO = 3 * %BAR - 3',
        '\t\t<condition expression="((3 * %BAR) - 3)" value="%FOO" weight="100" behaviour="mandatory" />'
      ],
      [
        '3 + 2 * 3',
        '\t\t<condition expression="(3 + (2 * 3))" weight="100" behaviour="mandatory" />'
      ],
      [
        '1 + 2 + 3',
        '\t\t<condition expression="((1 + 2) + 3)" weight="100" behaviour="mandatory" />'
      ],
      [
        '-1',
        '\t\t<condition expression="(-1)" weight="100" behaviour="mandatory" />'
      ],
      [
        '!%FOO',
        '\t\t<condition expression="(%FOO = false)" weight="100" behaviour="mandatory" />'
      ],
      [
        '3 % 4',
        '\t\t<condition expression="(mod(3, 4))" weight="100" behaviour="mandatory" />'
      ],
      [
        '3 ^ 4',
        '\t\t<condition expression="(pow(3, 4))" weight="100" behaviour="mandatory" />'
      ],
      [
        '3 ^ (4 + 2)',
        '\t\t<condition expression="(pow(3, (4 + 2)))" weight="100" behaviour="mandatory" />'
      ],
      [
        '3 ^ 4 + 2',
        '\t\t<condition expression="((pow(3, 4)) + 2)" weight="100" behaviour="mandatory" />'
      ],
      [
        'round(%FOO)',
        '\t\t<condition expression="round(%FOO)" weight="100" behaviour="mandatory" />'
      ],
      [
        'countRelationshipInstances(%S, "has outcome", *) > 0',
        '\t\t<condition expression="(countRelationshipInstances(%S, \'has outcome\', \'*\') gt 0)" weight="100" behaviour="mandatory" />'
      ],
      [
        'round(%FOO + 3)',
        '\t\t<condition expression="round((%FOO + 3))" weight="100" behaviour="mandatory" />'
      ],
      [
        'now()',
        '\t\t<condition expression="now()" weight="100" behaviour="mandatory" />'
      ],
      [
        '4 + 3 (behaviour: optional, weight: 50)',
        '\t\t<condition expression="(4 + 3)" weight="50" behaviour="optional" />'
      ]
    ]

    const conditionParser = Condition.map(transformCondition)

    for (const [input, expected] of inputs) {
      expect(conditionParser.tryParse(input)).toEqual(expected)
    }
  })

  it('should transform rules', () => {
    const inputs = [
      ['speaks {}', '\t<relinst type="speaks" cf="100">\n\n\t</relinst>'],
      [
        'speaks - "English" {}',
        '\t<relinst type="speaks" object="English" cf="100">\n\n\t</relinst>'
      ],
      [
        '"Dave" - speaks - "English" {}',
        '\t<relinst type="speaks" subject="Dave" object="English" cf="100">\n\n\t</relinst>'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Rule.map(transformRule).parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })
})
