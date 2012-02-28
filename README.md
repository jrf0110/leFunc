# leFunc

leFunc is way to overload functions in Javascript.

Typically, if you have optional arguments or you're uncertain about parameter types and order coming into a function, you might do something like this:

    function getItems(groupId, options, callback){
      if (typeof options == "function"){
        callback = options;
        options = {};
      }
      // Do some work with the corrected parameters
    }

A fairly trivial example, but we do this a lot. Other languages provide more flexible options like function overloading. So you can do stuff like this:

    function getItems(groupId, callback){
      // Do some work with the corrected parameters
    }
    function getItems(groupId, options, callback){
      // Do some work with the corrected parameters
    }

leFunc allows you to do this.

## Examples
    function _getItems(groupId, options, callback){
      // Do some work with the corrected parameters
    }
    // Define function getItems(string groupId, function callback) to window
    leFunc("getItems", ["String", "Function"], function(groupId, callback){
      // Maybe since we know that were not getting the options variable
      // We might want to do some extra work
      console.log("This is the TWO parameter function!");
      _getItems(groupId, {}, callback);
    });
    // Define function getItems(string groupId, function callback) to window
    leFunc("getItems", ["String", "Object", "Function"], function(groupId, options, callback){
      console.log("This is the THREE parameter function")
      _getItems(groupId, options, callback);
    });

    // Call the function how you want to know
    getItems("4f3ae2e3c3e54c2b90000072", function(error, result){});
    // output: This is the TWO parameter function!
    getItems("4f3ae2e3c3e54c2b90000072", {date: {$lt: new Date()}} function(error, result){});
    // output: This is the THREE parameter function!

You can define as many overloads as you want with as many combinations of types as you want.

## Binding

The function leFunc is actually defined on the exports or window object by the internal function _leFunc. There are like 8 overloads for it so you can call it with any combination of parameters and it will still work. One of the optional parameters to leFunc is an object you want your function to be defined on.

    // So, maybe you're in some scope
    (function(){
      // And you only want leFunc to define your function within this scope
      // Just pass in the object you want to be defined on
      leFunc(
          "somethingCool"
        , this
        , ["String", "String", "Function"]
        , function(str1, str2, callback){
          console.log(str1 + str2);
          callback();
        }
      );
      leFunc(
          "somethingCool"
        , this
        , ["String", "Number", "Function"]
        , function(str1, num, callback){
          for (var i = 0; i < num; i++){
            console.log(str1);
          }
          callback();
        }
      );

      something("Right ", "On", function(){console.log("complete")});
      // output:  "Right On"
      //          "complete"

      something("Right On", 3, function(){console.log("complete")});
      // output:  "Right On"
      //          "Right On"
      //          "Right On"
      //          "Complete"
    })();

    something("Just ", "Testing", function(){console.log("complete")});
    // This would throw an error saying something is undefined since it's not
    // defined in this scope