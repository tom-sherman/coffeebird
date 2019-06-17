/* global it, expect */
const { transpile } = require('../src/coffeebird')
const { loadExample } = require('./util')

it('should transpile examples', () => {
  const helloWorld = loadExample('hello-world.coffeebird')
  expect(transpile(helloWorld)).toMatchSnapshot()

  const helloWorldExtended = loadExample('hello-world-extended.coffeebird')
  expect(transpile(helloWorldExtended)).toMatchSnapshot()

  const comments = loadExample('comments.coffeebird')
  expect(transpile(comments)).toMatchSnapshot()

  const rules = loadExample('rules.coffeebird')
  expect(transpile(rules)).toMatchSnapshot()
})
