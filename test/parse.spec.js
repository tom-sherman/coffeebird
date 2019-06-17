/* global it, expect */
const { CoffeebirdParser } = require('../src/coffeebird')
const { loadExample } = require('./util')

it('should parse comments at the end of the line', () => {
  const comments = loadExample('comments.coffeebird')
  const parse = () => CoffeebirdParser.tryParse(comments)
  expect(parse).not.toThrow()
  expect(parse()).toMatchSnapshot()
})
