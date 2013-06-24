var fs = require('fs')
var jsdom = require('jsdom')
var esprima = require('esprima')

function detectAMD(name, code, callback){

  code = String(code)

  try{
    // check for syntax errors because jsdom doesn't
    // throw on syntax errors for some reason
    esprima.parse(code)
  }catch(e){
    return callback(e)
  }

  jsdom.env({
    html: '',
    src: [';(' + pre + '());', code],
    done: function(errs, window){
      if (errs){
        callback(errs)
      }else if(window.define.args){
        var result = {
          amd: true, 
          dependencies: window.define.dependencies}
        callback(null, result)
      }else{
        callback(null, {
          amd: false
        })
      }

    }
  })

  function pre(){
    var result = {}

    function require(lib){
      define.dependencies.push(lib)
    }
    var module = {
      exports: {}
    }

    function define(){
      var first = arguments[0]
      if (Array.isArray(first)){
        define.dependencies = first
      }
      if (typeof first === 'function'){
        first(require, module.exports, module)
      }
      define.args = Array.prototype.slice.apply(arguments)
    }

    define.amd = {}
    define.dependencies = []

    window.define = define
  }
}

module.exports = detectAMD
