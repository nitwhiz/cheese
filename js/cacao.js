var Cacao = function(parent, options, style){
	if(typeof window.Cups == "undefined"){
		window.Cups = [];
		document.onselectstart = function(){return false;};
		document.onmousemove = function(e){
			for(var i = 0; i < window.Cups.length; i++){
				if(window.Cups[i].drag == true){
					window.Cups[i].translate(e.clientX - window.Cups[i].tx, e.clientY - window.Cups[i].ty);
				}
			}
		};
		return true;
	}

	if(!(parent instanceof HTMLElement)){
		console.error("[Cacao] parent: [" + typeof parent + "] is NOT a HTML elment!");
		return false;
	}
	
	if(options == null){
		options = {};
	}
	
	var cacao = this.cacao = this;
	
	cacao.Parent = parent;
	cacao.Wrapper
	= cacao.TitleBar
	= cacao.Content
	= null;
	
	(options.title 	== null) ? options.title = "No Title" : 0;
	(options.x 		== null) ? options.x = 10 : 0;
	(options.y 		== null) ? options.y = 10 : 0;
	(options.width 	== null) ? options.width = -1 : 0;
	(options.height == null) ? options.height = -1 : 0;
	
	cacao.options = options;
	
	cacao.tx = 0;
	cacao.ty = 0;
	cacao.drag = false;
	cacao.built = false;
	
	cacao.style = style;
	
	cacao.build = function(){
		cacao.Wrapper = document.createElement("div");
		cacao.TitleBar = document.createElement("div");
		cacao.Content = document.createElement("div");
		
		cacao.Wrapper.appendChild(cacao.TitleBar);
		cacao.Wrapper.appendChild(cacao.Content);
		
		cacao.Wrapper.style.position = "absolute";
		cacao.Wrapper.style.top = parseInt(cacao.options.y) + "px";
		cacao.Wrapper.style.left = parseInt(cacao.options.x) + "px";
		(cacao.options.width != -1) ? cacao.Wrapper.style.width = parseInt(cacao.options.width) + "px" : 0;
		(cacao.options.height != -1) ? cacao.Wrapper.style.height = parseInt(cacao.options.height) + "px" : 0;
		
		cacao.TitleBar.onmousedown = function(e){
			cacao.drag = true;
			cacao.tx = (navigator.appName == "Microsoft Internet Explorer") ? e.offsetX : e.layerX;
			cacao.ty = (navigator.appName == "Microsoft Internet Explorer") ? e.offsetY : e.layerY;
			
			cacao.TitleBar.style.cursor = "move";
			
			cacao.onTop();
			
			return true;
		};
		
		cacao.TitleBar.onmouseup = function(e){
			cacao.drag = false;
			
			cacao.TitleBar.style.cursor = "default";
			
			return true;
		};
		
		for(var o in cacao.style){
			if(o != "Buttons"){
				for(var s in cacao.style[o]){
					cacao[o].style[s] = cacao.style[o][s];
				}
			}
		}
		
		cacao.setTitle(cacao.options.title);
		
		cacao.append();
		
		cacao.built = true;
		
		return cacao;
	};
	
	cacao.appendContent = function(co){
		if(co instanceof HTMLElement){
			cacao.Content.appendChild(co);
		}else if(co instanceof Object){
			for(var a in co){
				var x = document.createElement(a);
				for(var b in co[a]){
					if(b == "text"){
						x.innerHTML = co[a][b];
					}else if(b == "style"){
						for(var c in co[a][b]){
							x.style[c] = co[a][b][c];
						}
					}else if(b == "attributes"){
						for(var c in co[a][b]){
							x.setAttribute(c, co[a][b][c]);
						}
					}
				}
				cacao.Content.appendChild(x);
			}
		}else{
			console.error("[Cacao] appendContent(): contentobject [" + typeof co + "] is NOT an Object or HTMLElement!");
		}
		
		return cacao;
	};
	
	cacao.setContent = function(co){
		if(co instanceof HTMLElement){
			cacao.Content.innerHTML = "";
			cacao.Content.appendChild(co);
		}else if(co instanceof Object){
			cacao.Content.innerHTML = "";
			for(var a in co){
				var x = document.createElement(a);
				for(var b in co[a]){
					if(b == "text"){
						x.innerHTML = co[a][b];
					}else if(b == "style"){
						for(var c in co[a][b]){
							x.style[c] = co[a][b][c];
						}
					}else if(b == "attributes"){
						for(var c in co[a][b]){
							x.setAttribute(c, co[a][b][c]);
						}
					}
				}
				cacao.Content.appendChild(x);
			}
		}else{
			console.error("[Cacao] appendContent(): contentobject [" + typeof co + "] is NOT an Object or HTMLElement!");
		}
		
		return cacao;
	};
	
	cacao.setTitle = function(t){
		cacao.TitleBar.innerHTML = t; 
	};
	
	cacao.getTitle = function(){
		return cacao.TitleBar.innerHTML;
	};
	
	cacao.onTop = function(){
		if(cacao.Wrapper.style.zIndex <= window.Cups.length){
			for(var i = 0; i < window.Cups.length; i++){
				if(window.Cups[i].Wrapper.style.zIndex > 0){
					window.Cups[i].Wrapper.style.zIndex--;
				}
			}
		}
			
		cacao.Wrapper.style.zIndex = window.Cups.length + 1;
		
		return cacao;
	};
	
	cacao.translate = function(x, y){	
		cacao.Wrapper.style.top = y + "px";
		cacao.Wrapper.style.left = x + "px";
		
		return cacao;
	};
	
	cacao.append = function(){
		window.Cups.push(cacao);
		cacao.Parent.appendChild(cacao.Wrapper);
		
		return cacao;
	};
	
	return cacao;
};