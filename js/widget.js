window.Widget = function(ti, wi, he, x, y, pa){
	if(ti == null && wi == null && he == null && x == null && y == null && pa == null){
		window.Widgets = [];
		document.onselectstart = function(){return false;};
		document.onmousemove = function(e){
			for(var i = 0; i < window.Widgets.length; i++){
				if(window.Widgets[i].drag == true){
					window.Widgets[i].translate(e.clientX - window.Widgets[i].tx, e.clientY - window.Widgets[i].ty);
				}
			}
		};
		return true;
	}
	
	var w = this;
	
	w.parent = pa;

	w.wrapper = document.createElement("div");
	w.tBar = document.createElement("div");
	w.cContainer = document.createElement("div");
	
	w.title = ti;
	w.width = wi;
	w.height = he;
	w.x = x;
	w.y = y;
	
	w.drag = false;
	w.tx = 0;
	w.ty = 0;
	
	w.build = function(){
		w.wrapper.style.display  = "none";
		w.wrapper.style.position = "absolute";
		w.wrapper.style.width = w.width + "px";
		w.wrapper.style.height = w.height + "px";
		w.wrapper.style.left = x + "px";
		w.wrapper.style.top = y + "px";
		w.wrapper.style.border = "1px solid rgb(81, 81, 81)";
		w.wrapper.style.fontFamily = "Noto Sans, Arial";
		w.wrapper.style.borderRadius = "3px";
		w.wrapper.style.overflow = "hidden";
		w.wrapper.style.boxShadow = "0 0 15px black, inset 0 0 10px black";
		w.wrapper.style.backgroundColor = "rgb(115, 115, 115)";
		w.wrapper.style.zIndex = window.Widgets.length + 1;
		w.wrapper.setAttribute("class", "widget-window");
	
		w.tBar.style.fontSize = "14px";
		w.tBar.style.padding = "3px 7px";
		w.tBar.style.backgroundColor = "rgb(81, 81, 81)";
		w.tBar.style.color = "white";
		w.tBar.style.borderBottom = "1px solid rgb(81, 81, 81)";
		w.tBar.style.textShadow = "0 0 5px rgb(200, 200, 200)";
		w.tBar.style.boxShadow = "0 0 10px black";
		w.tBar.innerHTML = w.title;
		w.tBar.setAttribute("class", "widget-window-titlebar");
		
		w.tBar.onmousedown = function(e){
			w.drag = true;
			w.tx = (navigator.appName == "Microsoft Internet Explorer") ? e.offsetX : e.layerX;
			w.ty = (navigator.appName == "Microsoft Internet Explorer") ? e.offsetY : e.layerY;
			
			w.tBar.style.cursor = "move";
			
			w.onTop();
			
			w.wrapper.style.zIndex = window.Widgets.length + 1;
			
			return true;
		};
		w.tBar.onmouseup = function(e){
			w.drag = false;
			
			w.tBar.style.cursor = "default";
			
			return true;
		};
		
		w.cContainer.style.overflowX = "hidden";
		w.cContainer.style.overflowY = "scroll";
		w.cContainer.style.width = (w.width + 20) + "px";
		w.cContainer.style.height = (w.height - 25) + "px";
		w.cContainer.style.clear = "both";
		w.cContainer.style.textShadow = "0 0 5px rgb(200, 200, 200)";
		w.cContainer.setAttribute("class", "widget-window-content");
		
		w.wrapper.appendChild(w.tBar);
		w.wrapper.appendChild(w.cContainer);
		
		w.parent.appendChild(w.wrapper);
		
		window.Widgets.push(w);
		
		return w;
	};
	
	w.addContent = function(c){
		w.cContainer.appendChild(c(w));
		
		return w;
	};
	
	w.addContentAtTop = function(c){
		if(w.cContainer.firstChild){
			w.cContainer.insertBefore(c(w), w.cContainer.firstChild);
		}else{
			w.cContainer.appendChild(c(w));
		}
		
		return w;
	};
	
	w.show = function(o){
		if(typeof o == "undefined"){
			$(w.wrapper).fadeIn(500);
		}else{
			w.wrapper.style.opacity = 0;
			w.wrapper.style.display = "block";
			$(w.wrapper).animate({
				"opacity":o
			}, 500);
		}
		
		return w;
	};
	
	w.hide = function(){
		$(w.wrapper).fadeOut(500);
		
		return w;
	};
	
	w.translate = function(x, y){
		w.x = x;
		w.y = y;
		
		w.wrapper.style.top = w.y + "px";
		w.wrapper.style.left = w.x + "px";
		
		return w;
	};
	
	w.setTitle = function(t, a){
		if(t.length > 20){
			t = t.substr(0, 20) + "[...]." + t.split(".").pop();
		}
		w.title = t;
		w.tBar.innerHTML = t + ((typeof a == "undefined") ? "" : a);
		
		return w;
	};
	
	w.setSize = function(wi, he){
		w.width = wi;
		w.height = he;
	
		w.wrapper.style.width = w.width + "px";
		w.wrapper.style.height = w.height + "px";
		w.cContainer.style.width = (w.width + 20) + "px";
		w.cContainer.style.height = (w.height - 25) + "px";
		
		return w;
	};
	
	w.onTop = function(){
		if(w.wrapper.style.zIndex <= window.Widgets.length){
			for(var i = 0; i < window.Widgets.length; i++){
				if(window.Widgets[i].wrapper.style.zIndex > 0){
					window.Widgets[i].wrapper.style.zIndex--;
				}
			}
		}
			
		w.wrapper.style.zIndex = window.Widgets.length + 1;
		
		return w;
	};
	
	w.destroy = function(){
		w.hide();
		w = null;
	};
	
	return w;
};