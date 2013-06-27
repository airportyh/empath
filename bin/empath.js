#! /usr/bin/env node

require('colors')
var fs = require('fs')
var path = require('path')
var empath = require('../lib/index')
var strutils = require('../lib/strutils')
var yesno = strutils.yesno
var indent = strutils.indent
var renderList = strutils.renderList
var dir = process.argv[2]

console.log(('Scanning directory ' + dir).grey)
empath(dir, function(err, results){
  if (err) return console.err(err)
  console.log('Found main file: ' + results.main.green)
  if (results.rest){
    console.log((results.rest.length + 
      ' other main file candidate(s), -v to see more detail.').grey)
  }
  console.log('Supports AMD?')
  console.log(indent(yesno(results.amd, true)))
  if (results.amd){
    console.log(indent('dependencies:', renderList(results.amd.dependencies)))
  }
  console.log('Supports CommonJS?')
  console.log(indent(yesno(results.commonjs, true)))
  if (results.commonjs){
    console.log(indent('dependencies: ' + renderList(results.commonjs.dependencies)))
  }
  console.log('Global variables exported')
  console.log(indent(renderList(results.globals).green))
  
})