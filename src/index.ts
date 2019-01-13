import { Lexer } from './lexer'

;(async () => {
  const lex = new Lexer({ path: './package.json' })
  for await (const token of lex.tokens()) {
    console.log(token)
  }
})().catch(err => console.error(err))
