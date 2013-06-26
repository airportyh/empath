#! /usr/bin/env node

require('colors')
var fs = require('fs')
var path = require('path')
var detectAMD = require('../lib/detect_amd')
var detectCommonJS = require('../lib/detect_commonjs')
var detectGlobals = require('../lib/detect_globals')
var detectMain = require('../lib/detect_main')
var indent = require('../lib/strutils').indent
var async = require('async')

var requireConfig = {paths: {}, shim: {}}
fs.readdir('components', function(err, dirs){
  if (err) return console.error(err)
  async.eachSeries(dirs, function(dir, next){
    var dirpath = path.join('components', dir)
    detectMain(dirpath , function(err, mains){
      async.filter(mains, function(main, callback){
        var mainpath = path.join(dirpath, main)
        var code = fs.readFileSync(mainpath)
        detectAMD(mainpath, code, function(err, amd){
          detectCommonJS(mainpath, code, function(err, commonjs){
            detectGlobals(mainpath, code, function(err, globals){
              var passed = !(!amd.amd && !commonjs.commonjs && globals.exports.length === 0)
              if (mainpath.match(/hogan/i)){
                console.log(mainpath, amd, commonjs, globals)
              }
              callback(passed)
            })
          })
        })
      }, function(mains){
        if (mains.length === 0){
          console.error(('No main found for ' + dirpath + ', skipping.').red)
          return next()
        }
        var main = mains[0]
        console.log('Main for ' + dir + ': ' + main)
        var mainpath = path.join(dirpath, main)
        console.log('mainpath: ' + mainpath)
        requireConfig.paths[dir] = mainpath.match(/^(.+)\.js$/)[1]
        var code = fs.readFileSync(mainpath)
        detectAMD(mainpath, code, function(err, amd){
          detectCommonJS(mainpath, code, function(err, commonjs){
            detectGlobals(mainpath, code, function(err, globals){
              if (!amd.amd && !commonjs.commonjs && globals.exports){
                requireConfig.shim[dir] = {exports: globals.exports[0]}
              }
              next()
            })
          })
        })
      })
    })
  }, function(err){
    var json = JSON.stringify(requireConfig, null, '  ')
    console.log('Config: ' + json)
    var configCode = 'require.config(' + json + ');'
    fs.writeFileSync('cajon.config.js', configCode)
    console.log('Wrote to cajon.config.js.')
  })
})