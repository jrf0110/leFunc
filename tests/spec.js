describe('leFunc', function(){
  var _func = function(leString, leNumber, leDate, leObject, leFunction){
    return [leString, leNumber, leDate, leObject, leFunction];
  }

  describe('Binding', function(){
    var myObject = {
      prop1: "icanhazproperty?"
    , prop2: 123456
    };
    var fn = leFunc({
      "": function(){
        return this;
      }
    }, myObject);

    it('Should bind myObject to fn', function(){
      var t = fn();
      expect(t).toEqual(myObject);
    });
  });

  describe('Function Selecting', function(){
    describe('Verbose Syntax', function(){
      var func1 = leFunc({
        "": function(){
          return _func(null,null,null,null,null);
        },
        "string": function(str){
          return _func(str, null,null,null,null);
        },
        "string,number": function(str,num){
          return _func(str,num,null,null,null);
        },
        "string,number,date": function(str,num,d){
          return _func(str,num,d,null,null);
        },
        "string,number,date,object": function(str,num,d,obj){
          return _func(str,num,d,obj,null);
        },
        "string,number,date,object,function": function(str,num,d,obj,func){
          return _func(str,num,d,obj,func);
        }
      });
      it('Should select no args', function(){
        expect(func1()).toEqual(_func(null,null,null,null,null));
      });
      it('Should select String', function(){
        expect(func1("test")).toEqual(_func("test", null, null, null, null));
      });
      it('Should select String, Number', function(){
        expect(func1("test", 1)).toEqual(_func('test', 1, null, null, null));
      });
      it('Should select String, Number, Date', function(){
        var d = new Date();
        expect(func1("test", 1, d)).toEqual(_func('test', 1, d, null, null));
      });
      it('Should select String, Number, Date, Object', function(){
        var d = new Date();
        expect(func1("test", 1, d, {})).toEqual(_func('test', 1, d, {}, null));
      });
      it('Should select String, Number, Date, Object, Function', function(){
        var d = new Date();
        var f = function(){};
        expect(func1("test", 1, d, {}, f)).toEqual(_func('test', 1, d, {}, f));
      });
      it('Should throw an undefined error', function(){
        var e = new Error("The function of type snf is undefined");
        expect(function(){func1("test", 1, function(){})}).toThrow(e);
      });
    });

    describe('Shorthand Syntax', function(){
      var func1 = leFunc({
        "": function(){
          return _func(null,null,null,null,null);
        },
        "s": function(str){
          return _func(str, null,null,null,null);
        },
        "s,n": function(str,num){
          return _func(str,num,null,null,null);
        },
        "s,n,d": function(str,num,d){
          return _func(str,num,d,null,null);
        },
        "s,n,d,o": function(str,num,d,obj){
          return _func(str,num,d,obj,null);
        },
        "s,n,d,o,f": function(str,num,d,obj,func){
          return _func(str,num,d,obj,func);
        }
      });
      it('Should select no args', function(){
        expect(func1()).toEqual(_func(null,null,null,null,null));
      });
      it('Should select String', function(){
        expect(func1("test")).toEqual(_func("test", null, null, null, null));
      });
      it('Should select String, Number', function(){
        expect(func1("test", 1)).toEqual(_func('test', 1, null, null, null));
      });
      it('Should select String, Number, Date', function(){
        var d = new Date();
        expect(func1("test", 1, d)).toEqual(_func('test', 1, d, null, null));
      });
      it('Should select String, Number, Date, Object', function(){
        var d = new Date();
        expect(func1("test", 1, d, {})).toEqual(_func('test', 1, d, {}, null));
      });
      it('Should select String, Number, Date, Object, Function', function(){
        var d = new Date();
        var f = function(){};
        expect(func1("test", 1, d, {}, f)).toEqual(_func('test', 1, d, {}, f));
      });
      it('Should throw an undefined error', function(){
        var e = new Error("The function of type snf is undefined");
        expect(function(){func1("test", 1, function(){})}).toThrow(e);
      });
    });
  });
});