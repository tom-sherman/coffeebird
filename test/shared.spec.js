const assert = require('assert')
const { Num, Int, Str, Bool, Comment } = require('../src/shared')


describe('shared :: Literals', function () {
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

  const validInts = [
    [ '1', 1 ],
    [ '01', 1 ],
    [ '0', 0 ],
    [ '123', 123 ]
  ]

  const validNumbers = [
    ...validInts,
    [ '0.1', 0.1 ],
    [ '0.1000', 0.1 ],
    [ '123.100200', 123.100200 ],
    [ '00123.100200', 123.100200 ],
  ]

  describe('Num', function () {
    it('should parse valid numbers', function () {
      for (const [ input, expected ] of validNumbers) {
        assert.equal(Num.parse(input).value, expected)
      }
    })

    it('should not parse invalid numbers', function () {
      for (const input of invalidNumbers) {
        assert.equal(Num.parse(input).status, false, `${ JSON.stringify(input) } is not a valid number but has been parsed as one`)
      }
    })
  })

  describe('Int', function () {
    it('should parse integers', function () {
      for (const [ input, expected ] of validInts) {
        assert.equal(Int.parse(input).value, expected)
      }
    })

    it('should not parse invalid numbers', function () {
      for (const input of invalidNumbers) {
        assert.equal(Int.parse(input).status, false, `${ JSON.stringify(input) } is not a valid number but has been parsed as one`)
      }
    })

    it('should not parse decimals and floats', function () {
      const numbersNotInt = [
        '1.0',
        '1.1',
        '25.555555'
      ]

      for (const input of numbersNotInt) {
        assert.equal(Int.parse(input).status, false, `${ JSON.stringify(input) } is not an integer but has been parsed as one`)
      }
    })
  })

  describe('Str', function () {
    it('should parse valid strings', function () {
      const validStrings = [
        '""',
        '"foo"',
        '"   "'
      ]

      for (const string of validStrings) {
        assert.ok(Str.parse(string).status)
      }
    })

    it('should not parse invalid strings', function () {
      const invalidStrings = [
        '',
        '0',
        'null',
        '"no close',
        '"',
        'no open"'
      ]

      for (const string of invalidStrings) {
        assert.ok(!Str.parse(string).status)
      }
    })
  })

  describe('Bool', function () {
    it('should parse valid booleans', function () {
      assert.ok(Bool.parse('true'))
      assert.ok(Bool.parse('false'))
    })

    it('should not parse non booleans', function () {
      const nonBools = [
        '',
        '0',
        '1',
        'maybe',
        '()',
        '!!',
        ' '
      ]

      for (const input of nonBools) {
        assert.ok(!Bool.parse(input).status)
      }
    })
  })
})

describe('shared :: Comments', function () {
  it('should parse valid comments', function () {
    const validComments = [
      [ '//', '' ],
      [ '//foo', 'foo' ],
      [ '// foo', ' foo' ],
      [ '// ', ' ' ]
    ]

    for (const [ input, expected ] of validComments) {
      assert.ok(Comment.parse(input).status)
      assert.equal(Comment.parse(input).value, expected)
    }
  })

  it('should not parse invalid comments', function () {
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
      assert.ok(!Comment.parse(input).status)
    }
  })
})
