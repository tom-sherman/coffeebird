const ow = require('ow')

const INFIX_OPERATOR_MAP = {
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

const OPERATOR_FUNCTION_MAP = {
  Modulus: 'mod',
  Exponentiate: 'pow'
}

function transformExpression(expr, transformed = '') {
  const [operator, ...operands] = expr

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
    case 'Or': {
      const left = transformValue(operands[0])
      const right = transformValue(operands[1])
      transformed += `${left} ${INFIX_OPERATOR_MAP[operator]} ${right}`
      break
    }

    case 'Negate': {
      transformed += `-${transformValue(operands[0])}`
      break
    }

    case 'Not': {
      transformed += `${transformValue(operands[0])} = false`
      break
    }

    case 'Modulus':
    case 'Exponentiate': {
      transformed += `${OPERATOR_FUNCTION_MAP[operator]}(${transformValue(
        operands[0]
      )}, ${transformValue(operands[1])})`
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

const transformValue = value => {
  if (Array.isArray(value)) {
    return transformExpression(value)
  }

  if (typeof value === 'string') {
    // We only need to worry about escaping single quotes currently as Rainbird cannot handle escaped backslashes.
    value = value.replace("'", "\\'")
    // Transform escaped quotes to literal quotes.
    value = value.replace('\\"', '"')
    return `'${value}'`
  }
  if (value && value.name) {
    return '%' + value.name
  }
  if (value && value.function) {
    return transformFunction(value)
  }
  return value
}

const defaultFunctionTransform = fn => {
  return `${fn.function}(${fn.arguments.map(transformValue).join(', ')})`
}

function transformFunction(fn) {
  const matchedFunction = RBLANG_FUNCTIONS[String(fn.function)]
  if (typeof matchedFunction === 'undefined') {
    throw new Error(`CB001: "${fn.function}" is not a function.`)
  }

  matchedFunction.validate(fn)

  return matchedFunction.transform(fn)
}

const functionArguments = args => ow.object.exactShape({ ...args })

const functionValidator = shape => ow.create(ow.object.exactShape(shape))

const variable = ow.object.exactShape({ name: ow.string })

const variableOrExpression = ow.any(variable, ow.number, ow.array.minLength(2))
const variableOrString = ow.any(variable, ow.string)

const RBLANG_FUNCTIONS = {
  countRelationshipInstances: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('countRelationshipInstances'),
      arguments: functionArguments([
        variableOrString,
        ow.string,
        variableOrString
      ])
    })
  },
  sumObjects: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('sumObjects'),
      arguments: functionArguments([
        variableOrString,
        ow.string,
        ow.string.equals('*')
      ])
    })
  },
  isSubset: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('isSubset'),
      arguments: functionArguments([
        variableOrString,
        ow.string,
        variableOrString,
        variableOrString,
        ow.string,
        variableOrString
      ])
    })
  },
  min: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('min'),
      arguments: ow.array.ofType(variableOrExpression)
    })
  },
  max: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('max'),
      arguments: ow.array.ofType(variableOrExpression)
    })
  },
  round: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('round'),
      arguments: functionArguments([
        variableOrExpression,
        ow.any(variableOrExpression, ow.undefined)
      ])
    })
  },
  ceil: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('ceil'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  floor: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('floor'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  abs: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('abs'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  sqrt: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('sqrt'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  factorial: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('factorial'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  tan: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('tan'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  csc: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('csc'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  cot: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('cot'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  sec: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('sec'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  atan: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('atan'),
      arguments: functionArguments([variableOrExpression])
    })
  },
  now: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('now'),
      arguments: ow.array.maxLength(0)
    })
  },
  today: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('today'),
      arguments: ow.array.maxLength(0)
    })
  },
  addDays: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('addDays'),
      arguments: functionArguments([variableOrString, variableOrExpression])
    })
  },
  addWeeks: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('addWeeks'),
      arguments: functionArguments([variableOrString, variableOrExpression])
    })
  },
  addMonths: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('addMonths'),
      arguments: functionArguments([variableOrString, variableOrExpression])
    })
  },
  addYears: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('addYears'),
      arguments: functionArguments([variableOrString, variableOrExpression])
    })
  },
  dayOfWeek: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('dayOfWeek'),
      arguments: functionArguments([variableOrString])
    })
  },
  dayOfMonth: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('dayOfMonth'),
      arguments: functionArguments([variableOrString])
    })
  },
  dayOfYear: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('dayOfYear'),
      arguments: functionArguments([variableOrString])
    })
  },
  monthOfYear: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('monthOfYear'),
      arguments: functionArguments([variableOrString])
    })
  },
  year: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('year'),
      arguments: functionArguments([variableOrString])
    })
  },
  daysBetween: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('daysBetween'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  },
  weeksBetween: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('weeksBetween'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  },
  monthsBetween: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('monthsBetween'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  },
  yearsBetween: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('yearsBetween'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  },
  secondsBetween: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('secondsBetween'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  },
  minutesBetween: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('minutesBetween'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  },
  hoursBetween: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('hoursBetween'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  },
  isBeforeDate: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('isBeforeDate'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  },
  isAfterDate: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('isAfterDate'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  },
  isSameDate: {
    transform: defaultFunctionTransform,
    validate: functionValidator({
      function: ow.string.equals('isSameDate'),
      arguments: functionArguments([variableOrString, variableOrString])
    })
  }
}

module.exports = {
  defaultFunctionTransform,
  RBLANG_FUNCTIONS,
  transformFunction,
  transformValue
}
