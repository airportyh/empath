var fs = require('fs')
var jsdom = require('jsdom')

function detectAMD(code, callback){

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
      if(window.define.args){
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
