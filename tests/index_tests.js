var assert = require('chai').assert
var detectMain = require('../lib/detect_main')
var fs = require('fs')
var path = require('path')
var empath = require('../lib/index')

suite('empath', function(){

  test('sniffs directory', function(done){
    check('complete', function(err, result){
      assert(!err)
      assert.equal(result.main, 'index.js')
      assert.ok(result.amd)
      assert.ok(result.commonjs)
      assert.deepEqual(result.globals, ['hello'])
      done()
    })
  })

  test('d3 special case', function(done){
    check('d3', function(err, result){
      assert(!err)
      assert.equal(result.main, 'd3.js')
      assert(!result.amd)
      assert(!result.commonjs)
      assert.deepEqual(result.globals, ['d3'])
      assert.equal(result.rest.length, 2)
      done()
    })
  })

})

function check(dir, callback){
  var dir = path.join(__dirname,
      'fixtures/directories/' + dir)
  empath(dir, false, callback)
}