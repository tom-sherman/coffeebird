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

console.log(
  convertXml(`
<?xml version="1.0" encoding="utf-8"?>
<rbl:kb xmlns:rbl="http://rbl.io/schema/RBLang">
	<concept name="Player" type="string" />
	<concept name="Card" type="string" />
	<concept name="Suit" type="string" />
	<concept name="Card Rank" type="string" />
	<concept name="Hand" type="string" />

    <rel name="has card" subject="Player" object="Card" plural="true" allowUnknown="false" askable="secondFormObject" />
	<rel name="card has suit" subject="Card" object="Suit" plural="false" allowUnknown="false" askable="all" />
	<rel name="card has rank" subject="Card" object="Card Rank" plural="false" allowUnknown="false" askable="all" />
	<rel name="has possible hand" subject="Player" object="Hand" plural="true" allowUnknown="false" askable="none" />

	<concinst name="Hearts" type="Suit" />
	<concinst name="Diamonds" type="Suit" />
	<concinst name="Clubs" type="Suit" />
	<concinst name="Spades" type="Suit" />
	<concinst name="A" type="Card Rank" />
    <concinst name="2" type="Card Rank" />
    <concinst name="3" type="Card Rank" />
    <concinst name="4" type="Card Rank" />
    <concinst name="5" type="Card Rank" />
    <concinst name="6" type="Card Rank" />
    <concinst name="7" type="Card Rank" />
    <concinst name="8" type="Card Rank" />
    <concinst name="9" type="Card Rank" />
    <concinst name="10" type="Card Rank" />
    <concinst name="J" type="Card Rank" />
    <concinst name="Q" type="Card Rank" />
    <concinst name="K" type="Card Rank" />
    <concinst name="1" type="Card" />
    <concinst name="2" type="Card" />
    <concinst name="3" type="Card" />
    <concinst name="4" type="Card" />
    <concinst name="5" type="Card" />
    <concinst name="6" type="Card" />
    <concinst name="7" type="Card" />
    <concinst name="8" type="Card" />
    <concinst name="9" type="Card" />
    <concinst name="10" type="Card" />
    <concinst name="11" type="Card" />
    <concinst name="12" type="Card" />
    <concinst name="13" type="Card" />
    <concinst name="14" type="Card" />
    <concinst name="15" type="Card" />
    <concinst name="16" type="Card" />
    <concinst name="17" type="Card" />
    <concinst name="18" type="Card" />
    <concinst name="19" type="Card" />
    <concinst name="20" type="Card" />
    <concinst name="21" type="Card" />
    <concinst name="22" type="Card" />
    <concinst name="23" type="Card" />
    <concinst name="24" type="Card" />
    <concinst name="25" type="Card" />
    <concinst name="26" type="Card" />
    <concinst name="27" type="Card" />
    <concinst name="28" type="Card" />
    <concinst name="29" type="Card" />
    <concinst name="30" type="Card" />
    <concinst name="31" type="Card" />
    <concinst name="32" type="Card" />
    <concinst name="33" type="Card" />
    <concinst name="34" type="Card" />
    <concinst name="35" type="Card" />
    <concinst name="36" type="Card" />
    <concinst name="37" type="Card" />
    <concinst name="38" type="Card" />
    <concinst name="39" type="Card" />
    <concinst name="40" type="Card" />
    <concinst name="41" type="Card" />
    <concinst name="42" type="Card" />
    <concinst name="43" type="Card" />
    <concinst name="44" type="Card" />
    <concinst name="45" type="Card" />
    <concinst name="46" type="Card" />
    <concinst name="47" type="Card" />
    <concinst name="48" type="Card" />
    <concinst name="49" type="Card" />
    <concinst name="50" type="Card" />
    <concinst name="51" type="Card" />
    <concinst name="52" type="Card" />
    <concinst name="Straight flush" type="Hand" />
    <concinst name="Four of a kind" type="Hand" />
    <concinst name="Full house" type="Hand" />
    <concinst name="Flush" type="Hand" />
    <concinst name="Straight" type="Hand" />
    <concinst name="Three of a kind" type="Hand" />
    <concinst name="Two pair" type="Hand" />
    <concinst name="One pair" type="Hand" />
    <concinst name="High Card" type="Hand" />

    <relinst type="card has suit" subject="1" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="1" object="A" cf="100" />
    <relinst type="card has suit" subject="2" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="2" object="2" cf="100" />
    <relinst type="card has suit" subject="3" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="3" object="3" cf="100" />
    <relinst type="card has suit" subject="4" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="4" object="4" cf="100" />
    <relinst type="card has suit" subject="5" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="5" object="5" cf="100" />
    <relinst type="card has suit" subject="6" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="6" object="6" cf="100" />
    <relinst type="card has suit" subject="7" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="7" object="7" cf="100" />
    <relinst type="card has suit" subject="8" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="8" object="8" cf="100" />
    <relinst type="card has suit" subject="9" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="9" object="9" cf="100" />
    <relinst type="card has suit" subject="10" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="10" object="10" cf="100" />
    <relinst type="card has suit" subject="11" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="11" object="J" cf="100" />
    <relinst type="card has suit" subject="12" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="12" object="Q" cf="100" />
    <relinst type="card has suit" subject="13" object="Hearts" cf="100" />
    <relinst type="card has rank" subject="13" object="K" cf="100" />
    <relinst type="card has suit" subject="14" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="14" object="A" cf="100" />
    <relinst type="card has suit" subject="15" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="15" object="2" cf="100" />
    <relinst type="card has suit" subject="16" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="16" object="3" cf="100" />
    <relinst type="card has suit" subject="17" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="17" object="4" cf="100" />
    <relinst type="card has suit" subject="18" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="18" object="5" cf="100" />
    <relinst type="card has suit" subject="19" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="19" object="6" cf="100" />
    <relinst type="card has suit" subject="20" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="20" object="7" cf="100" />
    <relinst type="card has suit" subject="21" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="21" object="8" cf="100" />
    <relinst type="card has suit" subject="22" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="22" object="9" cf="100" />
    <relinst type="card has suit" subject="23" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="23" object="10" cf="100" />
    <relinst type="card has suit" subject="24" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="24" object="J" cf="100" />
    <relinst type="card has suit" subject="25" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="25" object="Q" cf="100" />
    <relinst type="card has suit" subject="26" object="Diamonds" cf="100" />
    <relinst type="card has rank" subject="26" object="K" cf="100" />
    <relinst type="card has suit" subject="27" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="27" object="A" cf="100" />
    <relinst type="card has suit" subject="28" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="28" object="2" cf="100" />
    <relinst type="card has suit" subject="29" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="29" object="3" cf="100" />
    <relinst type="card has suit" subject="30" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="30" object="4" cf="100" />
    <relinst type="card has suit" subject="31" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="31" object="5" cf="100" />
    <relinst type="card has suit" subject="32" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="32" object="6" cf="100" />
    <relinst type="card has suit" subject="33" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="33" object="7" cf="100" />
    <relinst type="card has suit" subject="34" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="34" object="8" cf="100" />
    <relinst type="card has suit" subject="35" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="35" object="9" cf="100" />
    <relinst type="card has suit" subject="36" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="36" object="10" cf="100" />
    <relinst type="card has suit" subject="37" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="37" object="J" cf="100" />
    <relinst type="card has suit" subject="38" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="38" object="Q" cf="100" />
    <relinst type="card has suit" subject="39" object="Clubs" cf="100" />
    <relinst type="card has rank" subject="39" object="K" cf="100" />
    <relinst type="card has suit" subject="40" object="Spades" cf="100" />
    <relinst type="card has rank" subject="40" object="A" cf="100" />
    <relinst type="card has suit" subject="41" object="Spades" cf="100" />
    <relinst type="card has rank" subject="41" object="2" cf="100" />
    <relinst type="card has suit" subject="42" object="Spades" cf="100" />
    <relinst type="card has rank" subject="42" object="3" cf="100" />
    <relinst type="card has suit" subject="43" object="Spades" cf="100" />
    <relinst type="card has rank" subject="43" object="4" cf="100" />
    <relinst type="card has suit" subject="44" object="Spades" cf="100" />
    <relinst type="card has rank" subject="44" object="5" cf="100" />
    <relinst type="card has suit" subject="45" object="Spades" cf="100" />
    <relinst type="card has rank" subject="45" object="6" cf="100" />
    <relinst type="card has suit" subject="46" object="Spades" cf="100" />
    <relinst type="card has rank" subject="46" object="7" cf="100" />
    <relinst type="card has suit" subject="47" object="Spades" cf="100" />
    <relinst type="card has rank" subject="47" object="8" cf="100" />
    <relinst type="card has suit" subject="48" object="Spades" cf="100" />
    <relinst type="card has rank" subject="48" object="9" cf="100" />
    <relinst type="card has suit" subject="49" object="Spades" cf="100" />
    <relinst type="card has rank" subject="49" object="10" cf="100" />
    <relinst type="card has suit" subject="50" object="Spades" cf="100" />
    <relinst type="card has rank" subject="50" object="J" cf="100" />
    <relinst type="card has suit" subject="51" object="Spades" cf="100" />
    <relinst type="card has rank" subject="51" object="Q" cf="100" />
    <relinst type="card has suit" subject="52" object="Spades" cf="100" />
    <relinst type="card has rank" subject="52" object="K" cf="100" />


    <relinst type="has possible hand" object="One pair" cf="100">
        <condition rel="has card" subject="%S" object="%CARD1" weight="100" behaviour="mandatory" />
        <condition rel="has card" subject="%S" object="%CARD2" weight="100" behaviour="mandatory" />
        <condition expression="%CARD1 is not equal to %CARD2" weight="100" behaviour="mandatory"  />
        <condition rel="card has rank" subject="%CARD1" object="%RANK" weight="100" behaviour="mandatory" />
        <condition rel="card has rank" subject="%CARD2" object="%RANK" weight="100" behaviour="mandatory" />
    </relinst>

    <relinst type="has possible hand" object="Four of a kind" cf="100">
        <condition rel="has card" subject="%S" object="%CARD1" weight="100" behaviour="mandatory" />
        <condition rel="has card" subject="%S" object="%CARD2" weight="100" behaviour="mandatory" />
        <condition rel="has card" subject="%S" object="%CARD3" weight="100" behaviour="mandatory" />
        <condition rel="has card" subject="%S" object="%CARD4" weight="100" behaviour="mandatory" />
        <condition expression="(%CARD1 is not equal to %CARD2) and (%CARD1 is not equal to %CARD3) and (%CARD1 is not equal to %CARD4)" weight="100" behaviour="mandatory"  />
        <condition expression="(%CARD2 is not equal to %CARD3) and (%CARD2 is not equal to %CARD4)" weight="100" behaviour="mandatory"  />
        <condition expression="(%CARD3 is not equal to %CARD4)" weight="100" behaviour="mandatory"  />
        <condition rel="card has rank" subject="%CARD1" object="%RANK" weight="100" behaviour="mandatory" />
        <condition rel="card has rank" subject="%CARD2" object="%RANK" weight="100" behaviour="mandatory" />
        <condition rel="card has rank" subject="%CARD3" object="%RANK" weight="100" behaviour="mandatory" />
        <condition rel="card has rank" subject="%CARD4" object="%RANK" weight="100" behaviour="mandatory" />
    </relinst>

    <relinst type="has possible hand" object="Three of a kind" cf="100">
        <condition rel="has card" subject="%S" object="%CARD1" weight="100" behaviour="mandatory" />
        <condition rel="has card" subject="%S" object="%CARD2" weight="100" behaviour="mandatory" />
        <condition rel="has card" subject="%S" object="%CARD3" weight="100" behaviour="mandatory" />
        <condition expression="(%CARD1 is not equal to %CARD2) and (%CARD1 is not equal to %CARD3)" weight="100" behaviour="mandatory"  />
        <condition expression="(%CARD2 is not equal to %CARD3)" weight="100" behaviour="mandatory"  />
        <condition rel="card has rank" subject="%CARD1" object="%RANK" weight="100" behaviour="mandatory" />
        <condition rel="card has rank" subject="%CARD2" object="%RANK" weight="100" behaviour="mandatory" />
        <condition rel="card has rank" subject="%CARD3" object="%RANK" weight="100" behaviour="mandatory" />
    </relinst>

    <relinst type="has possible hand" object="Two pair" cf="100">
        <condition rel="has card" subject="%S" object="%CARD1" weight="100" behaviour="mandatory" />
        <condition rel="has card" subject="%S" object="%CARD2" weight="100" behaviour="mandatory" />
        <condition expression="%CARD1 is not equal to %CARD2" weight="100" behaviour="mandatory"  />
        <condition rel="card has rank" subject="%CARD1" object="%RANK1" weight="100" behaviour="mandatory" />
        <condition rel="card has rank" subject="%CARD2" object="%RANK1" weight="100" behaviour="mandatory" />
        <condition rel="has card" subject="%S" object="%CARD3" weight="100" behaviour="mandatory" />
        <condition rel="has card" subject="%S" object="%CARD4" weight="100" behaviour="mandatory" />
        <condition expression="%CARD3 is not equal to %CARD4" weight="100" behaviour="mandatory"  />
        <condition rel="card has rank" subject="%CARD1" object="%RANK2" weight="100" behaviour="mandatory" />
        <condition rel="card has rank" subject="%CARD2" object="%RANK2" weight="100" behaviour="mandatory" />
        <condition expression="%RANK1 is not equal to %RANK2" weight="100" behaviour="mandatory"  />
    </relinst>



</rbl:kb>
`)
)
