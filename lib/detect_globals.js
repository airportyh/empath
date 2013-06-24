var fs = require('fs')
var jsdom = require('jsdom')
var esprima = require('esprima')

function arraySubtract(one, other){
  return one.filter(function(g){
    return other.indexOf(g) === -1
  })
}

function globalsAddedBy(fun){
  var globals = Object.keys(global)
  fun()
  var globals2 = Object.keys(global)
  var newGlobals = globals2.filter(function(g){
    return globals.indexOf(g) === -1
  })
  return newGlobals
}

function detectGlobals(name, code, callback){
  code = String(code)

  try{
    esprima.parse(code)
  }catch(e){
    return callback(e)
  }

  var pre = '__globals_before__ = Object.keys(window).concat(["__globals_before__"])'
  jsdom.env({
    html: '',
    src: [pre, code],
    done: function(errs, window){
      if (errs){
        callback(errs)
      }else{
        var newGlobals = arraySubtract(Object.keys(window), 
          window.__globals_before__)
        callback(null, {exports: newGlobals})
      }
    }
  })
}

module.exports = detectGlobals