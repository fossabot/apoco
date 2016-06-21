"use strict";

const       assert = require('chai').assert;
const        jsdom = require('jsdom');
const   browserify = require('browserify');
const browserifyFn = require('browserify-string');
const         path = require('path');
const           fs = require('fs');
const Harvey=require('../declare').Harvey;


global.document=require("jsdom").jsdom(undefined,
                                           {virtualConsole: jsdom.createVirtualConsole().sendTo(console)});
global.window=document.defaultView;
global.navigator=global.window.navigator;


describe("DisplayTabs-(start without tab items)",function(){
    var t;
    require("../DisplayTabs.js"); 
    it("creates a tab display object",function(){
        var b=document.createElement("div");
        b.id="test";
        document.getElementsByTagName("body")[0].appendChild(b);
        assert.strictEqual(document.body.contains(b),true);
        t=Harvey.display.tabs({id:"test_tabs",DOM:"test"});
        assert.isObject(t);
    });
    it("can add a tab",function(){
        t.addTab({name:"tabOne"});
        assert.strictEqual(t.getTab().length,1);
    });
    it("can add another tab",function(){
        t.addTab({name:"tabTwo"});
        assert.strictEqual(t.getTab().length,2);
    });
    it("has a show method that puts the root element into the dom",function(){
        var b=document.getElementById("test_tabs");
        assert.strictEqual(document.body.contains(b),false);
        t.show();
        var b=document.getElementById("test_tabs");
        assert.strictEqual(document.body.contains(b),true);
        
    });
    it("has put the tabs into the dom",function(){
        var b=document.querySelectorAll("#test_tabs li");
        assert.strictEqual(b.length,2);
    });
    it("can delete a tab",function(){
        t.deleteTab("tabOne");
        assert.strictEqual(t.getTab().length,1);
    });
});

describe("DisplayTabs",function(){
    var t;
    require("../DisplayTabs.js"); 
    it("creates a tab display object",function(){
        var b=document.createElement("div");
        b.id="test2";
        document.getElementsByTagName("body")[0].appendChild(b);
        assert.strictEqual(document.body.contains(b),true);
        t=Harvey.display.tabs({id:"test_tabs2",DOM:"test2",
                               tabs:[{name:"tabOne",action:function(that,index){
                                   var p;
                                   if(that.element.style.visibility === "visible"){
                                       p="hidden";
                                   }
                                   else{
                                       p="visible";
                                   }
                                   
                                   that.element.style.visibility=p;
                               }},
                                     {name:"tabTwo"},
                                     {name:"tabThree"}
                               ]});
        assert.isObject(t);
    });
    it("has a show method which puts the root element into the dom ",function(){
        var b=document.getElementById("test_tabs2");
        assert.strictEqual(document.body.contains(b),false);
        t.show();
        var b=document.getElementById("test_tabs2");
        assert.strictEqual(document.body.contains(b),true);         
    });
    it("has put the tabs into the dom",function(){
        var b=document.getElementById("test_tabs2").getElementsByTagName("li");
        assert.strictEqual(b.length,3);
    });
    it("executes the action function when clicked",function(){
        var b=document.getElementById("test_tabs2").getElementsByTagName("li")[0];
        assert.isObject(b);
        b.style.visibility="visible";
        //console.log("text in b is " + b.html());
        b.click();
        var r=b.style.visibility;
        assert.strictEqual(r,"hidden");
    });
    it("can add a tab",function(){
        t.addTab({name:"tabFour"});
        assert.strictEqual(t.getTab().length,4);
        var b=document.getElementById("test_tabs2").getElementsByTagName("li");
        assert.strictEqual(b.length,4);
    });
    it("can delete a tab",function(){
        t.deleteTab("tabTwo");
        assert.strictEqual(t.getTab().length,3);
    });
    it("can still execute the action function when clicked",function(){
        var b=document.getElementById("test_tabs2").getElementsByTagName("li")[0];
        assert.isObject(b);
        //console.log("text in b is " + b.html());
        b.click();
        assert.strictEqual(b.style.visibility,"visible");
    });
});