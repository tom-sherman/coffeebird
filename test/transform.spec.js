/* global describe, it, expect */
const {
  transformConcept,
  transformRelationship,
  transformFact,
  transformInstance,
  transformRule,
  transformCondition
} = require('../src/transform')
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
        'rel Person - speaks - Language (\n\taskable: none,\n\tcanAdd: none\n)',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="none" canAdd="none" />'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Rel.map(transformRelationship).parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
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
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Condition.map(transformCondition).parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
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
