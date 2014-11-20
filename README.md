# Overload your functions with leFunc

It basically provides a structured way to type check your functions. It's particularly useful when building api's that can have multiple combinations of parameters.

```javascript
var getItems = leFunc({
  "string": function(id){
    // Do something
  },
  "string,object": function(id, options){
    // Do something else
  },
  "string,object,function": function(id, options, callback){
    // Do something different
    callback();
  },
  "object,string,function?": function(options, message, callback){
    // Do something ca-raaaaazzzy
    if ( callback ) callback();
  },
  "default": function(){
    // Figure out what to do with arguments
    callback();
  }
});

getItems("123abc"); // Calls the first function
getItems("123abc", { poop: true }); // Calls the second function
getItems("123abc", { butt: true }, function(){}); // Calls the third function
getItems({ butt: true }, "What what?" function(){}); // Calls the fourth function
```

##Install

```
npm install leFunc
```

or

```
jam install leFunc
```

## Optional Args

While it's nice to have leFunc parse function argument signatures, sometimes its explicitness can get in the way of JavaScript flexibility. Consider the case where you've got a number of argument combinations and then a callback. Your arguments up to the callback can have any number of combinations, but the callback is always at the end. If you wanted to define all of those combinations and then allow the callback to optional, that's _a lot_ of re-definition. That's where Optional Args come in:

```javascript
api.users.get = leFunc({
  "Number,Object,Function?": function( id, params, callback ){
    return http( '/api/users/' + id + parseParams( params ), callback );
  }
, "Object,Function?": function( params, callback ){
    return http( '/api/users' + parseParams( params ), callback );
  }
, "Function?": function( callback ){
    return http( '/api/users', callback );
  }
});
```

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

## And now with binding!

```javascript
var myObject = {
  prop1: "icanhazproperty?"
, prop2: 123456
};

var getItems = leFunc({
  "s"; function(id){
    console.log(this.prop1)
  }
  "so": function(id, options){
    console.log(this.prop2)
  },
  "sof": function(id, options, callback){
    console.log(this.prop1, this.prop2);
    callback();
  }
}, myObject); // Pass in your object to bind as the second parameter
```

## Data Types

Any data type that you can use in javascript, you can use with leFunc. That is, any data type as described by ```Object.prototype.toString```. You can also provide custom data types by defining the name of a class and the corresponding constructor via the leFunc.config function

```javascript
leFunc.dataTypes({
  // Provide a hash that maps to custom datatypes
  jQuery: jQuery
, Router: utils.Router
, Poop: MyAwesomePoopClass
});

var myFunc = leFunc({
  "string,jQuery,Router,Poop": function(id, $el, app, myPoop){
    // Do work
  }
, "string,Router,Poop": function(id, app, myPoop){
    // And so on
  }
});
```

# Custom Mappings

Using the config function, you can provide special mappings to the default data types. This is how the shorthand syntax is accomplished.

```javascript
{
  s: "string"
, b: "boolean"
, n: "number"
, o: "object"
, u: "undefined"
, r: "regexp"
, a: "array"
, f: "function"
, d: "date"
}
```

You can easily add your own like this:

```javascript
leFunc.config({
  str:  "string"
, bool: "boolean"
, num:  "number"
, g:    "global"
});
```

## The Fallback

If you try and call a leFunc that hasn't been define, it will throw a pretty vague error. So, if you want to avoid that, provide a default function under the key "default" like is seen in the first example.

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

Copyright (c) 2012 John Fawcett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
