var assert = require('chai').assert
var detectGlobals = require('../lib/detect_globals')
var fs = require('fs')
var path = require('path')

suite('detect globals', function(){

  test('basic', function(done){
    check('global_export', function(err, result){
      assert(!err)
      assert.deepEqual(result.exports, ['foo'])
      done()
    })
  })

  test('syntax error', function(done){
    check('syntax_error', function(err, result){
      assert(err)
      done()
    })
  })

})

function check(filename, callback){
  var content = fs.readFileSync(path.join(__dirname, 'fixtures/scripts/' + filename + '.js'))
  detectGlobals(filename, content, callback)
}