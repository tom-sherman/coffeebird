export function strStartsWith(str: string, test: string | RegExp): boolean {
  if (typeof test === 'string') {
    return str.startsWith(test)
  }

  const reStr = test.toString()
  // Insert start of string special char if it isn't there already
  const newRegex = reStr[1] === '^'
    ? test
    : new RegExp(`^${ reStr.slice(1, reStr.length - 1) }`)

  return newRegex.test(str)
}

/**
 * reports whether the rune is a space character as defined by Unicode's White Space property; in the Latin-1 space this is
 * `'\t', '\n', '\v', '\f', '\r', ' ', U+0085 (NEL), U+00A0 (NBSP).`
 */
export function isSpace (char: string) {
  const reWhitespace = /[\t\n\v\f\r \u{0085}\u{00A0}]/u
  return reWhitespace.test(char)
}
