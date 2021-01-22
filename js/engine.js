//User Interface - Generic engine for ui and menu creation-- by Matthew Shapard Copyright 2021
//Simple menus and buttons with rounded corners - button highlight features
const engine = {};
//requestAnimationFrame attempts to sync cycle funtion to engine FPS
engine.fps = 10;
engine.timestamp = null;
engine.fpsCalculated = 0;
engine.counter = 0;
engine.lastX = 0;
engine.lastY = 0;
engine.draw = function(){
	//Clears canvas
	engine.vfx.canvas.width = engine.vfx.canvas.width;
	//TODO: transfer creature draw methods to Vfx
	this.game.conway.draw();
	
	//engine.ui holds menus and buttons
	this.ui.draw();
	engine.game.player.drawMouseSpawn(engine.lastX,engine.lastY);
}
//TODO: remove condition and ensure .timestamp is init before 1st draw
engine.evaluateFps = function(timestamp){
	if (engine.timestamp == null){
		engine.timestamp = timestamp;
	}else {
		engine.fpsCalculated = 1/(timestamp - engine.timestamp)*1000;
		engine.timestamp = timestamp;
	}
}
//main program loop
function cycle(timestamp){
	//timestamp may be used to create fps stats
    engine.evaluateFps(timestamp);
	//console.log(timestamp);
	//keep a loop of 0-9999 going, so engine.game can modulo based on engine.counter
	engine.counter = (engine.counter + 1) % 10000;
	//game update logic 
	engine.game.conway.runCycle();
	//update dev button: fps
	engine.ui.fpsBtn.value = engine.fpsCalculated.toPrecision(2);
	
		
	//updates button and display gui
	engine.game.updateStats(engine.ui);
	
	//draw game logic, then ui
	engine.draw();
	//recursively call next frame
	setTimeout(function(){ //throttle requestAnimationFrame to engine fps
        requestAnimationFrame(cycle)
    }, 1000/engine.fps);
}

//program load complete, assemble engine and event handlers. Start cycles
onload = function(){
	engine.vfx = new Vfx();
	engine.ui = new Ui();
	//bootstrap application and give it access to the engine
	engine.game = new Game(engine);
	let canvas = engine.vfx.canvas;
	let ctx = engine.vfx.ctx;
	canvas.onmousemove = function (e) {
		let loc = windowToCanvas(canvas, e.clientX, e.clientY);
		mouseEventHandler(loc.x,loc.y,'mMove');
	};
	canvas.onmousedown = function (e) {
		let loc = windowToCanvas(canvas, e.clientX, e.clientY);
		mouseEventHandler(loc.x,loc.y,'mDown');
	};
	canvas.onmouseup = function (e) {
		let loc = windowToCanvas(canvas, e.clientX, e.clientY);
		mouseEventHandler(loc.x,loc.y,'mUp');
	};
	//Begin update/draw cycles
	requestAnimationFrame(cycle);
}

//converts pixel values between window and the screen area canvas lives on
function windowToCanvas(canvas, x, y) {
   var bbox = canvas.getBoundingClientRect();
   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
}
//hooked into canvas event handling
//passes coordinates to ui, then to game... menu clicks prioritize
function mouseEventHandler(x,y,mAction){
	engine.lastX = x;
	engine.lastY = y;
	let isMouseOverButton = engine.ui.handleEvent(x,y,mAction);
	if (!isMouseOverButton){
		engine.game.handleEvent(x,y,mAction);
	}
	engine.vfx.polarColorPicker(x,y,mAction);
	
}
//engine.ui -- holds menus and buttons
class Ui{
	constructor(){
		//merely for iteration
		this.menus = [];
		//used to define button rules in game logic
		this.menu = {};
		this.createMenus();
		//TODO: replace this simple initializer within game logic
		this.setIsVisible();
	}
	//engine.ui is passed events from engine.js for code readibility
	//TODO: expand from mouse only to include keyboard events
	//Returns true if mouse is over a button, or false
	handleEvent(x,y,action){
		let isMouseOverButton = false;
		//dev info window - and button examples
		//gives mouse location in canvas-pov pixels, and in % of canvas width/height
		this.locBtn.value = ': '+x+','+y;
		this.pctBtn.value = ': '+Math.round(x/engine.vfx.width*100)+','+Math.round(y/engine.vfx.height*100);
		//tests what visible button is pressed/hovered, if any
		for (let menu of this.menus){
			if(menu.isVisible == true){
				
				for (let btn of menu.buttons){
					if(btn.isVisible){
						//if mouse is over btn, ask btn to update 
						if(((x >= btn.x) && (x <= btn.x + btn.width)) &&	((y >= btn.y) && (y <= btn.y + btn.height))){
							isMouseOverButton = true;
							btn.update(action,x,y);
							//this.typBtn.value = btn.name;
							//this.oBtn.value = btn.isMouseOver;
							//this.dimBtnvalue = btn.isHighlight;
						//if a button was under the mouse and is no longer, ask btn to update
						}else if(btn.isMouseOver){
							btn.update('mOut');
							//this.oBtn.value = btn.isMouseOver;
							//this.dimBtn.value = btn.isHighlight;
						}
					}
				}
				//handling for menus that close when mouse leaves
				//menu is set to visible, see if x,y are out of menu, and set isVisble false
				engine.game.mouseOverMenus(menu,x,y);
			}
		}
		return isMouseOverButton;
	}
	//initialize some menus and buttons as visible
	setIsVisible(){
		this.menu.dev.isVisible = true; 
		for (let btn of this.menu.dev.buttons){
			btn.isVisible = true;
		}
		
		//IMPLEMENTATION -- ask game logic what highlights as clickable
	}
	//visibility is determined via a components draw method
	draw(){
		for (let menu of this.menus){
			if (menu != this.menu.dev) {
				menu.draw();
			}
			this.menu.dev.draw();
		}
	}
	//all dem interfaces -- 
	createMenus(){
		//Menu constructor(name,x,y,width,height,hue,sat,lum,alp)
		this.menu.dev = new Menu('Dev',86,0,14,10,55,100,60,1);
		this.locBtn = this.menu.dev.createButton('LOC',87,2,6,6,177,96,78,1.0);
		this.pctBtn = this.menu.dev.createButton('%WH',94,2,6,6,177,96,78,1.0);
		this.fpsBtn = this.menu.dev.createButton('FPS',91,8,6,6,177,96,78,1.0);
		//this.typBtn = this.menu.dev.createButton('Type',81,38,6,6,240,96,78,1.0);
		//this.oBtn = this.menu.dev.createButton('Ori%',81,50,19,6,240,96,78,1.0);
		//this.dimBtn = this.menu.dev.createButton('Dim%',81,62,19,6,240,96,78,1.0);
		
		this.menus.push(this.menu.dev);
		
		
	}
}
//all canvas drawing is meant to be done here, 
//attempting to ignore all object class properties to isolate drawing methods 
//accepts points, dimensions, and hsla - a mini-object for color and alpha level .h .s .l .a
class Vfx{
	constructor(){
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.width = this.canvas.getAttribute('width');
		this.height = this.canvas.getAttribute('height');
		//height of 'M' is about the same as width, and good approximate for line placement
		this.ctx.font="16px Georgia";
		this.mHeight = this.ctx.measureText('M').width;
		//vars for drawRounded function
		this.menuRounding = 5;
		this.buttonRounding = 3;
		//game component hsla limits
		this.dimLimit = 40;
		this.brightLimit = 70;
		this.unsatLimit = 40;
		this.satLimit = 90;
		this.hsla = this.hslaEdit();
	}
	hslaEdit(type,hsla,modify){
		let brightLimit = this.brightLimit;
		let dimLimit = this.dimLimit;
		let satLimit = this.satLimit;
		let unsatLimit = this.unsatLimit;
		switch (type){
			case 'hue':
			hsla.h = (hsla.h + modify) % 360;
			break;
			case 'drift':
			hsla.h = (hsla.h + Math.floor(Math.random()*(modify*2-1) - modify)) % 360;
			hsla.s = (hsla.s + Math.floor(Math.random()*(modify*2-1) - modify));
			hsla.l = (hsla.l + Math.floor(Math.random()*(modify*2-1) - modify));
			
			if (hsla.l > brightLimit){
				hsla.l = brightLimit
			}else if (hsla.l < dimLimit){
				hsla.l = dimLimit;
			}
			if (hsla.s > satLimit){
				hsla.s = satLimit
			}else if (hsla.s < satLimit){
				hsla.s = satLimit;
			}
			break;
			case 'grey':
			hsla.h = Math.floor(Math.random()*360);
			hsla.s = Math.floor(Math.random()*3+13);
			hsla.l = Math.floor(Math.random()*4+30);
			hsla.a = 36;
			break;
			default: //new hsla
			let hslaNew = {
				h: Math.floor(Math.random()*360),
				s: Math.floor(Math.random()*30+40),
				l: Math.floor(Math.random()*30+40),
				a: 100
			};
			return(hslaNew);
		}
	}
	polarColorPicker(x,y,mAction){
		let x0 = this.width/2;
		let y0 = this.height/2;
		let theta = Math.atan2((y-y0),(x0-x))*57.2957795;
		if (theta < 0){
			theta = 360 + theta;
		}
		//console.log(theta);
		engine.ui.menu.dev.hsla.h = theta;
	}
	drawButton(btn){
		this.hsla.h = btn.hsla.h;
		this.hsla.s = btn.hsla.s;
		if (btn.isDiabled){
			this.hsla.l = btn.hsla.l/3;
		}else{
			this.hsla.l = btn.hsla.l
		}
		this.hsla.a = btn.hsla.a;
		this.drawRounded(btn.x,btn.y,btn.width,btn.height,this.hsla,this.buttonRounding);
		if(btn.isHighlight){
			this.drawHighlight(btn.x,btn.y,btn.width,btn.height,btn.hsla);
		}
		//TODO: create text sizing method based on pixel dimensions of buttons
		let ctx = this.ctx;
		ctx.font="16px Georgia";
		ctx.textAlign="center"; 
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#000000";
		let textY = btn.y + this.mHeight;
		ctx.fillText(btn.name,btn.x + btn.width/2, textY-4);
		if (btn.value != null){
			ctx.fillText(btn.value,btn.x + btn.width/2, textY+this.mHeight-2);
		}
		if(btn.isMouseOver){
			this.drawHover(btn);
		}
	}
	drawHover(btn){
		//console.log('hover: '+btn.name);
		if(btn.hoverText.length > 0){
			this.drawRounded(btn.parent.x,this.height/2.9,btn.parent.width,this.height/11,btn.hsla,this.buttonRounding);
			let ctx = this.ctx;
			ctx.font="14px Georgia";
			let mHeight = this.ctx.measureText('M').width;
			ctx.textAlign="center"; 
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#000000";
			let textY = this.height/3.1 + 2*mHeight;
			for (let line of btn.hoverText){
				ctx.fillText(line,btn.parent.x + btn.parent.width/2, textY);
				textY += mHeight;
			}
		}
	}
	//draws a top and bottom border of small circles on a rectangle selection
	drawHighlight(x,y,width,height,hsla){
		//highlight circle size = 2..4
		let radius = 2 + Math.floor(Math.random()*3);
		let modify = 315;
		let xOrigin = x+radius;
		let yOrigin = y+radius;
		let ctx = this.ctx;
		let hue = (hsla.h + modify) % 360;
			
		let saturation = hsla.s;
		let lum = 30;
		ctx.fillStyle = 'hsl('+hue+','+saturation+'%,'+lum+'%)';
		ctx.globalAlpha = hsla.a;
		for (let i = 1; i*radius*2 < width; i++){
			ctx.beginPath();
			ctx.arc(xOrigin,y,radius,0,2*Math.PI);
			ctx.fill();
			let lowerOrigin = 2*x+width-xOrigin;
			ctx.beginPath();
			ctx.arc(lowerOrigin,y+height,radius,0,2*Math.PI);
			ctx.fill();
			xOrigin += radius*2;
		}			
		for (let i = 1; i*radius*2 < height; i++){
			ctx.beginPath();
			ctx.arc(x,yOrigin,radius,0,2*Math.PI);
			ctx.fill();
			let rightOrigin = 2*y+height-yOrigin;
			ctx.beginPath();
			ctx.arc(x+width,rightOrigin,radius,0,2*Math.PI);
			ctx.fill();
			yOrigin += radius*2;
		}
	}
	drawRounded(x,y,width,height,hsla,rounded) {
		let ctx = this.ctx;
		const radiansInCircle = 2 * Math.PI;
		const halfRadians = (2 * Math.PI)/2;
		const quarterRadians = (2 * Math.PI)/4;
		ctx.beginPath();
		// top ww arc
		ctx.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true)
		// line from top ww to bottom ww
		ctx.lineTo(x, y + height - rounded)
		// bottom ww arc  
		ctx.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true)  
		// line from bottom ww to bottom ee
		ctx.lineTo(x + width - rounded, y + height)
		// bottom ee arc
		ctx.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true)  
		// line from bottom ee to top ee
		ctx.lineTo(x + width, y + rounded)  
		// top ee arc
		ctx.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true)  
		// line from top ee to top ww
		ctx.lineTo(x + rounded, y);
		let hue = hsla.h;
		let saturation = hsla.s;
		let lum = hsla.l;
		ctx.fillStyle = 'hsl('+hue+','+saturation+'%,'+lum+'%)';
		ctx.globalAlpha = hsla.a;
		ctx.fill();		
	}
}
//canvas buttons, no css, no html
class Button{
	//origin point and dimensions are inputted as % of width and height of canvas
	constructor(menu,name,x,y,width,height,hue,sat,lum,alp){
		this.parent = menu;
		this.name = name;
		this.text = name;
		this.value = null;
		this.cost = null;
		this.isVisible = true;
		this.isHighlight = false;
		this.isMouseOver = false;
		this.isDiabled = false;
		this.hoverText = [];
		this.value = '';
		//converted to pixels from relative proportions
		this.x = Math.floor(x*engine.vfx.width/100);
		this.y = Math.floor(y*engine.vfx.height/100);
		this.width = Math.floor(width*engine.vfx.width/100);
		this.height = Math.floor(height*engine.vfx.height/100);
		//mini object used throughout engine
		this.hsla = {
			h : hue,
			s : sat,
			l : lum,
			a : alp
		};
	}
	//when visible, engine.ui.handleEvent sends buttons update requests
	update(event,x,y){
		if ((event == 'mMove') && (this.isMouseOver == false)){
			this.toggleIsMouseOver();
			engine.game.hovered(this);
		}else if (event == 'mUp'){
			engine.game.pressed(this,x,y);
			//this.isHighlight = !this.isHighlight;
		}else if (event == 'mOut'){
			this.toggleIsMouseOver();
			engine.game.player.checkForRemoval(this);
			
		}
		//TODO: add existing 'mDown' event -- keyboard handling later too
	}
	//simple handling for a light/dark effect of mouse hovering
	// BUGSUSPECT -- remote possibility of altering normal luminosity
	toggleIsMouseOver(){
		this.isMouseOver = !(this.isMouseOver);
		if(this.isMouseOver){
			this.hsla.l +=10;
		}else{
			this.hsla.l -=10;
		}
	}
	//Button is a base component of ui, actual draw requests made here to engine.vfx
	draw(){
		if (this.isVisible){
			//without z-index, this places highlight behind button
			engine.vfx.drawButton(this);
		}
	}
}
//engine.ui.menu  
class Menu{
	//	x,y,w,h all in %
	constructor(name, x,y,width,height,hue,sat,lum,alp){
		this.name = name;
		//converts relative placement and size to pixels
		this.x = Math.floor(x*engine.vfx.width/100);
		this.y = Math.floor(y*engine.vfx.height/100);
		this.width = Math.floor(width*engine.vfx.width/100);
		this.height = Math.floor(height*engine.vfx.height/100);
		this.hsla = {
		h : hue,
		s : sat,
		l : lum,
		a : alp
		};
		this.buttons = [];
		this.isVisible = true;
		this.isToggled = false;
	}
	toggleIsVisible(){
		this.isVisible = !this.isVisible;
	}
	//returns created button and adds to engine.ui.menu.buttons
	createButton (name, x, y, width, height, hue, sat, lum, alp){
		let button = new Button(this,name, x, y, width, height, hue, sat, lum, alp);
		this.buttons.push(button);
		return(button);
	}
	//menu is a parent of buttons, draw menu and call buttons draw method  
	draw(){
		if (this.isVisible){
			engine.vfx.drawRounded(this.x,this.y,this.width,this.height,this.hsla,engine.vfx.menuRounding);
			for (let btn of this.buttons){
				btn.draw();
			}
		}
	}
	
}
