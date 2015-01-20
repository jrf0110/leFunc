(function(){
  var
    // Custom data types - will only check here if type is object
    dataTypes = {}

    // Holds mappings to actual data types
  , shortHands = {
      s: "String"
    , b: "Boolean"
    , n: "Number"
    , o: "Object"
    , u: "Undefined"
    , r: "Regexp"
    , a: "Array"
    , f: "Function"
    , d: "Date"
    , "string": "String"
    , "boolean": "Boolean"
    , "number": "Number"
    , "object": "Object"
    , "undefined": "Undefined"
    , "regexp": "Regexp"
    , "array": "Array"
    , "function": "Function"
    , "date": "Date"
    }

  , getDataTypeName = function(value){
      for (var type in dataTypes){
        if (value instanceof dataTypes[type]) return type;
      }
      return "Object";
    }

  , getType = function(value){
      var type = Object.prototype.toString.call(value);
      return type.substring(8, type.length -1);
    }

    // Returns the data type checking function
  , leFunc = function(functions, bindTo){
      var
        functionList = {} // - Holds the various types of functions
      , types             // - String of all arg types
      , typesArray        // - Array of all arg types
      , i                 // - Index for array of all arg types
      , type              // - typesArray[i]
      , key               // - Constructed key/index for the functionList
      , custom = false    // - Indicates whether or not this function uses a custom
                          //   data type so we can skip the instanceof checks
      , optionals = {}    // - Holds optional types declared in the form of `arity`: `type`
                          //   Also holds a key called `greatest` which lets us know
                          //   what the greatest optional arity was
      ;

      // Create the possible function list lowercasing all arg types
      for (types in functions){
        // Get the types in a workable format
        typesArray = types.split(',');
        key = "";
        // Go through each type and construct the key
        for (i = 0; i < typesArray.length; i++){
          type = typesArray[i];
          if (type[type.length - 1] === '?'){
            type = type.substring(0 , type.length - 1);
            optionals[i] = type;
            optionals.greatest = i;
          }
          // Check to see if we're using a custom data type
          if (!custom && dataTypes.hasOwnProperty(type)) custom = true;
          // Use the shortHand mapping if available
          key += shortHands.hasOwnProperty(type) ? shortHands[type] : type;
        }

        functionList[key] = functions[types];
      }

      // Return a function that finds the correct function in the functionList
      return function(){
        // Create a key based on the arguments data types that will match
        // A function list key
        var key = "", i  = 0, type, arg, l = arguments.length;

        if ( optionals.greatest !== undefined && optionals.greatest >= l ){
          l = optionals.greatest + 1;
        }

        for (; i < l; i++){
          arg = arguments[i];

          if ( optionals[i] && ( arg === null || arg === undefined ) ){
            type = optionals[i];
          } else {
            type = getType(arg);
          }

          // If it's an object, it might be a custom data type
          if (type === "Object" && custom) type = getDataTypeName(arg);
          // Append the type
          key += type;
        }

        if ( i < optionals.greatest ){
          for (; i < optionals.greatest; i++){

          }
        }

        // Couldn't find a matching function
        if (!functionList.hasOwnProperty(key)){
          // Just use the default fallback function then
          if (functionList.hasOwnProperty('default'))
            return functionList['default'].apply(bindTo || {}, arguments);
          else throw new Error("The function of type " + key + " is undefined");
        }
        return functionList[key].apply(bindTo || this, arguments);
      };
    }
  ;

  leFunc.config = function(configuration){
    // Setup data types
    for (var key in configuration.dataTypes){
      dataTypes[key] = configuration.dataTypes[key];
    }

    // Setup shorthands
    for (var key in configuration.shortHands){
      shortHands[key] = configuration.shortHands[key];
    }
  };

  if (typeof module !== "undefined") module.exports = leFunc;
  else if (typeof define !== "undefined") define('leFunc', function(){ return leFunc });
  else window.leFunc = leFunc;
})();