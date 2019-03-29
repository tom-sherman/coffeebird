const createAttrs = obj =>
  Object.entries(obj)
    .filter(([_, value]) => typeof value !== 'undefined' && value !== null)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

function transformConcept(concept) {
  let { name, options: { type = 'string', behaviour } = {} } = concept

  if (behaviour === 'mutuallyExclusive') {
    behaviour = 'mutually-exclusive'
  }

  return `\t<concept ${createAttrs({ name, type, behaviour })} />`
}

function transformRelationship(rel) {
  const {
    subject,
    name,
    object,
    options: {
      askable = 'all',
      plural = false,
      allowUnknown = false,
      canAdd,
      allowCf,
      firstForm,
      secondFormObject,
      secondFormSubject
    } = {}
  } = rel

  let xml = `\t<rel ${createAttrs({
    name,
    subject,
    object,
    plural,
    allowUnknown,
    askable,
    canAdd,
    allowCf
  })}`

  if (firstForm || secondFormObject || secondFormSubject) {
    xml += `>\n${transformQuestionWordings({
      firstForm,
      secondFormObject,
      secondFormSubject
    })}\n\t</rel>`
  } else {
    xml += ' />'
  }

  return xml
}

function transformQuestionWordings(questions) {
  const { firstForm, secondFormObject, secondFormSubject } = questions
  let questionTags = []

  if (firstForm) {
    questionTags.push(`\t\t<firstForm>${firstForm}</firstForm>`)
  }
  if (secondFormObject) {
    questionTags.push(
      `\t\t<secondFormObject>${secondFormObject}</secondFormObject>`
    )
  }
  if (secondFormSubject) {
    questionTags.push(
      `\t\t<secondFormSubject>${secondFormSubject}</secondFormSubject>`
    )
  }

  return questionTags.join('\n')
}

function transformInstance(instance) {
  const { name, type } = instance
  return `\t<concinst ${createAttrs({ name, type })} />`
}

function transformFact(fact) {
  const { subject, rel, object, options: { cf = 100 } = {} } = fact
  return `\t<relinst ${createAttrs({ type: rel, subject, object, cf })} />`
}

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

  return `\t<relinst ${createAttrs({
    type: rel,
    subject,
    object,
    cf,
    minimumRuleCertainty,
    alt,
    behaviour
  })}>\n${conditions.map(transformCondition).join('\n')}\n\t</relinst>`
}

function transformRuleBehaviour(behaviour) {
  const behaviourMap = {
    topDown: 'top-down',
    topDownStrict: 'top-down-strict'
  }

  return behaviourMap[behaviour]
}

function transformCondition(condition) {
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
  const { expression, weight = 100, behaviour = 'mandatory', alt } = condition
  return `\t\t<condition expression="${transformExpression(
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
  return `\t\t<condition expression="${transformExpression(
    expression
  )}" value="${transformValue(assignment)}" ${createAttrs({
    weight,
    behaviour,
    alt
  })} />`
}

function transformExpression(expr, transformed = '') {
  if (expr.left) {
    transformed += transformValue(expr.left) + ' '
  }
  if (expr.operator) {
    transformed += transformOperator(expr.operator) + ' '
  }
  if (expr.right && expr.right.operator) {
    return transformExpression(expr.right, transformed)
  }
  // At this point, either we have reached the end of the expression or the expression was a literal value.
  transformed += transformValue(expr.right ? expr.right : expr)

  return transformed
}

function transformOperator(operator) {
  const operatorMap = {
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '==': '=',
    '!=': 'is not equal to',
    '>=': 'gte',
    '<=': 'lte',
    '>': 'gt',
    '<': 'lt',
    '&&': 'and',
    '||': 'or'
  }
  return operatorMap[operator]
}

function transformValue(value) {
  if (value.name) {
    return '%' + value.name
  }
  return value
}

module.exports = {
  createAttrs,
  transformConcept,
  transformFact,
  transformInstance,
  transformRelationship,
  transformRule,
  transformCondition
}
