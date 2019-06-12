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
  if (!Array.isArray(expr)) {
    transformed += transformValue(expr)
    return transformed
  }

  const [operator, ...operands] = expr
  const transformedOperator = transformOperator(operator)

  switch (operator) {
    case 'Multiply':
    case 'Divide':
    case 'Add':
    case 'Subtract':
    case 'GreaterThan':
    case 'LessThan':
    case 'GreaterThanOrEqual':
    case 'LessThanOrEqual':
    case 'Equal':
    case 'NotEqual':
    case 'And':
    case 'Or':
    case 'Equal': {
      const left = transformExpression(operands[0])
      const right = transformExpression(operands[1])
      transformed += `${left} ${transformedOperator} ${right}`
      break
    }

    default: {
      throw new Error(`"${operator}" is not a valid operator.`)
    }
  }

  // Rainbird doesn't follow the natural order of operations but instead goes left to right (madness, I know!)
  // Each sub expression is wrapped in () so we can preserve order of operations
  // Unfortunately this introduces a lot of redundant parens eg. 1 + 2 + 3 => ((1 + 2) + 3)
  return `(${transformed})`
}

function transformOperator(operator) {
  const operatorMap = {
    Add: '+',
    Subtract: '-',
    Multiply: '*',
    Divide: '/',
    Equal: '=',
    NotEqual: 'is not equal to',
    GreaterThanOrEqual: 'gte',
    LessThanOrEqual: 'lte',
    GreaterThan: 'gt',
    LessThan: 'lt',
    And: 'and',
    Or: 'or'
  }
  return operatorMap[operator]
}

function transformValue(value) {
  if (typeof value === 'string') {
    // We only need to worry about escaping single quotes currently as Rainbird cannot handle escaped backslashes.
    value = value.replace("'", "\\'")
    // Transform escaped quotes to literal quotes.
    value = value.replace('\\"', '"')
    return `'${value}'`
  }
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
