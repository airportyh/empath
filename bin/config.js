#! /usr/bin/env node

require('colors')
var fs = require('fs')
var path = require('path')
var empath = require('../lib/index')
var async = require('async')

var requireConfig = {paths: {}, shim: {}}

fs.readdir('components', function(err, dirs){
  if (err) return console.error(err)
  async.eachSeries(dirs, function(dir, next){
    var dirpath = path.join('components', dir)
    empath(dirpath, function(err, info){
      if (err) console.error(err)
      if (!info){
        console.error(('No main found for ' + dirpath + ', skipping.').red)
        return next()
      }
      var mainpath = path.join(dirpath, info.main)
      requireConfig.paths[dir] = mainpath.match(/^(.+)\.js$/)[1]
      if (!info.amd && !info.commonjs && info.globals){
        requireConfig.shim[dir] = {exports: info.globals[0]}
      }
      next()
    })
  }, function(){
    var json = JSON.stringify(requireConfig, null, '  ')
    console.log('Config: ' + json)
    var configCode = 'require.config(' + json + ');'
    fs.writeFileSync('cajon.config.js', configCode)
    console.log('Wrote to cajon.config.js.')
  })
})
