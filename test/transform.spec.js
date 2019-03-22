const assert = require('assert')
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

describe('transform', function() {
  it('should transform concepts', function() {
    const inputs = [
      ['concept Language', '\t<concept name="Language" type="string" />'],
      ['concept Language ()', '\t<concept name="Language" type="string" />'],
      ['concept Foo (type=string)', '\t<concept name="Foo" type="string" />'],
      ['concept Foo( type=truth )', '\t<concept name="Foo" type="truth" />'],
      [
        'concept Foo(\n\ttype=number\n)',
        '\t<concept name="Foo" type="number" />'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Concept.map(transformConcept).parse(input)
      assert.ok(status)
      assert.equal(value, expected)
    }
  })

  it('should transform relationships', function() {
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
        'rel Person - speaks - Language (askable=none)',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="none" />'
      ],
      [
        'rel Person - speaks - Language (\n\taskable=none,\n\tcanAdd=none\n)',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="none" canAdd="none" />'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Rel.map(transformRelationship).parse(input)
      assert.ok(status)
      assert.equal(value, expected)
    }
  })

  it('should transform relationships with question wording', function() {
    const inputs = [
      [
        'rel Person - speaks - Language (firstForm = "Does %S live in %O?")',
        '\t<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="all">\n' +
          '\t\t<firstForm>Does %S live in %O?</firstForm>\n' +
          '\t</rel>'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Rel.map(transformRelationship).parse(input)
      assert.ok(status)
      assert.equal(value, expected)
    }
  })

  it('should transform instances', function() {
    const { status, value } = Instance.map(transformInstance).parse(
      'Person("Dave")'
    )
    assert.ok(status)
    assert.equal(value, '\t<concinst name="Dave" type="Person" />')
  })

  it('should transform facts', function() {
    const inputs = [
      [
        '"Dave" - speaks - "English"',
        '\t<relinst type="speaks" subject="Dave" object="English" cf="100" />'
      ],
      [
        '"Dave" - speaks - "English" (cf = 90)',
        '\t<relinst type="speaks" subject="Dave" object="English" cf="90" />'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Fact.map(transformFact).parse(input)
      assert.ok(status)
      assert.equal(value, expected)
    }
  })

  it('should transform condition rels', function() {
    const inputs = [
      [
        '%S - speaks - %LANG',
        '\t\t<condition rel="speaks" subject="%S" object="%LANG" weight="100" behaviour="mandatory" />'
      ],
      [
        '%S - speaks - %LANG (behaviour = optional)',
        '\t\t<condition rel="speaks" subject="%S" object="%LANG" weight="100" behaviour="optional" />'
      ],
      [
        '%S - speaks - %LANG (behaviour = optional, weight = 50)',
        '\t\t<condition rel="speaks" subject="%S" object="%LANG" weight="50" behaviour="optional" />'
      ]
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Condition.map(transformCondition).parse(input)
      assert.ok(status)
      assert.equal(value, expected)
    }
  })

  it.skip('should transform rules', function() {
    const inputs = [
      ['speaks {}', '<relinst type=speaks" cf="100">\n</relinst>']
    ]

    for (const [input, expected] of inputs) {
      const { status, value } = Rule.map(transformRule).parse(input)
      assert.ok(status)
      assert.equal(value, expected)
    }
  })
})
