var _leFunc = ((function(){
  var LeFunc = {};
  var LeFuncItemProto = {
    argTypes: [],
    functions: [],
    add: function(args, fn){
      this.argTypes.push(args);
      this.functions.push(fn);
    }
  };
  var LeFuncProto = {
    define: function(name, params, bindTo, fn){
      if (this.isNew(name)){
        var self = this;
        this.functions[name] = function(){
          var argTypes  = self.functions[name].argTypes
            , i         = 0
            , n         = 0
          ;
          console.log(argTypes);
          console.log(arguments);
          for (; i < argTypes.length; i++){
            for (n = 0; n < arguments.length; n++){
              console.log(i + ", " + n);
              console.log("type:        " + argTypes[i][n]);
              console.log("passedType:  " + typeof arguments[n]);
              console.log("typeValue:   " + argTypes[i][n]);
              console.log("passedValue: " + arguments[n]);
              //console.log("not equal? " + (Object.prototype.toString.call(arguments[n]) != ("[object " + argTypes[i][n] + "]")));
              /*if (Object.prototype.toString.call(arguments[n]) != ("[object " + argTypes[i][n] + "]").trim())
                break;*/
              console.log("not equal? " + (typeof arguments[n] != argTypes[i][n]));
              if (typeof arguments[n] != argTypes[i][n])
                break;
            }
            if (n == arguments.length) break;
          }
          if (typeof self.functions[name].functions[i] == "undefined"){
            throw new TypeError("Cannot find method " + name + " that accepts " + arguments.length + " arguments of that type");
          }
          console.log(self.functions[name].functions[i]);
          return self.functions[name].functions[i].apply({}, arguments);
        };

        this.functions[name].argTypes = [];
        this.functions[name].functions = [];
        this.functions[name].add = function(args, fn){
          this.argTypes.push(args);
          this.functions.push(fn);
        };
        bindTo[name] = this.functions[name];
      }
      for (var i = 0; i < params.length; i++){params[i] = params[i].toLowerCase();}
      this.functions[name].add(params, fn);
    },
    isNew: function(name){
      return this.functions[name] === undefined;
    }
  };

  LeFunc.initialize = function(){
    var lf = {};
    lf.__proto__ = LeFuncProto;
    lf.functions = {};
    return lf;
  };
  LeFunc.functions = {};
  return LeFunc;
})()).initialize();

_leFunc.define("leFunc", ["Object"], window, function(params){
  /* Fix any undefined variables */
  params.name       = params.name       || null;
  params.argTypes   = params.argTypes   || [];
  params.bindTo     = params.bindTo     || window;
  params.fn         = params.fn         || null;

  _leFunc.define(params.name, params.argTypes, params.bindTo, params.fn);
})
_leFunc.define(
  "leFunc",
  ["String", "Array", "Object", "Function"],
  window,
  function(name, params, bindTo, fn){
    _leFunc.define(name, params, bindTo, fn);
  }
);
_leFunc.define(
  "leFunc",
  ["String", "Array", "Function"],
  window,
  function(name, params, fn){
    _leFunc.define(name, params, window, fn);
  }
);
_leFunc.define(
  "leFunc",
  ["String", "String", "Function"],
  window,
  function(name, param, fn){
    _leFunc.define(name, [param], window, fn);
  }
);
_leFunc.define(
  "leFunc",
  ["String", "Function"],
  window,
  function(name, fn){
    _leFunc.define(name, [], window, fn);
  }
);