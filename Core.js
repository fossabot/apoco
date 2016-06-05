global.Harvey=require('./declare').Harvey;
global.UI=require('./declare').UI;
require("./index.js");
require("./Utils.js");
require("./Panel.js");
require("./Popups.js");


// Harvey is a singleton 

(function(){
    'use strict';

    var DEBUG=false;
    var that=this;
    window.onerror=function(msg,url,lineno){
        //Harvey.Error=Harvey.popup.dialog({id:"Harvey_Error"});
	Harvey.popup.error(url, ("line number " + lineno + " " + msg));
    };

/*
    window.onerror=function(msg,url,lineno,colno,error){
	Harvey.display.dialog(url, ("line number " + lineno + " " + msg + " stack trace " + error.stack ));
    };  */
    window.addEventListener('beforeunload',function(e){  // 5 seconds to delete everything
        window.document.body.style.visibility="hidden";
        var t;
        var d=new Promise(function(resolve,reject){
            t=window.setTimeout(function(){Harvey.Panel.deleteAll(resolve); },50000);
        });
        d.then( function(){
            window.clearTimeout(t);
        }).catch(function(result){
            
        });
    });
   

    //$.extend(true,Harvey,{
    Harvey.mixinDeep(Harvey,{
	start: function(options) {
	    // Harvey.popup.spinner(true);
            console.log("++++++++++++++++++++++++++++++== Harvey start is here ");
            console.log("options are %j ",options);
            if(options){
	        if(!Harvey.checkType["array"](options) && Harvey.checkType["object"](options)){
		    var p=Harvey.display[options.display](options);
		    if(p){
		        p.show();
		    }
		    else {
		        throw new Error("could not execute " + options.display);
		    }
	        }
                else if(Harvey.checkType["array"](options)){
                    Harvey.Panel.UIStart(options);
                }
                else{
                    throw new Error("Harvey.start: Unknown options");
                }
            }
        },
        stop: function(){
            Harvey.Panel.deleteAll();
            if(Harvey.webSocket){
                Harvey.webSocket.close();
            }

        }

    });
 
})();
