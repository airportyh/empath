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
  }, function(err){
    var json = JSON.stringify(requireConfig, null, '  ')
    console.log('Config: ' + json)
    var configCode = 'require.config(' + json + ');'
    fs.writeFileSync('cajon.config.js', configCode)
    console.log('Wrote to cajon.config.js.')
  })
})
/*
console.log(('Searching for main in ' + dir).grey)
detectMain(dir, function(err, mains){
  console.log('Candidates for main: ')
  console.log(indent(mains.join('\n').green))
  if (!mains.length === 0){
    console.error('main not found :('.red)
    process.exit(1)
  }
  var main = mains[0]
  detectModuleSystem(dir, main, function(){
  })
})

function detectModuleSystem(dir, main, callback){
  var mainpath = path.join(dir, main)
  var contents = fs.readFileSync(mainpath)
  detectAMD(main, contents, function(err, result){
    if (err){
      console.error(err)
    }
    console.log('  Supports AMD?')
    console.log('    ' + yesno(result.amd, true))
    if (result.amd){
      if (result.dependencies.length > 0){
        console.log(('    dependencies: ' + result.dependencies.join(', ')).green)
      }
    }
    detectCommonJS(main, contents, function(err, result){
      if (err){
        console.error(err)
      }
      console.log('  Supports CommonJS?')
      console.log('    ' + yesno(result.commonjs, true))
      if (result.commonjs){
        if (result.dependencies.length > 0){
          console.log(('    dependencies: ' + result.dependencies.join(', ')).green)
        }
        console.log(('    exports a ' + (typeof result.exports)).green)
      }
      detectGlobals(main, contents, function(err, result){
        console.log('  Globals variables exported')
        if (result.exports.length > 0){
          console.log('    ' + (result.exports.join(', ')).green)
        }else{
          console.log('    none'.red)
        }
        callback()
      })
    })
  })
}

function yesno(bool, colored){
  if (colored) return bool ? 'yes'.green : 'no'.red
  else return bool ? 'yes' : 'no'
}
*/