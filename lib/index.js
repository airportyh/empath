var fs = require('fs')
var path = require('path')
var detectMain = require('./detect_main')
var detectAMD = require('./detect_amd')
var detectCommonJS = require('./detect_commonjs')
var detectGlobals = require('./detect_globals')
var async = require('async')

module.exports = empath

function empath(dir, opts, callback){
  detectMain(dir, opts.verbose, function(err, mains){
    async.map(mains, function(main, callback){
      var mainpath = path.join(dir, main)  
      scanCode(dir, mainpath, function(err, result){
        result.main = main
        callback(err, result)
      })
    }, function(err, results){
      var winner = results.filter(function(r){
        return r.amd || r.commonjs || r.globals
      })[0]
      var rest = results.filter(function(r){
        return r !== winner
      })
      if (rest.length > 0){
        winner.rest = rest
      }
      callback(err, winner)
    })
  })
}

function scanCode(dir, mainpath, callback){
  fs.readFile(mainpath, function(err, code){
    detectAMD(dir, code, function(err, amd){
      detectCommonJS(dir, code, function(err, commonjs){
        detectGlobals(dir, code, function(err, globals){
          var result = {
            amd: amd.amd ? amd : null,
            commonjs: commonjs.commonjs ? commonjs : null,
            globals: globals.exports.length > 0 ? globals.exports : null
          }
          callback(err, result)
        })
      })
    })
  })
}