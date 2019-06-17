const { createAttrs } = require('./shared')

const transformRelationship = rel => {
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

const transformQuestionWordings = questions => {
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

module.exports = {
  transformQuestionWordings,
  transformRelationship
}
