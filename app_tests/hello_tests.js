var hello = require('../app/hello')

describe('hello', function(){

  it('says hello', function(){
    expect(hello()).toBe('hello world')
  })

  it('says hello to individual', function(){
    expect(hello('bob')).toBe('hello bob')
  })

})