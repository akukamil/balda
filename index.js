var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}, state="",my_role="", game_tick=0, my_turn=0, move=0, game_id=0, last_cell=null, show_word=0, start_word="БАЛДА";
var me_conf_play=0,opp_conf_play=0, any_dialog_active=0, h_state=0, game_platform="",activity_on=1, hidden_state_start = 0;
g_board=[];
var players="", pending_player="";
var my_data={opp_id : ''},opp_data={};
var g_process=function(){};
var some_process = {};
var rus_let = ['А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я'];
var rus_let2 = ['А','Б','В','Г','Д','Е','Ж','З','И','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я'];
var adj_cells = {0:[1,5],1:[0,6,2],2:[1,7,3],3:[2,8,4],4:[3,9],5:[0,6,10],6:[1,5,7,11],7:[2,6,8,12],8:[3,7,9,13],9:[4,8,14],10:[5,11,15],11:[6,10,12,16],12:[7,11,13,17],13:[8,12,14,18],14:[9,13,19],15:[10,16,20],16:[11,15,17,21],17:[12,16,18,22],18:[13,17,19,23],19:[14,18,24],20:[15,21],21:[16,20,22],22:[17,21,23],23:[18,22,24],24:[19,23]};


irnd = function (min,max) {	
	//мин и макс включительно
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rgb_to_hex = (r, g, b) => '0x' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = "single";
		this.x=x;
		this.y=y;
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){cards_menu.card_down(id)};
		this.bcg.pointerover=function(){this.bcg.alpha=0.5;}.bind(this);
		this.bcg.pointerout=function(){this.bcg.alpha=1;}.bind(this);

		this.avatar=new PIXI.Sprite();
		this.avatar.x=20;
		this.avatar.y=20;
		this.avatar.width=this.avatar.height=60;

		this.name="";
		this.name_text=new PIXI.BitmapText('...', {fontName: 'mfont',fontSize: 25});
		this.name_text.anchor.set(0.5,0.5);
		this.name_text.x=135;
		this.name_text.y=35;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('...', {fontName: 'mfont',fontSize: 28});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(0.5,0.5);
		this.rating_text.x=135;
		this.rating_text.y=70;

		//аватар первого игрока
		this.avatar1=new PIXI.Sprite();
		this.avatar1.x=20;
		this.avatar1.y=20;
		this.avatar1.width=this.avatar1.height=60;

		//аватар второго игрока
		this.avatar2=new PIXI.Sprite();
		this.avatar2.x=120;
		this.avatar2.y=20;
		this.avatar2.width=this.avatar2.height=60;

		this.rating_text1=new PIXI.BitmapText('1400', {fontName: 'mfont',fontSize: 22});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=50;
		this.rating_text1.y=70;

		this.rating_text2=new PIXI.BitmapText('1400', {fontName: 'mfont',fontSize: 22});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150;
		this.rating_text2.y=70;
		
		//
		this.rating_bcg = new PIXI.Sprite(game_res.resources.rating_bcg.texture);

		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar, this.avatar1, this.avatar2, this.rating_bcg, this.rating_text,this.rating_text1,this.rating_text2, this.name_text);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};


		this.place=new PIXI.BitmapText("", {fontName: 'mfont',fontSize: 25});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.rating.x=298;
		this.rating.tint=rgb_to_hex(255,242,204);
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class cells_class extends PIXI.Container {
		
	constructor(x,y,id) {
		super();

		this.id = id;
		this.x=x;
		this.y=y;

		this.bcg=new PIXI.Sprite(gres.big_letter_image.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode = true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		
		this.bcg2=new PIXI.Sprite(gres.big_letter_image_h.texture);
		this.bcg2.visible = false;
		
		this.bcg3=new PIXI.Sprite(gres.big_letter_image_h2.texture);
		this.bcg3.visible = false;

		this.letter=new PIXI.BitmapText("", {fontName: 'mfont',fontSize: 35});
		this.letter.tint=0xffff00;
		this.letter.x=22;
		this.letter.y=12;
		
		this.bcg.pointerdown = this.pointer_down.bind(this);

		this.addChild(this.bcg, this.bcg2, this.bcg3, this.letter);
	}	
	
	pointer_down () {
		
		let id = this.id;
		word_creation.cell_down.bind(word_creation,id)();		
		
	}
}

class keys_class extends PIXI.Container {
		
	constructor(x,y, id) {
		super();

		this.key_id = id;
		this.x=x;
		this.y=y;

		this.bcg=new PIXI.Sprite(gres.key_image.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode = true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		

		this.letter=new PIXI.BitmapText("", {fontName: 'mfont',fontSize: 25});
		this.letter.tint=0x000000;
		this.letter.x=15;
		this.letter.y=10;
		
		this.bcg.pointerdown = this.pointer_down.bind(this);

		this.addChild(this.bcg,this.letter);
	}	
	
	pointer_down () {		
		let key = this.key_id;
		word_creation.key_down.bind(word_creation,key)();
	}
	
}

var anim2= {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI);
	},
	
	easeInOutCubic: function(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	add : function(obj, params, vis_on_end, time, func, anim3_origin) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		if (anim3_origin === undefined)
			anim3.kill_anim(obj);


		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					

					

				this.slot[i] = {
					obj: obj,
					params: params,
					vis_on_end: vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

		
		

	},	
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		

				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
					
					s.obj.visible=s.vis_on_end;
					s.obj.alpha = 1;
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

var anim3 = {
			
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	add : function (obj, params, schedule, func = 0, repeat = 0) {
		
		//anim3.add(objects.header0,['x','y'],[{time:0,val:[0,0]},{time:1,val:[110,110]},{time:2,val:[0,0]}],'easeInOutCubic');	
		
		
		//если уже идет анимация данного спрайта то отменяем ее
		anim3.kill_anim(obj);
		
		
		//ищем свободный слот для анимации
		let f=0;
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {
				
				obj.ready = true;
				
				//если это точечная анимация то сразу устанавливаем первую точку
				if (func === 0)
					for (let i=0;i<params.length;i++)
						obj[params[i]]=schedule[0].val[i]
				
				this.slot[i] = {
					obj: obj,
					params: params,
					schedule: schedule,
					func: func,
					start_time : game_tick,
					cur_point: 0,
					next_point: 1,
					repeat: repeat
				};
				f = 1;				
				break;
			}
		}		
		
		if (f===1) {			
			return new Promise(function(resolve, reject){					
			  anim3.slot[i].p_resolve = resolve;	  		  
			});				
		} else {
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
	},
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				//это точечная анимация
				if (s.func === 0) {
					
					let time_passed = game_tick - s.start_time;
					let next_point_time = s.schedule[s.next_point].time;
					
					//если пришло время следующей точки
					if (time_passed > next_point_time) {
						
						//устанавливаем параметры точки
						for (let i=0;i<s.params.length;i++)
							s.obj[s.params[i]]=s.schedule[s.next_point].val[i];
												
						s.next_point++;		
						
						//начинаем опять отчет времени
						s.start_time = game_tick;	
						
						//если следующая точка - не существует
						if (s.next_point === s.schedule.length) {							

							if (s.repeat === 1) {
								s.start_time = game_tick
								s.next_point = 1;
							}
							else {								
								s.p_resolve('finished');
								this.slot[i]=null;									
							}
						
						}
					}					
				}
				else
				{
					//это вариант с твинами между контрольными точками
					
					m_lable : if (s.obj.ready === true) {						
						
						//если больше нет контрольных точек то убираем слот или начинаем сначала
						if (s.next_point === s.schedule.length) {
							
							if (s.repeat === 1) {
								s.cur_point = 0;
								s.next_point = 1;
							}
							else {
								s.p_resolve('finished');
								this.slot[i]=null;	
								break m_lable;
							}			
						}					

							
						let p0 = s.schedule[s.cur_point];
						let p1 = s.schedule[s.next_point];
						let time = p1.time;
						
						//заполняем расписание для анимации №2
						let cur_schedule={};							
						for (let i = 0 ; i < s.params.length ; i++) {						
							let p = s.params[i];
							cur_schedule[p]=[p0.val[i],p1.val[i]]						
						}					
						
						//активируем анимацию
						anim2.add(s.obj,cur_schedule,true,time,s.func,1);	
						
						s.cur_point++;
						s.next_point++;							
							
					
					}		
				}
			}			
		}		
	}
	

}

async function add_message(text) {
	
	if (objects.message_cont.visible === true)
		return;

	objects.message_text.text = text;
	await anim2.add(objects.message_cont,{x:[-200,objects.message_cont.sx]}, true, 1,'easeOutElastic');
	await new Promise((resolve, reject) => setTimeout(resolve, 3000));
	await anim2.add(objects.message_cont,{x:[objects.message_cont.sx,-200]}, false, 0.5,'easeInBack');
	
}

var big_message = {
	
	p_resolve : 0,
		
	show: function(t1,t2) {
				
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';

		objects.big_message_text.text=t1;
		anim2.add(objects.big_message_cont,{y:[-180,objects.big_message_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	close : function() {
		
		if (objects.big_message_cont.ready===false)
			return;

		game_res.resources.close.sound.play();
		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

var online_player = {
		
	timer : 0,
	time_t : 0,
	
	send_move : function  (move_data) {
		

		//отправляем ход сопернику
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:move_data});
		
		
		//проверяем завершение
		//timer.sw();	
		
	},
	
	init : function (r) {
	

		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'p'});
		
	
		//таймер времени
		this.reset_timer();
		this.timer = setTimeout(function(){online_player.process_time()}, 1000);
		objects.timer.visible=true;
		
		//заносим рейтинг проигрыша но потом он будет восстановлен
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		let lose_rating =  Math.round(my_data.rating + 16 * (0 - Ea));
		firebase.database().ref("players/"+my_data.uid+"/rating").set(lose_rating);	
		//firebase.database().ref("states/"+my_data.uid+"/rating").set(my_data.rating);	
		
		
	},
	
	reset_timer : function() {
		
		this.time_t=90;
		objects.timer.tint=0xffffff;	
		
	},
	
	process_time : function () {
		
		this.time_t--;
		
		if (this.time_t >= 0) {
			if ( this.time_t >9 )
				objects.timer.text = '0:'+this.time_t;
			else
				objects.timer.text = '0:0'+this.time_t;
		}
		
		if (this.time_t < 0 && my_turn === 1)	{
			game.stop('MY_NO_TIME');			
			return;
		}

		if (this.time_t < -5 && my_turn === 0)	{
			game.stop('OPP_NO_TIME');
			return;
		}

		//подсвечиваем красным если осталость мало времени
		if (this.time_t === 5) {
			objects.timer.tint=0xff0000;
			game_res.resources.clock.sound.play();
		}
		
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){online_player.process_time()}, 1000);
		
	},
	
	stop : async function(res) {
		
		
		
		
		//отключаем таймер времени
		clearTimeout(this.timer);
		let old_rating = my_data.rating;
		let Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (res === 'DRAW') {
			my_data.rating = Math.round(my_data.rating + 16 * (0.5 - Ea));	
			gres.draw.sound.play();
		}

		if (res === 'MY_WIN' || res === 'OPP_NO_TIME' || res === 'OPP_CANCEL') {
			my_data.rating = Math.round(my_data.rating + 16 * (1 - Ea));
			gres.win.sound.play();
			
		}
		if (res === 'MY_LOSE' || res === 'MY_NO_TIME' || res === 'MY_CANCEL') {
			my_data.rating = Math.round(my_data.rating + 16 * (0 - Ea));
			gres.lose.sound.play();
		}
		
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);	
		firebase.database().ref("states/"+my_data.uid+"/rating").set(my_data.rating);	
		
		let res_s="";
		if (res === 'DRAW')
			res_s = 'Ничья!!!'
		if (res === 'MY_WIN')
			res_s = 'Вы выиграли!!!'
		if (res === 'MY_LOSE')
			res_s = 'Вы проиграли!!!'
		if (res === 'MY_NO_TIME')
			res_s = 'Вы проиграли. У Вас закончилось время!'
		if (res === 'OPP_NO_TIME')
			res_s = 'Вы выиграли. У соперника закончилось время!'
		if (res === 'MY_CANCEL') {
			res_s = 'Вы отменили игру!'			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"OPP_CANCEL",tm:Date.now()});
		}

		if (res === 'OPP_CANCEL')
			res_s = 'Соперник отменил игру!'
		
		await big_message.show(res_s,"Рейтинг: " + old_rating + ' > ' + my_data.rating);
	
	}

};

var bot_player = {
	
	true_rating : 0,	
	timer : 0,
	time_t : 0,
	search_start_time : 0,
		
	send_move : async function  () {

		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		
		
		//начинаем поиск слова
		this.search_start_time = Date.now();
		some_process.bot_search_word = this.process.bind(this);

	},
	
	init : function () {
		
		set_state({state : 'b'});
		
		//выбираем случайным образом стартовое слово
		let d_size = rus_dict.length;
		while(1) {
			
			let r_num = irnd(0,d_size-1);
			start_word = rus_dict[r_num];
			let _wlen = start_word.length;
			if (_wlen === 5)
				break;			
		}
		

		
		//отключаем таймер...........................
		objects.timer.visible=false;
	
	},
	
	get_adj_cells : function(field) {
		
		let _adj_cells = [];
		
		for (let i = 0 ; i < 25 ; i++) {
			if (field[i] === "") {
							
				//получаем смежные ячейки
				let a_cells = adj_cells[i];
				let a_cells_cnt = a_cells.length;
				for (let a = 0; a < a_cells_cnt ; a++) {
					let a_cell_id = a_cells[a];
					if (field[a_cell_id] !== "") {
						_adj_cells.push(i);		
						break;
					}					
				}
			}
		}		
		
		return _adj_cells;
	},	
	
	make_move : function (field, acc_word, acc_pos) {
		
		
		//выбираем следующую букву
		let cur_letter_pos = acc_pos[acc_pos.length-1];
		let available_cells = adj_cells[cur_letter_pos];
		let available_cells_cnt = available_cells.length;
		
		//опредляем возможные дальнейшие пути
		let _av_cells=[]
		for (let i = 0 ; i < available_cells_cnt ; i ++) {			
			let pos = available_cells[i];
			if (field[pos]!=="" && acc_pos.includes(pos)===false)
				_av_cells.push(pos);			
		}
		
		let _av_cells_len = _av_cells.length;
		if (_av_cells_len === 0 ){
			//console.log("Нет больше ходов");
			return;			
		}
		
		//выбираем путь случайно
		let next_pos = _av_cells[irnd(0 , _av_cells_len - 1 )];		
		let next_letter = field[next_pos];

		acc_word[0] +=next_letter;
		acc_pos.push(next_pos);
		
	},
	
	search_word : function () {
		
		//создаем массивы пустых клеток и заполненных клеток
		let field = [];
		for (let i = 0 ; i < 25 ; i++)
			field.push(objects.cells[i].letter.text);		
		let _adj_cells = this.get_adj_cells(field);
		let _adj_cells_cnt = _adj_cells.length;
							
		//выбирем случайную букву...............................................
		let new_letter = rus_let2[irnd(0,27)];
				
		//ставим букву в случайное место на поле................................
		let _field = [...field];
		let new_letter_cell_id = _adj_cells[irnd(0 , _adj_cells_cnt - 1 )];	
		_field[new_letter_cell_id] = new_letter;	

		//получаем позиции только букв на поле...................................
		let letters_pos = [];
		for (let i = 0 ; i < 25 ; i++)
			if (_field[i] !== "")
				letters_pos.push(i);

		//несколько попыток найти слово на новом поле............................
		for (let r=0;r<10;r++) {
			let [acc_word, acc_pos] = this.read_random_word(_field, letters_pos);		
			console.log(r,acc_word[0]);
			if (acc_word[0].length > 2)
				if(rus_dict.includes(acc_word[0])===true)
					if( game.words_hist.includes(acc_word[0])===false)					
						return [new_letter_cell_id, new_letter, acc_pos];			
		}

		
		return -999;
	},
		
	read_random_word : function(field, letters_pos) {
		
		//выбираем начальную для поиска букву
		let letters_pos_len = letters_pos.length;
		let start_letter_pos = letters_pos[irnd(0 , letters_pos_len - 1 )];		
		
		//начинаем идти от этой буквы пока не будет дальше ходов или достигнута максимальная длина
		let acc_pos = [start_letter_pos];
		let acc_word = [field[start_letter_pos]];
		
		//делаем четыре хода от начальной буквы
		this.make_move(field, acc_word, acc_pos);
		this.make_move(field, acc_word, acc_pos);
		this.make_move(field, acc_word, acc_pos);
		this.make_move(field, acc_word, acc_pos);
		
		return [acc_word,acc_pos];	
		
	},
		
	stop : async function (res) {
		
		some_process.bot_search_word = function(){};
		
		
		
		if (res === 'DRAW') {
			gres.draw.sound.play();
		}

		if (res === 'MY_WIN' || res === 'GIVE_UP') {
			gres.win.sound.play();
			
		}
		if (res === 'MY_LOSE' || res === 'MY_CANCEL') {
			gres.lose.sound.play();
		}
		
		
		
		let res_s="";
		if (res === 'DRAW') 
			res_s = 'Ничья!!!'

		if (res === 'MY_WIN') 
			res_s = 'Вы выиграли!!!'
			
		if (res === 'MY_LOSE') 
			res_s = 'Вы проиграли!!!'
		
		if (res === 'MY_NO_TIME') 
			res_s = 'Вы проиграли. У Вас закончилось время!'
			
		
		if (res === 'OPP_NO_TIME') 
			res_s = 'Вы выиграли. У соперника закончилось время!'
			
		if (res === 'GIVE_UP') 
			res_s = 'Вы выиграли. Бот не смог найти слово!'
			
		if (res === 'MY_CANCEL') 
			res_s = 'Вы отменили игру!'

		
		await big_message.show(res_s, '--))--');
	
	},
	
	reset_timer : function() {
		
		
	},
	
	process : function () {
		
		
		let data = this.search_word();		
		let cur_time = Date.now();
				
		if (cur_time - this.search_start_time > 20000) {
			
			game.stop('GIVE_UP');			
			return;
		}
		
		if (data !== -999) {
			some_process.bot_search_word = function(){};
			word_waiting.receive_move(data)
		}
		
		
		
	}
	
};

var word_waiting = {
	
	activate : async function () {		
		
		my_turn = 0;
		
		objects.timer.x = 600;
		game.opponent.reset_timer();
		
		//процесс ожидания
		some_process.wait_opponent_move = this.process;
		objects.wait_opponent_move.visible=true;
				
		//сдвигаем поле в центр
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.y,75]}, true, 0.5,'easeInOutCubic');		
	},
	
	show_new_word_anim : async function(word_ids) {
		
		for (let i =0 ; i < word_ids.length ; i++){
			anim2.add(objects.cells[word_ids[i]].bcg3,{alpha:[0.7,0]}, false, 1,'easeInBack');		
			await new Promise((resolve, reject) => setTimeout(resolve, 300));
		}
		
	},
	
	receive_move : async function (move_data) {
		
		//воспроизводим уведомление о том что соперник произвел ход
		game_res.resources.receive_move.sound.play();

		//console.log(move_data);
		let cell_id = move_data[0];
		let letter = move_data[1];
		let word_ids = move_data[2];
		
		//вносим в поле новую букву
		objects.cells[cell_id].letter.text=letter;			
		
		//подсвечиваем новое слово
		await this.show_new_word_anim(word_ids);

		//убираем процесс
		some_process.wait_opponent_move = function(){};
		objects.wait_opponent_move.visible=false;

		//определяем все слово
		let word = "";
		word_ids.forEach( i => {
			let cur_letter = objects.cells[i].letter.text
			word+=cur_letter;
		})	
					
		objects.opp_words.text += word;
		objects.opp_words.text += ' ';	
		let l = game.get_letters_num();		
		objects.opp_letters_num.text = 'Букв: '+l[1];;
				
		if (game.is_field_complete()===true) {
			
			let my_result = l[0];
			let opp_result = l[1];
			
			let res = 'DRAW';
			if (my_result > opp_result)
				res = 'MY_WIN'
			if (my_result < opp_result)
				res = 'MY_LOSE'
			
			game.stop(res);
			return;
		}		

		//записываем слово в историю
		game.words_hist.push(word);		
		
		word_creation.activate();		
	},
	
	stop : async function () {
		
		
		
	},	
		
	process : function () {
		
		let a = Math.sin(game_tick * 2);
		if (a<0) a=-a;
		objects.wait_opponent_move.alpha = a;
	}
	
}

var word_creation = {
	
	active_key : -1,
	word : [],
	new_cell : null,
	show_word_mode : 0,
	
	activate : async function () {		
		
		my_turn = 1;
		this.show_word_mode=0;	
		game.opponent.reset_timer();
		objects.word.text="";
		this.word=[];
		
		objects.timer.x = 225;
		
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.y,10]}, true, 2,'easeOutCubic');		
		anim2.add(objects.keys_cont,{y:[600,objects.keys_cont.sy]}, true, 2,'easeOutCubic');
		
	},
	
	stop : async function () {
		
		
	},
	
	key_down : function (key) {				
		
		
		gres.key_down.sound.play();
		
		//если уже активирована клавиша то отменяем ее
		if (this.active_key!== -1)
			objects.keys[this.active_key].bcg.texture = gres.key_image.texture;
		
		//устанавливаем новую клавишу активированную
		this.active_key = key;
		
		//и ее текстуру
		objects.keys[this.active_key].bcg.texture = gres.key_image_h.texture;
		
	},
	
	cell_down : async function (cell_id) {		
		
		//если имеется какое-то сообщение
		if (objects.big_message_cont.visible===true)
			return;
		
		if (my_turn === 0) {
			add_message("Не твоя очередь");
			return;
		}
		
		
		if (this.show_word_mode === 1) {
			

			if (this.word.length > 0) {
				
				if (this.word.includes(cell_id)===true) {		
					gres.bad_move.sound.play();
					add_message("Нельзя ходить по кругу")
					return;		
				}				
					
				if (objects.cells[cell_id].letter.text === "") {
					gres.bad_move.sound.play();
					add_message("Нужно выбрать следующую букву")		
					return;				
				}				
				
				let prv_cell = this.word[this.word.length-1];
				if (adj_cells[prv_cell].includes(cell_id) === false) {
					gres.bad_move.sound.play();
					add_message("Выберите смежную клетку")
					return;
				}				
			}

			if (objects.cells[cell_id].letter.text === "") {
				gres.bad_move.sound.play();
				add_message("Нужно выбрать букву с которой начнется слово")		
				return;				
			}	
			
			gres.cell_move.sound.play();
				
			//анимируем ячейку
			anim2.add(objects.cells[cell_id].bcg2,{alpha:[0,1]}, true, 0.25,'linear');
			
			this.word.push(cell_id);
			
			
			let _word = "";
			this.word.forEach(w=>{
				_word+=objects.cells[w].letter.text
			})
			
			objects.word.text =_word;			
			return;
		}
		
		
		gres.cell_down.sound.play();
		
		
		if (this.active_key === -1)
			return;
		
		if (objects.cells[cell_id].letter.text !== "")
			return;
				
		this.new_cell = cell_id;
		
		objects.cells[cell_id].letter.text = rus_let[this.active_key];
		
		this.show_word_mode = 1;
		
		//убираем клавиатуру и показываем диалог
		anim2.add(objects.keys_cont,{y:[objects.keys_cont.sy,450]}, false, 1,'easeInOutCubic');
		anim2.add(objects.word_cont,{y:[450,objects.word_cont.sy]}, true, 0.5,'linear');
		objects.keys[this.active_key].bcg.texture = gres.key_image.texture;
		objects.word.text="";
		this.active_key=-1;
		
	},
	
	ok_down : async function () {		
		
		
		let _word = "";
		this.word.forEach(w=>{
			_word+=objects.cells[w].letter.text
		})
		
		if (this.word.length <2 ) {
			gres.bad_word.sound.play();
			add_message("Выделите клетки со словом по буквам");
			return;
		}
		
		if (_word === start_word) {
			this.cancel_down();
			gres.bad_word.sound.play();
			add_message("Главное слово нельзя выбирать");
			return;
		}		
		
		if (game.words_hist.includes(_word) === true) {
			gres.bad_word.sound.play();
			this.cancel_down();
			add_message("Такое слово уже есть(")
			return;
		}
		
		if (rus_dict.includes(_word) === false) {
			gres.bad_word.sound.play();
			this.cancel_down();
			add_message("Такого слова нету в словаре(")
			return;
		}
		
		
		gres.good_word.sound.play();

		//записываем в столбик слов
		objects.my_words.text += _word;
		objects.my_words.text += ' ';	
		
		//убираем выделение
		this.word.forEach(w=>{
			anim2.add(objects.cells[w].bcg2,{alpha:[1,0]}, false, 0.5,'linear');
		})
		
		
		//убираем диалог если он есть
		anim2.add(objects.word_cont,{y:[objects.word_cont.y,450]}, false, 0.5,'easeInOutCubic');
			
		//отправляем ход оппоненту
		let data = [this.new_cell,objects.cells[this.new_cell].letter.text,this.word];
		game.opponent.send_move(data);		
				
		//считаем сколько букв во всех моих словах
		let l = game.get_letters_num();	
		objects.my_letters_num.text = 'Букв: '+l[0];
		
		
		if (game.is_field_complete()===true) {		
			
				
			let my_result = l[0];
			let opp_result = l[1];
			
			let res = 'DRAW';
			if (my_result > opp_result)
				res = 'MY_WIN'
			if (my_result < opp_result)
				res = 'MY_LOSE'
		
			game.stop(res);
			return;
		}					
		
		//записываем слово в историю
		game.words_hist.push(_word);
		
		
		//последовательность больших кнопок
		this.word = [];	
		
		
		
		//активируем режим ожидания
		word_waiting.activate();
		
	},
		
	cancel_down : async function () {		
		
		objects.cells[this.new_cell].letter.text = "";
		
		//убираем диалог и показываем клавиатуру
		anim2.add(objects.word_cont,{y:[objects.word_cont.y,450]}, false, 0.5,'linear');
		anim2.add(objects.keys_cont,{y:[450,objects.keys_cont.sy]}, true, 0.5,'linear');
		
		//стираем слово на диалоге
		objects.word.text="";
		
		this.word.forEach(w=>{
			anim2.add(objects.cells[w].bcg2,{alpha:[1,0]}, false, 0.5,'linear');
		})
		
		this.active_key=-1;
		this.word =[];
		this.show_word_mode=0;		
	},
	
	process : function () {
		
		if (timer.time_left<1)
			game.stop('MY_NO_TIME');
		
	}
	
}

var game = {
	
	word_ids : [],
	words_hist : [],

	opponent : {},
	
	activate: function(role, opponent) {
				
		my_role=role;
		this.opponent = opponent;
		
		//отключаем клавиатуру и поле если они вдруг остались
		objects.cells_cont.visible=false;
		objects.keys_cont.visible=false;
		objects.word_cont.visible=false;
		objects.my_words.text="";
		objects.opp_words.text="";
		
		//инициируем все что связано с оппонентом
		this.opponent.init(my_role);
		
		//очищаем поле больших букв
		for (let i = 0 ; i < 25 ; i++) {			
			objects.cells[i].bcg2.visible=false;			
			objects.cells[i].letter.text="";			
		}		
		
		//записываем начальное слово в историю слов
		this.words_hist=[start_word];
		
		//пишем начальное слово
		for (let i=0;i<5;i++)
			objects.cells[10+i].letter.text=start_word[i];
		
		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
				
		//воспроизводим звук о начале игры
		game_res.resources.game_start.sound.play();
				
		//показываем карточки игроков		
		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;	
		objects.my_letters_num.text = "Букв: 0";
		objects.opp_letters_num.text = "Букв: 0";
		
		//показываем кнопку стоп
		objects.stop_bot_button.visible=true;

		if (my_role==="master")
			word_creation.activate();
		else 
			word_waiting.activate();	

	},
		
	is_field_complete : function() {
		
		for (let i = 0 ; i < 25 ; i++)			
			if (objects.cells[i].letter.text==="")	
				return false;
		return true;
		
	},
		
	get_letters_num : function () {
		
		//считаем сколько букв во всех моих словах
		let my_letters_num = 0;
		for (var i = 0; i < objects.my_words.text.length; i++)
			if (objects.my_words.text[i] !== ' ')
				my_letters_num++;

		
		//считаем сколько букв во всех моих словах
		let opp_letters_num = 0;
		for (var i = 0; i < objects.opp_words.text.length; i++)
			if (objects.opp_words.text[i] !== ' ')
				opp_letters_num++;
			
		return [my_letters_num,opp_letters_num];
		
		
	},
		
	stop : async function (res) {
				
		
		//убираем диалог
		if (objects.word_cont.visible === true)
			anim2.add(objects.word_cont,{y:[objects.word_cont.y,450]}, false, 0.5,'linear');
		
		//убираем клавиатуру если она есть
		if (objects.keys_cont.visible === true)
			anim2.add(objects.keys_cont,{y:[objects.keys_cont.sy,450]}, false, 1,'easeInOutCubic');
		
		//сдвигаем поле в центр
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.y,objects.cells_cont.y+10]}, true, 0.5,'easeInOutCubic');
				
		//убираем если остались процессы
		some_process.wait_opponent_move = function(){};
		objects.wait_opponent_move.visible=false;
				
		//убираем кнопку стоп
		objects.stop_bot_button.visible=false;
		
		
		//сначала завершаем все что связано с оппонентом
		await this.opponent.stop(res);		
		
				
		objects.timer.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.cells.visible=false;
		

			
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'o'});
		
		opp_data.uid = '';
				
		//убираем поле
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.y,-450]}, false, 0.6,'easeInOutCubic');		
		
		//показыаем рекламу		
		show_ad();
		
		main_menu.activate();
		
		//показываем социальную панель
		if (game_platform === 'VK')
			if (Math.random()>0.75)
				social_dialog.show();		
	}
}

var rating = {
	
	update : function (game_result_for_player) {
		
		if (game_result_for_player === 999)
			return '';
								
		//обновляем мой рейтинг в базе и на карточке
		let my_old_rating = my_data.rating;
		let my_new_rating = this.calc_my_new_rating(game_result_for_player);
		let my_rating_change = my_new_rating - my_old_rating;
		let opp_new_rating = opp_data.rating - my_rating_change;
		
		
		my_data.rating = my_new_rating;
		objects.my_card_rating.text = my_data.rating;
		my_data.games++;
				
		//записываем в базу свой новый рейтинг и оппонента
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
		firebase.database().ref("players/"+my_data.uid+"/games").set(my_data.games);			
		firebase.database().ref("players/"+opp_data.uid+"/rating").set(opp_new_rating);		


		return 'Рейтинг: ' + my_old_rating + ' > ' + my_new_rating;		
		
	},
	
	calc_my_new_rating : function(res)	{

		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (res===1)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (res===0)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (res===-1)
			return Math.round(my_data.rating + 16 * (0 - Ea));
	
	}	
	
}

var keep_alive = function() {
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	firebase.database().ref("states/"+my_data.uid).remove();
		return;		
	}


	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref("states/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var process_new_message = function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		start_word=msg.start_word;
		cards_menu.accepted_invite();
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==="REJECT"  && pending_player===msg.sender) {
		cards_menu.rejected_invite();
	}

	//получение сообщение в состояни игры
	if (state==="p") {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==="REFUSE")
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==="CONF")
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.message==="MSG")
				stickers.receive(msg.data);

			//получение сообщение об отмене игры
			if (msg.message==="OPP_CANCEL" )
				game.stop('OPP_CANCEL');
								
			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				word_waiting.receive_move(msg.data);
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender===opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}
}

var req_dialog = {
	
	_opp_data : {} ,
	
	show(uid) {		

		firebase.database().ref("players/"+uid).once('value').then((snapshot) => {

			//не показываем диалог если мы в игре
			if (state === 'p')
				return;

			player_data=snapshot.val();

			//показываем окно запроса только если получили данные с файербейс
			if (player_data===null) {
				//console.log("Не получилось загрузить данные о сопернике");
			}	else	{


				gres.invite.sound.play();
				
				
				//так как успешно получили данные о сопернике то показываем окно	
				anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 1,'easeOutElastic');

				//Отображаем  имя и фамилию в окне приглашения
				req_dialog._opp_data.name=player_data.name;
				make_text(objects.req_name,player_data.name,200);
				objects.req_rating.text=player_data.rating;
				req_dialog._opp_data.rating=player_data.rating;

				//throw "cut_string erroor";
				req_dialog._opp_data.uid=uid;

				//загружаем фото
				this.load_photo(player_data.pic_url);

			}
		});
	},

	load_photo: function(pic_url) {


		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//console.log("Загружаем текстуру "+objects.mini_cards[id].name)
			var loader = new PIXI.Loader();
			loader.add("inv_avatar", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
			loader.load((loader, resources) => {
				objects.req_avatar.texture=loader.resources.inv_avatar.texture;
			});
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log("Ставим из кэша "+objects.mini_cards[id].name)
			objects.req_avatar.texture=PIXI.utils.TextureCache[pic_url];
		}

	},

	reject: function() {

		if (objects.req_cont.ready===false)
			return;
		
		gres.click.sound.play();

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 1,'easeInBack');
		
		
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept: function() {

		if (objects.req_cont.ready===false)
			return;
		
		
		gres.click.sound.play();

		any_dialog_active=0;
		
		//устанавливаем окончательные данные оппонента
		opp_data=req_dialog._opp_data;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 1,'easeInBack');

		//сразу определяем начальное слово и отправляем сопернику
		let d_size = rus_dict.length;
		let w_len = 0;
		start_word = "";
		
		while(1) {
			
			let r_num = irnd(0,d_size-1);
			start_word = rus_dict[r_num];
			let _wlen = start_word.length;
			if (_wlen === 5)
				break;			
		}
		
		
		
		
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),start_word:start_word});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		cards_menu.close();
		game.activate("slave" , online_player );

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 1,'easeInBack');
	}

}

var	show_ad = function(){
		
	if (game_platform==="YANDEX") {			
		//показываем рекламу
		window.ysdk.adv.showFullscreenAdv({
		  callbacks: {
			onClose: function() {}, 
			onError: function() {}
					}
		})
	}
	
	if (game_platform==="VK") {
				 
		vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
		.then(data => console.log(data.result))
		.catch(error => console.log(error));	
	}		
}

var social_dialog = {
	
	show : function() {
		
		anim2.add(objects.social_cont,{x:[800,objects.social_cont.sx]}, true, 0.06,'linear');
		
		
	},
	
	invite_down : function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		game_res.resources.click.sound.play();
		vkBridge.send('VKWebAppShowInviteBox');
		social_dialog.close();
		
	},
	
	share_down: function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		game_res.resources.click.sound.play();
		vkBridge.send('VKWebAppShowWallPostBox', {"message": `Мой рейтинг в игре шахматы-блиц ${my_data.rating}. Сможешь победить меня?`,
		"attachments": "https://vk.com/app7991685"});
		social_dialog.close();
	},
	
	close_down: function() {
		if (objects.social_cont.ready !== true)
			return;
		
		game_res.resources.click.sound.play();
		social_dialog.close();
	},
	
	close : function() {
		
		anim2.add(objects.social_cont,{x:[objects.social_cont.x,800]}, false, 0.06,'linear');
				
	}
	
}

var main_menu = {


	activate: function() {

		//просто добавляем контейнер с кнопками
		objects.main_buttons_cont.visible=true;
		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.desktop.texture;
		
		

	},

	close : function() {

		objects.main_buttons_cont.visible=false;
		objects.desktop.visible=false;

	},

	play_button_down: function () {

		if (any_dialog_active===1 || activity_on===1) {
			game_res.resources.locked.sound.play();
			return
		};

		game_res.resources.click.sound.play();

		this.close();
		cards_menu.activate();

	},

	lb_button_down: function () {

		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};

		game_res.resources.click.sound.play();

		this.close();
		lb.show();

	},

	rules_button_down: function () {

		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};

		game_res.resources.click.sound.play();

	
		anim2.add(objects.rules_cont,{y:[-450, objects.rules_cont.sy]}, true, 1,'easeOutBack');

	},

	rules_ok_down: function () {
		any_dialog_active=0;		
		anim2.add(objects.rules_cont,{y:[objects.rules_cont.y,-450, ]}, false, 1,'easeInBack');
	}

}

var lb = {

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;

		
		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 1,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 1,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 1,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 1,'easeOutCubic');

		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}


		this.update();

	},

	close: function() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;

	},

	back_button_down: function() {

		if (any_dialog_active===1 || objects.lb_1_cont.ready===false) {
			game_res.resources.locked.sound.play();
			return
		};


		game_res.resources.click.sound.play();
		this.close();
		main_menu.activate();

	},

	update: function () {

		firebase.database().ref("players").orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {

			if (snapshot.val()===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var players_array = [];
				snapshot.forEach(players_data=> {
					if (players_data.val().name!=="" && players_data.val().name!=='' && players_data.val().name!==undefined)
						players_array.push([players_data.val().name, players_data.val().rating, players_data.val().pic_url]);
				});


				players_array.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,players_array.length);

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					
					if (i >= len) break;		
					if (players_array[i][0] === undefined) break;	
					
					let fname = players_array[i][0];
					make_text(objects['lb_'+(i+1)+'_name'],fname,180);					
					objects['lb_'+(i+1)+'_rating'].text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 3000});
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					
					if (i >= len) break;	
					if (players_array[i][0] === undefined) break;	
					
					let fname=players_array[i][0];

					make_text(objects.lb_cards[i-3].name,fname,180);

					objects.lb_cards[i-3].rating.text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3)
						objects['lb_'+(lb_num+1)+'_avatar'].texture=resource.texture
					else
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;
				});

			}

		});

	}

}

var cards_menu = {

	_opp_data : {},
	uid_pic_url_cache : {},
	
	cards_pos: [
				[0,0],[0,90],[0,180],[0,270],
				[190,0],[190,90],[190,180],[190,270],
				[380,0],[380,90],[380,180],[380,270],
				[570,0],[570,90],[570,180]

				],

	activate: function () {

		objects.cards_cont.visible=true;
		objects.back_button.visible=true;

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.cards_bcg.texture;

		//расставляем по соответствующим координатам
		for(let i=0;i<15;i++) {
			objects.mini_cards[i].x=this.cards_pos[i][0];
			objects.mini_cards[i].y=this.cards_pos[i][1];
		}


		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<15;i++)
			objects.mini_cards[i].visible=false;

		//добавляем карточку ии
		this.add_cart_ai();

		//включаем сколько игроков онлайн
		objects.players_online.visible=true;

		//подписываемся на изменения состояний пользователей
		firebase.database().ref("states") .on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});

	},

	players_list_updated: function(players) {

		//если мы в игре то не обновляем карточки
		if (state==="p" || state==="b")
			return;


		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};


		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков
		for (let uid in players){			
			if (players[uid].state !== 'p' && players[uid].hidden === 0)
				single[uid] = players[uid].name;						
		}
		
		//console.table(single);
		
		//убираем не играющие состояние
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];
		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			let small_opp_id = p_data[uid].opp_id;			
			//проходимся по соперникам
			for (let uid2 in players) {	
				let s_id=uid2.substring(0,10);				
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}							
			}			
		}
				
		
		//определяем столы
		//console.log (`--------------------------------------------------`)
		for (let uid in p_data) {
			let opp_id = p_data[uid].opp_id;
			let name1 = p_data[uid].name;
			let rating = p_data[uid].rating;
			let hid = p_data[uid].hidden;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 
			{				
				//console.log(`${name1} (${rating}) - одиночка `)					
			}			
		}
					
		
		
		//считаем и показываем количество онлайн игроков
		let num = 0;
		for (let uid in players)
			if (players[uid].hidden===0)
				num++
		objects.players_online.text='Игроков онлайн: ' + num;
		
		
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > 14)
			num_of_tables = num_of_tables - (num_of_cards - 14);

		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=1;i<15;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				let card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state , rating:players[card_uid].rating});
			}
		}



		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=1;i<15;i++) {			
			
				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {					
					if (p ===  objects.mini_cards[i].uid) {
						
						found = 1;							
					}	
				}				
			}		
			
			if (found === 0)
				new_single[p] = single[p];
		}
		

		
		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=1;i<15;i++) {			
		
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'table') {
				
				let uid1 = objects.mini_cards[i].uid1;	
				let uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {
					
					let t_uid1 = t;
					let t_uid2 = tables[t];				
					
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;						
					}							
				}
								
				if (found === 0)
					objects.mini_cards[i].visible = false;
			}	
		}
		
		
		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)			
			this.place_new_cart({uid:uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем новые столы сколько свободно
		for (let uid in tables) {			
			let n1=players[uid].name
			let n2=players[tables[uid]].name
			
			let r1= players[uid].rating
			let r2= players[tables[uid]].rating
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2});
		}
		
	},

	get_state_tint: function(s) {

		switch(s) {

			case "o":
				return 0x559955;
			break;

			case "b":
				return 0x376f37;
			break;

			case "p":
				return 0x344472;
			break;

			case "w":
				return 0x990000;
			break;
		}
	},

	place_table : function (params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400}) {
				
		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "table";
				
				
				objects.mini_cards[i].bcg.texture = gres.mini_player_card_table.texture;
				objects.mini_cards[i].bcg.tint=this.get_state_tint('p');
				
				//присваиваем карточке данные
				//objects.mini_cards[i].uid=params.uid;
				objects.mini_cards[i].uid1=params.uid1;
				objects.mini_cards[i].uid2=params.uid2;
												
				//убираем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = false;
				objects.mini_cards[i].avatar.visible = false;
				objects.mini_cards[i].name_text.visible = false;

				//Включаем элементы стола 
				objects.mini_cards[i].rating_text1.visible = true;
				objects.mini_cards[i].rating_text2.visible = true;
				objects.mini_cards[i].avatar1.visible = true;
				objects.mini_cards[i].avatar2.visible = true;
				objects.mini_cards[i].rating_bcg.visible = true;

				objects.mini_cards[i].rating_text1.text = params.rating1;
				objects.mini_cards[i].rating_text2.text = params.rating2;
				
				objects.mini_cards[i].name1 = params.name1;
				objects.mini_cards[i].name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:objects.mini_cards[i].avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:objects.mini_cards[i].avatar2});


				objects.mini_cards[i].visible=true;


				break;
			}
		}
		
	},

	update_existing_card: function(params={id:0, state:"o" , rating:1400}) {

		//устанавливаем цвет карточки в зависимости от состояния(имя и аватар не поменялись)
		objects.mini_cards[params.id].bcg.tint=this.get_state_tint(params.state);
		objects.mini_cards[params.id].state=params.state;

		objects.mini_cards[params.id].rating=params.rating;
		objects.mini_cards[params.id].rating_text.text=params.rating;
		objects.mini_cards[params.id].visible=true;
	},

	place_new_cart: function(params={uid:0, state: "o", name: "XXX", rating: rating}) {

		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture = gres.mini_player_card.texture;
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "single";

				//присваиваем карточке данные
				objects.mini_cards[i].uid=params.uid;

				//убираем элементы стола так как они не нужны
				objects.mini_cards[i].rating_text1.visible = false;
				objects.mini_cards[i].rating_text2.visible = false;
				objects.mini_cards[i].avatar1.visible = false;
				objects.mini_cards[i].avatar2.visible = false;
				objects.mini_cards[i].rating_bcg.visible = false;
				
				//включаем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = true;
				objects.mini_cards[i].avatar.visible = true;
				objects.mini_cards[i].name_text.visible = true;

				objects.mini_cards[i].name=params.name;
				make_text(objects.mini_cards[i].name_text,params.name,110);
				objects.mini_cards[i].rating=params.rating;
				objects.mini_cards[i].rating_text.text=params.rating;

				objects.mini_cards[i].visible=true;

				//стираем старые данные
				objects.mini_cards[i].avatar.texture=PIXI.Texture.EMPTY;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:objects.mini_cards[i].avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				break;
			}
		}

	},

	get_texture : function (pic_url) {
		
		return new Promise((resolve,reject)=>{
			
			//меняем адрес который невозможно загрузить
			if (pic_url==="https://vk.com/images/camera_100.png")
				pic_url = "https://i.ibb.co/fpZ8tg2/vk.jpg";

			//сначала смотрим на загруженные аватарки в кэше
			if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

				//загружаем аватарку игрока
				//console.log(`Загружаем url из интернети или кэша браузера ${pic_url}`)	
				let loader=new PIXI.Loader();
				loader.add("pic", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
				loader.load(function(l,r) {	resolve(l.resources.pic.texture)});
			}
			else
			{
				//загружаем текустуру из кэша
				//console.log(`Текстура взята из кэша ${pic_url}`)	
				resolve (PIXI.utils.TextureCache[pic_url]);
			}
		})
		
	},
	
	get_uid_pic_url : function (uid) {
		
		return new Promise((resolve,reject)=>{
						
			//проверяем есть ли у этого id назначенная pic_url
			if (this.uid_pic_url_cache[uid] !== undefined) {
				//console.log(`Взяли pic_url из кэша ${this.uid_pic_url_cache[uid]}`);
				resolve(this.uid_pic_url_cache[uid]);		
				return;
			}

							
			//получаем pic_url из фб
			firebase.database().ref("players/" + uid + "/pic_url").once('value').then((res) => {

				pic_url=res.val();
				
				if (pic_url === null) {
					
					//загрузить не получилось поэтому возвращаем случайную картинку
					resolve('https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg');
				}
				else {
					
					//добавляем полученный pic_url в кэш
					//console.log(`Получили pic_url из ФБ ${pic_url}`)	
					this.uid_pic_url_cache[uid] = pic_url;
					resolve (pic_url);
				}
				
			});		
		})
		
	},
	
	load_avatar2 : function (params = {uid : 0, tar_obj : 0, card_id : 0}) {
		
		//получаем pic_url
		this.get_uid_pic_url(params.uid).then(pic_url => {
			return this.get_texture(pic_url);
		}).then(t=>{			
			params.tar_obj.texture=t;			
		})	
	},

	add_cart_ai: function() {

		//убираем элементы стола так как они не нужны
		objects.mini_cards[0].rating_text1.visible = false;
		objects.mini_cards[0].rating_text2.visible = false;
		objects.mini_cards[0].avatar1.visible = false;
		objects.mini_cards[0].avatar2.visible = false;
		objects.mini_cards[0].rating_bcg.visible = false;

		objects.mini_cards[0].bcg.tint=0x777777;
		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="AI";
		objects.mini_cards[0].name="Бот";
		objects.mini_cards[0].name_text.text="Бот";
		objects.mini_cards[0].rating_text.text="1400";
		objects.mini_cards[0].rating=1400;
		objects.mini_cards[0].avatar.texture=game_res.resources.pc_icon.texture;
	},
	
	card_down : function ( card_id ) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog : function (card_id) {
		
		if (objects.td_cont.ready === false || objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			game_res.resources.locked.sound.play();
			return
		};


		game_res.resources.click.sound.play();
		
		anim2.add(objects.td_cont,{y:[-150,objects.td_cont.sy]}, true, 1,'easeOutBack');
		
		objects.td_avatar1.texture = objects.mini_cards[card_id].avatar1.texture;
		objects.td_avatar2.texture = objects.mini_cards[card_id].avatar2.texture;
		
		objects.td_rating1.text = objects.mini_cards[card_id].rating_text1.text;
		objects.td_rating2.text = objects.mini_cards[card_id].rating_text2.text;
		
		make_text(objects.td_name1, objects.mini_cards[card_id].name1, 150);
		make_text(objects.td_name2, objects.mini_cards[card_id].name2, 150);
		
	},
	
	close_table_dialog : function () {
		
		if (objects.td_cont.ready === false)
			return;
		
		any_dialog_active--;	
		
		game_res.resources.close.sound.play();
		
		anim2.add(objects.td_cont,{y:[objects.td_cont.sy,400,]}, false, 1,'easeInBack');
		
	},

	show_invite_dialog: function(cart_id) {


		if (objects.invite_cont.ready === false || objects.invite_cont.visible === true || 	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			game_res.resources.locked.sound.play();
			return
		};


		pending_player="";

		game_res.resources.click.sound.play();

		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;

	
		anim2.add(objects.invite_cont,{y:[450, objects.invite_cont.sy]}, true, 0.6,'easeOutBack');

		//копируем предварительные данные
		cards_menu._opp_data = {uid:objects.mini_cards[cart_id].uid,name:objects.mini_cards[cart_id].name,rating:objects.mini_cards[cart_id].rating};


		let invite_available = 	cards_menu._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[cart_id].state==="o" || objects.mini_cards[cart_id].state==="b");
		invite_available=invite_available || cards_menu._opp_data.uid==="AI";

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=invite_available;


		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[cart_id].avatar.texture;
		make_text(objects.invite_name,cards_menu._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[cart_id].rating_text.text;

	},

	close: function() {

		objects.cards_cont.visible=false;
		objects.back_button.visible=false;
		objects.desktop.visible=false;

		if (objects.invite_cont.visible === true)
			this.hide_invite_dialog();
		
		if (objects.td_cont.visible === true)
			this.close_table_dialog();

		//больше ни ждем ответ ни от кого
		pending_player="";

		//убираем сколько игроков онлайн
		objects.players_online.visible=false;

		//подписываемся на изменения состояний пользователей
		firebase.database().ref("states").off();

	},

	hide_invite_dialog: function() {

		if (objects.invite_cont.ready === false)
			return;
		
		game_res.resources.close.sound.play();

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=="") {
			firebase.database().ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player="";
		}

		anim2.add(objects.invite_cont,{y:[objects.invite_cont.sy,400]}, false, 0.5,'easeInBack');
	},

	send_invite: function() {


		if (objects.invite_cont.ready === false || 	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			game_res.resources.locked.sound.play();
			return
		}

		if (cards_menu._opp_data.uid==="AI")
		{
			cards_menu._opp_data.rating = 1400;
			
			make_text(objects.opp_card_name,cards_menu._opp_data.name,160);
			objects.opp_card_rating.text='1400';
			objects.opp_avatar.texture=objects.invite_avatar.texture;				
			
			this.close();
			game.activate('master', bot_player );
		}
		else
		{
			game_res.resources.click.sound.play();
			objects.invite_button.texture=game_res.resources.wait_response.texture;
			firebase.database().ref("inbox/"+cards_menu._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=cards_menu._opp_data.uid;
		}



	},

	rejected_invite: function() {

		pending_player="";
		cards_menu._opp_data={};
		this.hide_invite_dialog();
		big_message.show("Соперник отказался от игры",'(((');

	},

	accepted_invite: function() {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=cards_menu._opp_data;
		
		//сразу карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=objects.invite_avatar.texture;		

		cards_menu.close();
		game.activate("master" , online_player );
	},

	back_button_down: function() {

		if (objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true ||objects.invite_cont.visible === true)	{
			game_res.resources.locked.sound.play();
			return
		};



		game_res.resources.close.sound.play();

		this.close();
		main_menu.activate();

	}

}

var stickers = {

	show_panel: function() {


		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};
		any_dialog_active=1;

		if (objects.stickers_cont.ready===false)
			return;
		game_res.resources.click.sound.play();


		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="p")
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy]}, true, 1,'easeOutBack');
	},

	hide_panel: function() {

		game_res.resources.close.sound.play();

		if (objects.stickers_cont.ready===false)
			return;

		any_dialog_active=0;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[objects.stickers_cont.sy,-450]}, false, 1,'easeOutBack');
	},

	send : function(id) {

		if (objects.stickers_cont.ready===false)
			return;

		this.hide_panel();

		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		add_message("Стикер отправлен сопернику");

		//показываем какой стикер мы отправили
		objects.sent_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		
		anim2.add(objects.sent_sticker_area,{alpha:[0,0.5]}, true, 1,'linear');
		//objects.sticker_area.visible=true;
		//убираем стикер через 5 секунд
		if (objects.sent_sticker_area.timer_id!==undefined)
			clearTimeout(objects.sent_sticker_area.timer_id);

		objects.sent_sticker_area.timer_id=setTimeout(()=>{objects.sent_sticker_area.visible=false;}, 3000);

	},

	receive: function(id) {

		//воспроизводим соответствующий звук
		game_res.resources.receive_sticker.sound.play();

		objects.rec_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;

		anim2.add(objects.rec_sticker_area,{x:[-150,objects.rec_sticker_area.sx]}, true, 1,'easeOutBack');


		//убираем стикер через 5 секунд
		if (objects.rec_sticker_area.timer_id!==undefined)
			clearTimeout(objects.rec_sticker_area.timer_id);
		objects.rec_sticker_area.timer_id=setTimeout(()=>{

			anim2.add(objects.rec_sticker_area,{x:[objects.rec_sticker_area.x, -150]}, false, 1,'easeInBack');
			
		}, 5000);

	}


}

var auth = function() {
	
	return new Promise((resolve, reject)=>{

		let help_obj = {

			loadScript : function(src) {
			  return new Promise((resolve, reject) => {
				const script = document.createElement('script')
				script.type = 'text/javascript'
				script.onload = resolve
				script.onerror = reject
				script.src = src
				document.head.appendChild(script)
			  })
			},

			vkbridge_events: function(e) {

				if (e.detail.type === 'VKWebAppGetUserInfoResult') {

					my_data.name 	= e.detail.data.first_name + ' ' + e.detail.data.last_name;
					my_data.uid 	= "vk"+e.detail.data.id;
					my_data.pic_url = e.detail.data.photo_100;

					//console.log(`Получены данные игрока от VB MINIAPP:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);
					help_obj.process_results();
				}
			},

			init: function() {

				g_process=function() { help_obj.process()};

				let s = window.location.href;

				//-----------ЯНДЕКС------------------------------------
				if (s.includes("yandex")) {
					Promise.all([
						this.loadScript('https://yandex.ru/games/sdk/v2')
					]).then(function(){
						help_obj.yandex();
					});
					return;
				}


				//-----------ВКОНТАКТЕ------------------------------------
				if (s.includes("vk.com")) {
					Promise.all([
						this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')

					]).then(function(){
						help_obj.vk()
					});
					return;
				}


				//-----------ЛОКАЛЬНЫЙ СЕРВЕР--------------------------------
				if (s.includes("192.168")) {
					help_obj.debug();
					return;
				}


				//-----------НЕИЗВЕСТНОЕ ОКРУЖЕНИЕ---------------------------
				help_obj.unknown();

			},

			yandex: function() {

				game_platform="YANDEX";
				if(typeof(YaGames)==='undefined')
				{
					help_obj.local();
				}
				else
				{
					//если sdk яндекса найден
					YaGames.init({}).then(ysdk => {

						//фиксируем SDK в глобальной переменной
						window.ysdk=ysdk;

						//запрашиваем данные игрока
						return ysdk.getPlayer();


					}).then((_player)=>{

						my_data.name 	= _player.getName();
						my_data.uid 	= _player.getUniqueID().replace(/\//g, "Z");
						my_data.pic_url = _player.getPhoto('medium');

						//console.log(`Получены данные игрока от яндекса:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

						//если личные данные не получены то берем первые несколько букв айди
						if (my_data.name=="" || my_data.name=='')
							my_data.name=my_data.uid.substring(0,5);

						help_obj.process_results();

					}).catch((err)=>{

						//загружаем из локального хранилища если нет авторизации в яндексе
						help_obj.local();

					})
				}
			},

			vk: function() {

				game_platform="VK";
				vkBridge.subscribe((e) => this.vkbridge_events(e));
				vkBridge.send('VKWebAppInit');
				vkBridge.send('VKWebAppGetUserInfo');

			},

			debug: function() {

				game_platform = "debug";
				let uid = prompt('Отладка. Введите ID', 100);

				my_data.name = my_data.uid = "debug" + uid;
				my_data.pic_url = "https://sun9-73.userapi.com/impf/c622324/v622324558/3cb82/RDsdJ1yXscg.jpg?size=223x339&quality=96&sign=fa6f8247608c200161d482326aa4723c&type=album";

				help_obj.process_results();

			},

			local: function(repeat = 0) {

				game_platform="YANDEX";

				//ищем в локальном хранилище
				let local_uid = localStorage.getItem('uid');

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");

					let rnd_names=["Бегемот","Жираф","Зебра","Тигр","Ослик","Мамонт","Волк","Лиса","Мышь","Сова","Слон","Енот","Кролик","Бизон","Пантера"];
					let rnd_num=Math.floor(Math.random()*rnd_names.length)
					let rand_uid=Math.floor(Math.random() * 9999999);

					let name_postfix = rand_uid.toString().substring(0, 3);
					my_data.name 		=	rnd_names[rnd_num] + name_postfix;
					my_data.rating 		= 	1400;
					my_data.uid			=	"ls"+rand_uid;
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';

					localStorage.setItem('uid',my_data.uid);
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {
													
							//если повтоно нету данных то выводим предупреждение
							if (repeat === 1)
								alert('Какая-то ошибка');
							
							//console.log(`Нашли данные в ЛХ но не нашли в ФБ, повторный локальный запрос...`);	

							
							//повторно запускаем локальный поиск						
							localStorage.clear();
							help_obj.local(1);	
								
							
						} else {						
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;
							help_obj.process_results();
						}

					})	

				}


			},

			unknown: function () {

				game_platform="unknown";
				alert("Неизвестная платформа! Кто Вы?")

				//загружаем из локального хранилища
				help_obj.local();
			},

			process_results: function() {


				//отображаем итоговые данные
				//console.log(`Итоговые данные:\nПлатформа:${game_platform}\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

				//обновляем базовые данные в файербейс так могло что-то поменяться
				firebase.database().ref("players/"+my_data.uid+"/name").set(my_data.name);
				firebase.database().ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);
				firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);

				//вызываем коллбэк
				resolve("ok");
			},

			process : function () {

				objects.id_loup.x=20*Math.sin(game_tick*8)+90;
				objects.id_loup.y=20*Math.cos(game_tick*8)+110;
			}
		}

		help_obj.init();

	});	
	
}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function set_state(params) {

	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		h_state=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	firebase.database().ref("states/"+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

}

function vis_change() {

	if (document.hidden === true)
		hidden_state_start = Date.now();
	
	set_state({hidden : document.hidden});
	
		
}

async function load_user_data() {
	
	try {
	
		//получаем данные об игроке из социальных сетей
		await auth();
			
		//устанавлием имя на карточки
		make_text(objects.id_name,my_data.name,150);
		make_text(objects.my_card_name,my_data.name,150);
			
		//ждем пока загрузится аватар
		let loader=new PIXI.Loader();
		loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
		await new Promise((resolve, reject)=> loader.load(resolve))
		

		objects.id_avatar.texture=objects.my_avatar.texture=loader.resources.my_avatar.texture;
		
		//получаем остальные данные об игроке
		let snapshot = await firebase.database().ref("players/"+my_data.uid).once('value');
		let data = snapshot.val();
		
		//делаем защиту от неопределенности
		data===null ?
			my_data.rating=1400 :
			my_data.rating = data.rating || 1400;
			
		data===null ?
			my_data.games = 0 :
			my_data.games = data.games || 0;

		//устанавливаем рейтинг в попап
		objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

		//убираем лупу
		objects.id_loup.visible=false;

		//обновляем почтовый ящик
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		//подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

		//обновляем данные в файербейс так как могли поменяться имя или фото
		firebase.database().ref("players/"+my_data.uid).set({name:my_data.name, pic_url: my_data.pic_url, rating : my_data.rating, games : my_data.games, tm:firebase.database.ServerValue.TIMESTAMP});

		//устанавливаем мой статус в онлайн
		set_state({state : 'o'});

		//отключение от игры и удаление не нужного
		firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
		firebase.database().ref("states/"+my_data.uid).onDisconnect().remove();

		//это событие когда меняется видимость приложения
		document.addEventListener("visibilitychange", vis_change);

		//keep-alive сервис
		setInterval(function()	{keep_alive()}, 40000);

		//указываем что актвиность загрузки завершена
		activity_on=0;
		
		//ждем и убираем попап
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		

		anim2.add(objects.id_cont,{y:[objects.id_cont.y, -200]}, false, 1,'easeInBack');
	
	
	} catch (error) {		
		alert (error);		
	}
	
}

async function init_game_env() {
	
	
	//ждем когда загрузятся ресурсы
	await load_resources();

	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";

	//короткое обращение к ресурсам
	gres=game_res.resources;

	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyAFBbluhUs_MMWgz8OevYqAvLWjVe2YL-A",
			authDomain: "balda-810c3.firebaseapp.com",
			databaseURL: "https://balda-810c3-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "balda-810c3",
			storageBucket: "balda-810c3.appspot.com",
			messagingSenderId: "67392486991",
			appId: "1:67392486991:web:e3b8b40f8c48670c1df43a"
		});
	}

	
	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false,backgroundColor : 0x404040});
	document.body.appendChild(app.view);

	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }
	
	
	//загружаем данные об игроке
	load_user_data();
		
	//показыаем основное меню
	main_menu.activate();
	
	//заполняем клавиатуру
	for (let i = 0 ; i < 33 ; i ++)
		objects.keys[i].letter.text = rus_let[i];
	
	
	
	console.clear()

	//запускаем главный цикл
	main_loop();

}

async function load_resources() {


	
	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/


	let git_src="https://akukamil.github.io/balda/"
	//let git_src=""


	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"fonts/Neucha/font.fnt");


	game_res.add('click',git_src+'/sounds/click.wav');
	game_res.add('locked',git_src+'/sounds/locked.wav');
	game_res.add('clock',git_src+'/sounds/clock.mp3');
	game_res.add('close',git_src+'/sounds/close.wav');
	game_res.add('game_start',git_src+'/sounds/game_start.wav');
	game_res.add('lose',git_src+'/sounds/lose.wav');
	game_res.add('receive_move',git_src+'/sounds/receive_move.mp3');
	game_res.add('bad_word',git_src+'/sounds/bad_word.wav');
	game_res.add('good_word',git_src+'/sounds/good_word.mp3');
	game_res.add('key_down',git_src+'/sounds/key_down.wav');
	game_res.add('cell_down',git_src+'/sounds/cell_down.mp3');
	game_res.add('cell_move',git_src+'/sounds/cell_move.mp3');
	game_res.add('bad_move',git_src+'/sounds/bad_move.wav');
	game_res.add('win',git_src+'/sounds/win.wav');
	game_res.add('invite',git_src+'/sounds/invite.mp3');
	game_res.add('draw',git_src+'/sounds/draw.wav');
	
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+"res/" + load_list[i].name + "." +  load_list[i].image_format);		


	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, git_src+"stickers/"+i+".png");

	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	

	
	await new Promise((resolve, reject)=> game_res.load(resolve))

}

function main_loop() {

	//глобальная функция
	g_process();

	game_tick+=0.016666666;
	anim2.process();
	anim3.process();
	
	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();


	requestAnimationFrame(main_loop);
}


