var Validate = require('is-my-json-valid')
const { msgIdRegex, feedIdRegex, blobIdRegex } = require('ssb-ref')

function create(text, root, branch, mentions, recps, channel, pollType){
  var content = { type: 'poll', text, pollType}
  if (root) {
    root = link(root)
    if (!root)
      throw new Error('root is not a valid link')
    content.root = root
  }
  if (branch) {
    if (!root)
      throw new Error('root is not a valid link')
    branch = Array.isArray(branch) ? branch.map(link) : link(branch)
    if (!branch)
      throw new Error('branch is not a valid link')
    content.branch = branch
  }
  if (mentions && (!Array.isArray(mentions) || mentions.length)) {
    mentions = links(mentions)
    if (!mentions || !mentions.length)
      throw new Error('mentions are not valid links')
    content.mentions = mentions
  }
  if (recps && (!Array.isArray(recps) || recps.length)) {
    recps = links(recps)
    if (!recps || !recps.length)
      throw new Error('recps are not valid links')
    content.recps = recps
  }
  if (channel) {
    if (typeof channel !== 'string')
      throw new Error('channel must be a string')
    content.channel = channel
  }

  return content
}

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
        { $ref: '#/definitions/pollTypes/score'},
        //{ $ref: '#/definitions/pollTypes/rsvp'},
        //{ $ref: '#/definitions/pollTypes/meeting'},
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
      type: 'object',
      dot: {
        type: 'object',
        required: ['type', 'maxStanceScore', 'choices'],
        properties: {
          type: {
            type: 'string',
            pattern: '^dot$'
          },
          maxStanceScore: {
            type: 'integer',
            minimum: 0
          },
          maxChoiceScore: {
            type: 'integer',
            minimum: 0
          },
          choices: {
            type: 'array',
          }
        }
      },
      proposal: {
        type: 'object',
        required: ['type', 'proposal'],
        properties: {
          type: {
            type: 'string',
            pattern: '^proposal$'
          },
          proposal: {
            type: 'string',
          }
        }
      },
      score: {
        type: 'object',
        required: ['type', 'maxChoiceScore', 'choices'],
        properties: {
          type: {
            type: 'string',
            pattern: '^score$'
          },
          maxChoiceScore: {
            type: 'integer',
            minimum: 2
          },
          choices: {
            type: 'array',
          }
        }
      },
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
