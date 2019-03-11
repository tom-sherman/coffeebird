const assert = require('assert')
const {
  transformConcept,
  transformRelationship,
  transformFact,
  transformInstance
} = require('../src/transform')
const { Concept, Rel, Instance, Fact } = require('../src/parser')

describe('transform', function() {
  it('should transform concepts', function() {
    const inputs = [
      ['concept Language', '<concept name="Language" type="string" />'],
      ['concept Language ()', '<concept name="Language" type="string" />'],
      ['concept Foo (type=string)', '<concept name="Foo" type="string" />'],
      ['concept Foo( type=truth )', '<concept name="Foo" type="truth" />'],
      ['concept Foo(\n\ttype=number\n)', '<concept name="Foo" type="number" />']
    ]

    for (const [ input, expected ] of inputs) {
      const { status, value } = Concept.map(transformConcept).parse(input)
      assert.ok(status)
      assert.equal(value, expected)
    }
  })

  it('should transform relationships', function() {
    const inputs = [
      [
        'rel Person - speaks - Language',
        '<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="all" />'
      ],
      [
        'rel Person - speaks - Language ()',
        '<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="all" />'
      ],
      [
        'rel Person - speaks - Language (askable=none)',
        '<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="none" />'
      ],
      [
        'rel Person - speaks - Language (\n\taskable=none,\n\tcanAdd=none\n)',
        '<rel name="speaks" subject="Person" object="Language" plural="false" allowUnknown="false" askable="none" canAdd="none" />'
      ]
    ]

    for (const [ input, expected ] of inputs) {
      const { status, value } = Rel.map(transformRelationship).parse(input)
      assert.ok(status)
      assert.equal(value, expected)
    }
  })

  it('should transform instances', function () {
    const { status, value } = Instance.map(transformInstance).parse('Person("Dave")')
    assert.ok(status)
    assert.equal(value, '<concinst name="Dave" type="Person" />')
  })

  it('should transform facts', function () {
    const inputs = [
      [ '"Dave" - speaks - "English"', '<relinst type="speaks" subject="Dave" object="English" cf="100" />' ],
      [ '"Dave" - speaks - "English" (cf = 90)', '<relinst type="speaks" subject="Dave" object="English" cf="90" />' ]
    ]

    for (const [ input, expected ] of inputs) {
      const { status, value } = Fact.map(transformFact).parse(input)
      assert.ok(status)
      assert.equal(value, expected)
    }
  })
})
