var test = require('tape')
var {poll, isPoll, response} = require('../');

test('test', function(t) {
  t.true(true)
  t.end()
})

test('create and validate an invalid dot vote', function(t) {
  pollType = {}
  var myPoll = poll("how many food", null, null, null, null, null, pollType)
  t.false(isPoll(myPoll))
  t.end()
})

test('create and validate a valid dot vote', function(t) {
  pollType = {type: 'dot', maxStanceScore: 10, choices: ['cats', 'dogs']}
  var myPoll = poll("how many food", null, null, null, null, null, pollType)
  t.true(isPoll(myPoll))
  t.end()
})
