/* global describe, it, expect */
const {
  Condition,
  ConditionRel,
  ConditionExpr,
  ConditionVal,
  ConditionDictionary,
  ConditionSubjectObject
} = require('../../src/parser/condition')
const { Expression } = require('../../src/parser/condition/condition-expr')

describe('condition :: dictionary', () => {
  it('should parse valid dictionaries', () => {
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
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should not parse invalid dictionaries', () => {
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
      expect(ConditionDictionary.parse(input).status).toBe(false)
    }
  })
})

describe('condition :: subject/object', () => {
  it('should parse valid subject/object', () => {
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
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })
})

describe('condition', () => {
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

  const validConditionExpr = [
    [
      '%FOO == 3 (weight: 50)',
      {
        expression: ['Equal', { name: 'FOO' }, 3],
        type: 'expr',
        options: { weight: 50 }
      }
    ],
    [
      '%FOO == 3',
      {
        expression: ['Equal', { name: 'FOO' }, 3],
        type: 'expr',
        options: {}
      }
    ],
    [
      '%FOO == 3 ()',
      {
        expression: ['Equal', { name: 'FOO' }, 3],
        type: 'expr',
        options: {}
      }
    ],
    [
      '(2 + 3) * 4 (weight: 50)',
      {
        expression: ['Multiply', ['Add', 2, 3], 4],
        type: 'expr',
        options: { weight: 50 }
      }
    ],
    [
      '((2 + 3) * 4) (weight: 50)',
      {
        expression: ['Multiply', ['Add', 2, 3], 4],
        type: 'expr',
        options: { weight: 50 }
      }
    ],
    [
      '((2 + 3) * 4) ()',
      {
        expression: ['Multiply', ['Add', 2, 3], 4],
        type: 'expr',
        options: {}
      }
    ]
  ]

  const validConditionVal = [
    [
      '%FOO = 1',
      { assignment: { name: 'FOO' }, expression: 1, type: 'val', options: {} }
    ],
    [
      '%FOO = 0',
      { assignment: { name: 'FOO' }, expression: 0, type: 'val', options: {} }
    ],
    [
      '%FOO = true',
      {
        assignment: { name: 'FOO' },
        expression: true,
        type: 'val',
        options: {}
      }
    ],
    [
      '%FOO = false',
      {
        assignment: { name: 'FOO' },
        expression: false,
        type: 'val',
        options: {}
      }
    ],
    [
      '%FOO = 1.1',
      { assignment: { name: 'FOO' }, expression: 1.1, type: 'val', options: {} }
    ],
    [
      '%FOO = "bar"',
      {
        assignment: { name: 'FOO' },
        expression: 'bar',
        type: 'val',
        options: {}
      }
    ],
    [
      '%FOO = %BAR == 5',
      {
        assignment: { name: 'FOO' },
        expression: ['Equal', { name: 'BAR' }, 5],
        type: 'val',
        options: {}
      }
    ],
    [
      '%FOO = %BAR * 6',
      {
        assignment: { name: 'FOO' },
        expression: ['Multiply', { name: 'BAR' }, 6],
        type: 'val',
        options: {}
      }
    ]
  ]

  it('should parse valid condition rels', () => {
    for (const [input, expected] of validConditionRels) {
      const { status, value } = ConditionRel.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should parse valid condition expressions', () => {
    for (const [input, expected] of validConditionExpr) {
      const { status, value } = ConditionExpr.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should parse valid condition values', () => {
    for (const [input, expected] of validConditionVal) {
      const { status, value } = ConditionVal.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should parse valid conditions', () => {
    const validConditions = [
      ...validConditionRels,
      ...validConditionExpr,
      ...validConditionVal
    ]

    for (const [input, expected] of validConditions) {
      const { status, value } = Condition.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })
})
