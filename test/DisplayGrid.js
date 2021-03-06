"use strict";

const       assert = require('chai').assert;
const        jsdom = require('jsdom');
const   browserify = require('browserify');
const browserifyFn = require('browserify-string');
const         path = require('path');
const           fs = require('fs');
const Apoco=require('../declare').Apoco;


global.document=require("jsdom").jsdom(undefined,
                                           {virtualConsole: jsdom.createVirtualConsole().sendTo(console)});
global.window=document.defaultView;
global.navigator=global.window.navigator;



describe("DisplayGrid-(start without rows)",function(){

    var t;
    require("../DisplayGrid.js"); 
    it("creates a grid display object",function(){
        var b=document.createElement("div");
        b.id="test";
        document.getElementsByTagName("body")[0].appendChild(b);
        //$("body").append("<div id='test'></div>");
        t=Apoco.display.grid({id:"test_grid",DOM:"test",cols:[{name: "name",type:"string"}]});
        assert.isObject(t);
    });
    it("has a getElement method",function(){
        var b=t.getElement();
        assert.isObject(b); 
    });
    it("has a show method which adds the root element to the DOM",function(){
        var b=document.getElementById("test_grid");
        assert.isNotObject(b);
        t.show();
        var b=document.getElementById("test_grid");
        assert.isObject(b);
    });
    it("cannot add column if it does not have a unique name",function(){
        var fn=function(){
            t.addCol({name: "name",type:"string"});     
        };
        assert.throws(fn,"Columns must have unique names");
    });
    it("has added a column if a uniqueKey is not specified",function(){
        var v=t.getCol();
        assert.strictEqual(v.length,2);
    });
    it("can add a column ",function(){
        t.addCol({name: "index",type:"integer"});     
        assert.strictEqual(t.getColIndex("index"),2);
    });
    it("can add a row",function(){
        var b=t.addRow({name:"Bill",index:10});
        assert.notStrictEqual(b,null);
    });
    it("creates a grid",function(){
        assert.notStrictEqual(t.getGrid(),null);
        assert.notStrictEqual(t.getGrid(),undefined);
    });
    it("creates a row array",function(){
       // var n=t.getGrid();
        assert.notStrictEqual(t.getGrid().rows.length,0);
    });
    it("getRow throws an error if key is not unique",function(){
        t.addRow({name:"Homer",index:6});
        var fn=function(){
            var b=t.getRow({name:"Homer",index:6},null,{val:-1});
        };
        assert.throws(fn,"getRow: key is not unique" );
    });
    it("can add more columns ",function(){
        t.addCol({name: "job",type:"string"});     
        assert.strictEqual(t.getColIndex("job"),3);
    });
    it("can add yet another row",function(){
        t.addRow({name:"Sam",job:"Manager"});
    });
    it("can add a column with a label",function(){
        t.addCol({name: "things",label:"whatever",type:"string"});
        assert.strictEqual(t.getColIndex("things"),4);
    });
  
    it("dumps the contents of the grid as a JSON object",function(){
        var b=t.getJSON();
        assert.isObject(b);
//        console.log("JSON %j",b);
    });
    it("updates a row only if unique key",function(){
        var fn=function(){
            t.updateRow({name:"Sam",index:12});
        };
        assert.throws(fn,"getRow: key is not unique");
    });
    it("has a delete method",function(){
        var b=document.getElementById("test_grid");
//        console.log("delete grid got element" + b);
        t.delete();
        assert.strictEqual(document.body.contains(b),false);
//        console.log("t is now " + t);
    });
});



describe("DisplayGrid-(start with data and subgrids)",function(){
    var t;
    require("../DisplayGrid.js");
    
    //var data=require("./data/data.js");
    require("./data/data.js");
    var data=window.data;
    it("has got some data",function(){
        assert.isObject(data); 
    });
    it("creates a grid display object",function(){
        //$("body").append("<div id='Content'></div>");
        var b=document.createElement("div");
        b.id="Content";
        document.body.appendChild(b);
        assert.strictEqual(document.body.contains(b),true);
        t=Apoco.display.grid(data);
        assert.isObject(t);
    });

    it("has sorted all the grids",function(){
        var b=t.getGrid();
        for(var i=0;i<b.length;i++){
            assert.strictEqual(b[i].sorted,true);
        }
    });
    
     it("can add a row",function(){
        var b=t.getGrid("swaps").rows.length;
        b++;
        var n=t.addRow({stock:"FG63",class: "swaps",bid:10,maturity:"2020-05-21"});
        var c=t.getGrid("swaps").rows.length;
//        console.log("b is " + b +  " and c " + c);
        //var b=t.getRow({stock:"FG63",subclass: 1,bid:10});
        assert.strictEqual(b,c);
       // console.log("JSON %j",n);
    });
    it("can add another row",function(){
        var b=t.getGrid("swaps").rows.length;
        b++;
        var n=t.addRow({stock:"XXX",class: "swaps",bid:109,maturity:"2016-08-30"});
        var c=t.getGrid("swaps").rows.length;
        assert.strictEqual(b,c);
        
    });
    it("can retrieve a row that has been added after initialisation",function(){
//        console.log("trying to find a row");
        var b=t.getRow({stock:"XXX",maturity:"2016-08-30"});
        assert.notStrictEqual(b,null); 
    });
    it("has a show method which adds the root element to the DOM",function(){
        var b=document.getElementById("Blotter");
        assert.strictEqual(document.body.contains(b),false);
        t.show();
        var b=document.getElementById("Blotter");
        assert.strictEqual(document.body.contains(b),true);
    });
    it("can update a row",function(){
        t.updateRow({stock:"FG63",bid:40,class:"swaps",maturity:"2020-05-21"});
        var b=t.getRow({stock:"FG63",maturity:"2020-05-21"});
        assert.equal(b["bid"].getValue(),40.000);
    });
    it("has added a row to the dom",function(){
        var b=document.getElementById("straight").getElementsByTagName("tr")[0].getElementsByTagName("td")[0];//querySelector("#1 tr:first td:first");
        assert.isObject(b);
        var c=b.textContent;
//        console.log("td is " + c);
    });
    it("can add a column using the field option instead of a type",function(){
        var b=t.getCol().length;
        b++;
        t.addCol({name:"selection",field:"select",editable:true,options:["one","two","three"]});
        var c=t.getCol().length;
        assert.strictEqual(b,c);
    });
    it("can get a row",function(){
        var b=t.getRow({stock:'AAB',maturity:"2017-03-27"});
        assert.notStrictEqual(b,null);
       /* console.log("row is %j",b);
        for(var k in b){
            console.log("cell " + k + " values %j",b[k]);
            for(var m in b[k]){
                console.log("cell values " + m + " values %j " ,b[k][m]);
            }
        } */
    });
    it("can get a cell",function(){
        var b=t.getRow({stock:'AAB',maturity:"2017-03-27"});
        assert.notStrictEqual(b,null);
//        console.log("got cell " + b['selection']);
        var c=b['selection'];
        assert.notStrictEqual(c,null);
    });
    it("has added the options to the select cell",function(){
        var b=t.getRow({stock:'AAB',maturity:"2017-03-27"});
        assert.notStrictEqual(b,null);
//        console.log("got cell " + b['selection']);
        var c=b['selection'];
        assert.notStrictEqual(c,null);
        var d=b['selection'].select;
        assert.strictEqual(d.length,3);
//        console.log("options is %j",d);
    });
    
    it("can add a column",function(){
        var b=t.getCol().length;
        b++;
        t.addCol({name:"other",type:"string",editable:true});
        var c=t.getCol().length;
        assert.strictEqual(b,c);
    });
    it("updates an existing row",function(){
        //  t.updateRow({stock:"XXX",subclass:1,maturity:20160830,other:"something"});
        t.updateRow({stock:"AAB",class:"index_linked",maturity:"2017-03-27",other:"something"});
        var b=t.getRow({stock:"AAB",class:"index_linked",maturity:"2017-03-27"});
//        console.log("displayGrid:update row got %j",b);
     /*   for(var k in b){
            console.log("row key is " + k + " value " + b[k]);
            for (var n in b[k]){
                console.log("value object has key " + n + " value " + b[k][n]);
            }
        } */
        assert.notStrictEqual(b,null);
        assert.strictEqual(b["other"].getValue(),"something");
    });
    it("deletes a row",function(){
        t.deleteRow({stock:"AAC",class: "swaps",maturity:"2018-04-22"});
        
    });
    it("deletes a column",function(){
        t.deleteCol("bid");
    });
    it("can delete itself with hidden cols",function(){
        var b=document.getElementById("Blotter");
//        console.log("delete grid got element" + b);
        t.delete();
        assert.strictEqual(document.body.contains(b),false);
//        console.log("t is now " + t);
        
        
    });
    
});

describe("DisplayGrid-(start with data but no subgrids)",function(){
    var t;
    require("../DisplayGrid.js");
    var data={ id:"test_grid",DOM:"test",
               uniqueKey: ["one"],
               cols:[{name:"one",type: "integer" },
                     {name: "two",type: "string"}],
               rows:[{one: 20 ,two: "hat"},
                     {one: 22, two: "big"}]
             };
    it("creates a grid display object",function(){
        var b=document.createElement("div");
        b.id="test";
        document.body.appendChild(b);
        assert.strictEqual(document.contains(b),true);
        t=Apoco.display.grid(data);
        assert.isObject(t);
        t.show();
    });
    it("creates htmldiv container",function(){
        var b=document.getElementById("test_grid");
        assert.strictEqual(document.contains(b),true);
    });
    it("has sorted all the grids",function(){
        var b=t.getGrid();
        for(var i=0;i<b.length;i++){
            assert.strictEqual(b[i].sorted,true);
        }
    });
    it("can add a row",function(){
        var b=t.getGrid("all").rows.length;
        b++;
        var n=t.addRow({one:33, two: "fig"});
        assert.isObject(n);
        var c=t.getGrid("all").rows.length;
//        console.log("b is " + b +  " and c " + c);
        assert.strictEqual(b,c);
    });
    it("can create a rowEditPopup",function(){
        var b=t.getRow({one:20});
        assert.notStrictEqual(b,null);
        var f=t.rowEditPopup(b);
        assert.isObject(f);
        f.show();
        var b=document.getElementById("rowEditPopup");
        assert.strictEqual(document.contains(b),true);
        
    });
    it("can get row data from an event callback",function(){
        var b=t.getGrid();
        b.element.addEventListener("click",function(self){
            return function(e){
                var row;
                assert.isObject(self);
                if(self){
                    row=self.findRow(e,self);
                    assert.isObject(row);
                    assert.strictEqual(row,{one:"one",two:"hat"});
                }
            };
        },false);
        var h=document.getElementsByTagName("TR");
        assert.isObject(h);
        h[0].click();
        
    });
    it("rowEditpopup recreates itself it already in DOM",function(){
        var b=t.getRow({one:22});
        assert.notStrictEqual(b,null);
        var f=t.rowEditPopup(b);
        assert.isObject(f);
        f.show();
        var b=document.getElementById("rowEditPopup");
        assert.strictEqual(document.contains(b),true);
    });
   it("can delete itself",function(){
        var b=document.getElementById("test_grid");
        t.delete();
        assert.strictEqual(document.body.contains(b),false);
        
    });
    
    
});
describe("DisplayGrid-(start with data but no subgrids and no unique key)",function(){
    var t;
    require("../DisplayGrid.js");
    var data={ id:"test_grid",DOM:"test",
               userSortable:["two"],
               cols:[{name:"one",type: "integer" },
                     {name: "two",type: "string"}],
               rows:[{one: 20 ,two: "hat"},
                     {one: 22, two: "big"}]
             };
    it("creates a grid display object",function(){
        var b=document.createElement("div");
        b.id="test";
        document.body.appendChild(b);
        assert.strictEqual(document.contains(b),true);
        t=Apoco.display.grid(data);
        assert.isObject(t);
        t.show();
    });
    it("can get the grid",function(){
        var b=t.getGrid("all");
        assert.isObject(b);
    });
    it("can add a row",function(){
        var p=t.addRow({one: 36, two:"haha"});
        assert.notStrictEqual(p,null);
    });
    it("can add another row",function(){
        var b=t.getGrid("all").rows.length;
        b++;
        t.addRow({one: 44,two: "bigger"});
        var c=t.getGrid("all").rows.length;
        assert.strictEqual(b,c);
    });
    it("can get a row from data in row element",function(){
        var c=document.getElementById("test_grid").getElementsByTagName("tr");
        assert.strictEqual(c.length,4);
        var p=c[0];
        assert.isObject(p);
//        console.log("got data " + p.getAttribute("data-_aid"));
        var b=t.getRowFromElement(p);
        assert.isObject(b);
        assert.strictEqual(b["one"].value,20);
    });
    it("creates up and down buttons on user sortable columns",function(){
        var c=document.getElementById("test_grid").getElementsByClassName("head")[0];
        assert.isObject(c);
       // var b=c.getElementsByName("two")[0];
        var d=c.getElementsByClassName("arrows")[0];
        assert.isObject(d);
    });
    it("can sort a column if the buttom is clicked",function(){
        var s=t.sortOrder;
//        console.log("sort order is %j",s);
        var e=document.getElementsByClassName("arrows")[0]; //.getElementsByTagName("li")[1];
        assert.isObject(e);
        var up=e.querySelector("span.up");
       // var down=e.getElemenstByClassName("down")[0];
        assert.isObject(up);
        up.focus();
        up.click();
        var v=t.sortOrder;
//        console.log("sort order is %j",v);
        assert.notDeepEqual(v,s);
        assert.oneOf("two",v);
    });

    it("can get a row from data in row element after user sort",function(){
        var c=document.getElementById("test_grid").getElementsByTagName("tr");
        assert.strictEqual(c.length,4);
        var p=c[0];
        assert.isObject(p);
//        console.log("got data " + p.getAttribute("data-_aid"));
        var b=t.getRowFromElement(p);
        assert.isObject(b);
        assert.strictEqual(b["one"].value,22);
    });
    it("can delete itsef",function(){
        var b=document.getElementById("test_grid");
        var c=document.getElementsByClassName("head");
        t.delete();
        assert.strictEqual(document.body.contains(b),false);
        assert.strictEqual(c.length,0);
        //assert.strictEqual(document.body.contains(b),false);
        
    });
    
});
