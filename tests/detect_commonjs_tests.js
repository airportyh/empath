var assert = require('chai').assert
var detectCommonJS = require('../lib/detect_commonjs')
var fs = require('fs')
var path = require('path')

suite('detect commonjs', function(){

  test('module.exports', function(done){
    check('commonjs_basic', function(err, result){
      assert(!err)
      assert.equal(result.commonjs, true)
      assert.equal(typeof result.exports, 'function')
      done()
    })
  })

  test('exports properties', function(done){
    check('commonjs_properties', function(err, result){
      assert.equal(result.commonjs, true)
      assert.equal(result.exports.foo, 'foo')
      assert.equal(result.exports.bar, 'bar')
      done()
    })
  })

  test('with dependencies', function(done){
    check('commonjs_deps', function(err, result){
      assert.equal(result.commonjs, true)
      assert.deepEqual(result.dependencies, ['jquery', 'underscore'])
      done()
    })
  })

  'global_export amd_basic amd_with_commonjs amd_with_deps'.split(' ').forEach(function(filename){
    test('no commonjs - ' + filename, function(done){
      check(filename, function(err, result){
        assert.isFalse(result.commonjs)
        done()
      })
    })
  })

  test('syntax error', function(done){
    check('syntax_error', function(err){
      assert(err)
      done()
    })
  })

})

function check(filename, callback){
  var content = fs.readFileSync(path.join(__dirname, 'fixtures/scripts/' + filename + '.js'))
  detectCommonJS(filename, content, callback)
}