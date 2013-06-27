require('colors')

exports.indent = indent
function indent(str){
  return str.split('\n').map(function(line){
    return '  ' + line
  }).join('\n')
}

exports.yesno = yesno
function yesno(bool, colored){
  if (colored) return bool ? 'yes'.green : 'no'.red
  else return bool ? 'yes' : 'no'
}

exports.renderList = renderList
function renderList(list, colored){
  if (!list || list.length === 0) return 'none'
  return list.join(', ')  
}