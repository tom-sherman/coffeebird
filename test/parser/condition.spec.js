const assert = require('assert')
const {
  Condition,
  ConditionRel,
  ConditionExpr,
  ConditionVal,
  ConditionDictionary,
  ConditionSubjectObject
} = require('../../src/parser/condition')
const { Expression } = require('../../src/parser/condition/condition-expr')

describe('condition :: dictionary', function() {
  it('should parse valid dictionaries', function() {
    const validDictionaries = [
      ['()', {}],
      [
        '(behaviour: mandatory, weight: 100, alt: "Alt")',
        { behaviour: 'mandatory', weight: 100, alt: 'Alt' }
      ],
      [
        '(behaviour: mandatory, weight: 100)',
        { behaviour: 'mandatory', weight: 100 }
      ],
      ['(behaviour: mandatory)', { behaviour: 'mandatory' }],
      ['(weight: 100)', { weight: 100 }],
      ['(alt: "Alt text")', { alt: 'Alt text' }]
    ]

    for (const [input, expected] of validDictionaries) {
      const { status, value } = ConditionDictionary.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should not parse invalid dictionaries', function() {
    const invalidDictionaries = [
      '(alt:)',
      '(alt)',
      '(behaviour=)',
      '(behaviour=test)',
      '(weight = "100")',
      '(alt = 100)',
      '(weight=behaviour)',
      'weight = 100',
      ''
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
      {
        type: 'rel',
        subject: { name: 'S' },
        rel: 'speaks',
        object: { name: 'LANG' },
        options: {}
      }
    ],
    [
      '%S - speaks - %LANG (behaviour: optional, weight: 20)',
      {
        type: 'rel',
        subject: { name: 'S' },
        rel: 'speaks',
        object: { name: 'LANG' },
        options: { weight: 20, behaviour: 'optional' }
      }
    ],
    [
      '%S - speaks - "English"',
      {
        type: 'rel',
        subject: { name: 'S' },
        rel: 'speaks',
        object: 'English',
        options: {}
      }
    ],
    [
      '"Dave" - speaks - %LANGUAGE',
      {
        type: 'rel',
        subject: 'Dave',
        rel: 'speaks',
        object: { name: 'LANGUAGE' },
        options: {}
      }
    ],
    [
      '"Dave" - speaks - "English"',
      {
        type: 'rel',
        subject: 'Dave',
        rel: 'speaks',
        object: 'English',
        options: {}
      }
    ],
    [
      '%PERSON - is aged - 28',
      {
        type: 'rel',
        subject: { name: 'PERSON' },
        rel: 'is aged',
        object: 28,
        options: {}
      }
    ],
    [
      '"Dave" - is eligible - true',
      {
        type: 'rel',
        subject: 'Dave',
        rel: 'is eligible',
        object: true,
        options: {}
      }
    ],
    [
      '%O - is eligible - false',
      {
        type: 'rel',
        subject: { name: 'O' },
        rel: 'is eligible',
        object: false,
        options: {}
      }
    ]
  ]

  const validExpressions = [
    ['%FOO > 5', { left: { name: 'FOO' }, operator: '>', right: 5 }],
    ['5 > %FOO', { left: 5, operator: '>', right: { name: 'FOO' } }],
    ['%FOO >= 5.3', { left: { name: 'FOO' }, operator: '>=', right: 5.3 }],
    ['%FOO < 5', { left: { name: 'FOO' }, operator: '<', right: 5 }],
    ['%FOO <= 5', { left: { name: 'FOO' }, operator: '<=', right: 5 }],
    ['%FOO == 5', { left: { name: 'FOO' }, operator: '==', right: 5 }],
    ['%FOO != 5', { left: { name: 'FOO' }, operator: '!=', right: 5 }],
    ['%FOO == "bar"', { left: { name: 'FOO' }, operator: '==', right: 'bar' }],
    ['%FOO != "bar"', { left: { name: 'FOO' }, operator: '!=', right: 'bar' }],
    ['%FOO', { name: 'FOO' }],
    ['true', true],
    ['false', false],
    ['true && false', { left: true, operator: '&&', right: false }],
    ['true || false', { left: true, operator: '||', right: false }],
    [
      '%FOO == 3 || %FOO == 2',
      {
        left: {
          name: 'FOO'
        },
        operator: '==',
        right: {
          left: 3,
          operator: '||',
          right: {
            left: {
              name: 'FOO'
            },
            operator: '==',
            right: 2
          }
        }
      }
    ],
    [
      '%FOO == 3 && %FOO == 2',
      {
        left: {
          name: 'FOO'
        },
        operator: '==',
        right: {
          left: 3,
          operator: '&&',
          right: {
            left: {
              name: 'FOO'
            },
            operator: '==',
            right: 2
          }
        }
      }
    ],
    [
      '%FOO == 3 && %BAR == 2',
      {
        left: {
          name: 'FOO'
        },
        operator: '==',
        right: {
          left: 3,
          operator: '&&',
          right: {
            left: {
              name: 'BAR'
            },
            operator: '==',
            right: 2
          }
        }
      }
    ],
    // ['%FOO && (%BAR || %BAZ)', {}],
    // ['(%FOO > 5)', {}],
    // ['(%FOO == 1) && ((%BAR == 2) || (%BAZ == 3))', {}],
    // ['(%FOO == 1) && ((%BAR == 2) || (%BAZ == 3)) == false', {}],
    [
      '%FOO != false',
      {
        left: {
          name: 'FOO'
        },
        operator: '!=',
        right: false
      }
    ],
    [
      'false == %FOO',
      {
        left: false,
        operator: '==',
        right: {
          name: 'FOO'
        }
      }
    ],
    [
      '%FOO == %BAR + 5',
      {
        left: {
          name: 'FOO'
        },
        operator: '==',
        right: {
          left: {
            name: 'BAR'
          },
          operator: '+',
          right: 5
        }
      }
    ],
    [
      '%BAR + 5 == %FOO',
      {
        left: {
          name: 'BAR'
        },
        operator: '+',
        right: {
          left: 5,
          operator: '==',
          right: {
            name: 'FOO'
          }
        }
      }
    ]
  ]

  const validConditionExpr = [
    [
      '%FOO == 3 (weight: 50)',
      {
        expression: { left: { name: 'FOO' }, operator: '==', right: 3 },
        options: { weight: 50 }
      }
    ],
    [
      '%FOO == 3',
      {
        expression: { left: { name: 'FOO' }, operator: '==', right: 3 },
        options: {}
      }
    ],
    [
      '%FOO == 3 ()',
      {
        expression: { left: { name: 'FOO' }, operator: '==', right: 3 },
        options: {}
      }
    ]
  ]

  const validConditionVal = [
    ['%FOO = 1', { assignment: { name: 'FOO' }, expression: 1, options: {} }],
    ['%FOO = 0', { assignment: { name: 'FOO' }, expression: 0, options: {} }],
    [
      '%FOO = true',
      { assignment: { name: 'FOO' }, expression: true, options: {} }
    ],
    [
      '%FOO = false',
      { assignment: { name: 'FOO' }, expression: false, options: {} }
    ],
    [
      '%FOO = 1.1',
      { assignment: { name: 'FOO' }, expression: 1.1, options: {} }
    ],
    [
      '%FOO = "bar"',
      { assignment: { name: 'FOO' }, expression: 'bar', options: {} }
    ],
    [
      '%FOO = %BAR == 5',
      {
        assignment: { name: 'FOO' },
        expression: { left: { name: 'BAR' }, operator: '==', right: 5 },
        options: {}
      }
    ],
    [
      '%FOO = %BAR * 6',
      {
        assignment: { name: 'FOO' },
        expression: { left: { name: 'BAR' }, operator: '*', right: 6 },
        options: {}
      }
    ]
  ]

  it('should parse valid condition rels', function() {
    for (const [input, expected] of validConditionRels) {
      const { status, value } = ConditionRel.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should parse valid expressions', function() {
    for (const [input, expected] of validExpressions) {
      const { status, value } = Expression.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should parse valid condition expressions', function() {
    for (const [input, expected] of validConditionExpr) {
      const { status, value } = ConditionExpr.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it('should parse valid condition values', function() {
    for (const [input, expected] of validConditionVal) {
      const { status, value } = ConditionVal.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })

  it.skip('should parse valid conditions', function() {
    const validConditions = [
      ...validConditionRels,
      ...validConditionExpr,
      ...validConditionVal
    ]

    for (const [input, expected] of validConditions) {
      const { status, value } = Condition.parse(input)
      assert.ok(status)
      assert.deepEqual(value, expected)
    }
  })
})
