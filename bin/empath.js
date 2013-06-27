#! /usr/bin/env node

require('colors')
var program = require('commander')
var fs = require('fs')
var path = require('path')
var empath = require('../lib/index')
var strutils = require('../lib/strutils')
var yesno = strutils.yesno
var indent = strutils.indent
var renderList = strutils.renderList

program
  .version(require(__dirname + '/../package').version)
  .usage(['<file or directory>'])
  .option('-v, --verbose', 'verbose output')

program.parse(process.argv)

var dir_or_file = program.args[0]

if (!dir_or_file){
  program.outputHelp()
}else{
  main(dir_or_file, program.verbose)
}

function main(dir_or_file, verbose){
  try{
    var stat = fs.statSync(dir_or_file)
    if (stat.isFile()){
      scanFile(dir_or_file, verbose)
    }else{
      scanDirectory(dir_or_file, verbose)
    }
  }catch(e){
    console.error(e.message.red)
    return process.exit(1)
  }
}

function scanFile(file, verbose){
  empath.scanFile(file, function(err, info){
    console.log(('Scanning file ' + file).grey)
    console.log(displayMainFileInfo(info, true))
  })
}

function scanDirectory(dir, verbose){
  console.log(('Scanning directory ' + dir).grey)
  empath(dir, {verbose: verbose}, function(err, info){
    if (err) return console.err(err)
    console.log('Found main file: ' + info.main.green)
    if (info.rest && !verbose){
      console.log((info.rest.length + 
        ' other main file candidate(s), -v to see more detail.').grey)
    }
    
    console.log(displayMainFileInfo(info, true))
    if (info.rest && verbose){
      console.log('Other candidates for main:'.grey)
      info.rest.forEach(function(info){
        console.log(('- ' + info.main).grey)
        console.log(indent(displayMainFileInfo(info, false).grey))
      })
    }
  })
}

function displayMainFileInfo(info, colored){
  var lines = []
  lines.push('Supports AMD?')
  lines.push(indent(yesno(info.amd, colored)))
  if (info.amd){
    lines.push(indent('dependencies:', renderList(info.amd.dependencies)))
  }
  lines.push('Supports CommonJS?')
  lines.push(indent(yesno(info.commonjs, colored)))
  if (info.commonjs){
    lines.push(indent('dependencies: ' + renderList(info.commonjs.dependencies)))
  }
  lines.push('Global variables exported')
  var globalsDisplay = renderList(info.globals)
  if (colored) globalsDisplay = globalsDisplay.green
  lines.push(indent(globalsDisplay))
  return lines.join('\n')
}