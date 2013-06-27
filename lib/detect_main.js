var fs = require('fs')
var path = require('path')
var Set = require('set')
require('colors')

function detectMain(dir, callback){
  var mains = new Set
  getMain(dir, 'bower.json', [mainProp], mains, function(){
    getMain(dir, 'component.json', [mainProp], mains, function(){
      getMain(dir, 'package.json', [jamMainProp, mainProp], mains, function(){
        jsNamedSameAsDirExists(dir, mains, function(){
          indexJsExists(dir, mains, function(){
            callback(null, mains.get())
          })
        })
      })
    })
  })
}

function asArray(thing){
  if (Array.isArray(thing)) return thing
  else return [thing]
}

detectMain.logEnabled = false

function getMain(dir, filename, toTry, results, callback){
  var filepath = path.join(dir, filename)
  fs.readFile(filepath, function(err, content){
    if (detectMain.logEnabled){
      var found = !err
      console.log(('has ' + filename + '? ' + yesno(found)).grey)
    }
    try{
      var config = JSON.parse('' + content)
      toTry.forEach(function(fun){
        try{
          var result = fun(config)
          if (result){
            if (detectMain.logEnabled){
              console.log(('found main ' + result + ' in ' +
                filename).grey)
            }
            addResult(dir, results, result)
          }
        }catch(e){ /* ignore/muffle */ }
      })
    }catch(e){ /* ignore */ }
    callback(null, results)
  })  
}

function jamMainProp(config){
  return config.jam.main
}

function mainProp(config){
  return config.main
}

function jsNamedSameAsDirExists(dir, results, callback){
  var basename = path.basename(dir)

  var jsfilename = path.join(dir, basename + '.js')
  fs.stat(jsfilename, function(err, stat){
    if (stat && stat.isFile()){
      if (detectMain.logEnabled){
        console.log(('Found ' + basename + '.js' + '.').grey)
      }
      addResult(dir, results, basename + '.js')
    }
    callback(null, results)
  })
}

function indexJsExists(dir, results, callback){
  var basename = path.basename(dir)
  var jsfilename = path.join(dir, 'index.js')
  fs.stat(jsfilename, function(err, stat){
    if (stat && stat.isFile()){
      if (detectMain.logEnabled){
        console.log(('Found index.js.').grey)
      }
      addResult(dir, results, 'index.js')
    }
    callback(null, results)
  })
}

function yesno(bool, colored){
  if (colored) return bool ? 'yes'.green : 'no'.red
  else return bool ? 'yes' : 'no'
}

function addResult(dir, results, result){
  if (path.extname(result) !== '.js'){
    result += '.js'
  }
  var p = path.resolve(path.join(dir, result))
  p = path.relative(dir, p)
  results.add(p)
}
module.exports = detectMain