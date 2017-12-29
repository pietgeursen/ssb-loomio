var Validate = require('is-my-json-valid')

function create(){}

const schema = {}

const validate = Validate(schema, { verbose: true })

module.exports = {
  create,
  schema,
  validate
}
