import { Lexer } from './lexer'

;(async () => {
  const lex = new Lexer({ path: './package.json' })
  try {
    for await (const token of lex.tokens()) {
      console.log(token)
    }
  } catch (e) {
    console.error(e)
  }
})()
