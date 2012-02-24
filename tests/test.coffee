leFunc = require('./../lib/leFunc.js').leFunc

leFunc 'test', @,  ()->
  console.log "woot"

leFunc 'test', ["String"], @, (str)->
  console.log str

leFunc 'test', ["String", "Function"], @, (str, callback)=>
  @test "yayyy!"
  callback(str)

@test()
@test "weee"
@test "poop!", (str)->
  console.log str