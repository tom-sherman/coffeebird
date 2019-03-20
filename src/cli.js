#!/usr/bin/env node
const fs = require('fs')
const { parse, transpile } = require('./coffeebird')

const argv = require('yargs')
  .command(['transpile [input]', '*'], 'transpile a file to RBLang', yargs => {
    yargs.positional('input', {
      describe: 'The file to transpile.'
    })
  })
  .option('output', {
    alias: 'o'
  }).argv

const file = fs.readFileSync(argv.input, { encoding: 'utf8' })

const transpiled = transpile(file)

if (argv.output) {
  fs.writeFileSync(argv.output, transpiled)
} else {
  console.log(transpiled)
}
