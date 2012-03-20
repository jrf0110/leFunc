# Type check your functions with leFunc

leFunc provides type checking for your functions and is an easy way to make function overloads. It's also really small. It's like 20 lines of code uncompressed. So, yeah. Don't worry about it mucking things up.

```javascript
var getItems = leFunc({
  "string"; function(id){
    // Do something
  },
  "string,object": function(id, options){
    // Do something else
  },
  "string,object,function": function(id, options, callback){
    // Do something different
    callback();
  },
  "object,string,function": function(options, message, callback){
    // Do something ca-raaaaazzzy
    callback();
  }
});

getItems("123abc"); // Calls the first function
getItems("123abc", {poop: true}); // Calls the second function
getItems("123abc", {butt: true}, function(){}); // Calls the third function
getItems({butt: true}, "What what?" function(){}); // Calls the fourth function
```

## Why?

Mainly to avoid typechecking. It's something you always have to do and it's the same every time, so why not abstract it away? And it's really small.

leFunc checks your parameters by type, so you can define any combination of function and it will figure out which function you meant.

## A less verbose syntax

```javascript
var getItems = leFunc({
  "s"; function(id){
    // Do something
  }
  "s,o": function(id, options){
    // Do something else
  },
  "s,o,f": function(id, options, callback){
    // Do something different
    callback();
  }
});
```

And an even less verbose syntax:

```javascript
var getItems = leFunc({
  "s"; function(id){
    // Do something
  }
  "so": function(id, options){
    // Do something else
  },
  "sof": function(id, options, callback){
    // Do something different
    callback();
  }
});
```
## Limitations

leFunc currently only works for the following data types:

* Number
* String
* Object
* Date
* Function

Basically, all the normal stuff. You can't use Undefined, NaN, Null, Global, etc., though I do plan on implementing those soon as long as it's not too costly.

## Real Usage

Ideally you wouldn't re-define the same function for every parameter combination. That's just inefficient. So define your function outside of leFunc with the expected parameter set and use leFunc to do any special stuff based on the parameters.

```javascript
var _hop = function(userId, hopscotchId, options, callback){
  // Prepare awesome hopscotchId thingy for userId
  callback();
};

var hop = leFunc({
  "": function(){
    /*
      No parameters, so lets use the current userId
      and get a random hopscotchId to use and use
      the default options
   */
    var uid       = getCurrentUserId()
      , hid       = getRandomHopId()
      , options   = { awesome: true, steps: 20 }
      , callback  = function(){ /* do something */}
    ;
    _hop(uid, hid, options, callback);
  },
  "s": function(uid){
    /*
      Just a userId so lets use that and use a
      random hopscotch course and the default
      options
    */
    var hid       = getRandomHopId()
      , options   = { awesome: true, steps: 20 }
      , callback  = function(){ /* do something */}
    ;
    _hop(uid, hid, options, callback);
  },
  "s,s": function(uid, hid){
    /*
      Use a random hopscotch course and the
      default options
    */
    var options   = { awesome: true, steps: 20 }
      , callback  = function(){ /* do something */}
    ;
    _hop(uid, hid, options, callback);
  },
  "s,s,o": function(uid, hid, options){
    /*
      All we need to do is define the default callback
    */
    var callback  = function(){ /* do something */};
    _hop(uid, hid, options, callback);
  },
  "s,s,o,f": function(uid, hid, options, callback){
    /*
      Just call the private function
    */
    _hop(uid, hid, options, callback);
  }
});
```

## Still not convinced?

That's cool I guess.