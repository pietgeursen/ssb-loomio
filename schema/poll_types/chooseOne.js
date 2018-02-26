var schema = {
  type: 'object',
  required: ['type', 'maxStanceScore', 'choices'],
  properties: {
    type: {
      type: 'string',
      pattern: '^chooseOne'
    },
    maxStanceScore: {
      type: 'integer',
      minimum: 1,
      maximum: 1,
    },
    maxChoiceScore: {
      type: 'integer',
      minimum: 0,
      minimum: 1,
    },
    choices: {
      type: 'array',
    }
  }
}

module.exports = schema;
