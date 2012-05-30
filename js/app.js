WebFontConfig = {
	google:{families:["Noto+Sans::latin"]}
};

(function(){
	var wf = document.createElement("script");
	wf.src = ("https:" == document.location.protocol ? "https" : "http") +
		"://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
	wf.type = "text/javascript";
	wf.async = "true";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(wf, s);
})();

var moblur = {
	0:{x:-1, y:-1, f:0},
	1:{x: 0, y:-1, f:0},
	2:{x: 1, y:-1, f:1},

	3:{x:-1, y: 0, f:0},
	4:{x: 0, y: 0, f:0},
	5:{x: 1, y: 0, f:0},

	6:{x:-1, y: 1, f:1},
	7:{x: 0, y: 1, f:0},
	8:{x: 1, y: 1, f:0},

	w:3, h:3, d:2
};

var laplacian = {
	0:{x:-1, y:-1, f: 0},
	1:{x: 0, y:-1, f:-1},
	2:{x: 1, y:-1, f: 0},

	3:{x:-1, y: 0, f:-1},
	4:{x: 0, y: 0, f: 4},
	5:{x: 1, y: 0, f:-1},

	6:{x:-1, y: 1, f: 0},
	7:{x: 0, y: 1, f:-1},
	8:{x: 1, y: 1, f: 0},

	w:3, h:3, d:4
};

var smoothing = {
	0:{x:-1, y:-1, f:1},
	1:{x: 0, y:-1, f:1},
	2:{x: 1, y:-1, f:1},

	3:{x:-1, y: 0, f:1},
	4:{x: 0, y: 0, f:2},
	5:{x: 1, y: 0, f:1},

	6:{x:-1, y: 1, f:1},
	7:{x: 0, y: 1, f:1},
	8:{x: 1, y: 1, f:1},

	w:3, h:3, d:10
};

var shiny = {
	0:{x:-1, y:-1, f:-1},
	1:{x: 0, y:-1, f:-1},
	2:{x: 1, y:-1, f:-1},

	3:{x:-1, y: 0, f:-1},
	4:{x: 0, y: 0, f: 2},
	5:{x: 1, y: 0, f:-1},

	6:{x:-1, y: 1, f:-1},
	7:{x: 0, y: 1, f:-1},
	8:{x: 1, y: 1, f:-1},

	w:3, h:3, d:-5
};

var awake = {
	0:{x:-1, y:-1, f:-1},
	1:{x: 0, y:-1, f: 1},
	2:{x: 1, y:-1, f:-1},

	3:{x:-1, y: 0, f:-1},
	4:{x: 0, y: 0, f: 2},
	5:{x: 1, y: 0, f:-1},

	6:{x:-1, y: 1, f:-1},
	7:{x: 0, y: 1, f: 1},
	8:{x: 1, y: 1, f:-1},

	w:3, h:3, d:-2
};

var pic = null,
	w_filters = null,
	w_img = null,
	w_protocol = null,
	w_transfer = null,
	undoa = null,
	newa = null,
	downa = null;
var undos = [];

var ow = oh = 0;

function uploadfile(){
	$("#fu").click();
}

function handleupload(f){
	var a = $("#drop")[0];
	var b = document.createElement("img");

	var c = false;

	var t = false;
	var r = new FileReader();
	r.readAsDataURL(f[0]);
	r.onload = function(){
		var data = r.result;
		b.src = data;
		b.onload = function(){
			if(!t){
				a.innerHTML = "";
				ow = parseInt(b.width);
				oh = parseInt(b.height);
				if(parseInt(b.width) > 800 || parseInt(b.height) > 600){
					if(Math.max(b.width, b.height) == b.width){
						var e = 800 / b.width;
						b.width = 800;
						b.height = Math.floor(parseInt(b.height) * e);
					}else{
						var e = 600 / b.height;
						b.width =  Math.floor(parseInt(b.width) * e);
						b.height = 600;
					}
					c = true
				}
				a.style.width = b.width + "px";
				a.style.height = b.height + "px";
				a.appendChild(b);

				pic = new Imagine(b, ow, oh);
				pic.save();

				w_img.setSize(b.width + 20, b.height + 46);
				w_img.setTitle(f[0].name);
			}
			t = true;
		};
	};
}

function action(n){
	undos.push(pic.getData());
	undoa.style.backgroundImage = "url(assets/undo.png)";
	undoa.style.cursor = "pointer";

	if(typeof n != "undefined"){
		w_protocol.addContentAtTop(function(){
			var a = document.createElement("div");
			var b = document.createElement("img");
			var c = document.createElement("div");

			a.style.height = "30px";
			a.style.color = "lightgrey";
			a.style.textShadow = "0 0 2px rgb(200, 200, 200)";
			a.style.fontSize = "11px";
			a.style.lineHeight = "30px";
			a.style.backgroundColor = "rgb(95, 95, 95)";
			a.style.borderBottom = "1px solid rgb(55, 55, 55)";
			a.style.overflow = "hidden";

			b.src = pic.getURL();
			var e = 20 / pic.vc.height;
			b.style.width = pic.vc.width * e + "px";
			b.style.height = "20px";
			b.style.marginLeft = "4px";
			b.style.marginTop = "4px";
			b.style.marginRight = "4px";
			b.style.border = "1px solid rgb(55, 55, 55)";
			b.style.cssFloat = "left";

			b.src = pic.getURL();

			c.appendChild(b);
			a.innerHTML = c.innerHTML + n;

			return a;
		});
	}
}

function undo(){
	if(undos.length > 0){
		undos.pop();
		w_protocol.cContainer.removeChild(w_protocol.cContainer.firstChild);
		if(undos.length == 0){
			undoa.style.backgroundImage = "url(assets/noundo.png)";
			undoa.style.cursor = "not-allowed";
			pic.restore();
		}else{
			pic.putData(undos[undos.length - 1]);
		}
	}
}

function allnew(){
	pic = null;
	undos = [];
	$("#fu")[0].value = "";

	var a = w_img.cContainer.getElementsByTagName("div")[0];
	a.innerHTML = "<br><br>drop image here.<br>or click <a href=\"javascript:void(0);\" onclick=\"uploadfile();\" style=\"color:rgb(164, 164, 164);text-decoration:none;\">here</a>.";
	a.style.width = "400px";
	a.style.height = "270px";

	w_img.setSize(420, 316);
	w_img.setTitle("Image");

	w_protocol.cContainer.innerHTML = "";

	undoa.style.backgroundImage = "url(assets/noundo.png)";
	undoa.style.cursor = "not-allowed";
}

function share(){
	// removed
}

function download(){
	if(pic != null){
		location.href = pic.getURL();
	}
}

function app(){
	new Widget();

	var z = document.createElement("a");
	z.style.position = "absolute";
	z.style.left = "100%";
	z.style.marginLeft = "-26px";
	z.style.width = "24px";
	z.style.height = "24px";
	z.style.backgroundImage = "url(assets/noundo.png)";
	z.style.cursor = "not-allowed";
	z.href = "javascript:void(0);";
	z.onclick = function(e){e.stopPropagation();e.preventDefault();undo();};
	z.onmousemove = function(e){e.stopPropagation();e.preventDefault();};
	z.setAttribute("title", "Remove last Filter");
	undoa = z;

	var y = document.createElement("a");
	y.style.position = "absolute";
	y.style.left = "100%";
	y.style.marginLeft = "-52px";
	y.style.width = "24px";
	y.style.height = "24px";
	y.style.backgroundImage = "url(assets/new.png)";
	y.style.cursor = "pointer";
	y.href = "javascript:void(0);";
	y.onclick = function(e){e.stopPropagation();e.preventDefault();allnew();};
	y.onmousemove = function(e){e.stopPropagation();e.preventDefault();};
	y.setAttribute("title", "New");
	newa = y;

	var x = document.createElement("a");
	x.style.position = "absolute";
	x.style.left = "100%";
	x.style.marginLeft = "-78px";
	x.style.width = "24px";
	x.style.height = "24px";
	x.style.backgroundImage = "url(assets/download.png)";
	x.style.cursor = "pointer";
	x.href = "javascript:void(0);";
	x.onclick = function(e){e.stopPropagation();e.preventDefault();download();};
	x.onmousemove = function(e){e.stopPropagation();e.preventDefault();};
	x.setAttribute("title", "Download");
	downa = x;

	$("#fu")[0].onchange = function(){
		if(this.value != ""){
			handleupload(this.files);
		}
	};

	w_transfer = new Widget("Image is uploading to Facebook", 410, 70, 450, 46, $("#wrapper")[0]).build().addContent(function(w){
		var a = document.createElement("p");

		a.style.color = "white";
		a.style.margin = "10px";
		a.style.padding = "0px";
		a.style.fontSize = "14px";

		a.innerHTML = "The truck with the magic is on its way, please wait...";

		return a;
	});

	w_img = new Widget("Image", 420, 316, 440, 10, $("#wrapper")[0]).build()
		.addContent(function(w){
			var t = false;

			var a = document.createElement("div");
			var b = document.createElement("img");

			var c = false;

			a.id = "drop";
			a.style.width = "400px";
			a.style.height = "270px";
			a.style.margin = "6px";
			a.style.border = "4px dashed rgb(193, 193, 193)";
			a.style.color = "rgb(193, 193, 193)";
			a.style.textAlign = "center";
			a.style.fontWeight = "bold";
			a.style.fontSize = "30px";
			a.style.textShadow = "none";
			a.innerHTML = "<br><br>drop image here.<br>or click <a href=\"javascript:void(0);\" onclick=\"uploadfile();\" style=\"color:rgb(164, 164, 164);text-decoration:none;\">here</a>.";
			a.ondragenter = function(e){e.stopPropagation();e.preventDefault();};
			a.ondragexit = function(e){e.stopPropagation();e.preventDefault();};
			a.ondragover = function(e){e.stopPropagation();e.preventDefault();};
			a.ondrop = function(e){
				e.stopPropagation();
				e.preventDefault();
				t = false;
				var fs = e.dataTransfer.files;
				var n = fs[0].name;
				var r = new FileReader();
				r.readAsDataURL(fs[0]);
				r.onload = function(){
					var data = r.result;
					b.src = data;
					b.onload = function(){
						if(!t){
							a.innerHTML = "";
							ow = parseInt(b.width);
							oh = parseInt(b.height);
							if(parseInt(b.width) > 800 || parseInt(b.height) > 600){
								if(Math.max(b.width, b.height) == b.width){
									var e = 800 / b.width;
									b.width = 800;
									b.height = Math.floor(parseInt(b.height) * e);
								}else{
									var e = 600 / b.height;
									b.width =  Math.floor(parseInt(b.width) * e);
									b.height = 600;
								}
								c = true;
							}
							a.style.width = b.width + "px";
							a.style.height = b.height + "px";
							w.setSize(b.width + 20, b.height + 46);
							w.setTitle(n);
							b.setAttribute("alt", n);
							b.setAttribute("title", n);
							a.appendChild(b);
							pic = new Imagine(b, ow, oh);
							pic.save();
						}
						t = true;
					};
				};
			};

			return a;
		}).show().onTop();

	w_protocol = new Widget("Protocol", 200, $(document).height() - 20, $(document).width() - 210, 10, $("#wrapper")[0]).build().show();
	w_protocol.tBar.appendChild(undoa);
	w_protocol.tBar.appendChild(newa);
	w_protocol.tBar.appendChild(downa);

	w_filters = new Widget("Filters", 411, $(document).height() - 20, 10, 10, $("#wrapper")[0]).build().show();

	var addFilter = function(fname, fapplyonthumb, fchanges, invokeaction){
		w_filters.addContent(function(w){
			var t = false;

			var a = document.createElement("div");
			var b = document.createElement("img");
			var c = document.createElement("div");

			a.style.cssFloat = "left";
			a.style.width = "137px";

			b.src = "assets/colourhand.jpg";
			b.style.margin = "6px 6px 0 6px";
			b.style.boxShadow = "0 0 5px black";
			b.onmouseover = function(){
				b.style.cursor = "pointer";
			};
			b.onmouseout = function(){
				b.style.cursor = "default";
			};
			b.onclick = function(){
				if(pic != null){
					w_filters.setTitle("Filters (working...)");
					setTimeout(function(){
						fchanges(pic, false);
						if(typeof invokeaction != "undefined" && invokeaction == true){
							action(fname);
						}
						w_filters.setTitle("Filters");
					}, 10);
				}
			};

			c.innerHTML = fname;
			c.style.width = "137px";
			c.style.fontSize = "12px";
			c.style.color = "white";
			c.style.textAlign = "center";

			b.onload = function(){
				if(!t && fapplyonthumb){
					var ow = parseInt(b.width);
					var oh = parseInt(b.height);
					fchanges(new Imagine(b, ow, oh), true);
				}
				t = true;
			};

			a.appendChild(b);
			a.appendChild(c);

			return a;
		})
	};

	addFilter("Normal", false, function(fp){
		fp.restore();
	}, true);

	addFilter("1840", true, function(fp){
		fp.greyscale();
	}, true);

	addFilter("Dry", true, function(fp){
		fp.saturation(.5);
	}, true);

	addFilter("The Old Days", true, function(fp){
		fp.greyscale()
		  .multiply(228, 168, 82)
		  .saturation(.5);
	}, true);

	addFilter("Scary", true, function(fp){
		fp.negative();
	}, true);

	addFilter("Compliment", true, function(fp){
		fp.hue(180);
	}, true);

	addFilter("Reeed", true, function(fp){
		fp.add(30, 0, 0);
	}, true);

	addFilter("Greeen", true, function(fp){
		fp.add(0, 30, 0);
	}, true);

	addFilter("Blueee", true, function(fp){
		fp.add(0, 0, 30);
	}, true);

	addFilter("CSI: Miami", true, function(fp){
		fp.saturation(1.5)
		  .add(45, 35, 0);
	}, true);

	addFilter("Drunken", true, function(fp){
		fp.filter(moblur, 2);
	}, true);

	addFilter("Comic", true, function(fp){
		fp.saturation(1.5).each(function(RGB){
			if(RGB.R <= 42){
				RGB.R = 0;
			}else if(RGB.R <= 85){
				RGB.R = 85;
			}else if(RGB.R <= 170){
				RGB.R = 170;
			}else{
				RGB.R = 255;
			}

			return RGB.R;
		}, function(RGB){
			if(RGB.G <= 42){
				RGB.G = 0;
			}else if(RGB.G <= 85){
				RGB.G = 85;
			}else if(RGB.G <= 170){
				RGB.G = 170;
			}else{
				RGB.G = 255;
			}

			return RGB.G;
		}, function(RGB){
			if(RGB.B <= 42){
				RGB.B = 0;
			}else if(RGB.B <= 85){
				RGB.B = 85;
			}else if(RGB.B <= 170){
				RGB.B = 170;
			}else{
				RGB.B = 255;
			}

			return RGB.B;
		}).eachRGB(function(RGB, lRGB, i){
			if(!(i % 1.5)){
				RGB.R = RGB.R - 15;
				RGB.G = RGB.G - 15;
				RGB.B = RGB.B - 15;
			}

			return RGB;
		});
	}, true);

	addFilter("Woodstock", true, function(fp){
		fp.add(25, 0, 0)
		  .saturation(.5)
		  .add(0, 0, 15);
	}, true);

	addFilter("Juicy", true, function(fp){
		fp.saturation(1.5);
	}, true);

	addFilter("Signal", true, function(fp){
		fp.randNoise(15);
	}, true);

	addFilter("Shiny", true, function(fp, onthumb){
		var a = new Image();
		var t = 0;
		a.src = fp.getURL();
		a.width = fp.img.width;
		a.height = fp.img.height;
		a.onload = function(){
			if(t != 1){
				var vfp = new Imagine(a, fp.img.width, fp.img.height);

				vfp.filter(shiny);

				fp.eachRGB(function(RGB, lRGB, i){
					return {
						R:Math.floor((RGB.R + vfp.getPixelByIndex(i).R) / 2),
						G:Math.floor((RGB.G + vfp.getPixelByIndex(i).G) / 2),
						B:Math.floor((RGB.B + vfp.getPixelByIndex(i).B) / 2)
					};
				});

				if(!onthumb){
					action("Shiny");
				}
			}
			t++;
		};
	}, false);

	addFilter("Awake", true, function(fp, onthumb){
		var a = new Image();
		var t = 0;
		a.src = fp.getURL();
		a.width = fp.img.width;
		a.height = fp.img.height;
		a.onload = function(){
			if(t != 1){
				var vfp = new Imagine(a, fp.img.width, fp.img.height);

				vfp.filter(awake).value(1.5);

				fp.saturation(.75).eachRGB(function(RGB, lRGB, i){
					return {
						R:Math.floor(RGB.R + vfp.getPixelByIndex(i).R / 3),
						G:Math.floor(RGB.G + vfp.getPixelByIndex(i).G / 3),
						B:Math.floor(RGB.B + vfp.getPixelByIndex(i).B / 3)
					};
				});

				if(!onthumb){
					action("Awake");
				}
			}
			t++;
		};
	}, false);

	addFilter("Rainbow", true, function(fp, onthumb){
		var a = new Image();
		var t = 0;
		a.src = "assets/rainbow.jpg";
		a.width = fp.img.width;
		a.height = fp.img.height;
		a.onload = function(){
			if(t != 1){
				var vfp = new Imagine(a, 800, 600);
				vfp.getData();

				fp.eachRGB(function(RGB, lRGB, i){
					return {
						R:Math.floor(RGB.R * (vfp.getPixelByIndex(i).R / 255)),
						G:Math.floor(RGB.G * (vfp.getPixelByIndex(i).G / 255)),
						B:Math.floor(RGB.B * (vfp.getPixelByIndex(i).B / 255))
					};
				}).saturation(.5);

				if(!onthumb){
					action("Rainbow");
				}
			}
			t++;
		};
	}, false);

	addFilter("Nashville", true, function(fp, onthumb){
		var a = new Image();
		var t = 0;
		a.src = fp.getURL();
		a.width = fp.img.width;
		a.height = fp.img.height;
		a.onload = function(){
			if(t != 1){
				var vfp = new Imagine(a, fp.img.width, fp.img.height);

				vfp.filter(laplacian);

				fp.eachRGB(function(RGB, lRGB, i){
					return {
						R:Math.floor((RGB.R + vfp.getPixelByIndex(i).R)),
						G:Math.floor((RGB.G + vfp.getPixelByIndex(i).G)),
						B:Math.floor((RGB.B + vfp.getPixelByIndex(i).B))
					};
				}).eachRGB(function(RGB){
					var i = RGB.B / 255;

					RGB.B = 127 + 127 * i;
					return {
						R:RGB.R,
						G:RGB.G,
						B:RGB.B
					};
				}).eachRGB(function(RGB){
					var R = RGB.R;
					var G = RGB.G;
					var B = RGB.B;

					var p0, p1, p2, p3, i = 0;

					var cmr = function(a, b, c, d, i){
						return a * ((-i + 2) * i - 1) * i * .5 +
							b * (((3 * i - 5) * i) * i + 2) * .5 +
							c * ((-3 * i + 4) * i + 1) * i * .5 +
							d * ((i - 1) * i * i) * .5;
					};

					if(R <= 57){
						p0 = 0;
						p1 = 0;
						p2 = 19;
						p3 = 255;

						i = ((p2 - p1) * ((R - p1) / (p2 - p1))) / (57 - p1);
					}else if(R <= 101){
						p0 = 0;
						p1 = 19;
						p2 = 111;
						p3 = 255;

						i = (R - p1) / (101 - p1);
					}else if(R <= 170){
						p0 = 19;
						p1 = 111;
						p2 = 188;
						p3 = 255;

						i = (R - p1) / (170 - p1);
					}else{
						p0 = 111;
						p1 = 188;
						p2 = 255;
						p3 = 255;

						i = (R - p1) / (255 - p1);
					}

					R = cmr(p0, p1, p2, p3, i);

					if(G <= 19){
						p0 = 0;
						p1 = 0;
						p2 = 3;
						p3 = 255;

						i = ((p2 - p1) * ((G - p1) / (p2 - p1))) / (19 - p1);
					}else if(G <= 71){
						p0 = 0;
						p1 = 3;
						p2 = 86;
						p3 = 130;

						i = (G - p1) / (71 - p1);
					}else if(G <= 116){
						p0 = 3;
						p1 = 86;
						p2 = 130;
						p3 = 185;

						i = (G - p1) / (116 - p1);
					}else if(G <= 192){
						p0 = 86;
						p1 = 130;
						p2 = 185;
						p3 = 229;

						i = ((p2 - p1) * ((G - p1) / (p2 - p1))) / (192 - p1);
					}else{
						p0 = 130;
						p1 = 185;
						p2 = 229;
						p3 = 255;

						i = ((p2 - p1) * ((G - p1) / (p2 - p1))) / (255 - p1);
					}

					G = cmr(p0, p1, p2, p3, i);

					if(B == 0){
						B = 64;
					}else{
						p0 = 0;
						p1 = 64;
						p2 = 208;
						p3 = 255;

						i = i = ((p2 - p1) * ((B - p1) / (p2 - p1))) / (255 - p1);

						B = cmr(p0, p1, p2, p3, i);
					}

					return {
						R:R,
						G:G,
						B:B
					};
				}).multiply(247, 217, 173);

				if(!onthumb){
					action("Nashville");
				}
			}
			t++;
		};
	}, false);

	addFilter("Tunnelvision", true, function(fp, onthumb){
		var a = new Image();
		var t = 0;
		a.src = "assets/border-gradient.jpg";
		a.width = fp.img.width;
		a.height = fp.img.height;
		a.onload = function(){
			if(t != 1){
				var vfp = new Imagine(a, 800, 600);
				vfp.getData();

				fp.eachRGB(function(RGB, lRGB, i){
					return {
						R:Math.floor(RGB.R * (vfp.getPixelByIndex(i).R / 255)),
						G:Math.floor(RGB.G * (vfp.getPixelByIndex(i).G / 255)),
						B:Math.floor(RGB.B * (vfp.getPixelByIndex(i).B / 255))
					};
				});

				if(!onthumb){
					action("Tunnelvision");
				}
			}
			t++;
		};
	}, false);

	addFilter("Sunglasses", true, function(fp){
		fp.saturation(.5).add(100, 25, -50).add(-50, -50, -50);
	}, true);

}
