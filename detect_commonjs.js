var fs = require('fs')

function globalsAddedBy(fun){
  var globals = Object.keys(global)
  fun()
  var globals2 = Object.keys(global)
  var newGlobals = globals2.filter(function(g){
    return globals.indexOf(g) === -1
  })
  return newGlobals
}

var modules = {}

function runInCleanContext(name, code){
  var code = 'with(arguments[0]){\n' + String(code) + '\n}'
  var f = new Function(code)
  var requires = []
  function require(lib){
    requires.push(lib)
    return modules[lib]
  }
  var module = {
    exports: {}
  }
  f({require: require, module: module, exports: module.exports})
  var msg = [name]
  if (requires.length > 0){
    msg.push('requires')
    msg.push(requires.join(', '))
  }
  if (module.exports){
    msg.push('exports a')
    msg.push(typeof module.exports)
    modules[name] = module.exports
  }
  console.log.apply(console, msg)
}

function loadFile(name, callback){
  fs.readFile(name + '.js', function(err, contents){
    if (err) return callback(err)
    runInCleanContext(name, contents)
    if (callback) callback(null)
  })
}

loadFile('underscore', function(){
  loadFile('backbone')
})
