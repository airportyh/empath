var assert = require('chai').assert
var detectMain = require('../lib/detect_main')
var fs = require('fs')
var path = require('path')

suite('detect main', function(){

  test('bower.json', function(done){
    get('bower', function(err, main){
      assert.deepEqual(main, ['blah.js'])
      done()
    })
  })

  test('component.json', function(done){
    get('component', function(err, main){
      assert.deepEqual(main, ['foo.js'])
      done()
    })
  })

  test('package.json', function(done){
    get('package', function(err, main){
      assert.deepEqual(main, ['bar.js'])
      done()
    })
  })

  test('jam_config has priority over package.json top level', function(done){
    get('jam', function(err, main){
      assert.deepEqual(main, ['bar.js', 'foo.js'])
      done()
    })
  })

  test('get <dirname>.js', function(done){
    get('dirname', function(err, main){
      assert.deepEqual(main, ['dirname.js'])
      done()
    })
  })

  test('get index.js', function(done){
    get('index_js', function(err, main){
      assert.deepEqual(main, ['index.js'])
      done()
    })
  })

  test('all choices', function(done){
    get('all_choices', function(err, main){
      assert.deepEqual(main, [
        'bower.js',
        'component.js',
        'package_jam.js',
        'package.js',
        'all_choices.js',
        'index.js'
      ])
      done()
    })
  })

  test('dedup', function(done){
    get('dedup', function(err, main){
      assert.deepEqual(main, ['index.js'])
      done()
    })
  })

})

function get(name, callback){
  var dirpath = path.join(__dirname, 'fixtures/directories/' + name)
  detectMain(dirpath, false, callback)
}