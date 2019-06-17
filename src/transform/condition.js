const { createAttrs } = require('./shared')
const { transformValue } = require('./expression')

function transformCondition(condition) {
  const {
    subject,
    rel,
    object,
    options: { weight = 100, behaviour = 'mandatory', alt }
  } = condition
  if (condition.type === 'rel') {
    return transformConditionRel(condition)
  } else if (condition.type === 'expr') {
    return transformConditionExpr(condition)
  } else if (condition.type === 'val') {
    return transformConditionVal(condition)
  }
}

function transformConditionRel(condition) {
  const {
    subject,
    rel,
    object,
    options: { weight = 100, behaviour = 'mandatory', alt }
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
    options: { weight = 100, behaviour = 'mandatory', alt }
  } = condition
  return `\t\t<condition expression="${transformValue(
    expression
  )}" ${createAttrs({ weight, behaviour, alt })} />`
}

function transformConditionVal(condition) {
  const {
    expression,
    assignment,
    weight = 100,
    behaviour = 'mandatory',
    alt
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
