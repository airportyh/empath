#! /usr/bin/env node

require('colors')
var fs = require('fs')
var path = require('path')
var detectAMD = require('../lib/detect_amd')
var detectCommonJS = require('../lib/detect_commonjs')
var detectGlobals = require('../lib/detect_globals')

var dir = process.argv[2]

console.log(('Searching for main in ' + dir).grey)
var main = findMainFrom(path.join(dir, 'bower.json'))
if (!main){
  main = findMainFrom(path.join(dir, 'component.json'))
}
if (!main){
  main = findMainFrom(path.join(dir, 'package.json'))
}

if (!main){
  console.error('main not found :('.red)
  process.exit(1)
}

if (Array.isArray(main)){
  main = main[0]
}
var mainpath = path.join(dir, main)
var contents = fs.readFileSync(mainpath)
detectAMD(main, contents, function(err, result){
  if (err){
    console.error(err)
  }
  console.log('Supports AMD?')
  console.log('  ' + yesno(result.amd, true))
  if (result.amd){
    if (result.dependencies.length > 0){
      console.log(('  dependencies: ' + result.dependencies.join(', ')).green)
    }
  }
  detectCommonJS(main, contents, function(err, result){
    if (err){
      console.error(err)
    }
    console.log('Supports CommonJS?')
    console.log('  ' + yesno(result.commonjs, true))
    if (result.commonjs){
      if (result.dependencies.length > 0){
        console.log(('  dependencies: ' + result.dependencies.join(', ')).green)
      }
      console.log(('  exports a ' + (typeof result.exports)).green)
    }
    detectGlobals(main, contents, function(err, result){
      console.log('Globals variables exported')
      console.log('  ' + result.exports.join(', ').green)
    })
  })
})

function findMainFrom(filepath){
  var exists = fs.existsSync(filepath)
  console.log(('has ' + filepath + '? ' + yesno(exists)).grey)
  if (exists){
    var config = JSON.parse(String(fs.readFileSync(filepath)))
    var main = (config.jam && config.jam.main) || config.main
    if (main){
      console.log(('Main found in ' + filepath + ': ' + main).green)
    }else{
      console.log(('No main found in ' + filepath).grey)
    }
  }
  return main
}

function yesno(bool, colored){
  if (colored) return bool ? 'yes'.green : 'no'.red
  else return bool ? 'yes' : 'no'
}