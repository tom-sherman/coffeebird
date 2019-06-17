const { createAttrs } = require('./shared')
const { transformCondition } = require('./condition')

function transformRule(rule) {
  let {
    subject,
    rel,
    object,
    conditions,
    options: { cf = 100, minimumRuleCertainty, alt, behaviour } = {}
  } = rule

  if (behaviour) {
    behaviour = transformRuleBehaviour(behaviour)
  }

  // TODO: Catch errors thrown from transforming conditions with invalid function calls

  return `\t<relinst ${createAttrs({
    type: rel,
    subject,
    object,
    cf,
    minimumRuleCertainty,
    alt,
    behaviour
  })}>\n${conditions
    .map(cond => transformCondition(cond.value ? cond.value : cond))
    .join('\n')}\n\t</relinst>`
}

function transformRuleBehaviour(behaviour) {
  const behaviourMap = {
    topDown: 'top-down',
    topDownStrict: 'top-down-strict'
  }

  return behaviourMap[behaviour]
}

module.exports = {
  transformRule,
  transformRuleBehaviour
}
