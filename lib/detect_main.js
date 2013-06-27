var fs = require('fs')
var path = require('path')
var Set = require('set')
var yesno = require('./strutils').yesno
require('colors')

function detectMain(dir, verbose, callback){
  new MainFinder(dir, verbose).search(callback)
}

function MainFinder(dir, verbose){
  this.dir = dir
  this.mains = new Set
  this.verbose = verbose
}

MainFinder.prototype.search = function(callback){
  var self = this
  self.getMain('bower.json', [mainProp], function(){
    self.getMain('component.json', [mainProp], function(){
      self.getMain('package.json', [jamMainProp, mainProp], function(){
        self.jsNamedSameAsDirExists(function(){
          self.indexJsExists(function(){
            callback(null, self.mains.get())
          })
        })
      })
    })
  })
}

MainFinder.prototype.getMain = function(filename, toTry, callback){
  var self = this
  var filepath = path.join(this.dir, filename)
  fs.readFile(filepath, function(err, content){
    if (self.verbose){
      var found = !err
      console.log(('Has ' + filename + '? ' + yesno(found)).grey)
    }
    try{
      var config = JSON.parse('' + content)
      toTry.forEach(function(fun){
        try{
          var result = fun(config)
          if (result){
            if (self.verbose){
              console.log(('Found main ' + result + ' in ' +
                filename).grey)
            }
            self.addResult(result)
          }else{
            if (self.verbose){
              console.log(('No main found in ' + filename).grey)
            }
          }
        }catch(e){ /* ignore/muffle */ }
      })
    }catch(e){ /* ignore */ }
    callback()
  })  
}

MainFinder.prototype.jsNamedSameAsDirExists = function(callback){
  var self = this
  var dir = this.dir
  var basename = path.basename(dir)
  var jsfilename = path.join(dir, basename + '.js')
  fs.stat(jsfilename, function(err, stat){
    if (stat && stat.isFile()){
      if (self.verbose){
        console.log(('Found file ' + jsfilename + '.').grey)
      }
      self.addResult(basename + '.js')
    }
    callback()
  })
}

MainFinder.prototype.indexJsExists = function(callback){
  var self = this
  var dir = this.dir
  var basename = path.basename(dir)
  var jsfilename = path.join(dir, 'index.js')
  fs.stat(jsfilename, function(err, stat){
    if (stat && stat.isFile()){
      if (self.verbose){
        console.log(('Found file ' + jsfilename + '.').grey)
      }
      self.addResult('index.js')
    }
    callback()
  })
}
MainFinder.prototype.addResult = function(result){
  var dir = this.dir
  var results = this.mains
  if (path.extname(result) !== '.js'){
    result += '.js'
  }
  var p = path.resolve(path.join(dir, result))
  p = path.relative(dir, p)
  results.add(p)
}

function asArray(thing){
  if (Array.isArray(thing)) return thing
  else return [thing]
}

function jamMainProp(config){
  return config.jam.main
}

function mainProp(config){
  return config.main
}

module.exports = detectMain