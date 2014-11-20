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

    it('Should bind to `this` by default', function(){
      Object.create({
        a: 'yay'

      , fn: leFunc({
          '':
          function(){
            expect( this.a ).toEqual('yay')
          }
        })
      }).fn();
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
        var e = new Error("The function of type StringNumberFunction is undefined");
        expect(function(){func1("test", 1, function(){})}).toThrow(e);
      });
      it('Should allow for optional args', function(){
        var counter = 0;
        var fn = leFunc({
          'String,Function?': function(){
            counter++;
          }
        });

        fn('ahhyeahhh');
        fn('ahhyeahhh', function(){});

        expect( counter ).toEqual( 2 );
      });
      it('Should allow for arbitrary optional args', function(){
        var counter = 0;
        var fn = leFunc({
          'String,Object?,Function?': function(){
            counter++;
          }
        });

        fn('ahhyeahhh');
        fn('ahhyeahhh', null, function(){});
        fn('ahhyeahhh', {});

        expect( counter ).toEqual( 3 );
      });
      it('Should allow for single optional arg', function(){
        var counter = 0;
        var fn = leFunc({
          'Function?': function(){
            counter++;
          }
        });

        fn(function(){});
        fn();

        expect( counter ).toEqual( 2 );
      });
      it('Should not allow an optional type to be fulfilled by the wrong type', function(){
        var counter = 0;
        var fn = leFunc({
          'String,Function?': function(){
            counter++;
          }
        });

        fn('ahhyeahhh', function(){});

        var e = new Error("The function of type StringString is undefined");
        expect(function(){ fn('ahhyeahhh', 'yeeeebuddy'); }).toThrow(e);
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
        var e = new Error("The function of type StringNumberFunction is undefined");
        expect(function(){func1("test", 1, function(){})}).toThrow(e);
      });
    });

    describe("Reverting to Default", function(){
      var func1 = leFunc({
        "default": function(){
          return 0;
        }
      });

      it('Should revert to the default function', function(){
        expect(func1()).toEqual(0);
      });

      it('Should revert to the default function', function(){
        expect(func1("1", "2", "3")).toEqual(0);
      });
    });

    describe("Custom Data Types", function(){
      var ctr1 = function(){}, Ctr2 = function(){}, ctr3 = function(){};

      leFunc.config({
        dataTypes: {
          ctr1: ctr1
        , Ctr2: Ctr2
        }
      });

      var func1 = leFunc({
        "ctr1": function(myCtr1){
          return 0;
        }
      , "ctr1,Ctr2": function(myCtr1, myCtr2){
          return 1;
        }
      , "ctr1,Ctr2,Function": function(myCtr1, myCtr2){
          return 2;
        }
      });

      it('Should select ctr1', function(){
        expect(func1(new ctr1())).toEqual(0);
      });

      it('Should select ctr1,Ctr2', function(){
        expect(func1(new ctr1(), new Ctr2())).toEqual(1);
      });

      it('Should select ctr1,Ctr2', function(){
        expect(func1(new ctr1(), new Ctr2(), function(){})).toEqual(2);
      });

      it('Should throw an undefined error', function(){
        var e = new Error('The function of type ctr1Object is undefined')
        expect(function(){ func1(new ctr1(), new ctr3()) }).toThrow(e);
      });
    });
  });
});