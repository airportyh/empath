;(function(){

function hello(){
  return 'hello world'
}

if (typeof define !== 'undefined' && define.amd){
  define(hello)
}else if (typeof require !== 'undefined' &&
  typeof exports !== 'undefined' &&
  typeof module !== 'undefined'){
  module.exports = hello
}else{
  window.hello = hello
}

}());