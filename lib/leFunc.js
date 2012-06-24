(function(){
  // Converts all parameter types to just their first letter
  var toShortHand = function(types){
    types = types.toLowerCase();
    if (types == "default") return types;
    if (types.indexOf(',') == -1 && types.indexOf('t') == -1 && types.indexOf('u') == -1) return types;
    return types.match(/\b[a-z]/g).join('');
  },
  leFunc = function(functions, bindTo){
    var functionList = {};
    for (var argTypes in functions)
      functionList[toShortHand(argTypes)] = functions[argTypes];
    return function(){
      var key = "", i = 0;
      for (; i < arguments.length; i++)
        key += Object.prototype.toString.call(arguments[i])[8].toLowerCase();
      if (!functionList.hasOwnProperty(key)) {
        if (functionList.hasOwnProperty('default'))
          return functionList.default.apply(bindTo || this, arguments);
        else throw new Error("The function of type " + key + " is undefined");
      }
      return functionList[key].apply(bindTo || this, arguments);
    };
  };
  if (typeof module !== "undefined") module.exports.leFunc = leFunc;
  else if (typeof define !== "undefined") define('leFunc', function(){ return leFunc });
  else window.leFunc = leFunc;
})();