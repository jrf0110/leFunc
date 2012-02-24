var exports = exports || window;

(function(leFuncName){
  var _leFunc = (function(){
    /***
     * From Sugar.js ->
     * Object module
     *
     * Much thanks to kangax for his informative aricle about how problems with instanceof and constructor
     * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
     *
     ***/
    var isClass = function(obj, str) {
      var result = Object.prototype.toString.call(obj);
      if (result == "[object global]") result = "[object Object]";
      return result === '[object '+str+']';
    }

    var LeFunc = function(){}, lf
      , LeFuncItemProto = {
        argTypes: [],
        functions: [],
        add: function(args, fn){
          this.argTypes.push(args);
          this.functions.push(fn);
        }
      }
      , LeFuncProto = {
        define: function(name, params, bindTo, fn){
          if (this.isNew(name)){
            var self = this;
            this.functions[name] = function(){
              var argTypes  = self.functions[name].argTypes
                , i         = 0
                , n         = 0
              ;
              for (; i < argTypes.length; i++){
                if (argTypes[i].length != arguments.length) continue;
                for (n = 0; n < arguments.length; n++){
                  if (!isClass(arguments[n], argTypes[i][n]))
                    break;
                }
                if (n == arguments.length) break;
              }
              if (typeof self.functions[name].functions[i] == "undefined"){
                throw new TypeError("Cannot find method " + name + " that accepts " + arguments.length + " arguments of that type");
              }
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
          // Capitalize first letter of argTypes
          for (var i = 0; i < params.length; i++){
            params[i] = params[i].charAt(0).toUpperCase() + params[i].slice(1);
          }
          this.functions[name].add(params, fn);
          return this.functions[name];
        },
        isNew: function(name){
          return this.functions[name] === undefined;
        }
      }
    ;

    LeFunc.prototype = LeFuncProto;
    lf = new LeFunc;
    lf.functions = {};
    return lf;
  })();

  _leFunc.define(leFuncName, ["Object"], exports, function(params){
    /* Fix any undefined variables */
    params.name       = params.name       || null;
    params.argTypes   = params.argTypes   || [];
    params.bindTo     = params.bindTo     || window;
    params.fn         = params.fn         || null;

    _leFunc.define(params.name, params.argTypes, params.bindTo, params.fn);
  });
  _leFunc.define(
    leFuncName,
    ["String", "Array", "Object", "Function"],
    exports,
    function(name, params, bindTo, fn){
      _leFunc.define(name, params, bindTo, fn);
    }
  );
  _leFunc.define(
    leFuncName,
    ["String", "Array", "Function"],
    exports,
    function(name, params, fn){
      _leFunc.define(name, params, window, fn);
    }
  );
  _leFunc.define(
    leFuncName,
    ["String", "Object", "Function"],
    exports,
    function(name, bindTo, fn){
      _leFunc.define(name, [], bindTo, fn);
    }
  );
  _leFunc.define(
    leFuncName,
    ["String", "String", "Function"],
    exports,
    function(name, param, fn){
      _leFunc.define(name, [param], window, fn);
    }
  );
  _leFunc.define(
    leFuncName,
    ["String", "Function"],
    exports,
    function(name, fn){
      _leFunc.define(name, [], window, fn);
    }
  );
})("leFunc");