var fs = require('fs')
var jsdom = require('jsdom')
var deepEqual = require('deep-equal')

function detectCommonJS(code, callback){

  code = String(code)

  jsdom.env({
    html: '',
    src: [';(' + pre + '());', code],
    done: function(errs, window){
      errs = errs || window.document.errors
      if (errs){
        var err = errs[0].data.error
        if (err.constructor.name === 'SyntaxError'){
          return callback(err)
        }
      }
      var requires = window.require._requires
      var module = window.module
      if (deepEqual(module.exports, {})){
        callback(null, {commonjs: false})
      }else{
        callback(null, {
          commonjs: true, 
          exports: module.exports,
          dependencies: requires
        })
      }
    
    }
  })

  function pre(){

    var modules = {}
    var module = {
      exports: {}
    }

    var requires = []
    function require(lib){
      requires.push(lib)
      return modules[lib]
    }
    require._requires = requires

    window.require = require
    window.exports = module.exports
    window.module = module

  }

}

module.exports = detectCommonJS
