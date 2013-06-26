var Backbone = require('backbone')

var m = new Backbone.Model({name: 'bob'})

m.on('change:name', function(model, val){
  console.log('changed to', val)
})

m.set('name', 'james')