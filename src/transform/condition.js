const { createAttrs } = require('./shared')
const { transformValue } = require('./expression')

function transformCondition(condition) {
  const {
    options: { weight = 100, behaviour = 'mandatory', alt }
  } = condition

  if (condition.type === 'rel') {
    return transformConditionRel({
      ...condition,
      options: { weight, behaviour, alt }
    })
  } else if (condition.type === 'expr') {
    return transformConditionExpr({
      ...condition,
      options: { weight, behaviour, alt }
    })
  } else if (condition.type === 'val') {
    return transformConditionVal({
      ...condition,
      options: { weight, behaviour, alt }
    })
  }
}

function transformConditionRel(condition) {
  const {
    subject,
    rel,
    object,
    options: { weight, behaviour, alt }
  } = condition

  return `\t\t<condition ${createAttrs({
    rel,
    subject: transformValue(subject),
    object: transformValue(object),
    weight,
    behaviour,
    alt
  })} />`
}

function transformConditionExpr(condition) {
  const {
    expression,
    options: { weight, behaviour, alt }
  } = condition

  return `\t\t<condition expression="${transformValue(
    expression
  )}" ${createAttrs({ weight, behaviour, alt })} />`
}

function transformConditionVal(condition) {
  const {
    expression,
    assignment,
    options: { weight, behaviour, alt }
  } = condition

  return `\t\t<condition expression="${transformValue(
    expression
  )}" value="${transformValue(assignment)}" ${createAttrs({
    weight,
    behaviour,
    alt
  })} />`
}

module.exports = {
  transformCondition
}
