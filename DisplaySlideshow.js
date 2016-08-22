var Harvey=require('./declare').Harvey;
require("./DisplayBase");

;(function(){
    "use strict";
    var HarveyMakeSlideshow=function(options,win){
        var defaults={
	    autoplay: true,
	    fullscreen: true,
            delay: 4000,
	    element: null,
            editable: false, //unusual to make it uneditable
            thumbnails:false,
            current: 0,
            controls: true
	};
	var f,that=this;
        for(var k in defaults){
            if(options[k] === undefined){
                options[k]=defaults[k];
            }  
        }
        //Harvey.mixinDeep(options,defaults);
	Harvey._DisplayBase.call(this,options,win);  //use class inheritance - base Class
//	console.log("called display base");
        if(this.thumbnails === true){
            this.thumbnails=document.createElement("div"); 
            this.thumbnails.classList.add("thumbnails");
        }
        if(this.values){  // start preloading images
     //       console.log("got some values");
            f=Harvey.field["imageArray"]({name:"slideshow"});
            if(!f){
                throw new Error("Slideshow: cannot make imageArray");
            }
            this.promise=f.loadImages(this.values);
        }
        else if(this.editable === true){   // put up file browser to select images 
            f=Harvey.field["imageArray"]({name:"slideshow",editable: this.editable});
        }
        this._execute();
    };

    HarveyMakeSlideshow.prototype={
        _controls:function(){
            var that=this;
            var d,u,l,s,sibs;
            var icons=[{class:"ui-icon-seek-prev",action: "step",params:"prev"},
                       {class:"ui-icon-play",action: "play"},
                       {class:"ui-icon-pause",action: "stop"},
                       {class:"ui-icon-seek-next",action: "step",params: "next"},
                       {class:"ui-icon-arrow-4-diag",action:"showFullscreen"}];
            d=document.createElement("div");
            d.classList.add("slideshow_controls");
            u=document.createElement("ul");
            d.appendChild(u);
            u.addEventListener("mouseover",function(e){
                if(e.target.tagName === "LI"){
                    e.stopPropagation();
                    e.target.classList.add("ui-icon-hover");
                }
            });
            u.addEventListener("mouseout",function(e){
                if(e.target.tagName === "LI"){
                    e.stopPropagation();
                    e.target.classList.remove("ui-icon-hover");
                }
            });
            
            for(var i=0;i<icons.length;i++){
                if(icons[i].action === "showFullscreen" && this.fullscreen !== true){
                    continue;  //don't show the fullscreen icon
                }
                l=document.createElement("li");
                l.classList.add("ui-state-default","ui-corner-all");
                l.addEventListener("click",(function(icon,that){
                return function(e){
                    e.stopPropagation();
                    if(icon.action === "play" && that.interval){
                    //    console.log("already in play mode");
                        e.currentTarget.classList.remove("ui-state-active");
                        that["stop"]();
                        return;
                    }
                    e.currentTarget.classList.add("ui-state-active");
                    sibs=Harvey.Utils.getSiblings(e.currentTarget);
                 //   console.log("got siblings length " + sibs.length);
                    for(var j=0;j<sibs.length;j++){
                        sibs[j].classList.remove("ui-state-active");
                    }
                    if(icon.params){
                        that[icon.action](icon.params);
                    }
                    else{
                        that[icon.action](); 
                    }
                };
                })(icons[i],this),false);
                s=document.createElement("span");
                s.classList.add("ui-icon",icons[i].class);
                l.appendChild(s);
                u.appendChild(l);
            }
            that.element.appendChild(d);
            
        },
        _afterShow:function(){ //set the width and height when it has been determined
            var that=this,ar,lis=[];
           // console.log("AFTER SHOW IS HERE ");
            
            this.width=window.getComputedStyle(this.slideshow_container,null).getPropertyValue("width").split("px");
            this.height=window.getComputedStyle(this.slideshow_container,null).getPropertyValue("height").split("px");
           // console.log("slideshow container width " + this.width + " height " + this.height);
            this.width=parseFloat(this.width);
            this.height=parseFloat(this.height);
            ar=this.width/this.height;
            
            // get the slide container
            var car=this.slideshow_container.getElementsByTagName("ul")[0];
            if(this.promise){
                this.promise.then(function(){
                    lis=that.slideshow_container.querySelectorAll("li.slide");
             //       console.log("lis is " + lis + " lis.length " + lis.length);
                    if(lis.length !== that.values.length){
	                throw new Error("Slideshow: slide lis do not exist");
                    }
                    for(var i=0;i<that.values.length;i++){
               //         console.log("loading image " + i + " with aspect ratio " + that.values[i].aspect_ratio);
               //         console.log("image width " + that.values[i].width + " height " + that.values[i].height);
                        if(!lis[i].contains(that.values[i].SSimage)){
                            that.values[i].SSimage=document.createElement("img");
                            that.values[i].SSimage.src=that.values[i].src;
                            lis[i].appendChild(that.values[i].SSimage);
                        }
              //          console.log("image asepect ratio is " + that.values[i].aspect_ratio);
              //          console.log("window aspect ratio is " + ar);
	                if(that.values[i].aspect_ratio > ar){   //wider than window - fit to width
		            var h=that.width/that.values[i].aspect_ratio;
              //              console.log("new image height is " + h);
                            var w=((that.width).toString() + "px");
              //              console.log("new image width is " + w);
                            that.values[i].SSimage.style.width=w;
                            that.values[i].SSimage.style.height=(h.toString() + "px");
		            h=(that.height-h)/2;
		            that.values[i].SSimage.style.marginTop=(h.toString() + "px"); 
                            that.values[i].SSimage.style.marginBottom=(h.toString() + "px");
		        }
		        else{  // - fit to height
		            var w=that.height*that.values[i].aspect_ratio;
             //               console.log("new image width is " + w);
                            that.values[i].SSimage.style.width=(w + "px");
                            that.values[i].SSimage.style.height=(that.height + "px");
		            w=(that.width-w)/2;
                            that.values[i].SSimage.style.marginLeft=(w + "px");
                            that.values[i].SSimage.style.marginRight=(w + "px");
		        }
                        if(that.current=== i){
                            that.values[i].SSimage.style.visibility="visible";
                        }
                        else{
                            that.values[i].SSimage.style.visibility="hidden";
                        }
                    }
                    if(that.autoplay === true){
               //         console.log("trigger autoplay");
                        if(that.interval){
                            that.stop();
                        }
                        that.element.querySelector("span.ui-icon-play").click();
                    }
                }).catch(function(reason){
                    //remove the lis
                    Harvey.popup.error("Slideshow",("Could not load images" + reason));
                }); 
            }
        },
	_execute: function(){
            var that=this,l;
	//    console.log("execute of DisplaySlideshow");
	    this.element=document.createElement("div"); 
            this.element.id=this.id;
            this.element.classList.add("Harvey_slideshow","ui-widget-content","ui-corner-all");
            this.slideshow_container=document.createElement("div");
            this.slideshow_container.classList.add("slideshow","pic_area");
	    this.element.appendChild(this.slideshow_container);
            var car=document.createElement("ul");
            car.classList.add("carousel");
           
         /*   var left=document.createElement("span");
            left.classList.add("carousel_left","ui-state-default","ui-corner-all");
            var right=document.createElement("span");            
            right.classList.add("carousel_right","ui-state-default","ui-corner-all");
                    
            left.addEventListener("click",function(e){e.stopPropagation();
                                                      that.step("prev");},false);
            right.addEventListener("click",function(e){e.stopPropagation();
                                                       that.step("next");},false);

            this.slideshow_container.appendChild(left);
            this.slideshow_container.appendChild(right); */
	    that.slideshow_container.appendChild(car);
            for(var i=0;i<this.values.length;i++){ //create containers for images
                l=document.createElement("li");
                l.classList.add("slide");
                car.appendChild(l);
            }
            if(that.controls === true){
                that._controls();
            }
        },
        deleteAll:function(){
            // delete all the images
            if(this.values){
                for(var i=0;i<this.values;i++){
                    this.slideshow_container.removeChild(this.values[i].SSimage);
                }
            }
            while(this.element.firstChild){
                this.element.removeChild(this.element.firstChild);
            }
        },
        showFullscreen: function(){
	    // get the window width and height
	    var that=this,c,t;
	   // var width=$(window).width()-60; //innerWidth();
	    //var height=$(window).height()-60; //innerHeight();
            var width=parseInt(window.innerWidth-36);
            var height=parseInt(window.innerHeight-48);
            //if this node is in the DOM we are already in fullscreen mode
            var r=document.getElementsByClassName("slideshow_cover")[0];
     //       console.log("showFullscreen got width " + width + " height " + height);
	    that.element.parentNode.removeChild(this.element); 
     //       console.log("slideshow cover is " + r);
            // that.hide();
            that.stop();
	    if(!document.contains(r)){
//	        console.log("Fullscreen is truE- so do it");
	        that.element.style.width=(width.toString() + "px"); 
                that.element.style.height=(height.toString() + "px");
	        that.slideshow_container.style.width=(width.toString() + "px");
                that.slideshow_container.style.height=((height).toString() + "px");
	        //console.log("remove class pic_area");
	        that.slideshow_container.classList.remove("pic_area");
	        that.slideshow_container.classList.add("pic_area_full");
	        that.element.classList.add("show_full_screen");
                document.body.appendChild(that.element);
                c=that.element.querySelector("div.slideshow_controls");
                c.style.position="absolute";
                c.style.top=(height.toString() + "px");
                c.style.left=((width/2 -70).toString() + "px");
                t=document.createElement("div"); // add a big div to cover everything
                t.classList.add("slideshow_cover");
                document.body.appendChild(t);
                that._afterShow();
                window.scrollTo(0,0);
	    }
	    else{
                document.body.removeChild(r); // remove slideshow_cover
                // console.log("Fullscreen is falsE- so undo it");
	        that.element.style.width=""; 
                that.element.style.height="";
	        that.slideshow_container.style.width=""; 
                that.slideshow_container.style.height=""; 
	        that.element.classList.remove("show_full_screen");
	        that.slideshow_container.classList.remove("pic_area_full");
	        that.slideshow_container.classList.add("pic_area");
                c=that.element.querySelector("div.slideshow_controls");
                c.style.position="";
                c.style.top="";
                c.style.left="";
                if(this.after){
                    t=document.getElementById(that.after);
                    if(t){
                        t.parentNode.insertBefore(that.element,t.nextSibling);
                    }
                    else{
                        this.DOM.appendChild(that.element);
                    }
                }
                else{
                    that.DOM.appendChild(that.element);
                }
                that._afterShow();
	    }
        },
        play:function(){
            var that=this;
  //          console.log("play is here " + that);
            this.interval=setInterval(function(){that.step("next");},this.delay);
        },
        stop:function(){
            var that=this;
            if(this.interval){
                clearInterval(that.interval);
            }
            this.interval=null;
        },
        step: function(dir){
            var num=this.values.length;
           // console.log("next is here len vals is " + num + " current is " + this.current);
            this.values[this.current].SSimage.style.position="relative";
            this.values[this.current].SSimage.style.visibility="hidden";
            if(dir==="next"){
                if(this.current>=(num-1)){
                    this.current=0;
                }
                else{
                    this.current++;
                }
            }
            else{
                if(this.current <= 0){
                    this.current=num-1;
                }
                else{
                    this.current--;
                }
            }
            this.values[this.current].SSimage.style.visibility="visible"; 
            this.values[this.current].SSimage.style.position="absolute";
            this.values[this.current].SSimage.style.top=0;
            this.values[this.current].SSimage.style.left=0;
          //  console.log("now current is " + this.current);
        } /*,
        getImages: function(data,settings){
            if(!settings){
                settings={};
            }
            var promise=new Promise(function(resolve,reject){
                Harvey.REST("GET",settings,data);
            });
            promise.then(function(rd){
                for(var i=0;i<rd.length;i++){
                    this.values.push(rd[i]);
                }
            }).catch(function(reason){
                Harvey.popup.dialog("Slideshow: getImages could not load " + reason);
            });

            return promise;
        } */
    };

    Harvey.Utils.extend(HarveyMakeSlideshow,Harvey._DisplayBase);

 /*   Harvey.mixinDeep(Harvey,{
	display: {
	    slideshow: function(opts,win){
                opts.display="slideshow";
                return new HarveyMakeSlideshow(opts,win);
            },
            slideshowMethods:function(){
                var ar=[];
                for(var k in HarveyMakeSlideshow.prototype){
                    ar.push(k);
                }
                return ar;
            }
	}
    }); */
    Harvey.display.slideshow=function(opts,win){
        opts.display="slideshow";
        return new HarveyMakeSlideshow(opts,win);
    };
    Harvey.display.slideshowMethods=function(){
        var ar=[];
        for(var k in HarveyMakeSlideshow.prototype){
            ar.push(k);
        }
        return ar; 
    };


})();
