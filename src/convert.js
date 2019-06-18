const parse = require('rblang-parser')

const createDictionary = obj =>
  `(${Object.entries(obj)
    .filter(([_, value]) => typeof value !== 'undefined' && value !== null)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')})`

const transformConceptName = name => name.replace(/\s/g, '')

const transformConcept = ({ name, type, behaviour }) =>
  `concept ${transformConceptName(name)} ${createDictionary({
    type,
    behaviour
  })}`

const transformRelationship = ({
  name,
  subject,
  object,
  plural,
  allowUnknown,
  askable,
  canAdd
}) =>
  `rel ${subject} - ${name} - ${object} ${createDictionary({
    plural,
    allowUnknown,
    askable,
    canAdd
  })}`

const transformSubjectObject = value =>
  typeof value === 'string' ? `"${value}"` : String(value)

const transformInstance = ({ name, type }) =>
  `${transformConceptName(type)}(${transformSubjectObject(name)})`

const transformFact = ({ type, subject, object, cf }) =>
  `"${subject}" - ${type} - ${transformSubjectObject(
    object
  )} ${createDictionary({ cf })}`

const transformConditionRel = ({
  rel,
  subject,
  object,
  behaviour,
  weight,
  alt
}) =>
  `${transformSubjectObject(subject)} - ${rel} - ${transformSubjectObject(
    object
  )} ${createDictionary({ behaviour, weight: parseInt(weight || 100), alt })};`

const transformExpression = expression =>
  expression.replace(/mod\(([^)]+),([^)]+)\)/g, '($1) % ($2)')

const transformConditionExpression = ({ expression, behaviour, weight, alt }) =>
  `${transformExpression(expression)} ${createDictionary({
    behaviour,
    weight: parseInt(weight || 100),
    alt
  })};`

const transformConditionValue = ({
  expression,
  value,
  behaviour,
  weight,
  alt
}) =>
  `${value} = ${transformExpression(expression)} ${createDictionary({
    behaviour,
    weight: parseInt(weight || 100),
    alt
  })};`

const transformCondition = condition => {
  if (condition.value) {
    return transformConditionValue(condition)
  }
  if (condition.expression) {
    return transformConditionExpression(condition)
  }

  return transformConditionRel(condition)
}

const transformRule = ({
  subject,
  object,
  type,
  cf,
  behaviour,
  alt,
  conditions
}) =>
  `${typeof subject !== 'undefined' ? `${subject} - ` : ''}${type}${
    typeof object !== 'undefined' ? ` - ${object}` : ''
  } ${createDictionary(cf, behaviour, alt)} {\n${conditions
    .map(transformCondition)
    .join('\n\t')}\n}`

const convertXml = rblang => {
  const parsed = parse(rblang)
  return `
${parsed.concepts.map(transformConcept).join('\n')}

${parsed.relationships.map(transformRelationship).join('\n')}

${parsed.instances.map(transformInstance).join('\n')}

${parsed.facts.map(transformFact).join('\n')}

${parsed.rules.map(transformRule).join('\n\n')}
`.trim()
}

module.exports = {
  convertXml
}
