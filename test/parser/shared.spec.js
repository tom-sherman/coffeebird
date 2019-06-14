/* global describe, it, expect */
const {
  Num,
  Int,
  Str,
  Bool,
  Comment,
  Variable
} = require('../../src/parser/shared')

describe('shared :: Literals', () => {
  const invalidNumbers = [
    '',
    ' ',
    '\0',
    '\t',
    'foo',
    '0-0',
    '0..7',
    '£50.50',
    '50ml',
    'undefined',
    'null'
  ]

  const validInts = [['1', 1], ['01', 1], ['0', 0], ['123', 123]]

  const validNumbers = [
    ...validInts,
    ['0.1', 0.1],
    ['0.1000', 0.1],
    ['123.100200', 123.1002],
    ['00123.100200', 123.1002]
  ]

  describe('Num', () => {
    it('should parse valid numbers', () => {
      for (const [input, expected] of validNumbers) {
        expect(Num.parse(input).value).toBeCloseTo(expected, 10)
      }
    })

    it('should not parse invalid numbers', () => {
      for (const input of invalidNumbers) {
        expect(Num.parse(input).status).toBe(false)
      }
    })
  })

  describe('Int', () => {
    it('should parse integers', () => {
      for (const [input, expected] of validInts) {
        expect(Int.parse(input).value).toBe(expected)
      }
    })

    it('should not parse invalid numbers', () => {
      for (const input of invalidNumbers) {
        expect(Int.parse(input).status).toBe(false)
      }
    })

    it('should not parse decimals and floats', () => {
      const numbersNotInt = ['1.0', '1.1', '25.555555']

      for (const input of numbersNotInt) {
        expect(Int.parse(input).status).toBe(false)
      }
    })
  })

  describe('Str', () => {
    it('should parse valid strings', () => {
      const validStrings = [['""', ''], ['"foo"', 'foo'], ['"   "', '   ']]

      for (const [input, expected] of validStrings) {
        const { status, value } = Str.parse(input)
        expect(status).toBe(true)
        expect(value).toBe(expected)
      }
    })

    it('should not parse invalid strings', () => {
      const invalidStrings = ['', '0', 'null', '"no close', '"', 'no open"']

      for (const string of invalidStrings) {
        expect(Str.parse(string).status).toBe(false)
      }
    })
  })

  describe('Bool', () => {
    it('should parse valid booleans', () => {
      const trueParsed = Bool.parse('true')
      expect(trueParsed.status).toBe(true)
      expect(trueParsed.value).toBe(true)

      const falseParsed = Bool.parse('false')
      expect(falseParsed.status).toBe(true)
      expect(falseParsed.value).toBe(false)
    })

    it('should not parse non booleans', () => {
      const nonBools = ['', '0', '1', 'maybe', '()', '!!', ' ']

      for (const input of nonBools) {
        expect(Bool.parse(input).status).toBe(false)
      }
    })
  })
})

describe('shared :: Comments', () => {
  it('should parse valid comments', () => {
    const validComments = [
      ['//', ''],
      ['//foo', 'foo'],
      ['// foo', ' foo'],
      ['// ', ' ']
    ]

    for (const [input, expected] of validComments) {
      const { status, value } = Comment.parse(input)
      expect(status).toBe(true)
      expect(value).toBe(expected)
    }
  })

  it('should not parse invalid comments', () => {
    const invalidComments = [
      '/ hello',
      'hello // test',
      '0',
      '',
      '/ / hello',
      '/ /',
      '/'
    ]

    for (const input of invalidComments) {
      expect(Comment.parse(input).status).toBe(false)
    }
  })
})

describe('shared :: Variables', () => {
  it('should parse valid variables', () => {
    const validVars = [
      ['%FOO', { name: 'FOO' }],
      ['%FOO_BAR', { name: 'FOO_BAR' }],
      ['%_FOO_BAR', { name: '_FOO_BAR' }]
    ]

    for (const [input, expected] of validVars) {
      const { status, value } = Variable.parse(input)
      expect(status).toBe(true)
      expect(value).toEqual(expected)
    }
  })

  it('should not parse invalid variables', () => {
    const invalidVars = [
      '',
      ' ',
      '0',
      '%',
      '%FOO-%BAR',
      '%%',
      '%foo',
      '%FOO_%BAR',
      'FOO',
      '% FOO',
      '%FOO1',
      '%Foo'
    ]

    for (const input of invalidVars) {
      expect(Variable.parse(input).status).toBe(false)
    }
  })
})
