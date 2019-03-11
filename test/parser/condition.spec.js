const assert = require('assert')
const {
  Condition,
  ConditionRel,
  ConditionExpr,
  ConditionVal,
  ConditionDictionary,
  ConditionSubjectObject
} = require('../../src/parser/condition')

describe('condition :: dictionary', function() {
  it('should parse valid dictionaries', function() {
    const validDictionaries = [
      ['', {}],
      ['()', {}],
      [
        '(behaviour = mandatory, weight = 100, alt = "Alt")',
        { behaviour: 'mandatory', weight: 100, alt: 'Alt' }
      ],
      [
        '(behaviour = mandatory, weight = 100)',
        { behaviour: 'mandatory', weight: 100 }
      ],
      ['(behaviour = mandatory)', { behaviour: 'mandatory' }],
      ['(weight = 100)', { weight: 100 }],
      ['(alt = "Alt text")', { alt: 'Alt text' }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = ConditionDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid dictionaries', function() {
    const invalidDictionaries = [
      '(alt)',
      '(behaviour=)',
      '(behaviour=test)',
      '(weight = "100")',
      '(alt = 100)',
      '(weight=behaviour)',
      'weight = 100'
    ]

    for (const input of invalidDictionaries) {
      assert.ok(!ConditionDictionary.parse(input).status)
    }
  })
})

describe('condition :: subject/object', function() {
  it('should parse valid subject/object', function() {
    const validSubjectsObjects = [
      ['0', 0],
      ['1', 1],
      ['134.333', 134.333],
      ['true', true],
      ['false', false],
      ['"true"', 'true'],
      ['"France"', 'France'],
      ['"1.5"', '1.5'],
      ['%FOO', { name: 'FOO' }],
      ['%FOO_BAR', { name: 'FOO_BAR' }]
    ]

    for (const [input, expected] of validSubjectsObjects) {
      const { status, value } = ConditionSubjectObject.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })
})

describe('condition', function() {
  const validConditionRels = [
    [
      '%S - speaks - %LANG',
      { subject: { name: 'S' }, rel: 'speaks', object: { name: 'LANG' } }
    ],
    [
      '%S - speaks - "English"',
      { subject: { name: 'S' }, rel: 'speaks', object: 'English' }
    ],
    [
      '"Dave" - speaks - %LANGUAGE',
      { subject: 'Dave', rel: 'speaks', object: { name: 'LANGUAGE' } }
    ],
    [
      '"Dave" - speaks - "English"',
      { subject: 'Dave', rel: 'speaks', object: 'English' }
    ],
    [
      '%PERSON - is aged - 28',
      { subject: { name: 'PERSON' }, rel: 'is aged', object: 28 }
    ],
    [
      '"Dave" - is eligible - true',
      { subject: 'Dave', rel: 'is eligible', object: true }
    ],
    [
      '%O - is eligible - false',
      { subject: { name: 'O' }, rel: 'is eligible', object: false }
    ]
  ]

  const validBooleanExpr = [
    ['%FOO > 5', {}],
    ['5 > %FOO', {}],
    ['%FOO >= 5', {}],
    ['%FOO < 5', {}],
    ['%FOO <= 5', {}],
    ['%FOO == 5', {}],
    ['%FOO != 5', {}],
    ['(%FOO > 5)', {}],
    ['%FOO == "bar"', {}],
    ['%FOO != "bar"', {}],
    ['%FOO', {}],
    ['true', {}],
    ['false', {}],
    ['true and false', {}],
    ['true or false', {}],
    ['%FOO == 3 or %FOO == 2', {}],
    ['%FOO == 3 and %FOO == 2', {}],
    ['%FOO == 3 and %BAR == 2', {}],
    ['%FOO and (%BAR or %BAZ)', {}],
    ['(%FOO == 1) and ((%BAR == 2) or (%BAZ == 3))', {}],
    ['(%FOO == 1) and ((%BAR == 2) or (%BAZ == 3)) == false', {}],
    ['%FOO != false', {}],
    ['false == %FOO', {}],
    ['%FOO == %BAR + 5', {}],
    ['%BAR + 5 == %FOO', {}]
  ]

  const validConditionVal = [
    ['%FOO = 1', {}],
    ['%FOO = 0', {}],
    ['%FOO = true', {}],
    ['%FOO = false', {}],
    ['%FOO = 1.1', {}],
    ['%FOO = "bar"', {}],
    ['%FOO = %BAR == 5', {}],
    ['%FOO = %BAR * 6', {}]
  ]

  it('should parse valid condition rels', function() {
    for (const [input, expected] of validConditionRels) {
      const { status, value } = ConditionRel.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })
})
