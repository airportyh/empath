var fs = require('fs')
var path = require('path')

var dir = process.argv[2]

console.log('Searching for main in', dir)
var main = findMainFrom(path.join(dir, 'bower.json'))
if (!main){
  main = findMainFrom(path.join(dir, 'component.json'))
}
if (!main){
  main = findMainFrom(path.join(dir, 'package.json'))
}

function findMainFrom(filepath){
  var exists = fs.existsSync(filepath)
  console.log('has', filepath, '?', exists)
  if (exists){
    var config = JSON.parse(String(fs.readFileSync(filepath)))
    var main = (config.jam && config.jam.main) || config.main
    if (main){
      console.log('Main found in', filepath, ':', main)
    }else{
      console.log('No main found in', filepath)
    }
  }
  return main
}