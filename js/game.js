//Game logic, dependent on a basic Engine supplying a UI and VFX interface
class Game{
	constructor(engine){
		this.engine = engine;
		this.vfx = engine.vfx;
		this.ctx = engine.vfx.ctx;
		this.grid = new Grid(this,this.vfx.width,this.vfx.height,18,0);
		this.createMenus(engine.ui);
		//must be called after createMenus
		this.player = new Player();
		this.conway = new Conway(this);
		//this.conway.conwaySpawn(this.conway.options);
		//this.conway.conwaySpawn(this.conway.options);
		this.conway.conwaySpawn(this.conway.options);
	}
	
	resetMenus(){
		engine.ui = new Ui();
		this.createMenus(engine.ui);
	}
	updateStats(ui){
		//autopurchase before screen updateStats
		this.player.autoPurchase();
		//erase hud menus if on settings/start screen
		let m = engine.ui.menu;
		for (let hudBtn of engine.ui.menu.hud.buttons){
			if(m.settingsMenu.isVisible){
				hudBtn.isVisible = false;
				m.spawn.isVisible = false;
				m.spawn.isToggled = false;
				m.labor.isVisible = false;
				m.labor.isToggled = false;
				m.safehouse.isVisible = false;
				m.safehouse.isToggled = false;
				m.vacate.isVisible = false;
				m.vacate.isToggled = false;
			}else{hudBtn.isVisible = true;}
		}
		//call each menu and refresh each visible button
		for (let menu of ui.menus){
			if (menu.isVisible){
				for (let button of menu.buttons){
					if (button.isVisible){
						this.refreshButtonValue(button);
					}
				}
			}
		}
	}
	//checks mouseOver for game components
	handleEvent(x,y,event){
		if( event == 'mMove'){
			this.player.drawMouseSpawn(x,y);
		} else if (event == 'mUp' && this.player.mouseSpawnShapes.length != 0){
			//this is only called with mUp if not over a ui button
			this.player.placeMouseSpawn(this.player.spawn,x,y);
		}
		
	}
	//handles mouse-out closing of specific menus
	//passed menu is set to visible, and should erase if mouse has left area
	mouseOverMenus(menu,x,y){
		let m = engine.ui.menu;
		if ( menu.isHover && !menu.isToggled){
			if(!(((x >= menu.x) && (x <= menu.x + menu.width)) &&	((y >= menu.y) && (y <= menu.y + menu.height)))){
					menu.isVisible = false;
			}
		}
	}
	highlightAffordable(button,currency){
		let menu = engine.ui.menu;
		if (button.cost != null & button.cost <= currency){
			button.isHighlight = true;
		}else{
			button.isHighlight = false;
		}
	}
	refreshTopMenu(button){
		//engine.ui.locBtn.value = (100*this.conway.conwayPopulation/this.conway.numOfShapes).toPrecision(2);
		//engine.ui.pctBtn.value = (100*this.conway.playerPopulation/this.conway.numOfShapes).toPrecision(2);
		let menu = button.parent;
		switch (button){
			case menu.currency:
			button.value = this.player.stats.currency.toPrecision(4);
			break;
			case menu.rateOfCurrency:
			button.value = this.conway.rateOfCurrency.toPrecision(2);
			break;
			case menu.bodies:
			button.value = this.conway.conwayPopulation;
			break;
			case menu.rateOfInfection:
			button.value = (this.player.stats.conwayPopBonus*(this.conway.conwayPopulation/this.conway.numOfShapes)).toPrecision(2);
			break;
			case menu.antibodies:
			button.value = this.conway.playerPopulation;
			break;
			case menu.rateOfProtection:
			button.value = (this.player.stats.playerPopBonus*(this.conway.playerPopulation/this.conway.numOfShapes)).toPrecision(2);
			break;
			default:
			//this.highlightAffordable(button);
		}
	}
	refreshRulesMenu(button){
		let menu = button.parent;
		switch (button){
			case menu.s1:
			button.isHighlight = this.conway.rules.survive.includes(1);
			break;
			case menu.b1:
			button.isHighlight = this.conway.rules.birth.includes(1);
			break;
			case menu.s2:
			button.isHighlight = this.conway.rules.survive.includes(2);
			break;
			case menu.b2:
			button.isHighlight = this.conway.rules.birth.includes(2);
			break;
			case menu.s3:
			button.isHighlight = this.conway.rules.survive.includes(3);
			break;
			case menu.b3:
			button.isHighlight = this.conway.rules.birth.includes(3);
			break;
			case menu.s4:
			button.isHighlight = this.conway.rules.survive.includes(4);
			break;
			case menu.b4:
			button.isHighlight = this.conway.rules.birth.includes(4);
			break;
			case menu.s5:
			button.isHighlight = this.conway.rules.survive.includes(5);
			break;
			case menu.b5:
			button.isHighlight = this.conway.rules.birth.includes(5);
			break;
			case menu.s6:
			button.isHighlight = this.conway.rules.survive.includes(6);
			break;
			case menu.b6:
			button.isHighlight = this.conway.rules.birth.includes(6);
			break;
			case menu.s7:
			button.isHighlight = this.conway.rules.survive.includes(7);
			break;
			case menu.b7:
			button.isHighlight = this.conway.rules.birth.includes(7);
			break;
			case menu.s8:
			button.isHighlight = this.conway.rules.survive.includes(8);
			break;
			case menu.b8:
			button.isHighlight = this.conway.rules.birth.includes(8);
			break;
			default:
			//this.highlightAffordable(button);
		}
	}
	toggleSurviveRule(number){
		let index = this.conway.rules.survive.indexOf(number);
		if (index > -1){
			this.conway.rules.survive.splice(index,1);
		}else{
			this.conway.rules.survive.push(number);
		}
	}
	toggleBirthRule(number){
		let index = this.conway.rules.birth.indexOf(number);
		if (index > -1){
			this.conway.rules.birth.splice(index,1);
		}else{
			this.conway.rules.birth.push(number);
		}
	}	
	toggleRules(button){
		let menu = button.parent;
		switch (button){
			case menu.save:
			this.saveGame();
			break;
			case menu.load:
			this.loadGame();
			break;
			case menu.delSave:
			this.deleteGame();
			break;
			case menu.s1:
			this.toggleSurviveRule(1);
			break;
			case menu.b1:
			this.toggleBirthRule(1);
			break;
			case menu.s2:
			this.toggleSurviveRule(2);
			break;
			case menu.b2:
			this.toggleBirthRule(2);
			break;
			case menu.s3:
			this.toggleSurviveRule(3);
			break;
			case menu.b3:
			this.toggleBirthRule(3);
			break;
			case menu.s4:
			this.toggleSurviveRule(4);
			break;
			case menu.b4:
			this.toggleBirthRule(4);
			break;
			case menu.s5:
			this.toggleSurviveRule(5);
			break;
			case menu.b5:
			this.toggleBirthRule(5);
			break;
			case menu.s6:
			this.toggleSurviveRule(6);
			break;
			case menu.b6:
			this.toggleBirthRule(6);
			break;
			case menu.s7:
			this.toggleSurviveRule(7);
			break;
			case menu.b7:
			this.toggleBirthRule(7);
			break;
			case menu.s8:
			this.toggleSurviveRule(8);
			break;
			case menu.b8:
			this.toggleBirthRule(8);
			break;
			default:
			//this.highlightAffordable(button);
		}
	}
	refreshLabMenu(button){
		let menu = button.parent;
		let stats = this.player.stats;
		switch (button){
			case menu.renovate:
			let lowest = 10*(4*4*4);
			let gain = Math.floor(Math.cbrt(stats.currency/10));
			let next = gain + 1;
			if (gain < 4){
				button.value = 'Need '+ Math.ceil(lowest - stats.currency).toPrecision(2) + ' more Credits';
				button.isHighlight = false;
			}else{
				button.value = ' And Gain '+ Math.floor(stats.baseMaterialRate*Math.cbrt(stats.currency/10)) + ' Materials';
				button.isHighlight = true;
			}
			let gainCost = 10*(gain*gain*gain);
			button.hoverText.splice(0,button.hoverText.length);
			button.hoverText.push('Tear it all down and build a','better laboratory.','' + (10*(next*next*next)).toPrecision(2) + ' Distance Credits','earns the next Material point.');	
			break;
			case menu.material:
			button.value = stats.material.toPrecision(2);
			break;
			case menu.materialTotal:
			button.value = stats.materialTotal.toPrecision(2);
			break;
			default:
			if (button.cost != null){
				button.value = button.cost;
				this.highlightAffordable(button,stats.material);
			}
			
		}
	}
	refreshAscendMenu(button){
		let menu = button.parent;
		let stats = this.player.stats;
		switch (button){
			case menu.ascension:
			let lowest = 10*(4*4*4);
			let gain = Math.floor(Math.cbrt(stats.materialTotal/10));
			let next = gain + 1;
			if (gain < 4){
				button.value = 'Need '+ Math.ceil(lowest - stats.materialTotal).toPrecision(2) + ' more Material';
				button.isHighlight = false;
			}else{
				button.value = ' And Gain '+ Math.floor(stats.baseAscendRate*Math.cbrt(stats.materialTotal/10)) + ' Zen';
				button.isHighlight = true;
			}
			let gainCost = 10*(gain*gain*gain);
			button.hoverText.splice(0,button.hoverText.length);
			button.hoverText.push('Let go of all Material goods','and gain the benefits of ascension!','' + (10*(next*next*next)).toPrecision(2) + ' Total Material','earns the next Zen point.');	
			break;
			case menu.autoRenovate:
			if(button.cost == null){
				button.isHighlight = false;
				button.value = 'for ' + stats.renovateMin;
			}else{
				button.value = button.cost;
				this.highlightAffordable(button,stats.zen);
			}
			break;
			case menu.zen:
			button.value = stats.zen.toPrecision(2);
			break;
			case menu.zenTotal:
			button.value = stats.zenTotal.toPrecision(2);
			break;
			default:
			if (button.cost != null && button != menu.autoPlus && button != menu.autoMinus){
				button.value = button.cost;
				this.highlightAffordable(button,stats.zen);
			}else{
				button.value = null;
			}
			
		}
	}
	refreshHudMenu(button){
		let menu = engine.ui.menu;
		let stats = engine.game.player.stats;
		button.isHighlight = false;
		switch (button){
			case menu.hud.spawn:
			if(!stats.isSpawnAvaisafehousele && stats.spawnTimeout < engine.counter){
				stats.isSpawnAvaisafehousele = true;
			}
			if(stats.isSpawnAvaisafehousele){
				button.isHighlight = true;
			}else{button.isHighlight = false;}
			break;
			case menu.hud.labor:
			for (let item of menu.labor.buttons){
				if (item.cost != null && item.cost <= stats.currency){
					button.isHighlight = true;
				}
			}
			break;
			case menu.hud.safehouse:
			for (let item of menu.safehouse.buttons){
				if (item.cost != null && item.cost <= stats.material){
					button.isHighlight = true;
				}
			}
			break;
			default:
		}
		
	}
	refreshButtonValue(button){
		let menu = this.engine.ui.menu;
		switch (button.parent){
			case menu.top:
			this.refreshTopMenu(button);
			break;
			case menu.settingsMenu:
			this.refreshRulesMenu(button);
			break;
			case menu.spawn:
			if(this.player.stats.isSpawnAvaisafehousele){
				button.isHighlight = true;
			}else{button.isHighlight = false;}
			break;
			case menu.safehouse:
			this.refreshLabMenu(button);
			break;
			//labor falls under default for now
			case menu.labor:
			if (button.cost != null){
				if(button.cost > 99999){
					button.value = button.cost.toPrecision(2);
				}else{
					button.value = Math.ceil(button.cost);
				}
				this.highlightAffordable(button,this.player.stats.currency);
			}
			break;
			case menu.hud:
			this.refreshHudMenu(button);
			case menu.ascend:
			this.refreshAscendMenu(button);
			default:
			
		}
	}
	hovered(button){
		let menu = engine.ui.menu;
		let ui = engine.ui;
		switch (button.parent){
			case menu.hud:
			switch (button){
				case menu.hud.spawn:
				menu.spawn.isVisible = true;
				break;
				case menu.hud.labor:
				menu.labor.isVisible = true;
				break;
				case menu.hud.safehouse:
				menu.safehouse.isVisible = true;
				break;
				case menu.hud.ascend:
				menu.ascend.isVisible = true;
				break;
				case menu.hud.vacate:
				menu.vacate.isVisible = true;
				break;
				//case menu.hud.settings:
				//menu.settingsMenu.isVisible = true;
				//break;
				default:
			}
			break;
			case menu.spawn:	
			this.player.prepareMouseSpawn(button);
			break;
			
			default:
		}
	}
	pressed(button,x,y){
		let menu = this.engine.ui.menu;
		let ui = this.engine.ui;
		switch (button.parent){
			case menu.hud:
			switch (button){
				case menu.hud.spawn:
				menu.spawn.isToggled = !menu.spawn.isToggled;
				break;
				case menu.hud.labor:
				menu.labor.isToggled = !menu.labor.isToggled;
				break;
				case menu.hud.safehouse:
				menu.safehouse.isToggled = !menu.safehouse.isToggled;
				break;
				case menu.hud.ascend:
				menu.ascend.isToggled = !menu.ascend.isToggled;
				break;
				case menu.hud.vacate:
				menu.vacate.isToggled = !menu.vacate.isToggled;
				break;
				default:
			}
			break;
			case menu.spawn:
			if(this.player.stats.isSpawnAvaisafehousele){
				this.player.mouseSpawnButton = null;
			}
			break;
			case menu.settingsMenu:
			this.toggleRules(button);
			break;
			case menu.top:
			if(button == menu.top.settings){
				menu.settingsMenu.isVisible = !menu.settingsMenu.isVisible;
			}
			break;
			default:
				this.player.purchase(button);
		}
	}
	//all gui names, positions, dimensions, and colors
	createMenus(ui){
		let x = 0;
		let y = 0;
		let y1 = 0;
		let yHeader = 17;
		let w = 0;
		let h = 0;
		//rows
		let r = 0;
		//spacer
		let s = 0;
		//button width
		let bw = 0;
		//Menu constructor(name,x,y,width,height,hue,sat,lum,alp)
		
		
		ui.menu.spawn = new Menu('Spawn',0,0,11,100,55,53,29,0.7);
		let spawn = ui.menu.spawn;
		ui.menus.push(spawn);
		spawn.isHover = true;
		spawn.isVisible = false;
		spawn.rPen = spawn.createButton('r-Pento',1,17,9,6,    290,100,60,1.0);
		spawn.acorn = spawn.createButton('Acorn',1,29,9,6,315,100,60,1.0);
		spawn.copperhead = spawn.createButton('Copperhead',1,41,9,6,        5,100,60,1.0);
		spawn.fish = spawn.createButton('Fish',1,53,9,6,      340,100,60,1.0);
		spawn.glider = spawn.createButton('Glider',1,65,9,6,     30,100,60,1.0);
		spawn.random = spawn.createButton('Random',1,77,9,6,   45,100,60,1.0);
		spawn.rPen.isVisible = false;
		spawn.acorn.isVisible = false;
		spawn.fish.isVisible = false;
		spawn.copperhead.isVisible = false;
		
		
		
		x = 11;
		w = 22;
		s = 7;
		y1 = 45;
		r = 3.5;
		bw =9.6;
		ui.menu.labor = new Menu('Labor',x,0,w,100,55,53,29,0.7);
		let labor = ui.menu.labor;
		labor.hoverText.push('Husks of dead infections litter','the ground, while the living','irratically swarm the','air surrounding you.');
		ui.menus.push(labor);
		labor.isHover = true;
		labor.isVisible = false;
		y = y1;
		labor.craftDouble = labor.createButton('Tailoring',x+w/2-4,y,bw,6,177,96,78,1.0);
		labor.craftDouble.hoverText.push('Double Amount of','Distance Credits','Gained each Cycle.');
		labor.craft1 = labor.createButton('Hat',x+1,y+s,bw,6,177,96,78,1.0);
		labor.craft1.hoverText.push('Reduce Penalty:','Income is reduced less','for each infection present.');
		labor.craft2 = labor.createButton('Gloves',x+w-1-bw,y+s,bw,6,177,96,78,1.0);
		labor.craft2.hoverText.push('Reduce Penalty:','Income is reduced less','for each infection present.');
		labor.craft3 = labor.createButton('Mask',x+1,y+2*s,bw,6,177,96,78,1.0);
		labor.craft3.hoverText.push('Reduce Penalty:','Income is reduced less','for each infection present.');
		labor.craft4 = labor.createButton('Shield',x+w-1-bw,y+2*s,bw,6,177,96,78,1.0);
		labor.craft4.hoverText.push('Reduce Penalty:','Income is reduced less','for each infection present.');
		
		y = y1+r*s
		labor.mouseSpawnDelay = labor.createButton('Engineering',x+w/2-4,y,bw,6,177,96,78,1.0);
		labor.mouseSpawnDelay.hoverText.push('Reduce delay between','Spawning Disinfecting','Agents into the air.');
		labor.skill1 = labor.createButton('Aquarium',x+1,y+s,bw,6,177,96,78,1.0);
		labor.skill1.hoverText.push('Unlock Disinfecting Agent:','Fish Agents are','formed with husks and','a little algae to grow on.');
		labor.skill2 = labor.createButton('Sun Rock',x+w-1-bw,y+s,bw,6,177,96,78,1.0);
		labor.skill2.hoverText.push('Unlock Disinfecting Agent:','Copperhead Agents bask','in the warmth of day','and slide in the shadow of night.');
		labor.skill3 = labor.createButton('Oak Bonsai',x+1,y+2*s,bw,6,177,96,78,1.0);
		labor.skill3.hoverText.push('Unlock Disinfecting Agent:','Acorn Agents will','surprise any enemy with','their amazing growth.');
		labor.skill4 = labor.createButton('Textbooks',x+w-1-bw,y+2*s,bw,6,177,96,78,1.0);
		labor.skill4.hoverText.push('Unlock Disinfecting Agent:','R-Penimino... Napoleon','Bonaparte has got nothing','on this little over-achiever.');
		
		x += w-.1;
		//w = 22;
		s = 7;
		//y1 = 23;
		r = 3.5;
		//bw =9;
		ui.menu.safehouse = new Menu('Safehouse',x,0,w,100,55,53,29,0.7);
		let safehouse = ui.menu.safehouse;
		safehouse.hoverText.push('Who knew so many things could','be made from husk material?','Renovate to make safehouse','upgrades with gained Material.');
		ui.menus.push(safehouse);
		safehouse.isHover = true;
		safehouse.isVisible = false;
		y = y1;
		safehouse.material = safehouse.createButton('Material',x+1,yHeader,bw,6,177,96,78,1.0);
		safehouse.material.hoverText.push('Collect Materials to','make additions for','the laboratory.');
		safehouse.materialTotal = safehouse.createButton('Mat. Total',x+w-1-bw,yHeader,bw,6,177,96,78,1.0);
		safehouse.renovate = safehouse.createButton('Renovate Laboratory',x+w/2-bw,yHeader+ 1.4*s,bw*2,6,177,96,78,1.0);
		safehouse.renovate.hoverText.push('Tear it all down and build a','better laboratory. Collect','Material: Cubic Root of','(Distance Credits/10).');
		safehouse.tripler = safehouse.createButton('Triple Points',x+1,y,bw,6,177,96,78,1.0);
		safehouse.tripler.hoverText.push('Triple Distance Credits','Husk dodger... survivor...','got the skills to be the wiser.');
		safehouse.spawn = safehouse.createButton('Auto Spawn',x+w-1-bw,y,bw,6,177,96,78,1.0);
		safehouse.spawn.hoverText.push('Release agents into the air','on a continuous basis.');
		safehouse.craft = safehouse.createButton('Treadle Desk',x+1,y+s,bw,6,177,96,78,1.0);
		safehouse.craft.hoverText.push('Genuine Sunger-Brand sewing','table! Push pedal to metal and','increase Tailoring','skill when affordable.');
		safehouse.skill = safehouse.createButton('Microbiology',x+w-1-bw,y+s,bw,6,177,96,78,1.0);
		safehouse.skill.hoverText.push('Bridge the gap between inventor,','and life-creator. Increase','Engineering skill when affordable.');
		
		y = y1+s+2;
		safehouse.craft1 = safehouse.createButton('Hat Rack',x+1,y+s,bw,6,177,96,78,1.0);
		safehouse.craft1.hoverText.push('Why have you been throwing',' these out? Keep that hat',' after safehouse renovations.');
		safehouse.craft2 = safehouse.createButton('Natural Oils',x+w-1-bw,y+s,bw,6,177,96,78,1.0);
		safehouse.craft2.hoverText.push('Moist hands, dry air...',' terrible for gloves. Keep gloves',' after safehouse renovations.');
		safehouse.craft3 = safehouse.createButton('Dry Cleaner',x+1,y+2*s,bw,6,177,96,78,1.0);
		safehouse.craft3.hoverText.push('Finally, a way to',' clean masks properly. Keep a mask',' after safehouse renovations.');
		safehouse.craft4 = safehouse.createButton('Wood Shop',x+w-1-bw,y+2*s,bw,6,177,96,78,1.0);
		safehouse.craft4.hoverText.push('A proper place to store tools.','A shield is only an inch of','sawdust away at any moment.','Keep a shield after safehouse renovations.');
		y = y1+r*s;
		safehouse.skill1 = safehouse.createButton('Koi Pond',x+1,y+s,bw,6,177,96,78,1.0);
		safehouse.skill1.hoverText.push('Dedicate space for an indoor','pond. Keep the Aquarium on','Renovation and increase','the Disinfect Bonus of each Agent.');
		safehouse.skill2 = safehouse.createButton('Sun Roof',x+w-1-bw,y+s,bw,6,177,96,78,1.0);
		safehouse.skill2.hoverText.push('Open up the ceiling, let the light in.','Keep the Sun Rock on','Renovation and increase','the Disinfect Bonus of each Agent.');
		safehouse.skill3 = safehouse.createButton('Arboretum',x+1,y+2*s,bw,6,177,96,78,1.0);
		safehouse.skill3.hoverText.push('Spare the Bonsai from the','demolition dust. Keep Bonsai on','Renovation and increase','the Disinfect Bonus of each Agent.');
		safehouse.skill4 = safehouse.createButton('Cubicle',x+w-1-bw,y+2*s,bw,6,177,96,78,1.0);
		safehouse.skill4.hoverText.push('Think out of the box, in your','new cube! Keep Textbooks on','Renovation and increase','the Disinfect Bonus of each Agent.');
		
		x += w-.1;
		//w = 22;
		s = 7;
		//y1 = 23;
		r = 3.5;
		//bw =7;
		ui.menu.ascend = new Menu('ascend',x,0,w,100,55,53,29,0.7);
		let ascend = ui.menu.ascend;
		ascend.hoverText.push('Something is holding you back.','Is it a new tool or a giant weapon?','Perhaps just a different way of','looking at the world.');
		ui.menus.push(ascend);
		ascend.isHover = true;
		ascend.isVisible = false;
		y = y1;
		ascend.zen = ascend.createButton('Zen',x+1,yHeader,bw,6,177,96,78,1.0);
		ascend.zenTotal = ascend.createButton('Zen Total',x+w-1-bw,yHeader,bw,6,177,96,78,1.0);
		ascend.ascension = ascend.createButton('Reach Enlightenment',x+w/2-bw,yHeader+ 1.4*s,bw*2,6,177,96,78,1.0);
		ascend.ascension.hoverText.push('Let go of all Material goods','and gain the benefits of ascension!','Build a new Safehouse that can','contain your new state of being.');
		
		//ascend.materialDoubler = ascend.createButton('Boost Reno',x+w/2-4,y,8,6,177,96,78,1.0);
		//ascend.craft1 = ascend.createButton('Hat',x+1,y+s,bw,6,177,96,78,1.0);
		//ascend.craft2 = ascend.createButton('Shield',x+w-1-bw,y+s,bw,6,177,96,78,1.0);
		//ascend.craft3 = ascend.createButton('Mask',x+1,y+2*s,bw,6,177,96,78,1.0);
		//ascend.craft4 = ascend.createButton('Glove',x+w-1-bw,y+2*s,bw,6,177,96,78,1.0);
		
		y = y1+r*s
		ascend.autoRenovate = ascend.createButton('Auto-Reno',x+w/2-4,y,8,6,177,96,78,1.0);
		ascend.autoRenovate.hoverText.push('Renovate the Safehouse','for a set amount of','Material, when enough','Distance Credits are earned.');
		ascend.autoPlus = ascend.createButton('+',x+w/2+4,y,2,3,177,96,78,1.0);
		ascend.autoPlus.isVisible = false;
		ascend.autoMinus = ascend.createButton('-',x+w/2+4,y+3,2,3,177,96,78,1.0);
		ascend.autoMinus.isVisible = false;
		ascend.keepAllSpawns = ascend.createButton('Biochemist',x+1,y+s,bw,6,177,96,78,1.0);
		ascend.keepAllSpawns.hoverText.push('Keep all Disinfecting Agents','and the renovations that','support them on Ascension.');
		ascend.boostCredits = ascend.createButton('Above Danger',x+w-1-bw,y+s,bw,6,177,96,78,1.0);
		ascend.boostCredits.hoverText.push('Asended beings such as yourself','stride above the denser','hoards of infections.','Double Distance Credits earned.');
		ascend.keepTreadle = ascend.createButton('SweatShop',x+1,y+2*s,bw,6,177,96,78,1.0);
		ascend.keepTreadle.hoverText.push('No worries, you have crafted','specialized Agents to do','all the sweating.','Keep Treadle after Ascensions.');
		ascend.boostMaterial = ascend.createButton('Husk Trap',x+w-1-bw,y+2*s,bw,6,177,96,78,1.0);
		ascend.boostMaterial.hoverText.push('Double gained Material from','Renovations. Like a raingutter but','way, way, more gross. Good','thing mindless Agents clean it out.');
		
		x += w;
		//w = 22;
		s = 7;
		//y1 = 23;
		r = 3.5;
		//bw =7;
		ui.menu.vacate = new Menu('vacate',x,0,w,100,55,53,29,0.7);
		let vacate = ui.menu.vacate;
		ui.menus.push(vacate);
		vacate.isHover = true;
		vacate.isVisible = false;
		y = y1;
		vacate.craftDouble = vacate.createButton('Craft',x+w/2-4,y,8,6,177,96,78,1.0);
		vacate.craft1 = vacate.createButton('Hat',x+1,y+s,bw,6,177,96,78,1.0);
		vacate.craft2 = vacate.createButton('Shield',x+w-1-bw,y+s,bw,6,177,96,78,1.0);
		vacate.craft3 = vacate.createButton('Mask',x+1,y+2*s,bw,6,177,96,78,1.0);
		vacate.craft4 = vacate.createButton('Glove',x+w-1-bw,y+2*s,bw,6,177,96,78,1.0);
		
		y = y1+r*s
		vacate.mouseSpawnDelay = vacate.createButton('Skill',x+w/2-4,y,8,6,177,96,78,1.0);
		vacate.skill1 = vacate.createButton('Reflex',x+1,y+s,bw,6,177,96,78,1.0);
		vacate.skill2 = vacate.createButton('Strength',x+w-1-bw,y+s,bw,6,177,96,78,1.0);
		vacate.skill3 = vacate.createButton('Planing',x+1,y+2*s,bw,6,177,96,78,1.0);
		vacate.skill4 = vacate.createButton('Agility',x+w-1-bw,y+2*s,bw,6,177,96,78,1.0);
		
		ui.menu.settingsMenu = new Menu('settingsMenu',0,0,100,100,15,53,29,1);
		let settingsMenu = ui.menu.settingsMenu;
		ui.menus.push(settingsMenu);
		settingsMenu.isHover = false;
		settingsMenu.isVisible = false;
		settingsMenu.save = settingsMenu.createButton('Save',90,60,6,3,221,100,39,1.0);
		settingsMenu.load = settingsMenu.createButton('Load',90,66,6,3,221,100,39,1.0);
		settingsMenu.delSave = settingsMenu.createButton('Delete Save',90,72,6,3,221,100,39,1.0);
		settingsMenu.survive = settingsMenu.createButton('Survive',86,17,7,3,221,100,39,1.0);
		settingsMenu.birth = settingsMenu.createButton('Birth',93,17,7,3,124,100,39,1.0);
		settingsMenu.max = settingsMenu.createButton('Max',86,100,10,3,221,100,39,1.0);
		settingsMenu.s1 = settingsMenu.createButton('1',90,20,3,3,221,100,39,1.0);
		settingsMenu.b1 = settingsMenu.createButton('1',93,20,3,3,124,100,39,1.0);
		settingsMenu.s2 = settingsMenu.createButton('2',90,23,3,3,221,100,39,1.0);
		settingsMenu.b2 = settingsMenu.createButton('2',93,23,3,3,124,100,39,1.0);
		settingsMenu.s3 = settingsMenu.createButton('3',90,26,3,3,221,100,39,1.0);
		settingsMenu.b3 = settingsMenu.createButton('3',93,26,3,3,124,100,39,1.0);
		settingsMenu.s4 = settingsMenu.createButton('4',90,29,3,3,221,100,39,1.0);
		settingsMenu.b4 = settingsMenu.createButton('4',93,29,3,3,124,100,39,1.0);
		settingsMenu.s5 = settingsMenu.createButton('5',90,32,3,3,221,100,39,1.0);
		settingsMenu.b5 = settingsMenu.createButton('5',93,32,3,3,124,100,39,1.0);
		settingsMenu.s6 = settingsMenu.createButton('6',90,35,3,3,221,100,39,1.0);
		settingsMenu.b6 = settingsMenu.createButton('6',93,35,3,3,124,100,39,1.0);
		settingsMenu.s7 = settingsMenu.createButton('7',90,38,3,3,221,100,39,1.0);
		settingsMenu.b7 = settingsMenu.createButton('7',93,38,3,3,124,100,39,1.0);
		settingsMenu.s8 = settingsMenu.createButton('8',90,41,3,3,221,100,39,1.0);
		settingsMenu.b8 = settingsMenu.createButton('8',93,41,3,3,124,100,39,1.0);
		
		ui.menu.hud = new Menu('Hud',0,93,100,7,55,53,29,0.7);
		let hud = ui.menu.hud;
		ui.menus.push(hud);
		hud.isVisible = true;
		hud.spawn = hud.createButton('Spawn',0,93,8,6,70,96,78,1.0);
		hud.labor = hud.createButton('Skills',18,93,8,6,130,96,78,1.0);
		hud.safehouse = hud.createButton('Facilities',40,93,8,6,190,96,78,1.0);
		hud.ascend = hud.createButton('Ascend',61.9,93,8,6,250,96,78,1.0);
		hud.vacate = hud.createButton('Vacate',83.8,93,8,6,310,96,78,1.0);
		hud.vacate.isVisible = false;
		
		ui.menu.top = new Menu('Stats',0,0,100,14,55,53,29,0.7);
		let top = ui.menu.top;
		ui.menus.push(top);
		top.isVisible = true;
		top.currency = top.createButton('Distance Credits',4,1,19,6,177,96,78,1.0);
		top.rateOfCurrency = top.createButton('Gain Rate',4,7,19,6,137,96,78,1.0);
		//top.currency.isVisible = true;
		top.bodies = top.createButton('Infected Growths',34,1,19,6,177,96,78,1.0);
		top.rateOfInfection = top.createButton('Infection Penalty',34,7,19,6,177,96,78,1.0);
		top.antibodies = top.createButton('Disinfecting Agents',64,1,19,6,177,96,78,1.0);
		top.rateOfProtection = top.createButton('Disinfect Bonus',64,7,19,6,177,96,78,1.0);
		top.settings = top.createButton('Options',92,1,8,6,195,96,78,1.0);
	}

	saveGame(){
		localStorage.setItem("primary", JSON.stringify(this.player.stats));
		console.log(localStorage["primary"]);
	}
	deleteGame(){
	localStorage.removeItem("primary");
	console.log('Save Deleted');
	//this.player.initStats();
	//this.player.applyStats();	
	this.player.stats.currency += 1000000;
	this.player.stats.materialTotal += 10000;
	this.player.stats.material += 10000;
	}
	loadGame(){
		let gameJSON = localStorage.getItem("primary");
		//JSON revive method to rebuild stats object
		let data = JSON.parse(gameJSON);
		this.resetMenus();
		this.player.initStats();
		this.player.applyLoad(data);
		this.player.applyStats();
		console.log('loaded game');
	}	
	
	
	

}
//TODO: create JSON export/import
//Essentially all the savegame data, initializes costs etc..

class Player{
	constructor(){
		this.game = engine.game;
		this.stats = {};
		let spawn = engine.ui.menu.spawn;
		this.initStats();
		this.applyStats();
		this.mouseSpawnShapes = [];
		this.squareMap = null;
		this.mouseSpawnButton = null;
		this.safehousePrestigePurchases = [];
		//Game cycle will check this list and attempt to purchase button automatically
		this.autoPurchases = [];
		
	}
	initStats(){
		this.stats.baseIncomeRate = .10;
		this.stats.baseMaterialRate = 1;
		this.stats.baseAscendRate = 1;
		this.stats.conwayPopBonus = -9;
		this.stats.playerPopBonus = 10;
		this.stats.rateMultiplier = 1;
		this.stats.currency = 0;
		this.stats.currencyTotal = this.stats.currency;
		this.stats.material = 0;
		this.stats.materialTotal = this.stats.material;
		this.stats.zen = 0;
		this.stats.zenTotal = this.stats.zen;
		this.stats.randomSize = 2;
		//tracks all purchases in order to load or prestige and keep bought items -- does it stupidly to avoid messy Class JSO
		//TODO: save memory by implementing the messy JSON anyway
		this.stats.purchases = [];
		//spawn menu costs
		//5 leaves spawn.glider visible
		this.stats.lockedSpawnNumber = 5;
		this.stats.spawnInterval = 100;
		this.stats.isSpawnAvaisafehousele = true;
		this.stats.spawnTimeout = 0;
		
		//craft menu costs
		this.stats.craftDouble = 200;
		this.stats.mouseSpawnDelay = 10;
		this.stats.craft1 = 10;
		this.stats.craft2 = 75;
		this.stats.craft3 = 300;
		this.stats.craft4 = 1000;
		this.stats.skill1 = 15;
		this.stats.skill2 = 100;
		this.stats.skill3 = 600;
		this.stats.skill4 = 2000;
		this.stats.randomSizeCost = 2;
		//safehouse menu related values
		this.stats.safehousePoints = 0;
		this.stats.triplerCost = 4;
		this.stats.autoSpawn = 4;
		this.stats.autoSpawnSpeeds = [11000,240,200,180,160];
		this.stats.autoIndex = 0;
		this.stats.safehouseCraft = 8;
		this.stats.safehouseSkill = 8;
		this.stats.safehouse1 = 1;
		this.stats.safehouse2 = 2;
		this.stats.safehouse3 = 3;
		this.stats.safehouse4 = 5;
		this.stats.safehouse5 = 2;
		this.stats.safehouse6 = 4;
		this.stats.safehouse7 = 5;
		this.stats.safehouse8 = 6;
		//ascend menu
		this.stats.materialDoubler = 4;
		this.stats.autoRenovate = 12;
		this.stats.renovateMin = 4;
		this.stats.keepAllSpawns = 8;
		this.stats.ascendBoostCredits = 7;
		this.stats.keepTreadle = 6
		//lowest percent conway pop allowed to not spawn more
		this.stats.conwayPopThreshold = 0.06;
		
		
	}
	applyStats(){
		let stats = this.stats;
		let m = engine.ui.menu.spawn;
		//spawn related
		m = engine.ui.menu.labor;
		m.craftDouble.cost = stats.craftDouble;
		m.mouseSpawnDelay.cost = stats.mouseSpawnDelay;
		m.craft1.cost = stats.craft1;
		m.craft2.cost = stats.craft2;
		m.craft3.cost = stats.craft3;
		m.craft4.cost = stats.craft4;
		m.skill1.cost = stats.skill1;
		m.skill2.cost = stats.skill2;
		m.skill3.cost = stats.skill3;
		m.skill4.cost = stats.skill4;
		m.craftDouble.cost = stats.craftDouble;
		m.mouseSpawnDelay.isDisabled = false;
		m.craft1.isDisabled = false;
		m.craft2.isDisabled = false;
		m.craft3.isDisabled = false;
		m.craft4.isDisabled = false;
		m.skill1.isDisabled = false;
		m.skill2.isDisabled = false;
		m.skill3.isDisabled = false;
		m.skill4.isDisabled = false;
		//safehouse related costs
		m = engine.ui.menu.safehouse;
		m.material.value = stats.material;
		m.materialTotal.value = stats.materialTotal;
		m.renovate.value = 'Gain ' + stats.safehousePoints + ' Materials';
		m.tripler.cost = stats.triplerCost;
		m.spawn.cost = stats.autoSpawn;
		m.craft.cost = stats.safehouseCraft;
		m.skill.cost = stats.safehouseSkill;
		m.craft1.cost = stats.safehouse1;
		m.craft2.cost = stats.safehouse2;
		m.craft3.cost = stats.safehouse3;
		m.craft4.cost = stats.safehouse4;
		m.skill1.cost = stats.safehouse5;
		m.skill2.cost = stats.safehouse6;
		m.skill3.cost = stats.safehouse7;
		m.skill4.cost = stats.safehouse8;
		m.tripler.isDisabled = false;
		m.spawn.isDisabled = false;
		m.craft.isDisabled = false;
		m.skill.isDisabled = false;
		m.craft1.isDisabled = false;
		m.craft2.isDisabled = false;
		m.craft3.isDisabled = false;
		m.craft4.isDisabled = false;
		m.skill1.isDisabled = false;
		m.skill2.isDisabled = false;
		m.skill3.isDisabled = false;
		m.skill4.isDisabled = false;
		//ascend
		m = engine.ui.menu.ascend;
		m.zen.value = stats.zen;
		m.zenTotal.value = stats.zenTotal;
		m.autoPlus.cost = 0;
		m.autoMinus.cost = 0;
		m.boostMaterial.cost = this.stats.materialDoubler;
		m.autoRenovate.cost = this.stats.autoRenovate;
		m.keepAllSpawns.cost = this.stats.keepAllSpawns;
		m.boostCredits.cost = this.stats.ascendBoostCredits;
		m.keepTreadle.cost = this.stats.keepTreadle;
		//vacate
		
		
		
		
	}
	translateNameToButton(buttonName){
		for (let menu of engine.ui.menus){
			for (let button of menu.buttons){
				if ( button.name == buttonName){
					return (button);
				}
			}
		}
		return (null);
	}
	applyLoad(data){
		//load stats from a saved game
		if(data != null){
			
			this.stats.currency = data.currency;
			this.stats.randomSize = data.randomSize;
			//this.stats.lockedSpawnNumber = data.lockedSpawnNumber;
			this.stats.material = data.material;
			this.stats.materialTotal = data.materialTotal;
			this.stats.zen = data.zen;
			this.stats.zenTotal = data.zenTotal;
			//TODO: add vacate currency
			
			//TODO: add error correcting - may pass null to this.purchase
			for (let buttonName of data.purchases){
				let button = this.translateNameToButton(buttonName);
				console.log('Load Purchase: ' + button.name);
				this.purchase(button,true);
			}
		}
	}
	applyLabPrestige(gain){
		//capture kept items
		//TODO: add currency for vacate
		console.log('Lab Prestige Gain: ' + gain);
		let zen = this.stats.zen;
		let zenTotal = this.stats.zenTotal;
		let material = this.stats.material;
		let total = this.stats.materialTotal;
		let purchaseList = this.stats.purchases.slice(0);
		let toggle = engine.ui.menu.safehouse.isToggled;
		//reset game, add values to stats, purchase kept buttons
		engine.game.resetMenus();
		this.initStats();
		this.applyStats();
		this.stats.zen = zen;
		this.stats.zenTotal = zenTotal;
		this.stats.materialTotal = total + gain;
		this.stats.material = material + gain;
		engine.ui.menu.safehouse.isVisible = true;
		engine.ui.menu.safehouse.isToggled = toggle;
		for (let buttonName of purchaseList){
			let button = this.translateNameToButton(buttonName);
			if(button.parent == engine.ui.menu.safehouse || engine.ui.menu.ascend){
				this.purchase(button, true);
			}
		}
	}
	applyAscendPrestige(gain){
		//capture kept items
		//TODO: add currency for vacate
		console.log('Ascend Prestige Gain: ' + gain);
		let zen = this.stats.zen;
		let zenTotal = this.stats.zenTotal;
		let purchaseList = this.stats.purchases.slice(0);
		let toggle = engine.ui.menu.ascend.isToggled;
		//reset game, add values to stats, purchase kept buttons
		engine.game.resetMenus();
		this.initStats();
		this.applyStats();
		this.stats.zen = zen + gain;
		this.stats.zenTotal = zenTotal + gain;
		engine.ui.menu.ascend.isVisible = true;
		engine.ui.menu.ascend.isToggled = toggle;
		for (let buttonName of purchaseList){
			let button = this.translateNameToButton(buttonName);
			if(button.parent == engine.ui.menu.ascend){
				this.purchase(button, true);
			}
		}
	}
	//to be called by game cycle to autopurchase affordable
	autoPurchase(){
		for (let button of this.autoPurchases){
				this.purchase(button,false); 
		}
	}
	
	purchase(button,isFree){
		let costMultiplier = 1.5;
		let menu = engine.ui.menu;
		console.log('Purchase request: ' + button.name);
		if ((isFree == true) || (this.isAffordable(button))){
			//TODO add other ascensions here
			//dont add ascensions to load purchase lists
			if (button != menu.safehouse.renovate && button != menu.ascend.ascension){
				this.stats.purchases.push(button.name);
			}
			let cost = button.cost;
			if (isFree){
				cost = 0;
			}
			switch (button.parent){
				case menu.labor:
				switch (button){
					case menu.labor.craftDouble:
					this.stats.craftDouble += this.stats.craftDouble*costMultiplier; 
					this.stats.rateMultiplier += this.stats.rateMultiplier;
					button.cost = this.stats.craftDouble;
					break;
					case menu.labor.mouseSpawnDelay:
					this.stats.spawnInterval = Math.floor(this.stats.spawnInterval*0.7);
					if (this.stats.spawnInterval < 15){
						this.stats.spawnInterval = 0;
						this.disableButton(button);
					}else{
						button.cost += Math.floor(button.cost*costMultiplier);
					}
					console.log('SpawnInterval: ' + this.stats.spawnInterval);
					break;
					//case someMenu.randomSizeButton
					//this.stats.randomSize += 1;
					//this.stats.randomSizeCost += this.stats.randomSizeCost*costMultiplier;
					case menu.labor.skill1:
					menu.spawn.fish.isVisible = true;
					this.stats.craft1 = null;
					this.disableButton(button);
					break;
					case menu.labor.skill2:
					menu.spawn.copperhead.isVisible = true;
					this.stats.craft2 = null;
					this.disableButton(button);
					break;
					case menu.labor.skill3:
					menu.spawn.acorn.isVisible = true;
					this.stats.craft3 = null;
					this.disableButton(button);
					break;
					case menu.labor.skill4:
					menu.spawn.rPen.isVisible = true;
					this.stats.craft4 = null;
					this.disableButton(button);
					break;
					case menu.labor.craft1:
					this.stats.conwayPopBonus -= 0.25*this.stats.conwayPopBonus;
					this.stats.skill1 = null;
					this.disableButton(button);
					break;
					case menu.labor.craft2:
					this.stats.conwayPopBonus -= 0.25*this.stats.conwayPopBonus;
					this.stats.skill2 = null;
					this.disableButton(button);
					break;
					case menu.labor.craft3:
					this.stats.conwayPopBonus -= 0.25*this.stats.conwayPopBonus;
					this.stats.skill3 = null;
					this.disableButton(button);
					break;
					case menu.labor.craft4:
					this.stats.conwayPopBonus -= 0.25*this.stats.conwayPopBonus;
					this.stats.skill4 = null;
					this.disableButton(button);
					break;
					default:
				}
				this.stats.currency -= cost;
				break;
				case menu.safehouse:
				//TODO add safehouseCraft and safehouseSkill 
				switch (button){
					case menu.safehouse.craft:
					this.autoPurchases.push(menu.labor.craftDouble);
					this.disableButton(button);
					break;
					case menu.safehouse.skill:
					this.autoPurchases.push(menu.labor.mouseSpawnDelay);
					this.disableButton(button);
					break;
					case menu.safehouse.renovate:
					if(button.isHighlight){
						this.applyLabPrestige(Math.floor(this.stats.baseMaterialRate*Math.cbrt(this.stats.currency/10)));
					}
					break;
					case menu.safehouse.tripler:
					this.stats.rateMultiplier += 2*this.stats.rateMultiplier;
					this.stats.triplerCost += Math.floor(this.stats.triplerCost*costMultiplier);
					button.cost = this.stats.triplerCost;
					break;
					case menu.safehouse.spawn:
					if(this.stats.autoIndex < 4){
						this.stats.autoIndex += 1;
						this.stats.autoSpawn += Math.floor(this.stats.autoSpawn*costMultiplier);
						button.cost = this.stats.autoSpawn;
						if(this.stats.autoIndex == 4){
							this.stats.autoSpawn = null;
							this.disableButton(button);
						}
					}
					break;
					case menu.safehouse.craft1:
					if (menu.labor.craft1.cost != null){
						this.purchase(menu.labor.craft1,true);
					}
					this.safehousePrestigePurchases.push(menu.labor.craft1);
					this.stats.safehouse1 = null;
					this.disableButton(button);
					break;
					case menu.safehouse.craft2:
					if (menu.labor.craft2.cost != null){
						this.purchase(menu.labor.craft2,true);
					}
					this.safehousePrestigePurchases.push(menu.labor.craft2);
					this.stats.safehouse2 = null;
					this.disableButton(button);
					break;
					case menu.safehouse.craft3:
					if (menu.labor.craft3.cost != null){
						this.purchase(menu.labor.craft3,true);
					}
					this.safehousePrestigePurchases.push(menu.labor.craft3);
					this.stats.safehouse3 = null;
					this.disableButton(button);
					break;
					case menu.safehouse.craft4:
					if (menu.labor.craft4.cost != null){
						this.purchase(menu.labor.craft4,true);
					}
					this.safehousePrestigePurchases.push(menu.labor.craft4);
					this.stats.safehouse4 = null;
					this.disableButton(button);
					break;
					case menu.safehouse.skill1:
					if (menu.labor.skill1.cost != null){
						this.purchase(menu.labor.skill1,true);
					}
					this.stats.playerPopBonus += 0.25*this.stats.playerPopBonus;
					this.safehousePrestigePurchases.push(menu.labor.skill1);
					this.stats.safehouse5 = null;
					this.disableButton(button);
					break;
					case menu.safehouse.skill2:
					if (menu.labor.skill2.cost != null){
						this.purchase(menu.labor.skill2,true);
					}
					this.stats.playerPopBonus += 0.25*this.stats.playerPopBonus;
					this.safehousePrestigePurchases.push(menu.labor.skill2);
					this.stats.safehouse6 = null;
					this.disableButton(button);
					break;
					case menu.safehouse.skill3:
					if (menu.labor.skill3.cost != null){
						this.purchase(menu.labor.skill3,true);
					}
					this.stats.playerPopBonus += 0.25*this.stats.playerPopBonus;
					this.safehousePrestigePurchases.push(menu.labor.skill3);
					this.stats.safehouse7 = null;
					this.disableButton(button);
					break;
					case menu.safehouse.skill4:
					if (menu.labor.skill4.cost != null){
						this.purchase(menu.labor.skill4,true);
					}
					this.stats.playerPopBonus += 0.25*this.stats.playerPopBonus;
					this.safehousePrestigePurchases.push(menu.labor.skill4);
					this.stats.safehouse8 = null;
					this.disableButton(button);
					break;
					default:
				}
				this.stats.material -= cost;
				break;
				case menu.ascend:
				//TODO add ascendCraft and ascendSkill 
				switch (button){
					case menu.ascend.autoRenovate:
					this.autoPurchases.push(menu.safehouse.renovate);
					menu.ascend.autoPlus.isVisible = true;
					menu.ascend.autoMinus.isVisible = true;
					button.cost = null;
					break;
					case menu.ascend.autoPlus:
					this.stats.renovateMin ++;
					break;
					case menu.ascend.autoMinus:
					this.stats.renovateMin --;
					break;
					case menu.ascend.keepAllSpawns:
					this.purchase(menu.safehouse.skill1, true);
					this.purchase(menu.safehouse.skill2, true);
					this.purchase(menu.safehouse.skill3, true);
					this.purchase(menu.safehouse.skill4, true);
					this.disableButton(button);
					break;
					case menu.ascend.ascension:
					if(button.isHighlight){
						this.applyAscendPrestige(Math.floor(Math.cbrt(this.stats.materialTotal/10)));
					}
					break;
					case menu.ascend.boostCredits:
					this.stats.rateMultiplier += 2*this.stats.rateMultiplier;
					this.stats.ascendBoostCredits += Math.floor(this.stats.ascendBoostCredits*costMultiplier);
					button.cost = this.stats.ascendBoostCredits;
					break;
					case menu.ascend.keepTreadle:
					this.purchase(menu.safehouse.craft,true);
					this.disableButton(button);
					break;
					case menu.ascend.boostMaterial:
					this.stats.baseMaterialRate += this.stats.baseMaterialRate;
					this.stats.materialDoubler += Math.floor(this.stats.materialDoubler*costMultiplier);
					button.cost = this.stats.materialDoubler;
					break;
					default:
				}
				this.stats.zen -= cost;
				break;default:
			}
		
		}
		
	}
	
	disableButton(button){
		button.value = null;
		button.cost = null;
		button.isHighlight = false;
		button.isDisabled = true;
		button.hsla.a = .4;
	}
	isAffordable(button){
		let menu = engine.ui.menu;
		switch (button.parent){
			case menu.safehouse:
			return (button == menu.safehouse.renovate || ((button.cost <= this.stats.material) && (button.cost != null)));
			case menu.ascend:
			return (button == menu.ascend.ascension || ((button.cost <= this.stats.zen) && (button.cost != null)));
			break;
			default:
			return ((button.cost <= this.stats.currency) && (button.cost != null));
		}
	}
	//TODO: find average x,y distance from mouse, move shapes independent of grid
	checkForRemoval(button){
		let spawnButton = this.mouseSpawnButton;
		//mouseSpawn is not purchased and mouse is no longer hovered
		
		if(button == spawnButton){
			//console.log('SpawnUnHover: ' +this.mouseSpawnButton.name);
			while (this.mouseSpawnShapes.length > 0){
				this.mouseSpawnShapes.pop();
			}				
			this.mouseSpawnButton = null;
		}
	}
	generateRandomSpawn(){
		
		let map = '';
		let sizeX = Math.round(Math.random()*3) + this.stats.randomSize;
		let sizeY = Math.round(Math.random()*3) + this.stats.randomSize;
		for (let k = 0; k < sizeY; k++){
			if (k != 0){
				map = map + '$';
			}
			for (let i = 0; i < sizeX; i++){
				if (Math.floor(Math.random()<.5)){
					map = map + 'o'
				}else{
					map = map + 'b';
				}
			}
		}
		//console.log('generate: ' + map);
		return map;
	}
	//Confirm mouse spawn and convert to a creature
	prepareMouseSpawn(button){
		// oShape, rleMap, isEast, isSouth
		let spawn = {};
		if (this.mouseSpawnShapes.length < 1){
			this.mouseSpawnButton = button;
			let x = Math.floor(button.x +button.width);
			let y = Math.floor(button.y + button.width/2);
			console.log('Add Spawn: ' + x +','+ y);
			let s = engine.game.grid.getCloseShape(x,y); 
			//console.log('SpawnHover: ' +this.mouseSpawnButton.name);
			let oShape = s;
			let map = '';
			switch(button.name){
				case 'r-Pento':
				map = engine.game.conway.rPen;
				break;
				case 'Acorn':
				map = engine.game.conway.acorn;
				break;
				case 'Fish':
				map = engine.game.conway.fish;
				break;
				case 'Copperhead':
				map = engine.game.conway.copperhead;
				break;
				case 'Glider':
				map = engine.game.conway.gun;
				break;
				default:
				map = this.generateRandomSpawn();
			}
			spawn.oShape = s;
			spawn.map = map.slice(0);
			spawn.isEast = Math.random() < 0.5;
			spawn.isSouth = Math.random() < 0.5;
			spawn.isSideways = Math.random() < 0.5;
			
		}
		this.spawn = spawn;
		this.addMouseSpawn(spawn);
	}
	placeMouseSpawn(spawn,x,y){
		console.log('Start Placement: ' + x + ',' + y);
		let mouseToGrid = engine.game.grid.getCloseShape(x,y);
		let oShape = mouseToGrid;
		let s = oShape;
		let mapCopy = spawn.map.slice(0);
		let creature = new Creature (engine.game,mouseToGrid,Math.floor(Math.random()*361),'player');
		
		//how many repetitions of birth/dead shapes in a row 
		let repeat = 0;
		//randomize E/W and N/S
		while(mapCopy.length > 0){
			//console.log(mapCopy);
			let count = parseInt(mapCopy);
			//first char of map is not a counter
			if(isNaN(count)){
				let ch = mapCopy.substring(0,1);
				mapCopy = mapCopy.slice(1);
				//console.log(ch);
				switch (ch){
					case '!':
					break;
					case 'o':
					for (let j = 0; j <= repeat; j++){	
						s.creature.removeShape(s,engine.game.conway.liveShapes);
						s.life = 1;
						creature.addShape(s,engine.game.conway.liveShapes);
						if (spawn.isSideways){
							s = (spawn.isEast) ? s.ss : s.nn;
						}else{
							s = (spawn.isEast) ? s.ee : s.ww;
						}
					}
					repeat = 0;
					break;
					case 'b':
					for (let j = 0; j <= repeat; j++){
						if (spawn.isSideways){
							s = (spawn.isEast) ? s.ss : s.nn;
						}else{
							s = (spawn.isEast) ? s.ee : s.ww;
						}
					}
					repeat = 0;
					break;
					case '$':
					for (let j = 0; j <= repeat; j++){
						if (spawn.isSideways){
							oShape = (spawn.isSouth) ? oShape.ww : oShape.ee;
						}else{
							oShape = (spawn.isSouth) ? oShape.ss : oShape.nn;
						}
					}
					s = oShape;
					repeat = 0;
					break;
					default:
					console.log('rle error');
				}
			//discard number and set repeat
			}else{
				repeat = count - 1;
				let chLength = count.toString().length;
				//console.log('repeat: ' + repeat + '. length: ' + chLength);
				mapCopy = mapCopy.slice(chLength);
			}
		}
	while(this.mouseSpawnShapes.length > 0){
		this.mouseSpawnShapes.pop();
	}		
	this.stats.isSpawnAvaisafehousele = false;
	this.stats.spawnTimeout = engine.counter + this.stats.spawnInterval;
	}
	
	addMouseSpawn(spawn){
		let mapCopy = spawn.map.slice(0);
		let oShape = spawn.oShape;
		let s = oShape;
		//how many repetitions of birth/dead shapes in a row 
		let repeat = 0;
		//randomize E/W and N/S
		while(mapCopy.length > 0){
			//console.log(mapCopy);
			let count = parseInt(mapCopy);
			//first char of map is not a counter
			if(isNaN(count)){
				let ch = mapCopy.substring(0,1);
				mapCopy = mapCopy.slice(1);
				//console.log(ch);
				switch (ch){
					case '!':
					break;
					case 'o':
					for (let j = 0; j <= repeat; j++){
						this.mouseSpawnShapes.push(s);
						if (spawn.isSideways){
							s = (spawn.isEast) ? s.ss : s.nn;
						}else{
							s = (spawn.isEast) ? s.ee : s.ww;
						}
					}
					repeat = 0;
					break;
					case 'b':
					for (let j = 0; j <= repeat; j++){
						if (spawn.isSideways){
							s = (spawn.isEast) ? s.ss : s.nn;
						}else{
							s = (spawn.isEast) ? s.ee : s.ww;
						}
					}
					repeat = 0;
					break;
					case '$':
					for (let j = 0; j <= repeat; j++){
						if (spawn.isSideways){
							oShape = (spawn.isSouth) ? oShape.ww : oShape.ee;
						}else{
							oShape = (spawn.isSouth) ? oShape.ss : oShape.nn;
						}
					}
					s = oShape;
					repeat = 0;
					break;
					default:
					console.log('rle error');
				}
			//discard number and set repeat
			}else{
				repeat = count - 1;
				let chLength = count.toString().length;
				//console.log('repeat: ' + repeat + '. length: ' + chLength);
				mapCopy = mapCopy.slice(chLength);
			}
		}	
	}
	
	drawMouseSpawn(x,y){
	  if (this.mouseSpawnShapes.length > 0){	
		let hsla = engine.vfx.hslaEdit();
		engine.vfx.hslaEdit('grey',hsla);
		//hsla.a = 1.0;	
		let mouseToGrid = engine.game.grid.getCloseShape(x,y);
		let dX = Math.floor(mouseToGrid.x - this.mouseSpawnShapes[0].x);
		let dY = Math.floor(mouseToGrid.y - this.mouseSpawnShapes[0].y);
		//console.log('draw: ' + (mouseToGrid.x +dX) + ',' + (mouseToGrid.y +dY));
		for (let s of this.mouseSpawnShapes){
			engine.vfx.drawRounded(s.x + dX,s.y + dY,s.size,s.size,hsla,4);
			//engine.vfx.drawRounded(s.x,s.y,s.size,s.size,hsla,4);
		}
	  }
	}
	// TODO: assign probabilities to different spawns
	playerAutoSpawn(eggType){
		let egg = '';
		let eggs = ['Acorn','Crawler','Star','Vine','Spore'];
		if(eggType == null){
			eggType = eggs[Math.floor(Math.random()*eggs.length)];
		}
		switch(eggType){
			case 'Acorn':
			egg = engine.game.conway.acorn;
			break;
			case 'Crawler':
			egg = engine.game.conway.gun;
			break;
			case 'Star':
			egg = engine.game.conway.rPen;
			break;
			case 'Vine':
			egg = engine.game.conway.copperhead;
			break;
			case 'Spore':
			egg = engine.game.conway.fish;
			break;
			//eggtype must otherwise be a number
			default:
		}
		let s = engine.game.grid.getSampleShape();
		engine.game.conway.assign(s,egg,'player');
	}
}

class Conway {
	constructor (game){
		this.names = ['David','John','Paul','Mark','James','Robert','Stuart','Brian','Kevin','Richard','Neil','Iain','Peter','Graham','Allan','Lee','Anthony','Jonathan','Edward','Matthew','Charles','Alistair','Ronald','Francis','Bruce','Wayne','Adam','Calum','Robin','Greig','Cameron','Adrian','Gerald','Benjamin','Shaun','Campbell','Marcus','Barrie','Liam','Trevor','Lewis','Rory','Arthur','Owen','Jeffrey','Harry','Bernard','Jeremy','Nathan','Julian','Leon','Nigel','Drew','Frazer','Crawford','Gregg','Kerr','Victor','Daryl','Grahame','Maurice','Nicolas','Steve','Nairn','Scot','Warren','Billy','Ralph','Brett','Eoin','Imran','Ivor','Kevan','Robbie','Cornelius','Kristian','Mathew','Moray','Shane','Forbes','Kelvin','Tom','Alfred','Alick','Darryl','Harvey','Kirk','Marshall','Tommy','Wai','Andrea','Daren','Kieron','Luke','Marvin','Ronnie','Torquil','Wallace','Alain','Alec','Arran','Chun','Danny','Declan','Johnston','Keiron','Lloyd','Max','Maxwell','Neville','Reuben','Roberto','Tobias','Todd','Abid','Adnan','Asif','Bjorn','Brydon','Bryn','Carlo','Christien','Clint','Dario','Dustin','Edgar','Elton','Emlyn','Farooq','Gidon','Howard','Ircopperhead','Jaimie','Jeff','Kane','Kashif','Keiran','Leo','Lorn','Lyle','Michel','Nathanael','Nickie','Nicky','Ricky','Ritchie','Robertson','Rowland','Scotland','Sonny','Taylor','Travis','Tristan','Yan','Abdullahi','Adebayo','Adel','Adrain','Alaistair','Alexandre','Alfredo','Alisteir','Amato','Amir','Amit','Andres','Anil','Ann','Antonius','Anwar','Aonghus','Arif','Arnout','Aron','Arvind','Asa','Ashwani','Athol','Azzam','Balraj','Barnabas','Bayne','Bengiman','Bevan','Blythe','Bobby','Carey','Carol','Carreen','Cary','Chi','Chincdu','Chu','Ciaran','Ciaron','Coll','Con','Corin','Cormac','Cullen','Dameon','Danga','Darryn','Davide','Davyd','Dax','Del','Dermot','Diego','Dino','Domenico','Donnie','Donny','Dorino','Eben','Edoardino','Efeoni','El','Elgin','Eoghann','Erl','Fabio','Feargus','Francesco','Francois','Frankie','Frazier','Gardner','Georgio','Gethin','Gianni','Gillan','Gino','Greggory','Grigor','Gurkimat','Gurvinder','Haitham','Hani','Hedley','Hitesh','Hoi','Ifeatu','Iffor','Imtiaz','Islay','Jackson','Jade','Jardine','Jasbir','Jasjeet','Jeremiah','Jerry','Jesse','Jimmy','Jimsheed','Jojeph','Josep','Joshua','Joss','Jreen','Ka','Kai','Kari','Kee','Kelly','Kenrick','Kevyn','Khalid','Kier','Koon','Kristen','Kuldeep','Kurt','Kwasi','Laine','Laychlan','Lenord','Liaqat','Linsay','Lisle','Littlesky','Loumont','Luis','Mandeep','Manmath','Mansel','Maqsood','Marl','Marvan','Marvyn','Maurizio','Mcnamara','Melville','Miles','Milo','Mitchel','Moazzam','Muctarr','Mukendi','Nabil','Naeeh','Naeem','Neale','Neel','Nikolaos','Nishal','O','Obumneme','Odaro','Orest','Orlando','Pamela','Paulo','Pegasus','Piero','Pietro','Pravin','Quintin','Rajesh','Ramesh','Rauri','Raymund','Reay','Reece','Rex','Ritchard','Robertjohn','Rodden','Rohan','Rohit','Russel','Ryan','Sacha','Samir','Sanders','Saqib','Saul','Sebastian','Sergio','Shahed','Shahriar','Shawn','Sheikh','Sheldon','Shuan','Siddharta','Sleem','Solomon','Stevan','Stevie','Stuard','Sufian','Sven','Talal','Tanvir','Tarek','Tarl','Teginder','Thor','Thorfinn','Trebor','Trent','Vikash','Wael','Waheedur','Wanachak','Warner','Wilbs','Wilfred','Willis','Wun','Xavier','Yanik','Younis','Zadjil','Zain','Zeeshan','Zeonard','Zi','Claire','Sharon','Jacqueline','Louise','Sarah','Caroline','Elizabeth','Lorraine','Laura','Lorna','Wendy','Yvonne','Suzanne','Anne','Diane','Helen','Hazel','Andrea','Shona','Kathleen','Melanie','Jill','Leigh','Morag','Lynsey','Debbie','Arlene','Zoe','Mandy','Mhairi','Marion','Lynda','Eileen','Kim','Julia','Alexandra','Irene','Rebecca','Teresa','Adele','Ashley','Moira','Rosemary','Geraldine','Theresa','Agnes','Sheila','Hilary','Sonia','Janette','Gaynor','Veronica','Lyndsay','Susanne','Leona','Joyce','Avril','Josephine','Vanessa','Natasha','Monica','Roslyn','Adrienne','Isabel','Justine','Cara','Eilidh','Gwen','Faye','Naomi','Vicki','Hannah','Lee','Dorothy','Nadine','Sharron','Stacey','Collette','Kerrie','Marlene','Alana','Morna','Carol','Nina','Nyree','Sarah','Johanne','Marina','Nancy','Vivien','Alyson','Ann','Eve','Kellie','Lynette','Nadia','Ingrid','Lea','Senga','Catrina','Constance','Laurie','Lucinda','Mari','Paulene','Vivian','Antonia','Connie','Daniella','Francesca','Kimberly','Lee','May','Roisin','Aimee','Caren','Corrine','Leila','Liza','Madeleine','Myra','Sasha','Tessa','Tricia','Alexa','Amelia','Annabel','Cecilia','Elise','Estelle','Henrietta','Jade','Jeanie','Jody','Kristeen','Lucie','Lucille','Madeline','Nora','Sheryl','Shiona','Stella','Ailie','Allyson','Carol','Caron','Cathleen','Evonne','Holly','Johann','Karan','Kristine','Leeann','Lindy','Marissa','Norah','Rhian','Saira','Shauna','Susannah','Trudi','Vanda','Vickie','Ainsley','Ainslie','Camilla','Cathryn','Corinna','Corrina','Cristina','Della','Gabrielle','Greer','Imogen','Iris','Ishbel','Jeannette','Katrine','Kirsta','Kirstien','Kristen','Kyra','Lena','Liana','Parveen','Polly','Rita','Shane','Sheona','Suzanna','Vera','Allanna','Anji','Annamarie','Ava','Ayshea','Briony','Carey','Carolynn','Catharine','Ceri','Chelsey','Cheryll','Clayre','Courtney','Debbi','Dian','Donella','Elsie','Esme','Faith','Farhat','Flora','Haley','Hester','Inga','Ivonne','Janeen','Jaqueline','Jodie','Karis','Karrie','Katheryn','Kirstene','Kirsti','Kylie','Lauraine','Lenore','Letitia','Liane','Linzie','Lorena','Loretta','Mai','Margot','Marney','Marni','Maura','Maya','Mhari','Mylene','Nicki','Nickola','Nicolle','Nirmal','Pamella','Reena','Renee','Robert','Robina','Rosanna','Rupinder','Samina','Selena','Shaheen','Shareen','Sorcha','Tracie','Uzma','Wai','Yolanda','Abadah','Adel','Adelle','Adriana','Aimie','Aisling','Alain','Aline','Alka','Alvina','Alvise','Alwyn','Amand','Amita','Andromeda','Andwina','Aness','Angelle','Anisa','Anna','Anna','Annamaria','Anwar','Anya','Ara','Areena','Arline','Arshaluse','Ashley','Asra','Atinuke','Audra','Ayeshea','Barbara','Benedicte','Beverlee','Bianca','Billie','Bobbie','Breigh','Brian','Brigid','Caira','Cairan','Cara','Caralynn','Carlanne','Carlene','Carli','Carn','Carriean','Caryn','Carys','Caterina','Catherin','Catrona','Celesbial','Charelle','Charity','Charline','Cherise','Cherris','Cheryline','Christan','Christel','Cirsty','Clara','Clare','Cleonie','Colina','Correen','Correne','Corrinna','Cynthia','Cyrena','Dalia','Darlaine','Davidina','Dawna','Dawnna','Debbie','Deeba','Delphine','Dena','Devinder','Deziree','Diahann','Dominie','Doranne','Doris','Dulsie','Ebru','Edele','Eilaine','Elaina','Eleanora','Elishia','Elizabeth','Eloisa','Ema','Emma','Emma','Emmeline','Fadelma','Faheem','Farhana','Fehmeeda','Finan','Frances','Freda','Frosoulla','Fyona','Gaynore','Genene','George','Georgine','Gerda','Ghzala','Giselle','Gordina','Gulseren','Gwyneth','Hailey','Hamsa','Harjean','Hedda','Hilda','Hind','Honey','Honor','Ifeoma','Ilse','Imose','Innes','Irena','Ishabel','Jacinta','Jackeline','Jackson','Jacquelynn','Janeane','Janetta','Janferie','Jasmina','Jaswant','Jenefer','Jenna','Jetta','Jinny','Joe','Johane','Johnanna','Jorie','Joy','Juniper','Kae','Kamaljit','Karena','Karima','Karlene','Karlin','Katerina','Katha','Katrien','Katrinaa','Kavil','Keeley','Keir','Kerky','Kerray','Kerrie','Kerryann','Kerstin','Kirstein','Kirstin','Kjersti','Krischa','Kristan','Lada','Lalita','Larna','Lasuru','Lauri','Layna','Leagh','Leanda','Leighann','Lela','Lene','Lesleyanne','Lewelle','Lian','Lillias','Lina','Linn','Lisa','Lorain','Loramay','Lori','Lorinda','Lorna','Louis','Luan','Luciene','Lyndie','Lynn','Mabel','Machala','Madelene','Madelyn','Maimoona','Mairi','Mairi','Malize','Mamtaz','Manal','Marcell','Marellen','Marguerite','Mari','Marianna','Marie','Marie','Marilynn','Marla','Marnee','Marsa','Marsali','Marshalee','Mary','Mary','Mei','Mel','Melainie','Melisa','Melonie','Melysa','Merrilie','Millicent','Min','Mina','Mira','Mirrisa','Muala','Murdette','Mutch','Myriam','Nanvula','Nanze','Narene','Nasreen','Natalina','Nazma','Nhairi','Nicholina','Nirvana','Noeleen','Noha','Noreena','Nuzhat','Oenone','Oi','Olufunmilayo','Omanda','Orainne','Orla','Paula','Perdita','Pesar','Petre','Pilar','Pippa','Pui','Pulwander','Rabiah','Radha','Rajwant','Rakhi','Rani','Raynald','Rennie','Rhiannon','Rhianwen','Rhowan','Roistn','Rosaline','Rosalynd','Roseleen','Rosheen','Rosie','Rozan','Rozanne','Saara','Sabina','Sabreena','Safiya','Sajdah','Sajida','Sajni','Salena','Samfya','Sangeeta','Sara','Sara','Saskia','Scho','Seleena','Sengul','Shagofta','Shahana','Shaher','Shahnaz','Shaidh'];
		this.game = game;
		this.blank = new Creature(game,game.grid.getMiddleShape(),0,'BLANK');
		game.grid.initCreatures(this.blank);
		this.numOfShapes = game.grid.colsN*game.grid.rowsN;
		this.numOfLiveShapes = 0;
		this.rateOfCurrency = 0;
		this.rules = {
			survive : [2,3],
			birth : [3],
			maxMagnitude : 1
		};
		this.liveShapes = [];
		this.conwayPopulation = 0; 
		this.playerPopulation = 0;
		this.changes = [];	
		this.creatures = [];
		this.options = ['gun','loafer','copperhead','fish','rPen'];
		
		this.rPen = 'b2o$2o$bo!';
		this.acorn = 'bo5b$3bo3b$2o2b3o!';
		this.fish = 'bo2bo$o4b$o3bo$4o!';
		this.hivenudger = '4o5bo2bo$o3bo3bo4b$o7bo3bo$bo2bo3b4ob2$5b2o6b$5b2o6b$5b2o6b2$bo2bo3b4ob$o7bo3bo$o3bo3bo4b$4o5bo2bo!';
		this.gun = 'obo$b2o$bo!';
		this.loafer = 'b2o2bob2o$o2bo2b2o$bobo$2bo$8bo$6b3o$5bo$6bo$7b2o!';
		this.copperhead = 'b2o2b2o$3b2o$3b2o$obo2bobo$o6bo2$o6bo$b2o2b2o$2b4o2$3b2o$3b2o!';
	}
	compute(){
		this.changes = [];
		//list to evaluate: avoids calculating inactive shapes
		let evals = [];
		// tracks shapes neighbor colors
		let neigh = 0;
		for (let e of this.liveShapes){
			//console.log(e.creature);
			if (!evals.includes(e)){
				//////console.log('compute: eval ' + e.show());
				evals.push(e);
			}
			for (let t of e.getTouching()){
				//////console.log('compute: touching ' + t.show());
				if (!evals.includes(t)){
				//////console.log('compute: push ' + t.show());
				evals.push(t);
				}
			}
		}
		//list complete... add changes based on rules
		
		for (let e of evals){
			let parents = [];
			let sumLife = 0;
			let liveNeighbors = 0;
			//Magnitude is amount of life in a shape
			let maxMagnitude = this.rules.maxMagnitude;
			//survive rule is array of number of live neighbors to survive
			let survive = this.rules.survive;
			//birth rule, array of number of live neighbors to be born
			let birth = this.rules.birth;
			let touching = e.getTouching();
			for (let t of touching){
				if (t.life > 0){
					//TODO: consider weighing colorRef, requires plan for averaging
					if(!parents.includes(t.creature)){
						//console.log(t.creature);
						parents.push(t.creature);
					}
					liveNeighbors++;
				}
			}
			//e is empty neighbor of at least one life
			if (e.life == 0){
				//create new life
				if (birth.includes(liveNeighbors)){
					//			shape,new hi,creature 
					let creature = parents[Math.floor(Math.random()*parents.length)];
					//console.log('parents popped: ' + creature.name);
					this.addChange(e,creature);
				}
			}
			//e is alive already
			else{
				//remains alive
				if (survive.includes(liveNeighbors)){
					this.addChange(e,e.creature);		
				//inactivate
				}else{
					this.addChange(e);
				}
			}
		}
		//evals done, process changes
		this.exeChanges();
	}
	refreshPopulation(){
		let sumPlayer = 0;
		let sumConway = 0;
		for(let s of this.liveShapes){
			if(s.creature.name !='player'){
				sumConway++;
			} else {
				sumPlayer++;
			}
		}
		this.conwayPopulation = sumConway; 
		this.playerPopulation = sumPlayer;
		this.numOfLiveShapes = sumConway + sumPlayer;
		
	}
	
	runCycle(){
		//spawns a random creature every 180 frames
		if(engine.counter % 180 == 0 || (engine.counter % 40 == 0 && this.conwayPopulation/this.numOfShapes < engine.game.player.stats.conwayPopThreshold)){
			this.conwaySpawn(this.options);
		}
		if(engine.counter % engine.game.player.stats.autoSpawnSpeeds[engine.game.player.stats.autoIndex] == 0){
			this.game.player.playerAutoSpawn();
		}
		//get stats before cycle
		this.refreshPopulation();
		let conwayPopulation = this.conwayPopulation;
		let playerPopulation = this.playerPopulation;
		//update next conway frame
		this.compute();
		//get end of cycle stats
		this.refreshPopulation();
		this.conwayGrowth = this.conwayPopulation - conwayPopulation;
		this.playerGrowth = this.playerPopulation - playerPopulation;
		// award player end of cycle gains/losses
		//this.rateOfCurrency = this.game.player.stats.baseIncomeRate*(this.game.player.stats.rateMultiplier + 
		//						this.game.player.stats.conwayPopBonus*(this.conwayPopulation/this.numOfShapes) + 
		//						this.game.player.stats.playerPopBonus*(this.playerPopulation/this.numOfShapes));
		let stats = this.game.player.stats;
		let gain = stats.baseIncomeRate*stats.rateMultiplier;
		let loss = gain*stats.conwayPopBonus*(this.conwayPopulation/this.numOfShapes);
		let bonus = gain*stats.playerPopBonus*(this.playerPopulation/this.numOfShapes);
		//						this.game.player.stats.conwayPopBonus*(this.conwayPopulation/this.numOfShapes) + 
		//						this.game.player.stats.playerPopBonus*(this.playerPopulation/this.numOfShapes))
		this.rateOfCurrency = gain + bonus + loss;
		
		this.game.player.stats.currency += this.rateOfCurrency;
		
	}
	draw(){
		for (let s of this.liveShapes){
			engine.vfx.drawRounded(s.x,s.y,s.size,s.size,s.hsla,3);
		}
		//engine.game.player.drawMouseSpawn(engine.lastX,engine.lastY);
	}
	addChange(s,creature){
		let change = {};
		change.s = s;
		change.creature = creature;
		//change is removing life	
		if (creature == null){
			change.life = -1;
		}else{
			//new or surviving life
			if(s.life < this.rules.maxMagnitude){
				change.life = 1;
			}else{
				change.life = 0;
			}
		}
		this.changes.push(change);
	}	
	exeChanges(){
		let liveShapes = this.liveShapes;
		for (let change of this.changes){
			let s = change.s; 
			s.life += change.life;
			if (s.life == 0){
				s.creature.removeShape(s, liveShapes);
			}else{
				//TODO: proper colors
				change.creature.addShape(s, liveShapes);
			}
		}
		
	}
	
	conwaySpawn(options){
		let s = this.game.grid.getSampleShape();
		let egg = options[Math.floor(Math.random()*options.length)];
		if(egg =='gun'){
			this.assign(s,this.gun); 
		}else if(egg == 'loafer'){
			this.assign(s,this.loafer);
		}else if(egg == 'copperhead'){
			this.assign(s,this.copperhead);
		}else if(egg == 'fish'){
			this.assign(s,this.fish);
		}else if(egg == 'acorn'){
			this.assign(s,this.acorn);
		}else if(egg == 'rPen'){
			this.assign(s,this.rPen);
		}else if(egg == 'erase'){
			this.eraseLive = true;
		}
		
		//game.grid.draw();
		////console.log(s.show());
	}
		
	
	assign(oShape,map,name){
		//console.log('assign: ' + oShape.show())
		let row = 0;
		let s = oShape; 
		let hi = Math.floor(Math.random()*361);
		let creature = new Creature(this.game,oShape,hi,name);
		this.creatures.push(creature);
		let mapCopy = map.slice(0);
		let repeat = 0;
		let isEast = Math.random() < 0.5;
		let isSouth = Math.random() < 0.5;
		let	isSideways = Math.random() < 0.5;
		//randomize E/W and N/S
		while(mapCopy.length > 0){
			//console.log(mapCopy);
			let count = parseInt(mapCopy);
			//first char of map is not a counter
			if(isNaN(count)){
				let ch = mapCopy.substring(0,1);
				mapCopy = mapCopy.slice(1);
				//console.log(ch);
				switch (ch){
					case '!':
					break;
					case 'o':
					for (let j = 0; j <= repeat; j++){	
						s.creature.removeShape(s,this.game.conway.liveShapes);
						s.life = 1;
						creature.addShape(s,this.game.conway.liveShapes);
						if (isSideways){
							s = (isEast) ? s.ss : s.nn;
						}else{
							s = (isEast) ? s.ee : s.ww;
						}
					}
					repeat = 0;
					break;
					case 'b':
					for (let j = 0; j <= repeat; j++){
						if (isSideways){
							s = (isEast) ? s.ss : s.nn;
						}else{
							s = (isEast) ? s.ee : s.ww;
						}
					}
					repeat = 0;
					break;
					case '$':
					for (let j = 0; j <= repeat; j++){
						if (isSideways){
							oShape = (isSouth) ? oShape.ww : oShape.ee;
						}else{
							oShape = (isSouth) ? oShape.ss : oShape.nn;
						}
					}
					s = oShape;
					repeat = 0;
					break;
					default:
					console.log('rle error');
				}
			//discard number and set repeat
			}else{
				repeat = count - 1;
				let chLength = count.toString().length;
				//console.log('repeat: ' + repeat + '. length: ' + chLength);
				mapCopy = mapCopy.slice(chLength);
			}
		}
	}

}
class Creature{
	constructor(game,oShape, hi, name){
		this.game = game;
		this.route = [];
		if(name != null){
			this.name = name;
		}else{
			this.name = this.game.conway.names[Math.floor(Math.random()*this.game.conway.names.length)];
		}
		this.origin = oShape;
		this.hi = hi;
		this.x = oShape.x;
		this.y = oShape.y; 
		this.body = [];
		this.hsla = engine.vfx.hslaEdit();
	}
	removeShape(s,liveShapes){
		s.life = 0;
		s.creature = this.game.conway.blank;
		if(liveShapes != null){
			let index = liveShapes.indexOf(s);
			//remove life shape from liveShapes
			if (index > -1){
				liveShapes.splice(index,1);
			}
		}
		let i = this.body.indexOf(s);
		if(i >= 0){
		this.body.splice(i,1);	
		}
		if(this.body.length == 0){
			let k = this.game.conway.creatures.indexOf(this);
			if (k > -1){
				this.game.conway.creatures.splice(k,1);
			}
		}
	}
	addShape(s,liveShapes){
		s.creature = this;
		if(liveShapes !=null){
			let index = liveShapes.indexOf(s);
			//add life shape to liveShapes
			if (index == -1){
				liveShapes.push(s);
			}
			if(this.name != 'player'){
				if (index == -1){
					engine.vfx.hslaEdit('drift',this.hsla,25);
					s.changeColor(this.hsla);
				}else {
					engine.vfx.hslaEdit('drift',s.hsla,10);
				}
			}else{
				engine.vfx.hslaEdit('grey',s.hsla);
			}
			
		}
		let i = this.body.indexOf(s);
		if(i == -1){
			this.body.push(s);
		}
	}
	//returns false if neighbors are far away i.e. on opposite edges of grid
	isNeighbor(o,n){
		if ((Math.abs((o.x - n.x)) > 2*o.size) || (Math.abs(o.y - n.y) > 2*o.size)){
			return false;
		}else{
			return true;
		}
	}
	//recursively visit each contiguous neighbor, return route
	getTraversal(s){
		//console.log(s.show());
		if (s.life > 0){
			this.route.push(s);
			let touching = s.getTouching();
			//randomize touchlist
			for (let i = touching.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[touching[i], touching[j]] = [touching[j], touching[i]];
			}
			while(touching.length > 0){
				let t = touching.pop();
				
				if ((t.life > 0) && (!this.route.includes(t))){
					//console.log(t);
					if (this.isNeighbor(s,t)){
						this.getTraversal(t);
					}
				}
			}
			// this.route.push(s);
		}
	}
	
	
	
}
class Grid{
	//iterate rows, create shape, link shapes
	//formalize 'center' as player
	constructor (game,width,height,shapeSize, spacer, type){
		this.game = game;
		this.type = type;
		this.width = width;
		this.height = height;
		this.shapeSize = shapeSize;
		this.spacer = spacer;
		this.rowsN = Math.floor(width / (shapeSize + spacer));
		this.colsN = Math.floor(height / (shapeSize + spacer));
		this.rowMargin = Math.floor((width - this.rowsN*(shapeSize + spacer)) / 2);
		this.colMargin = Math.floor((height - this.colsN*(shapeSize + spacer)) / 2);
		//////console.log(this.rowsN + ' , ' + this.colsN);
		//Linked vertices matrix - the grid
		this.mtx = [];
		this.createGrid();
	}
	initCreatures(c){
		for (let i = 0; i<this.rowsN; i++){
			// make attribute changes
			for (let k = 0; k<this.colsN; k++){
				let s = this.mtx[i][k];
				c.addShape(s,null);
			}
		}
	}
	sortMinArray(array, type) {
		if (type == 'life'){
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			array.sort((a,b) => a.life - b.life);
			return (array);
		} else if (type == 'x'){
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			array.sort((a,b) => a.x - b.x);
			return (array);
		} else if (type == 'y'){
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			array.sort((a,b) => a.y - b.y);
			return (array);
		}
	}

	getSampleShape(){
		let x = Math.floor(Math.random()*this.rowsN);
		let y = Math.floor(Math.random()*this.colsN);
		return (this.mtx[x][y]);
	}
	getMiddleShape(){
		return this.mtx[Math.floor(this.rowsN / 2)][Math.floor(this.colsN / 2)];
	}
	//BUGSUSPECT infinite loop if x,y value is invalid
	getCloseShape(x,y){
		let s = this.mtx[0][0];
		let isFound = false;
		let oS = s;
		while(!isFound && s.ww != oS){
			if (s.x <= x && s.x + s.size >= x){
				//console.log(s.x);
				isFound = true;
			}else{
				s = s.ww;
			}
		}
		isFound = false;
		oS = s;
		while(!isFound && s.ss != oS){
			if (s.y <= y && s.y + s.size >= y){
				isFound = true;
			}else{
				s = s.ss;
			}
		}
		
		//console.log('Get close to ' + x + ',' + y + '... '+ s.x + ',' + s.y); 	 
		return (s);
	}
	createGrid (){
		// i is each column, a member of mtx
		for (let i = 0; i<this.rowsN; i++){
			this.mtx[i] = [];
			// k is a shape obj of column i
			for (let k = 0; k<this.colsN; k++){
				let newShape = null;
				newShape = new Shape(this.game,this.shapeSize*i+this.rowMargin+this.spacer*i,this.shapeSize*k+this.colMargin+k*this.spacer,this.shapeSize, 0);
				this.mtx[i].push(newShape);
			}	
		}
		//assign touching
		for (let i = 0; i<this.rowsN; i++){
			// k is a shape obj of column i
			for (let k = 0; k<this.colsN; k++){
				let s =this.mtx[i][k];
				//top ww "cornerwork"
				if(i == 0 && k == 0){
					////console.log('(' + i + ',' + k + ',) + corner = ' + s.x + ',' + s.y);
					s.nw = this.mtx[this.rowsN - 1][this.colsN - 1];
					s.nn = this.mtx[i][this.colsN - 1];
					s.ne = this.mtx[i + 1][this.colsN - 1];
					
					s.ww = this.mtx[this.rowsN - 1][k];
					s.ee = this.mtx[i + 1][k];
						
					s.sw = this.mtx[this.rowsN - 1][k + 1];
					s.ss = this.mtx[i][k + 1];
					s.se = this.mtx[i + 1][k + 1];
						
				//top ee cornerwork
				}else if(i == this.rowsN - 1 && k == 0){
						////console.log('(' + i + ',' + k + ',) + corner = ' + s.x + ',' + s.y);
						s.nw = this.mtx[i - 1][this.colsN - 1];
						s.nn = this.mtx[i][this.colsN - 1];
						s.ne = this.mtx[0][this.colsN - 1];
						
						s.ww = this.mtx[i - 1][k];
						s.ee = this.mtx[0][k];
						
						s.sw = this.mtx[i - 1][k + 1];
						s.ss = this.mtx[i][k + 1];
						s.se = this.mtx[0][k + 1];
					//botm ww
					}else if (i == 0 && k == this.colsN - 1){
						////console.log('(' + i + ',' + k + ',) + corner = ' + s.x + ',' + s.y);
						s.nw = this.mtx[this.rowsN - 1][k - 1];
						s.nn = this.mtx[i][k - 1];
						s.ne = this.mtx[i + 1][k - 1];
						
						s.ww = this.mtx[this.rowsN - 1][this.colsN - 1];
						s.ee = this.mtx[i + 1][k];
						
						s.sw = this.mtx[this.rowsN - 1][0];
						s.ss = this.mtx[i][0];
						s.se = this.mtx[i + 1][0];
					//botm ee
					}else if (i == this.rowsN - 1 && k == this.colsN - 1){
						////console.log('(' + i + ',' + k + ',) + corner = ' + s.x + ',' + s.y);
						s.nw = this.mtx[i - 1][k - 1];
						s.nn = this.mtx[i][k - 1];
						s.ne = this.mtx[0][k - 1];
						
						s.ww = this.mtx[i - 1][k];
						s.ee = this.mtx[0][k];
						
						s.sw = this.mtx[i - 1][0];
						s.ss = this.mtx[i][0];
						s.se = this.mtx[0][0];
					//first row, not corner "upwork"
					} else if(k == 0){
						s.nw = this.mtx[i - 1][this.colsN - 1];
						s.nn = this.mtx[i][this.colsN - 1];
						s.ne = this.mtx[i + 1][this.colsN - 1];
						
						s.ww = this.mtx[i - 1][k];
						s.ee = this.mtx[i + 1][k];
						
						s.sw = this.mtx[i - 1][k + 1];
						s.ss = this.mtx[i][k + 1];
						s.se = this.mtx[i + 1][k + 1];
					//last row "downwork"
					}else if(k == this.colsN - 1){
						s.nw = this.mtx[i - 1][k - 1];
						s.nn = this.mtx[i][k - 1];
						s.ne = this.mtx[i + 1][k - 1];
						
						s.ww = this.mtx[i - 1][k];
						s.ee = this.mtx[i + 1][k];
						
						s.sw = this.mtx[i - 1][0];
						s.ss = this.mtx[i][0];
						s.se = this.mtx[i + 1][0];
					//first column
					}else if (i == 0){
						s.nw = this.mtx[this.rowsN - 1][k - 1];
						s.nn = this.mtx[i][k - 1];
						s.ne = this.mtx[i + 1][k - 1];
						
						s.ww = this.mtx[this.rowsN - 1][k];
						s.ee = this.mtx[i + 1][k];
						
						s.sw = this.mtx[this.rowsN - 1][k + 1];
						s.ss = this.mtx[i][k + 1];
						s.se = this.mtx[i + 1][k + 1];
					// last column
					} else if (i == this.rowsN - 1){
						s.nw = this.mtx[i - 1][k - 1];
						s.nn = this.mtx[i][k - 1];
						s.ne = this.mtx[0][k - 1];
						
						s.ww = this.mtx[i - 1][k];
						s.ee = this.mtx[0][k];
						
						s.sw = this.mtx[i - 1][k + 1];
						s.ss = this.mtx[i][k + 1];
						s.se = this.mtx[0][k + 1];
					//not on an edge	
					}else {
						s.nw = this.mtx[i - 1][k - 1];
						s.nn = this.mtx[i][k - 1];
						s.ne = this.mtx[i + 1][k - 1];
						
						s.ww = this.mtx[i - 1][k];
						s.ee = this.mtx[i + 1][k];
						
						s.sw = this.mtx[i - 1][k + 1];
						s.ss = this.mtx[i][k + 1];
						s.se = this.mtx[i + 1][k + 1];
					}
			}	
		}
	}
	//returns .num .life
	getHood(s){
		let res = {};
		res.num = 0;
		res.life = 0;
		for (let t of s.getTouching()){
			res.num += 1;
			res.life += t.life;
		}
		return res;
	}
	
	//Returns hsl. 
	//TODO: add delta option
	getColor (s){
		let res = {
		hue : Math.floor(Math.random()*360),
		sat : Math.floor(Math.random()*101),
		lum : Math.floor(Math.random()*101)
		};
		//no context, return random hsl
		if (s == null){
			return res;
			
		}else {
			//get sat and lum
			
			let hood = this.getHood(s);
			res.hue = s.life + s.hi;
			res.sat = hood.num;
			res.lum = hood.life + s.life;
			return res;
			
		}
	}
	
	draw(color){
		for (var i = 0; i<this.rowsN; i++){
			
			// make attribute changes and draw
			for (var k = 0; k<this.colsN; k++){
				let s = this.mtx[i][k];
				if (s.life > 0.00){
					s.drawRounded();
				}
			}
		}
	}
} 
class Shape{
	constructor(game,x,y,size,life){
		this.game = game;
		this.creature = 'N/A';
		this.x = x;
		this.y = y;
		this.size = size;
		//flags and values for fill properties
		this.life = life;
		this.hsla = {
			h : 5,
			s : .60,
			l : .60,
			a : 100
		}
		this.hsl = {
			hue : 5,
			sat : .60,
			lum : .60
		}
		this.me = null;
		this.nw = null;
		this.nn = null;
		this.ne = null;
		this.ww = null;
		this.ee = null;
		this.sw = null;
		this.ss = null;
		this.se = null;
		this.hi = null;
	}
	changeColor(hsla){
		this.hsla.h = hsla.h;
		this.hsla.s = hsla.s;
		this.hsla.l = hsla.l;
		this.hsla.a = hsla.a;
	}
	//set color attr
	color(hsl){
		this.hsl.hue= hsl.hue % 360;
		this.hsl.sat = (hsl.sat % 45 + 56);
		this.hsl.lum = (hsl.lum %  45 + 56);
	}	
	
	hsla(type,hsla,modify){
		switch (type){
			case 'hue':
			hsla.h = (hsla.h + modify) % 360;
			break;
			default:
			let hslaNew = {
				h: Math.floor(Math.random()*360),
				s: Math.floor(Math.random()*30+40),
				l: Math.floor(Math.random()*30+40),
				a: 100
			};
			return(hslaNew);
		}
	}
	
	show(){
		//return (this.creature.name+ ': hue + ' + this.hsl.hue + ', sat ' + this.hsl.sat + ', lum ' + this.hsl.lum); 
		return (this.creature.name+ ' life: ' + this.life + ' history: ' + this.hi + ' x,y: ' + this.x + ',' + this.y);
	}
	getTouching(){
		return [this.nw,this.nn,this.ne,this.ww,this.ee,
				this.sw,this.ss,this.se];
	}

	drawRounded(offX,offY) {
		let alpha = 0;
		
			alpha = this.life;
			if (alpha <= 0){
				alpha = 0;
			}else if (alpha <.1){
				alpha = 0;
			}
		const radiansInCircle = 2 * Math.PI;
		const halfRadians = (2 * Math.PI)/2;
		const quarterRadians = (2 * Math.PI)/4;
		let rounded = Math.floor(this.size/4);
		let x = this.x;
		let y = this.y;
		this.game.ctx.beginPath();
		// top ww arc
		this.game.ctx.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true)
		// line from top ww to bottom ww
		this.game.ctx.lineTo(x, y + this.size - rounded)
		// bottom ww arc  
		this.game.ctx.arc(rounded + x, this.size - rounded + y, rounded, halfRadians, quarterRadians, true)  
		// line from bottom ww to bottom ee
		this.game.ctx.lineTo(x + this.size - rounded, y + this.size)
		// bottom ee arc
		this.game.ctx.arc(x + this.size - rounded, y + this.size - rounded, rounded, quarterRadians, 0, true)  
		// line from bottom ee to top ee
		this.game.ctx.lineTo(x + this.size, y + rounded)  
		// top ee arc
		this.game.ctx.arc(x + this.size - rounded, y + rounded, rounded, 0, -quarterRadians, true)  
		// line from top ee to top ww
		this.game.ctx.lineTo(x + rounded, y);
		let hue = this.hsl.hue;
		let saturation = this.hsl.sat;
		let lum = this.hsl.lum;
		//this.game.ctx.fillStyle = this.game.colors[this.colorRef];
		this.game.ctx.fillStyle = 'hsl('+hue+','+saturation+'%,'+lum+'%)';
		this.game.ctx.globalAlpha = alpha;
		this.game.ctx.fill();		
	}
}
//TODO: consider decomissioning and put methods into Stats
