window.Imagine = function(img, ow, oh){
	this.vc = document.createElement("canvas");
	this.vctx = this.vc.getContext("2d");
	this.img = img;
	this.ctxData = null;
	var bn = this.img.src.substr(this.img.src.indexOf("/") + 1, this.img.src.indexOf(";") - this.img.src.indexOf("/") - 1);
	var fn = this.img.src.split(".").pop();
	if(fn == "jpg"){fn = "jpeg";}
	this.fileType = (bn != "") ? bn : fn;
	
	this.ow = ow;
	this.oh = oh;
	this.vc.width = this.img.width;
	this.vc.height = this.img.height;
	this.vctx.drawImage(this.img, 0, 0, ow, oh, 0, 0, this.img.width, this.img.height);
	this.originalData = null;
	
	this.timesCounter = 0;
	
	this.getURL = function(){
		return this.vctx.canvas.toDataURL("image/" + this.fileType);
	};
	
	this.getData = function(){
		this.ctxData = this.vctx.getImageData(0, 0, this.vc.width, this.vc.height);
		return this.ctxData;
	};
	
	this.apply = function(){	
		this.vctx.putImageData(this.ctxData, 0, 0);
		this.img.src = this.getURL();
		
		return this;
	};
	
	this.save = function(){
		this.getData();
		this.originalData = this.ctxData;
		
		return this.originalData;
	};
	
	this.restore = function(){
		this.ctxData = this.originalData;
		this.apply();
		
		return this;
	};
	
	this.putData = function(d){
		this.ctxData = d;
		this.apply();
		
		return this;
	};
	
	/* TODO: antialiasing */
	this.smooth = function(){
		this.vctx.globalAlpha = .5;
	
		this.vctx.translate(.5, .5);
		this.vctx.drawImage(this.img, 0, 0, ow, oh, 0, 0, this.img.width, this.img.height);
		this.vctx.translate(-.5, -.5);
		
		this.vctx.translate(-.5, -.5);
		this.vctx.drawImage(this.img, 0, 0, ow, oh, 0, 0, this.img.width, this.img.height);
		this.vctx.translate(.5, .5);
		
		this.vctx.translate(.5, -.5);
		this.vctx.drawImage(this.img, 0, 0, ow, oh, 0, 0, this.img.width, this.img.height);
		this.vctx.translate(-.5, .5);
		
		this.vctx.translate(-.5, .5);
		this.vctx.drawImage(this.img, 0, 0, ow, oh, 0, 0, this.img.width, this.img.height);
		this.vctx.translate(.5, -.5);
		
		this.vctx.globalAlpha = 1;
		
		this.getData();
		this.apply();
		
		return this;
	};
	
	this.greyscale = function(){
		this.getData();
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			var c = 0.299 * this.ctxData.data[i]
					+ 0.587 * this.ctxData.data[i + 1]
					+ 0.114 * this.ctxData.data[i + 2];
					
			this.ctxData.data[i] 	 = c;
			this.ctxData.data[i + 1] = c;
			this.ctxData.data[i + 2] = c;
		}
		
		this.apply();
		
		return this;
	};
	
	this.negative = function(){
		this.getData();
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			this.ctxData.data[i] 	 = 255 - this.ctxData.data[i];
			this.ctxData.data[i + 1] = 255 - this.ctxData.data[i + 1];
			this.ctxData.data[i + 2] = 255 - this.ctxData.data[i + 2];
		}
		
		this.apply();
		
		return this;
	};
	
	this.multiply = function(r, g, b){
		this.getData();
		
		var R, G, B, nR, nG, nB = 0;
		
		if(typeof g == "undefined" && typeof b == "undefined"){
			for(var i = 0; i < this.ctxData.data.length; i += 4){
				R = this.ctxData.data[i];
				G = this.ctxData.data[i + 1];
				B = this.ctxData.data[i + 2];
				
				nR = Math.abs(Math.floor(r * (R / 255)));
				nG = Math.abs(Math.floor(r * (G / 255)));
				nB = Math.abs(Math.floor(r * (B / 255)));
				
				this.ctxData.data[i] 	 = (nR > 255) ? 255 : nR;
				this.ctxData.data[i + 1] = (nG > 255) ? 255 : nG;
				this.ctxData.data[i + 2] = (nB > 255) ? 255 : nB;
			}
		}else{
			for(var i = 0; i < this.ctxData.data.length; i += 4){
				R = this.ctxData.data[i];
				G = this.ctxData.data[i + 1];
				B = this.ctxData.data[i + 2];
				
				nR = Math.abs(Math.floor(r * (R / 255)));
				nG = Math.abs(Math.floor(g * (G / 255)));
				nB = Math.abs(Math.floor(b * (B / 255)));
				
				this.ctxData.data[i] 	 = (nR > 255) ? 255 : nR;
				this.ctxData.data[i + 1] = (nG > 255) ? 255 : nG;
				this.ctxData.data[i + 2] = (nB > 255) ? 255 : nB;
			}
		}
		
		this.apply();
		
		return this;
	};
	
	this.mix = function(r, g, b){
		this.getData();
		
		var R, G, B, nR, nG, nB = 0;
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			R = this.ctxData.data[i];
			G = this.ctxData.data[i + 1];
			B = this.ctxData.data[i + 2];
			
			nR = Math.abs(Math.floor(r + R / 2));
			nG = Math.abs(Math.floor(g + G / 2));
			nB = Math.abs(Math.floor(b + B / 2));
			
			this.ctxData.data[i] 	 = (nR > 255) ? 255 : nR;
			this.ctxData.data[i + 1] = (nG > 255) ? 255 : nG;
			this.ctxData.data[i + 2] = (nB > 255) ? 255 : nB;
		}
		
		this.apply();
		
		return this;
	};
	
	this.add = function(r, g, b){
		this.getData();
		
		var R, G, B, nR, nG, nB = 0;
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			R = this.ctxData.data[i];
			G = this.ctxData.data[i + 1];
			B = this.ctxData.data[i + 2];
			
			nR = Math.abs(Math.floor(r + R));
			nG = Math.abs(Math.floor(g + G));
			nB = Math.abs(Math.floor(b + B));
			
			this.ctxData.data[i] 	 = (nR > 255) ? 255 : nR;
			this.ctxData.data[i + 1] = (nG > 255) ? 255 : nG;
			this.ctxData.data[i + 2] = (nB > 255) ? 255 : nB;
		}
		
		this.apply();
		
		return this;
	};
	
	this.each = function(r, g, b){
		this.getData();
		
		var R, G, B, nR, nG, nB = 0;
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			R = this.ctxData.data[i];
			G = this.ctxData.data[i + 1];
			B = this.ctxData.data[i + 2];
			
			lR = (i > 0) ? this.ctxData.data[i - 4] : 0;
			lG = (i > 0) ? this.ctxData.data[i - 3] : 0;
			lB = (i > 0) ? this.ctxData.data[i - 2] : 0;
			
			nR = Math.abs(Math.floor(r({R:R, G:G, B:B}, {R:lR, G:lG, B:lB}, i, this.getXY(i))));
			nG = Math.abs(Math.floor(g({R:R, G:G, B:B}, {R:lR, G:lG, B:lB}, i, this.getXY(i))));
			nB = Math.abs(Math.floor(b({R:R, G:G, B:B}, {R:lR, G:lG, B:lB}, i, this.getXY(i))));
			
			this.ctxData.data[i] 	 = (nR > 255) ? 255 : nR;
			this.ctxData.data[i + 1] = (nG > 255) ? 255 : nG;
			this.ctxData.data[i + 2] = (nB > 255) ? 255 : nB;
		}
		
		this.apply();
		
		return this;
	};
	
	this.eachRGB = function(f){
		this.getData();
		
		var R, G, B, nR, nG, nB = 0;
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			R = this.ctxData.data[i];
			G = this.ctxData.data[i + 1];
			B = this.ctxData.data[i + 2];
			
			lR = (i > 0) ? this.ctxData.data[i - 4] : 0;
			lG = (i > 0) ? this.ctxData.data[i - 3] : 0;
			lB = (i > 0) ? this.ctxData.data[i - 2] : 0;
			
			nR = Math.abs(Math.floor(f({R:R, G:G, B:B}, {R:lR, G:lG, B:lB}, i, this.getXY(i)).R));
			nG = Math.abs(Math.floor(f({R:R, G:G, B:B}, {R:lR, G:lG, B:lB}, i, this.getXY(i)).G));
			nB = Math.abs(Math.floor(f({R:R, G:G, B:B}, {R:lR, G:lG, B:lB}, i, this.getXY(i)).B));
			
			this.ctxData.data[i] 	 = (nR > 255) ? 255 : nR;
			this.ctxData.data[i + 1] = (nG > 255) ? 255 : nG;
			this.ctxData.data[i + 2] = (nB > 255) ? 255 : nB;
		}
		
		this.apply();
		
		return this;
	};
	
	this.eachPixel = function(f){
		this.getData();
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			f({
				R:this.ctxData.data[i],
				G:this.ctxData.data[i + 1],
				B:this.ctxData.data[i + 2]
			}, this.getXY(i));
		}
		
		this.apply();
		
		return this;
	};
	
	this.hue = function(p){
		this.getData();
		
		var HSV = null;
		var RGB = null;
		var R, G, B, nR, nG, nB = 0;
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			R = this.ctxData.data[i];
			G = this.ctxData.data[i + 1];
			B = this.ctxData.data[i + 2];
			
			HSV = this.getHSV(R, G, B);
			
			HSV.H += p;
			
			RGB = this.getRGB(HSV.H, HSV.S, HSV.V);
			
			nR = Math.abs(Math.floor(RGB.R));
			nG = Math.abs(Math.floor(RGB.G));
			nB = Math.abs(Math.floor(RGB.B));
			
			this.ctxData.data[i] 	 = (nR) ? ((nR > 255) ? 255 : nR) : R;
			this.ctxData.data[i + 1] = (nG) ? ((nG > 255) ? 255 : nG) : G;
			this.ctxData.data[i + 2] = (nB) ? ((nB > 255) ? 255 : nB) : B;
		}
		
		this.apply();
		
		return this;
	};
	
	this.saturation = function(p){
		this.getData();
		
		var HSV = null;
		var RGB = null;
		var R, G, B, nR, nG, nB = 0;
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			R = this.ctxData.data[i];
			G = this.ctxData.data[i + 1];
			B = this.ctxData.data[i + 2];
			
			HSV = this.getHSV(R, G, B);
			
			HSV.S *= p;
			
			RGB = this.getRGB(HSV.H, HSV.S, HSV.V);
			
			nR = Math.abs(Math.floor(RGB.R));
			nG = Math.abs(Math.floor(RGB.G));
			nB = Math.abs(Math.floor(RGB.B));
			
			this.ctxData.data[i] 	 = (nR) ? ((nR > 255) ? 255 : nR) : R;
			this.ctxData.data[i + 1] = (nG) ? ((nG > 255) ? 255 : nG) : G;
			this.ctxData.data[i + 2] = (nB) ? ((nB > 255) ? 255 : nB) : B;
		}
		
		this.apply();
		
		return this;
	};
	
	this.filter = function(k, times){
		this.getData();
		
		var w = this.ctxData.width;
		var h = this.ctxData.height;
		
		var i, nR, nG, nB = 0;
		
		for(var x = 0; x < w; x++){
			for(var y = 0; y < h; y++){
				i = this.getIndex(x, y);
				
				nR = nG = nB = 0;
			
				for(var kl = 0; kl < (k.w * k.h); kl++){
					nR += this.getPixel(x + k[kl].x, y + k[kl].y).R * (k[kl].f / k.d);
					nG += this.getPixel(x + k[kl].x, y + k[kl].y).G * (k[kl].f / k.d);
					nB += this.getPixel(x + k[kl].x, y + k[kl].y).B * (k[kl].f / k.d);
				}
				
				this.ctxData.data[i] 	 = (nR > 255) ? 255 : nR;
				this.ctxData.data[i + 1] = (nG > 255) ? 255 : nG;
				this.ctxData.data[i + 2] = (nB > 255) ? 255 : nB;
			}
		}
		
		this.timesCounter++;
		
		this.apply();
		
		if(typeof times != "undefined" && this.timesCounter < times){
			this.filter(k, times);
		}
		
		return this;
	};
	
	this.value = function(p){
		this.getData();
		
		var HSV = null;
		var RGB = null;
		var R, G, B, nR, nG, nB = 0;
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			R = this.ctxData.data[i];
			G = this.ctxData.data[i + 1];
			B = this.ctxData.data[i + 2];
			
			HSV = this.getHSV(R, G, B);
			
			HSV.V *= p;
			
			RGB = this.getRGB(HSV.H, HSV.S, HSV.V);
			
			nR = Math.abs(Math.floor(RGB.R));
			nG = Math.abs(Math.floor(RGB.G));
			nB = Math.abs(Math.floor(RGB.B));
			
			this.ctxData.data[i] 	 = (nR) ? ((nR > 255) ? 255 : nR) : R;
			this.ctxData.data[i + 1] = (nG) ? ((nG > 255) ? 255 : nG) : G;
			this.ctxData.data[i + 2] = (nB) ? ((nB > 255) ? 255 : nB) : B;
		}
		
		this.apply();
		
		return this;
	};
	
	this.randNoise = function(r){
		this.getData();
		
		var R, G, B, nR, nG, nB = 0;
		
		for(var i = 0; i < this.ctxData.data.length; i += 4){
			R = this.ctxData.data[i];
			G = this.ctxData.data[i + 1];
			B = this.ctxData.data[i + 2];
			
			nR = Math.abs(Math.floor(R + this.getRand(0, r, true)));
			nG = Math.abs(Math.floor(G + this.getRand(0, r, true)));
			nB = Math.abs(Math.floor(B + this.getRand(0, r, true)));
			
			this.ctxData.data[i] 	 = (nR > 255) ? 255 : nR;
			this.ctxData.data[i + 1] = (nG > 255) ? 255 : nG;
			this.ctxData.data[i + 2] = (nB > 255) ? 255 : nB;
		}
		
		this.apply();
		
		return this;
	};
	
	this.getIndex = function(x, y){
		return (x + y * this.ctxData.width) * 4;
	};
	
	this.getXY = function(i){
		var X = i / 4 % this.ctxData.width,
			Y = (i / 4 - X) / this.ctxData.width;
		
		return {
			X:X,
			Y:Y
		};
	};
	
	this.getPixel = function(x, y) {
		var index = this.getIndex(x, y);
		
		return {
			R:this.ctxData.data[index + 0],
			G:this.ctxData.data[index + 1],
			B:this.ctxData.data[index + 2],
		};
	};
	
	this.getPixelByIndex = function(index){
		return {
			R:this.ctxData.data[index + 0],
			G:this.ctxData.data[index + 1],
			B:this.ctxData.data[index + 2],
		};
	};
	
	this.getHSV = function(R, G, B){
		var H, S, V, M, m = 0;
	
		M = Math.max(R, G, B);
		m = Math.min(R, G, B);
		
		if(G >= B){
			H = Math.acos((R - .5 * G - .5 * B) / Math.sqrt(Math.pow(R, 2) + Math.pow(G, 2) + Math.pow(B, 2) - R * G - R * B - G * B)) * 180 / Math.PI;
		}else{
			H = 360 - Math.acos((R - .5 * G - .5 * B) / Math.sqrt(Math.pow(R, 2) + Math.pow(G, 2) + Math.pow(B, 2) - R * G - R * B - G * B)) * 180 / Math.PI;
		}
		
		if(M == 0){
			S = 0;
		}else{
			S = 1 - m / M;
		}
		
		V = M / 255;
		
		return {
			H:H,
			S:S,
			V:V
		};
	};
	
	this.getRGB = function(H, S, V){
		var R, G, B, M, m, z = 0;
		
		if(H > 360){H = H - 360;}
		if(H < 0)  {H = 360 + H;}
		
		M = 255 * V;
		m = M * (1 - S);
		z = (M - m) * (1 - Math.abs((H / 60) % 2 - 1));
		
		if(H >= 0 && H < 60){
			R = M;
			G = z + m;
			B = m;
		}else if(H >= 60 && H < 120){
			R = z + m;
			G = M;
			B = m;
		}else if(H >= 120 && H < 180){
			R = m;
			G = M;
			B = z + m;
		}else if(H >= 180 && H < 240){
			R = m;
			G = z + m;
			B = M;
		}else if(H >= 240 && H < 300){
			R = z + m;
			G = m;
			B = M;
		}else if(H >= 300 && H <= 360){
			R = M;
			G = m;
			B = z + m;
		}
		
		return {
			R:R,
			G:G,
			B:B
		};
	}
	
	this.getPixelAt = function(x, y){
		var index = (x + y * this.ctxData.width) * 4;
		
		return {
			R:this.ctxData.data[index + 0],
			G:this.ctxData.data[index + 1],
			B:this.ctxData.data[index + 2]
		};
	};
	
	this.getRand = function(min, max, neg){
		if(neg){
			return (Math.floor(Math.random() * (max - min + 1)) + min) * (Math.round(Math.random()*1) * 2 - 1);
		}else{
			return Math.floor(Math.random() * (max - min + 1)) + min
		}
	};
	
	return this;
};
