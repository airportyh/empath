exports.indent = indent
function indent(str){
  return str.split('\n').map(function(line){
    return '  ' + line
  }).join('\n')
}