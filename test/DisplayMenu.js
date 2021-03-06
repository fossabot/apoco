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

describe("DisplayMenu-(start without menu items)",function(){
    var t;
    require("../DisplayMenu.js"); 
    it("creates a manu display object",function(){
        var b=document.createElement("div");
        b.id="test";
        document.body.appendChild(b);
        assert.strictEqual(document.body.contains(b),true);
        t=Apoco.display.menu({id:"test_menu",DOM:"test"});
        assert.isObject(t);
    });
    it("has a show method which adds root to DOM",function(){
       var b=document.getElementById("test_menu");
        assert.strictEqual(document.body.contains(b),false);
        t.show();
        b=document.getElementById("test_menu");
        assert.strictEqual(document.body.contains(b),true);
    });
    it("can add a menu item",function(){
        assert.strictEqual(t.getChildren().length,0);
        t.addMenu({name:"port"});
        assert.strictEqual(t.getChildren().length,1);
    });
    it("has added a menu item to the DOM",function(){
        var b=document.getElementById("test_menu").getElementsByTagName("li");
        assert.strictEqual(b.length,1);
    });
    it("can delete a menu item",function(){
        assert.strictEqual(t.getChildren().length,1);
        t.deleteChild("port");
        assert.strictEqual(t.getChildren().length,0);
    });
    it("can delete itself",function(){
        var b=document.getElementById("test_menu");
        assert.strictEqual(document.body.contains(b),true);
        t.delete();
        var b=document.getElementById("test_menu");
        assert.strictEqual(document.body.contains(b),false);
    });
    
});

describe("DisplayMenu",function(){
    var t;
    require("../DisplayMenu.js"); 
    it("creates a manu display object",function(){
        var b=document.createElement("div");
        b.id="test";
        document.getElementsByTagName("body")[0].appendChild(b);
       
        t=Apoco.display.menu({id:"test_menu",DOM:"test",components:[{name:"one"},
                                                               {name:"two",
                                                                action:function(that){
                                                                    that.element.textContent="clicked";
                                                                }},
                                                               {name: "three"}
                                                              ]});
        assert.isObject(t);
    });
    
    it("has a show method that puts the root node into the dom",function(){
        // assert.strictEqual($("#test_menu").length,0);
        var b=document.getElementById("test_menu");
        assert.strictEqual(document.body.contains(b),false);
        t.show();
        var b=document.getElementById("test_menu");
        assert.strictEqual(document.body.contains(b),true);
    });
    it("has put the menus into the DOM",function(){
        var b=document.getElementById("test_menu").getElementsByTagName("li");
        assert.strictEqual(b.length,3);
    });
    
    it("can add a menu item",function(){
        assert.strictEqual(t.getChildren().length,3);
        t.addMenu({name:"port"});
        assert.strictEqual(t.getChildren().length,4);
    });
    it("has put the added menu into the DOM",function(){
        var b=document.getElementById("test_menu").getElementsByTagName("li");
        assert.strictEqual(b.length,4);
    });
    
    it("can delete a menu item",function(){
        assert.strictEqual(t.getChildren().length,4);
        t.deleteChild("one");
        assert.strictEqual(t.getChildren().length,3);
    });
    it("has removed the deleted menu from the DOM",function(){
        var b=document.getElementById("test_menu").getElementsByTagName("li");
        assert.strictEqual(b.length,3);
    });

    
    it("has added menus to the dom",function(){
        assert.strictEqual(t.getChildren().length,3);
        var b=document.getElementById("test_menu");
        assert.isObject(b);
        var c=b.querySelectorAll("li");
//        console.log("+++++++++++++++++++++++++++ added nmenys to dom %j ",c);
        assert.strictEqual(c.length,3);
    });
    it("has a callback ",function(){
        var b=document.getElementById("test_menu").getElementsByTagName("li")[1];
        assert.isObject(b);
        var b=t.getChild("two").element;
        b.click();
        assert.strictEqual(b.textContent,"clicked");
    });
    it("has set the selected menu",function(){
        var b=t.getSelected().element;
        var c=t.getChild("two").element;
        assert.strictEqual(b,c);
    });

    it("can find the menu item with css name ",function(){
        var b=document.getElementsByName("two")[0];
        assert.isObject(b);
    });
    
});
