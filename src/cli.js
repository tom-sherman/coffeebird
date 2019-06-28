#!/usr/bin/env node
const fs = require('fs')
const { transpile } = require('./coffeebird')

require('yargs')
  .usage('usage: $0 <command>')
  .command(
    ['transpile [input]', '*'],
    'transpile a file to RBLang',
    yargs => {
      yargs
        .positional('input', {
          describe: 'The file to transpile.'
        })
        .option('output', {
          alias: 'o'
        })
    },
    transpileCmd
  )
  .command(
    'convert-rblang [input]',
    'convert RBLang to Coffeebird',
    yargs => {
      yargs
        .positional('input', {
          describe: 'The file to convert.'
        })
        .option('output', {
          alias: 'o'
        })
    },
    convertCmd
  )
  .help('help')
  .wrap(null).argv

function transpileCmd(argv) {
  const file = fs.readFileSync(argv.input, { encoding: 'utf8' })

  const transpiled = transpile(file)

  if (argv.output) {
    fs.writeFileSync(argv.output, transpiled)
  } else {
    console.log(transpiled)
  }
}

function convertCmd(argv) {
  console.log(argv)
}
