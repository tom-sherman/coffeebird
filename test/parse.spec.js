/* global it, expect */
const { CoffeebirdParser } = require('../src/coffeebird')
const { loadExample } = require('./util')

it('should parse comments', () => {
  const comments = loadExample('comments.coffeebird')
  const parse = () => CoffeebirdParser.tryParse(comments)
  expect(parse).not.toThrow()
  expect(parse()).toMatchSnapshot()
})

it('should parse all types of rules', () => {
  const rules = loadExample('rules.coffeebird')
  const parse = () => CoffeebirdParser.tryParse(rules)
  expect(parse).not.toThrow()
  expect(parse()).toMatchSnapshot()
})
