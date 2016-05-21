var Harvey=require('./declare').Harvey,UI=require('./declare').UI;// jQuery=require('jquery');


// Menu display object
//  requires HarveyDisplayBase.js
//


;(function(){

    "use strict";
   

// create the  display

    var HarveyMakeMenu=function(options,win){
	this.DEBUG=true;
	var that=this;
	Harvey._DisplayBase.call(this,options,win);  //use class inheritance - base Class
	console.log("called display base");
        this.execute();
    };


    var select_menu=function(that,index){
        var name=that.menu[index].name;
        var p=that.getSiblings();
        if(!p){
            throw new Error("Could not find siblings of " + that.parent.name);
        }
        for(var i=0;i<p.length;i++){

            if(p[i].id == name){
                p[i].show();
            }
            else{
                p[i].hide();
            }
        }
    };

    HarveyMakeMenu.prototype={
	execute: function(){
            var s,u;
	    //console.log("execute of DisplayMenu");
            this.selected=undefined;
            this.menu=[];
	    // this.element=$("<div id='" + this.id + "' class='menu ui-widget ui-widget-content ui-corner-all'></div>");
            this.element=document.createElement("div");
            this.element.id=this.id;
            this.element.classList.add("menu","ui-widget","ui-widget-content","ui-corner-all");
            if(this.heading){
                s=document.createElement("span");
                s.textContent=this.heading;
                this.element.appendChild(s);
            }
	    if(this.list === undefined){
                this.list=[];
	    }
	    console.log("Menus creating new element");
	    //var u=$("<ul class='harvey_menu_list ui-menu ui-widget ui-widget-content' role='menubar'></ul>");
	    u=document.createElement("ul");
            u.role="menubar";
            u.classList.add("harvey_menu_list","ui-menu","ui-widget","ui-widget-content");
            this.element.appendChild(u);
            
	    for(var i=0;i<this.list.length;i++){
                console.log("Making menu item " + i);
                this.addMenu(this.list[i],u);
            }
            this.list.length=0; // for garbage collection
	   // return true;
	},
	update:function(name){
	    var p=this.getMenu(name);
	    if(p !== null){
		p.element.click();
	    }
	    else{
		throw new Error("Harvey.menu Could not find element " + name);
	    }
	},
        getSelected: function(){
            if(this.selected){
                return this.selected;
            }
            return null;
        },
        reset: function(){
            this.selected=null;
            //this.element.find("ul li").removeClass("ui-state-active");
            var p=this.element.getElementsByTagName("li");
            for(var i=0;i<p.length;i++){
                p[i].classList.remove("ui-state-active");
            }
        },
	getMenu: function(name){
            if(name !== undefined){
	        for(var i=0;i<this.menu.length;i++){
		    if(this.menu[i].name == name){
		        return this.menu[i];
		    }
	        }
                return null;
            }
	    return this.menu;
	},
        addMenu:function(d,parent_element){
            var index,s,l,that=this;
            if(parent_element === undefined){
                parent_element=this.element.getElementsByClassName("harvey_menu_list")[0];
            }
            index=this.menu.length;
            console.log("addMenu index is " + index);
            d.element=document.createElement("li");
            if(d.seperator !== undefined){
                //d.element=$("<li  class='seperator'></li>");
                d.element.classList.add("seperator");
                s=document.createElement("span");
                s.className="seperator";
                s.textContent=d.seperator;
                //d.element.append("<span class='seperator'>" + d.seperator + "</span>");
                d.element.appendChild(s);
                parent_element.appendChild(d.element);
            }
            else{
                l=d.label? d.label: d.name;
                if(this.getMenu(l) !== null){
                    throw new Error("DisplayMenu: get Menu - menu already exists " + l);
                }
	       // d.element=$("<li  class='ui-menu-item' name='" + d.name + "' role='menuitem'>" + l + "</li>");
                d.element.classList.add("ui-menu-item");
                // d.element.role="menuitem";
                d.element.setAttribute("role","menuitem");
                //d.element.setAttribute("name",d.name);
                d.element.textContent=l;
                console.log("menu text is "+ d.element.text);
	        d.parent=this;
                parent_element.appendChild(d.element);
                this.menu[index]=d;
               
                               
                if(d.action !==undefined){
                    //console.log("menu has action " + this.menu[index].action);
	          //  this.menu[index].element[0].addEventListener("click",
                    //  function(that,index){
                    d.element.addEventListener("click",
                                 function(t,that){
                                     return function(e){
                                         e.stopPropagation();
                      //                   console.log("menu name is " + t.name);
                      //                   console.log("menu has action " + t.action);
                                         t.action(t);
                                         that.select(t.name);
                                     };
                                 }(d,that),false);//,false);
	            // }(that,index),false);
                }
	    }
        },
        deleteAll:function(){
            for(var i=0;i<this.menu.length;i++){
                if(this.menu[i].listen){
                    Harvey.unsubscribe(this.menu[i]);
                }
                //this.menu[i].element.empty();
                this.menu[i].element.parentNode.removeChild(this.menu[i].element);
            }
            this.menu.length=0;
        },
        deleteMenu:function(name){
            var n,index=-1;
            if(name === undefined){
                throw new Error("DisplayMenu: deleteMenu needs a name");
            }
            for(var i=0;i<this.menu.length;i++){
                if(this.menu[i].name === name){
                    index=i;
                    console.log("Found menu to delete " + name + " with index " + index);
                    break;
                }
            }
            if(index === -1){
                throw new Error("DisplayMenu: deleteMenu Cannot find menu" + name);
            }
            this.menu[index].element.parentNode.removeChild(this.menu[index].element);
            this.menu[index].element=null;
            this.menu.splice(index,1);
        },
	select: function(val){
            var c;
            for(var i=0;i<this.menu.length;i++){
                if (this.menu[i].name == val){
                    this.selected=this.menu[i];
                    //           var el=this.element.find("ul li:nth-child(" + (i+1) + ")");
                    c=this.selected.element.parentNode.children;
                    for(var j=0;j<c.length;j++){
                        c[j].classList.remove("ui-state-active");
                    }
                    this.selected.element.classList.add("ui-state-active");
                    return;
                }
            }
	}
    };

    Harvey.Utils.extend(HarveyMakeMenu,Harvey._DisplayBase);

    // Create the namespace
    // Harvey.display.tabs
    // $.extend(true, Harvey, {
    Harvey.mixinDeep(Harvey,{
	display: {
	    menu: function(opts,win){
                opts.display="menu";
                return new HarveyMakeMenu(opts,win);
            },
            menuMethods:function(){
                var ar=[];
                for(var k in HarveyMakeMenu.prototype){
                    ar.push(k);
                }
                return ar;
            }
	}
    });



})();
