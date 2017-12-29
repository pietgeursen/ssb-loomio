var Validate = require('is-my-json-valid')
const { msgIdRegex, feedIdRegex, blobIdRegex } = require('ssb-ref')

function create(){}

const schema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'pollType'],
  properties: {
    type: {
      type: 'string',
      pattern: '^poll$'
    },
    pollType: {
      oneOf: [
        { $ref: '#/definitions/pollTypes/dot'},
        { $ref: '#/definitions/pollTypes/proposal'},
        { $ref: '#/definitions/pollTypes/rsvp'},
        { $ref: '#/definitions/pollTypes/meeting'},
        { $ref: '#/definitions/pollTypes/score'},
      ] 
    },
    text: { type: 'string' },
    mentions: {
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/mentions/message' },
              { $ref: '#/definitions/mentions/feed' },
              { $ref: '#/definitions/mentions/blob' }
            ]
          }
        }
      ]
    },
    recps: {
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/feedId' },
              { $ref: '#/definitions/mentions/feed' },
            ]
          }
        }
      ]
    }
  },
  definitions: {

    messageId: {
      type: 'string',
      pattern: msgIdRegex
    },
    feedId: {
      type: 'string',
      pattern: feedIdRegex
    },
    blobId: {
      type: 'string',
      pattern: blobIdRegex
    },
    pollTypes: {
      dot: {
        type: 'object', 
        required: ['maxStanceScore', 'options'],
        properties: {
          maxStanceScore: {
            type: 'integer',
            minimum: 0
          },
          maxChoiceScore: {
            type: 'integer',
            minimum: 0
          }, 
          options: {
            type: 'array',
          }
        }
      } 
    },
    mentions: {
      message: {
        type: 'object',
        required: ['link'],
        properties: {
          link: { $ref: '#/definitions/messageId'}
        }
      },
      feed: {
        type: 'object',
        required: ['link', 'name'],
        properties: {
          link: { $ref: '#/definitions/feedId'},
          name: { type: 'string' }
        }
      },
      blob: {
        type: 'object',
        required: ['link', 'name'],
        properties: {
          link: { $ref: '#/definitions/blobId'},
          name: { type: 'string' }
        }
      }

    }
  },
}
const validate = Validate(schema, { verbose: true })

module.exports = {
  create,
  schema,
  validate
}
