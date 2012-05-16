// use exports if it exists, else use window
var module  = module || {}
  , window  = window || module.exports || exports
  , exports = module.exports || exports || window
;
(function(){
  // Converts all parameter types to just their first letter
  var toShortHand = function(types){
    types = types.toLowerCase();
    if (types.indexOf(',') == -1 && types.indexOf('t') == -1 && types.indexOf('u') == -1) return types;
    return types.match(/\b[a-z]/g).join('');
  };
  exports.leFunc = function(functions, bindTo){
    var functionList = {};
    for (var argTypes in functions)
      functionList[toShortHand(argTypes)] = functions[argTypes];
    return function(){
      var key = "", i = 0;
      for (; i < arguments.length; i++)
        key += Object.prototype.toString.call(arguments[i])[8].toLowerCase();
      if (!functionList.hasOwnProperty(key)) throw new Error("The function of type " + key + " is undefined");
      return functionList[key].apply(bindTo || this, arguments);
    };
  };
})();