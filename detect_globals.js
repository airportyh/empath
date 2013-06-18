var fs = require('fs')
var jsdom = require('jsdom')

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

function runInCleanContext(code, callback){
  var pre = '__globals_before__ = Object.keys(window).concat(["__globals_before__"])'
  jsdom.env({
    html: '',
    src: [pre, String(code)],
    done: function(errs, window){
      if (errs){
        console.error(errs)
      }else{
        var newGlobals = arraySubtract(Object.keys(window), 
          window.__globals_before__)
        callback(null, newGlobals)
      }
    }
  })
}

function loadFile(name, callback){
  fs.readFile(name + '.js', function(err, contents){
    if (err) return callback(err)

    runInCleanContext(contents, function(errs, newGlobals){
      console.log(name, 'exports globals:', newGlobals.join(', '))
    })
    
    if (callback) callback(null)
  })
}

/*loadFile('underscore', function(){
  loadFile('backbone')
})*/


loadFile('knockout')

