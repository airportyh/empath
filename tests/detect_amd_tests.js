var assert = require('chai').assert
var detectAMD = require('../lib/detect_amd')
var fs = require('fs')
var path = require('path')

suite('detect amd', function(){

  test('basic', function(done){
    check('amd_basic', function(err, result){
      assert(result)
      assert.equal(result.amd, true)
      done()
    })
  })

  test('with dependencies', function(done){
    check('amd_with_deps', function(err, result){
      assert(result)
      assert.equal(result.amd, true)
      assert.deepEqual(result.dependencies, ['jquery', 'underscore'])
      done()
    })
  })

  test('commonjs shim', function(done){
    check('amd_with_commonjs', function(err, result){
      assert(result)
      assert.equal(result.amd, true)
      assert.deepEqual(result.dependencies, ['jquery', 'underscore'])
      done()
    })
  })

  'global_export commonjs_basic'.split(' ').forEach(function(filename){
    test('no amd - ' + filename, function(done){
      check(filename, function(err, result){
        assert(result, 'has result')
        assert.equal(result.amd, false)
        done()
      })
    })
  })

  test('error', function(done){
    check('syntax_error', function(err, result){
      assert.match(err, /SyntaxError/)
      done()
    })
  })

})


function check(filename, callback){
  var content = fs.readFileSync(path.join(__dirname, 'fixtures/scripts/' + filename + '.js'))
  detectAMD(filename, content, callback)
}