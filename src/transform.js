const createAttrs = obj =>
  Object.entries(obj)
    .filter(([_, value]) => typeof value !== 'undefined' && value !== null)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

function transformConcept(concept) {
  const { name, options: { type = 'string', behaviour } = {} } = concept

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
  const {
    subject,
    rel,
    object,
    conditions,
    options: { cf = 100, minimumRuleCertainty, alt } = {}
  } = rule
  return `\t<relinst ${createAttrs({
    type: rel,
    subject,
    object,
    cf,
    minimumRuleCertainty,
    alt
  })}>\n${conditions.map(transformCondition).join('\n')}\n\t</relinst>`
}

function transformCondition(condition) {
  if (condition.type === 'rel') {
    return transformConditionRel(condition)
  } else if (
    condition.type === 'expr' &&
    condition.expression.operator === '='
  ) {
    return transformConditionVal(condition)
  } else if (condition.type === 'expr') {
    return transformConditionExpr(condition)
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
  return `<condition expression="${transformExpression(
    expression
  )}" ${createAttrs({ weight, behaviour })} />`
}

function transformConditionVal(condition) {
  const { expression, weight = 100, behaviour = 'mandatory', alt } = condition
  return `<condition expression="${transformExpression(
    expression
  )}" value="${transformValue(expression.left)}" ${createAttrs({
    weight,
    behaviour
  })} />`
}

function transformExpression(expr) {}

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
