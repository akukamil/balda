var M_WIDTH=800, M_HEIGHT=450;
var app ={stage:{},renderer:{}}, game_res, game, objects={}, state="",my_role="", game_tick=0, my_turn=0, move=0, game_id=0, last_cell=null, show_word=0, start_word="БАЛДА";
var me_conf_play=0,opp_conf_play=0, client_id =0, h_state=0, game_platform="",activity_on=1, hidden_state_start = 0, room_name = 'states2', connected = 1;
var players="", pending_player="";
var my_data={opp_id : ''},opp_data={};
var some_process = {};
var rus_let = ['А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я'];
const rus_let2 = ['А','Б','В','Г','Д','Е','Ж','З','И','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я'];
const adj_cells = {0:[1,5],1:[0,6,2],2:[1,7,3],3:[2,8,4],4:[3,9],5:[0,6,10],6:[1,5,7,11],7:[2,6,8,12],8:[3,7,9,13],9:[4,8,14],10:[5,11,15],11:[6,10,12,16],12:[7,11,13,17],13:[8,12,14,18],14:[9,13,19],15:[10,16,20],16:[11,15,17,21],17:[12,16,18,22],18:[13,17,19,23],19:[14,18,24],20:[15,21],21:[16,20,22],22:[17,21,23],23:[18,22,24],24:[19,23]};
const LANG=0;

irnd = function (min,max) {	
	//мин и макс включительно
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = "single";
		this.x=x;
		this.y=y;
		this.bcg=new PIXI.Sprite(gres.mini_player_card_online.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){cards_menu.card_down(id)};
		this.bcg.pointerover=function(){this.bcg.alpha=0.5;}.bind(this);
		this.bcg.pointerout=function(){this.bcg.alpha=1;}.bind(this);
		this.bcg.width = 200;
		this.bcg.height = 100;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=20;
		this.avatar.y=20;
		this.avatar.width=this.avatar.height=60;

		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'balsamic',fontSize: 25,align: 'center'});
		this.name_text.tint=objects.minicard_name_color;
		this.name_text.anchor.set(0.5,0.5);
		this.name_text.x=135;
		this.name_text.y=35;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'balsamic',fontSize: 32,align: 'center'});
		this.rating_text.tint=objects.minicard_rating_color;
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

		this.rating_text1=new PIXI.BitmapText('', {fontName: 'balsamic',fontSize: 18,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=50;
		this.rating_text1.y=70;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'balsamic',fontSize: 18,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150;
		this.rating_text2.y=70;
		
		//
		this.rating_bcg = new PIXI.Sprite(game_res.resources.rating_bcg.texture);
		this.rating_bcg.width = 200;
		this.rating_bcg.height = 100;
		
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
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'balsamic',fontSize: 25,align: 'center'});
		this.place.tint=objects.lb_place_color;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'balsamic',fontSize: 30,align: 'center'});
		this.name.tint=objects.lb_name_color;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'balsamic',fontSize: 35,align: 'center'});
		this.rating.x=298;
		this.rating.tint=objects.lb_rating_color;
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
		this.bcg.width=this.bcg.height=60;
		
		this.bcg2=new PIXI.Sprite(gres.big_letter_image_h.texture);
		this.bcg2.visible = false;
		this.bcg2.width=this.bcg2.height=60;
		
		this.bcg3=new PIXI.Sprite(gres.big_letter_image_h2.texture);
		this.bcg3.visible = false;
		this.bcg3.width=this.bcg3.height=60;

		this.letter=new PIXI.BitmapText('', {fontName: 'balsamic_bold',fontSize: 76});
		this.letter.tint=objects.cell_color;
		this.letter.anchor.set(0.5,0.5);
		this.letter.x=30;
		this.letter.y=30;
		
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
		this.bcg.width=40;
		this.bcg.height=40;
		this.bcg.interactive=true;
		this.bcg.buttonMode = true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width=this.bcg.height=50;
		

		this.letter=new PIXI.BitmapText("", {fontName: 'balsamic',fontSize: 35});
		this.letter.tint=objects.key_color;
		this.letter.x=20;
		this.letter.y=20;
		this.letter.anchor.set(0.5,0.5);
		
		this.bcg.pointerdown = this.pointer_down.bind(this);

		this.addChild(this.bcg,this.letter);
	}	
	
	pointer_down () {		
		let key = this.key_id;
		word_creation.key_down.bind(word_creation,key)();
	}
	
}

class chat_record_class extends PIXI.Container {
	
	constructor() {
		
		super();
		
		this.tm=0;
		this.msg_id=0;
		this.msg_index=0;
		
		
		this.msg_bcg = new PIXI.Sprite(gres.msg_bcg.texture);
		this.msg_bcg.width=560;
		this.msg_bcg.height=75;
		this.msg_bcg.x=90;
		

		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'balsamic',fontSize: 20});
		this.name.anchor.set(0.5,0.5);
		this.name.x=65;
		this.name.y=55;
		this.name.tint = objects.chat_name_color;
		
		this.avatar = new PIXI.Sprite(PIXI.Texture.WHITE);
		this.avatar.width = this.avatar.height = 40;
		this.avatar.x=65;
		this.avatar.y=5;
		this.avatar.interactive=true;
		this.avatar.pointerdown=feedback.response_message.bind(this,this);
		this.avatar.anchor.set(0.5,0)
				
		
		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'balsamic',fontSize: 25,align: 'left'}); 
		this.msg.x=140;
		this.msg.y=37.5;
		this.msg.maxWidth=470;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = objects.chat_message_color;
		
		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'balsamic',fontSize: 20}); 
		this.msg_tm.y=57;
		this.msg_tm.tint=objects.chat_time_color;
		//this.msg_tm.alpha=0.5;
		this.msg_tm.anchor.set(1,0.5);
		
		this.visible = false;
		this.addChild(this.msg_bcg,this.avatar, this.name, this.msg,this.msg_tm);
		
	}
	
	async update_avatar(uid, tar_sprite) {
		
		
		let pic_url = '';
		//если есть в кэше то =берем оттуда если нет то загружаем
		if (cards_menu.uid_pic_url_cache[uid] !== undefined) {
			
			pic_url = cards_menu.uid_pic_url_cache[uid];
			
		} else {
			
			pic_url = await firebase.database().ref("players/" + uid + "/pic_url").once('value');		
			pic_url = pic_url.val();			
			cards_menu.uid_pic_url_cache[uid] = pic_url;
		}
		
		
		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//загружаем аватарку игрока
			let loader=new PIXI.Loader();
			loader.add("pic", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 3000});
			
			let texture = await new Promise((resolve, reject) => {				
				loader.load(function(l,r) {	resolve(l.resources.pic.texture)});
			})
			
			if (texture === undefined || texture.width === 1) {
				texture = PIXI.Texture.WHITE;
				texture.tint = this.msg.tint;
			}
			
			tar_sprite.texture = texture;
			
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log(`Текстура взята из кэша ${pic_url}`)	
			tar_sprite.texture =  PIXI.utils.TextureCache[pic_url];
		}
		
	}
	
	async set(msg_data) {
						
		//получаем pic_url из фб
		this.avatar.texture=PIXI.Texture.WHITE;
		await this.update_avatar(msg_data.uid, this.avatar);



		this.tm = msg_data.tm;
			
		this.msg_id = msg_data.msg_id;
		this.msg_index=msg_data.msg_index;
		
		if (msg_data.name.length > 15) msg_data.name = msg_data.name.substring(0, 15);	
		this.name.text=msg_data.name ;		
		
		this.msg.text=msg_data.msg;
		
		if (msg_data.msg.length<25) {
			this.msg_bcg.texture = gres.msg_bcg_short.texture;			
			this.msg_tm.x=410;
		}
		else {
			
			this.msg_bcg.texture = gres.msg_bcg.texture;	
			this.msg_tm.x=630;
		}

		
		this.visible = true;
		
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		
	}	
	
}

anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0,visible:false,ready:true, alpha:0},
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	any_on : function() {
		
		for (let s of this.slot)
			if (s !== null)
				return true
		return false;		
	},
	
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
	
	easeOutBounce: function(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},
	
	easeInCubic: function(x) {
		return x * x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI*2);
	},
	
	easeInOutCubic: function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	shake : function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
		
		
	},	
	
	add : function(obj, params, vis_on_end, time, func, anim3_origin) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		/*if (anim3_origin === undefined)
			anim3.kill_anim(obj);*/

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
					if (s.vis_on_end === false)
						s.obj.alpha = 1;
					
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

sound = {
	
	on : 1,
	
	play : function(snd_res) {
		
		if (this.on === 0)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		game_res.resources[snd_res].sound.play();	
		
	}
	
	
}

message =  {
	
	promise_resolve :0,
	
	add : async function(text, timeout) {
		
		if (this.promise_resolve!==0)
			this.promise_resolve("forced");
		
		if (timeout === undefined) timeout = 3000;
		
		//воспроизводим звук
		sound.play('message');

		objects.message_text.text=text;

		await anim2.add(objects.message_cont,{x:[-200,objects.message_cont.sx]}, true, 0.25,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, timeout)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.message_cont,{x:[objects.message_cont.sx, -200]}, false, 0.25,'easeInBack');			
	},
	
	clicked : function() {
		
		
		message.promise_resolve();
		
	}

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

		gres.close_it.sound.play();
		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

confirm_dialog = {
	
	p_resolve : 0,
		
	show(msg) {
				
				
		if (objects.confirm_cont.visible === true) {
			gres.locked.sound.play();
			return;			
		}		
				
		objects.confirm_msg.text=msg;
		
		gres.bad_move.sound.play();
		anim2.add(objects.confirm_cont,{y:[450,objects.confirm_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			confirm_dialog.p_resolve = resolve;	  		  
		});
	},
	
	button_down(res) {
		
		if (objects.confirm_cont.ready===false){
			sound.play('locked');
			return;			
		}

		sound.play('click');
		anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve(res);	
		
	}

}

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	const f_size=obj.fontSize;
	const font=gres[obj.fontName].bitmapFont;
	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=font.chars[code_id];
		if (char_obj===undefined) {
			char_obj=font.chars[83];
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

online_player = {
		
	timer : 0,
	time_t : 0,
	control_time : 0,
	disconnect_time : 0,
	start_time : 0,
	
	send_move  (move_data) {
		

		//отправляем ход сопернику
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:move_data});
		
		//if (my_data.name === "Мышь205" || opp_data.name === "Мышь205" || my_data.name === "debug100" || opp_data.name === "debug100")
		//	firebase.database().ref("TEST_ILONA").push([game_id, client_id, move_data,"SEND",my_data.name, Date.now()]);	
		
		//проверяем завершение
		//timer.sw();	
		
	},
	
	init (r) {
	
		
		me_conf_play = 0;
		opp_conf_play = 0;


		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'p'});
		
		//фиксируем врему начала игры
		this.start_time = Date.now();
		
		
		//таймер времени
		//this.reset_timer(30);
		this.timer = setTimeout(function(){online_player.process_time()}, 1000);
		objects.timer.visible=true;
		
		//заносим рейтинг проигрыша но потом он будет восстановлен
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		let lose_rating =  Math.round(my_data.rating + 16 * (0 - Ea));
		firebase.database().ref("players/"+my_data.uid+"/rating").set(lose_rating);	
		
		
		objects.send_message_button.visible=true;
		
	},
	
	reset_timer(t) {
		
		this.move_start = Date.now();
		
		if (t===undefined)
			this.control_time = Date.now() + 90000;	
		else
			this.control_time = Date.now() + t*1000;	


		objects.timer.tint=objects.timer.base_tint;	
		
	},
	
	process_time () {
		
		this.time_t = Math.floor((this.control_time - Date.now())*0.001);
		
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
		if (this.time_t === 15) {
			objects.timer.tint=0xff0000;
			gres.clock.sound.play();
		}
		
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){online_player.process_time()}, 1000);
		
		if (connected === 0)
			this.disconnect_time++;
		else
			this.disconnect_time=0;
		
		if (this.disconnect_time > 15) {
			game.stop('MY_NO_CONNECTION');
			return;				
		}
		
		
	},
	
	async stop(res) {
					
		
		//случай если не смогли начать игру
		if(res === 'MY_NO_TIME'|| res === 'OPP_NO_TIME')
			if (opp_conf_play === 0 || me_conf_play === 0)
				res = "NO_CONNECTION";
		
		
		//отключаем таймер времени
		clearTimeout(this.timer);
		let old_rating = my_data.rating;
		let int_res = 0;
		let Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (res === 'DRAW') {
			my_data.rating = Math.round(my_data.rating + 16 * (0.5 - Ea));	
			gres.draw.sound.play();
			int_res=0;
		}
		if (res === 'MY_WIN' || res === 'OPP_NO_TIME' || res === 'OPP_CANCEL') {
			my_data.rating = Math.round(my_data.rating + 16 * (1 - Ea));
			gres.win.sound.play();
			int_res=1;
			
		}
		if (res === 'MY_LOSE' || res === 'MY_NO_TIME' || res === 'MY_CANCEL' || res === 'MY_NO_CONNECTION') {
			my_data.rating = Math.round(my_data.rating + 16 * (0 - Ea));
			gres.lose.sound.play();
			int_res=-1;
		}
		
		objects.my_card_rating.text = my_data.rating;
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);	
		firebase.database().ref(room_name+"/"+my_data.uid+"/rating").set(my_data.rating);	
		
		
		let res_s="";
		if (res === 'DRAW')
			res_s = 'Ничья!!!'
		if (res === 'MY_NO_CONNECTION')
			res_s = 'Потеряна связь!'
		if (res === 'MY_WIN')
			res_s = 'Вы выиграли!!!'
		if (res === 'MY_LOSE')
			res_s = 'Вы проиграли!!!'
		if (res === 'MY_NO_TIME')
			res_s = 'Вы проиграли. У Вас закончилось время!'
		if (res === 'OPP_NO_TIME')
			res_s = 'Вы выиграли. У соперника закончилось время!'
		if (res === 'NO_CONNECTION')
			res_s = 'Похоже игру не получилось начать!'
		if (res === 'OPP_CANCEL')
			res_s = 'Соперник отменил игру!'		
		if (res === 'MY_CANCEL') {
			res_s = 'Вы отменили игру!'			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"OPP_CANCEL",tm:Date.now()});
		}


		objects.send_message_button.visible=false;
		//записываем в историю партий
		if (res !== 'NO_CONNECTION') {
			
			
			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			
			firebase.database().ref("finishes/"+game_id + my_role).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':res,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
			my_data.games++;
			firebase.database().ref("players/"+my_data.uid+"/games").set(my_data.games);	
			
		}
		
		await big_message.show(res_s,"Рейтинг: " + old_rating + ' > ' + my_data.rating);
	
	},
	
	async send_message_down(){
		
		if(anim2.any_on()){			
			sound.play('locked');
			return;			
		}

		sound.play('click');
		let msg_data = await feedback.show();
		
		if (msg_data[0] === 'sent')			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"CHAT",tm:Date.now(),data:msg_data[1]});	
		
	},
	
	chat(data) {		
		
		sound.play('online_message');
		message.add(data, 10000);
	}

};

bot_player = {
	
	true_rating : 0,	
	timer : 0,
	found_data : {},
	found_words : [],
	time_t : 0,
	search_start_time : 0,
		
	send_move : async function  () {

		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
				
		//начинаем поиск слова
		this.found_words = [];
		this.found_data = {};
		this.search_start_time = Date.now();
		some_process.bot_search_word = this.process.bind(this);

	},
	
	init : function () {
		
		set_state({state : 'b'});
		
		//выбираем случайным образом стартовое слово
		let d_size = rus_dict0.length;
		while(1) {
			
			let r_num = irnd(0,d_size-1);
			start_word = rus_dict0[r_num];
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
		
	search_surrogate_match : function (dir_sur, inv_sur, new_letter_cell_id, acc_pos) {
		
		
		//длина суррогата
		let sur_len = dir_sur.length;		
	
		
		for (let word of rus_dict0) {
			
			if (word.length !== sur_len + 1 || word === start_word || this.found_words.includes(word) === true || game.words_hist.includes(word) === true)
				continue;
				
				
			//убираем первую букву для проверки прямого суррогата
			let dir_surrogated_word = word.substring(1, sur_len + 1);			
			if (dir_surrogated_word === dir_sur) {				
				this.found_words.push(word);
				console.log("Совп. прямого суррогата ", word);	
				this.found_data[word.length]=[new_letter_cell_id, word[0], acc_pos.slice()];	
			}
			
				
			//убираем первую букву для проверки обратного суррогата
			let inv_surrogated_word = word.substring(0, sur_len);			
			if (inv_surrogated_word === inv_sur) {
				this.found_words.push(word);
				console.log("Совп. обратного суррогата ", word);
				this.found_data[word.length]=[new_letter_cell_id, word[word.length - 1], acc_pos.slice().reverse()];	
			}		

		};		
		
	},
	
	search_word : function () {
		
		//создаем массивы пустых клеток и заполненных клеток
		let field = [];
		for (let i = 0 ; i < 25 ; i++)
			field.push(objects.cells[i].letter.text);		
		let _adj_cells = this.get_adj_cells(field);
		let _adj_cells_cnt = _adj_cells.length;

		/*
		//здесь нужно поискать 3-буквенные слова чтобы не остасть когда суррогатов нет
		let new_letter_cell_id = _adj_cells[irnd(0 , _adj_cells_cnt - 1 )];	
		let new_letter = rus_let2[irnd(0,27)];
		let letters_pos = [];
		for (let i = 0 ; i < 25 ; i++)
			if (field[i] !== "")
				letters_pos.push(i);			
			
		let [acc_word, acc_pos] = this.read_random_word4(field, letters_pos);
		
		if ( this.found_words.includes(acc_word[0]) !== true && game.words_hist.includes(acc_word[0]) !== true && rus_dict0.includes(acc_word[0])=== true) {
			this.found_data[acc_word[0].length]=[new_letter_cell_id, new_letter, acc_pos.slice()];		
			this.found_words.push(acc_word[0]);	
			console.log('Совпадение #4 ',acc_word[0] )
		}
		
		//если 4 буквы проверяем еще 3 буквы
		if (acc_word[0].length === 4) {			
			let acc_word3 = acc_word[0].substring(0, 3);	
			acc_pos.pop();				
			if ( this.found_words.includes(acc_word3) !== true && game.words_hist.includes(acc_word3) !== true && rus_dict0.includes(acc_word3)=== true) {
				this.found_data[3]=[new_letter_cell_id, new_letter, acc_pos.slice()];		
				this.found_words.push(acc_word3);	
				console.log('Совпадение #3 ',acc_word3 )
			}
		}*/

	
		

		//несколько попыток найти слово-суррогат начиная с рандомной смежной ячейки
		for (let i = 0 ; i < _adj_cells_cnt ; i++) {			
		
			//выбираем пустую клетку
			let start_cell = _adj_cells[i];			
			
			//считываем слово-суррогат 5 букв
			let [acc_word, acc_pos] = this.read_random_word(field, start_cell);	
			
			//прямой и обратный суррогат
			let dir_sur = acc_word[0];
			let inv_sur = dir_sur.split('').reverse().join('');
			
			//ищем совпадения суррогатов
			this.search_surrogate_match(dir_sur, inv_sur, start_cell, acc_pos);

			//если слово большое то делаем еще маленьких суррогатов
			for (let b = 0 ; b < 3 ; b++) {
				
				if (dir_sur.length > 2) {
					dir_sur = dir_sur.substring(0, dir_sur.length - 1);				
					inv_sur = inv_sur.substring(1, inv_sur.length);	
					acc_pos.pop();					
					
					//ищем совпадения суррогатов
					this.search_surrogate_match(dir_sur, inv_sur, start_cell, acc_pos);
				}				
			}			
		}



	},
		
	read_random_word : function(field, start_cell) {
		
		
		//начинаем идти от этой буквы пока не будет дальше ходов или достигнута максимальная длина
		let acc_pos = [start_cell];
		let acc_word = [''];
		
		//читаем 5 букв
		this.make_move(field, acc_word, acc_pos);		
		this.make_move(field, acc_word, acc_pos);		
		this.make_move(field, acc_word, acc_pos);		
		this.make_move(field, acc_word, acc_pos);		
		this.make_move(field, acc_word, acc_pos);
		
		return [acc_word,acc_pos];	
		
	},
	
	read_random_word4 : function(field, letters_pos) {
						
		//выбираем начальную для поиска букву
		let letters_pos_len = letters_pos.length;
		let start_letter_pos = letters_pos[irnd(0 , letters_pos_len - 1 )];		
		
		//начинаем идти от этой буквы пока не будет дальше ходов или достигнута максимальная длина
		let acc_pos = [start_letter_pos];
		let acc_word = [field[start_letter_pos]];
		
		//читаем еще 3 буквы
		this.make_move(field, acc_word, acc_pos);		
		this.make_move(field, acc_word, acc_pos);		
		this.make_move(field, acc_word, acc_pos);		
			
		return [acc_word,acc_pos];	
		
	},
			
	stop : async function (res) {
		
		some_process.bot_search_word = function(){};
		
		
		
		if (res === 'DRAW')
			gres.draw.sound.play();
		
		if (res === 'MY_LOSE' || res === 'MY_CANCEL')
			gres.lose.sound.play();		
		
				
		
		let res_s=["",""];
		
		if (res === 'DRAW') 
			res_s = ['Ничья!!!','(o_O)']

		if (res === 'MY_WIN') 
			res_s = ['Вы выиграли!!!','Рейтинг: +1']
			
		if (res === 'MY_LOSE') 
			res_s = ['Вы проиграли!!!','(o_O)']
		
		if (res === 'MY_NO_TIME') 
			res_s = ['Вы проиграли. У Вас закончилось время!','(o_O)']
								
		if (res === 'GIVE_UP') 
			res_s = ['Вы выиграли! Я не могу найти слово!','Рейтинг: +1']
			
		if (res === 'MY_CANCEL') 
			res_s = ['Вы отменили игру!','(o)_(o)']
				
		
		if (res === 'MY_WIN' || res === 'GIVE_UP') {		
		
			gres.win.sound.play();			

			if (my_data.rating > 1500) {
				
				res_s[1]=")))"
				
			} else {
				
				my_data.rating = my_data.rating + 1;			
				firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);	
				firebase.database().ref(room_name+"/"+my_data.uid+"/rating").set(my_data.rating);					
			}
		}				

		objects.my_card_rating.text = my_data.rating;
		
		await big_message.show(res_s[0], res_s[1]);
	
	},
	
	reset_timer : function() {
		
		
	},
	
	process : function () {
		
		//ищем слова и наполняем массив найденных слов
		this.search_word();		
		let cur_time = Date.now();
				
		//если появилось сообщение то выходим из игры или изменилось состояние
		if (objects.big_message_cont.visible === true || state !== 'b') {
				some_process.bot_search_word = function(){};
				return;	
		}
		
		if (cur_time - this.search_start_time > 20000) {
			
			game.stop('GIVE_UP');			
			return;
		}
		
		if (cur_time - this.search_start_time > 3000) {
			if (this.found_data[6]!==undefined) {				
				some_process.bot_search_word = function(){};
				word_waiting.receive_move(this.found_data[6]);
				return;
			}			
		}
		
		if (cur_time - this.search_start_time > 5000) {
			if (this.found_data[5]!==undefined) {				
				some_process.bot_search_word = function(){};
				word_waiting.receive_move(this.found_data[5]);		
				return;
			}			
		}
		
		if (cur_time - this.search_start_time > 7000) {
			if (this.found_data[4]!==undefined) {				
				some_process.bot_search_word = function(){};
				word_waiting.receive_move(this.found_data[4]);		
				return;				
			}			
		}
		
		if (cur_time - this.search_start_time > 9000) {
			if (this.found_data[3]!==undefined) {				
				some_process.bot_search_word = function(){};
				word_waiting.receive_move(this.found_data[3]);		
				return;				
			}			
		}
		
		if (cur_time - this.search_start_time > 12000) {
			if (this.found_data[2]!==undefined) {				
				some_process.bot_search_word = function(){};
				word_waiting.receive_move(this.found_data[2]);
				return;				
			}			
		}
		
	}
	
};

word_waiting = {
	
	receiving_move : 0,
	
	activate : async function (init_time) {		
				
		
		my_turn = 0;
		
		objects.timer.x = 595;
		game.opponent.reset_timer(init_time);
		
		//процесс ожидания
		some_process.wait_opponent_move = this.process;
		objects.wait_opponent_move.visible=true;
				
		//сдвигаем поле в центр
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.y,75]}, true, 0.5,'easeInOutCubic');		
	},
	
	show_new_word_anim : async function(word_ids) {
		
		this.receiving_move = 1;
		
		for (let i =0 ; i < word_ids.length ; i++){
			anim2.add(objects.cells[word_ids[i]].bcg3,{alpha:[0.7,0]}, false, 1,'easeInBack');	
			await new Promise((resolve, reject) => setTimeout(resolve, 300));
		}
		
		this.receiving_move = 0;
		
	},
	
	receive_move : async function (move_data) {
		
		
		//if (my_data.name === "Мышь205" || opp_data.name === "Мышь205" || my_data.name === "debug100" || opp_data.name === "debug100")
		//	firebase.database().ref("TEST_ILONA").push([game_id, client_id, move_data,"REC",my_data.name, Date.now()]);	
		
		
		if (objects.big_message_cont.visible === true)
			return;
		
		//защита от двойного прихода
		if (my_turn === 1)
			return;
		
		
		
		let cell_id = move_data[0];
		let letter = move_data[1];
		let word_ids = move_data[2];		
		
		//защите от неправильного прихода
		if (objects.cells[cell_id].letter.text!=='') return;
		
		
		//воспроизводим уведомление о том что соперник произвел ход
		gres.receive_move.sound.play();
		
		opp_conf_play = 1;


		
		//вносим в поле новую букву
		objects.cells[cell_id].letter.text=letter;			
		
		//подсвечиваем новое слово
		this.show_new_word_anim(word_ids);

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
		objects.opp_letters_num.text = l[1];;
				
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

word_creation = {
	
	active_key : -1,
	word : [],
	new_cell : null,
	show_word_mode : 0,
	
	activate : async function (init_time) {		
		
		my_turn = 1;
		this.show_word_mode=0;	
		game.opponent.reset_timer(init_time);
		objects.word.text="";
		this.word=[];
		
		objects.timer.x = 205;
		
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.y,10]}, true, 2,'easeOutCubic');		
		anim2.add(objects.keys_cont,{y:[600,objects.keys_cont.sy]}, true, 2,'easeOutCubic');
		
	},
	
	stop : async function () {
		
		
	},
	
	key_down : function (key) {				
				
		if (objects.req_cont.visible === true) {
			gres.locked.sound.play();
			return;
		}
		
		
		sound.play('key_down');
		
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
		if (objects.big_message_cont.visible===true || objects.req_cont.visible === true) {
			gres.locked.sound.play();
			return;
		}
		
		if (my_turn === 0) {
			sound.play('locked');
			message.add("Не твоя очередь");
			return;
		}
		
		
		if (this.show_word_mode === 1) {
			

			if (this.word.length > 0) {
				
				if (this.word.includes(cell_id)===true) {		
					gres.bad_move.sound.play();
					message.add("Нельзя ходить по кругу")
					return;		
				}				
					
				if (objects.cells[cell_id].letter.text === "") {
					gres.bad_move.sound.play();
					message.add("Нужно выбрать следующую букву")		
					return;				
				}				
				
				let prv_cell = this.word[this.word.length-1];
				if (adj_cells[prv_cell].includes(cell_id) === false) {
					gres.bad_move.sound.play();
					message.add("Выберите смежную клетку")
					return;
				}				
			}

			if (objects.cells[cell_id].letter.text === "") {
				gres.bad_move.sound.play();
				message.add("Нужно выбрать букву с которой начнется слово")		
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
				
		if (this.active_key === -1) {
			message.add("Сначала поставьте новую букву на поле");
			gres.bad_move.sound.play();
			return;				
		}
		
		if (objects.cells[cell_id].letter.text !== "") {
			message.add("Букву нужно поставить на пустую клетку");
			gres.bad_move.sound.play();
			return;				
		}
		
		if (this.check_if_near_adj(cell_id) === false) {
			message.add("Букву нужно поставить рядом с имеющимися на поле");
			gres.bad_move.sound.play();
			return;				
		}
		

		
		gres.cell_down.sound.play();
		
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
	
	check_if_near_adj : function(cell_id) {		
		let adj_arr = adj_cells[cell_id];
		for (let i = 0 ; i < adj_arr.length ; i++){			
			if (objects.cells[adj_arr[i]].letter.text!=='')
				return true;
		}
		return false;
	},
	
	ok_down : async function () {		
		
	
		//если имеется какое-то сообщение
		if (objects.big_message_cont.visible===true || objects.req_cont.visible === true) {
			gres.locked.sound.play();
			return;
		}
				
		let _word = "";
		this.word.forEach(w=>{
			_word+=objects.cells[w].letter.text
		})
		
		if (this.word.length <2 ) {
			gres.bad_word.sound.play();
			message.add("Выделите клетки со словом по буквам");
			return;
		}
		
		if (_word === start_word) {
			this.cancel_down();
			gres.bad_word.sound.play();
			message.add("Главное слово нельзя выбирать");
			return;
		}		
		
		if (this.word.includes(this.new_cell) === false) {
			this.cancel_down();
			gres.bad_word.sound.play();
			message.add("Нужно использовать новую букву!");
			return;
		}
				
		if (game.words_hist.includes(_word) === true) {
			gres.bad_word.sound.play();
			this.cancel_down();
			message.add("Такое слово уже есть(")
			return;
		}
		
		if (rus_dict0.includes(_word) === false && rus_dict1.includes(_word) === false) {
			gres.bad_word.sound.play();
			this.cancel_down();
			message.add("Такого слова нету в словаре(")
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
		
		me_conf_play = 1;
				
		//считаем сколько букв во всех моих словах
		let l = game.get_letters_num();	
		objects.my_letters_num.text = l[0];
		
		
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

		sound.play('click');
		
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

game = {
	
	word_ids : [],
	words_hist : [],

	opponent : {},
	
	activate: function(role, opponent) {
				
		my_role=role;
		this.opponent = opponent;
	
		
		//отключаем клавиатуру и поле если они вдруг остались
		objects.cells_cont.visible=false;
		objects.cells_cont.y = -400;
		objects.keys_cont.visible=false;
		objects.word_cont.visible=false;
		objects.my_words.text="";
		objects.opp_words.text="";
		
		objects.desktop.texture = gres.desktop.texture;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.6,'linear');	
		
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
		
		//если открыт чат то закрываем его
		if (objects.chat_cont.visible===true)
			chat.close();
				
		//воспроизводим звук о начале игры
		gres.game_start.sound.play();
				
		//показываем карточки игроков		
		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;	
		objects.my_letters_num.text = "0";
		objects.opp_letters_num.text = "0";
		
		//показываем кнопку стоп
		objects.stop_game_button.visible=true;

		if (my_role==="master")
			word_creation.activate(45);
		else 
			word_waiting.activate(45);	

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
						
		//если отменяем игру то сначала предупреждение
		if (res === 'MY_CANCEL') {
			
			if (objects.req_cont.visible||objects.confirm_cont.visible||anim2.any_on()) {
				gres.locked.sound.play();
				return;			
			}
			
			let conf = await confirm_dialog.show("Уверены?");
			if (conf === 'no')
				return;			
		}

		//теперь уже можно принимать приглашения
		req_dialog.reject_all_game_val = 0;
		
		
		//убираем диалог
		if (objects.word_cont.visible === true)
			anim2.add(objects.word_cont,{y:[objects.word_cont.y,450]}, false, 0.5,'linear');
		
		//убираем клавиатуру если она есть
		if (objects.keys_cont.visible === true)
			anim2.add(objects.keys_cont,{y:[objects.keys_cont.sy,450]}, false, 1,'easeInOutCubic');
		
		//убираем клавиатуру чата если есть
		if (objects.feedback_cont.visible === true)
			feedback.close();
		
		
		//убираем окно подтверждения если оно есть
		if (objects.confirm_cont.visible === true)
			anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.y,450]}, false, 1,'easeInOutCubic');
		
		//сдвигаем поле в центр
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.y,objects.cells_cont.y+10]}, true, 0.5,'easeInOutCubic');
				
		//убираем если остались процессы
		some_process.wait_opponent_move = function(){};
		objects.wait_opponent_move.visible=false;
				
		//убираем кнопку стоп
		objects.stop_game_button.visible=false;
		
		
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
				
	}
}

rating = {
	
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

keep_alive = function() {
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	firebase.database().ref(room_name+"/"+my_data.uid).remove();
		return;		
	}

	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

process_new_message = function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		game_id=msg.game_id;
		start_word=msg.start_word;
		cards_menu.accepted_invite();
	}

	
	//принимаем также отрицательный ответ от соответствующего соперника
	if ( pending_player===msg.sender) {
		
		if (msg.message==="REJECT")
			cards_menu.rejected_invite('Соперник отказался от игры!');
		if (msg.message==="REJECT_ALL")
			cards_menu.rejected_invite('Соперник пока не принимает приглашения!');
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

			//получение сообщение об отмене игры
			if (msg.message==="OPP_CANCEL" )
				game.stop('OPP_CANCEL');
								
			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				word_waiting.receive_move(msg.data);
			
			//получение сообщение с ходом игорка
			if (msg.message==="CHAT")
				online_player.chat(msg.data);
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender === req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}
}

req_dialog = {
	
	_opp_data : {} ,
	reject_all_game_val : 0,
	
	show(uid) {	

		if (state === 'b' && req_dialog.reject_all_game_val === 1) {
			
			firebase.database().ref("inbox/"+uid).set({sender:my_data.uid,message:"REJECT_ALL",tm:Date.now()});
			return;
		}	
		

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
				anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.5,'easeOutElastic');

				//Отображаем  имя и фамилию в окне приглашения
				req_dialog._opp_data.name=player_data.name;
				make_text(objects.req_name,player_data.name,200);
				objects.req_rating.text=player_data.rating;
				req_dialog._opp_data.rating=player_data.rating;


				if (state === 'b') {			
					objects.req_ok_w.visible=false;	
					objects.req_deny_w.visible=false;					
					objects.req_ok.visible=true;	
					objects.req_deny.visible=true;		
					objects.req_deny_all_game.visible=true;				
				} else {
					objects.req_ok.visible=false;	
					objects.req_deny.visible=false;		
					objects.req_deny_all_game.visible=false;	
					objects.req_ok_w.visible=true;	
					objects.req_deny_w.visible=true;	
					
				}


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


		if (anim2.any_on()) {
			gres.locked.sound.play();
			return;			
		}
		
		gres.click.sound.play();

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');
		
		
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	reject_all_game: function() {

		if (objects.req_cont.ready===false)
			return;
		
		message.add("Приглашения отключены до конца игры");
		req_dialog.reject_all_game_val = 1;
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT_ALL",tm:Date.now()});
	},

	accept: function() {

		if (objects.big_message_cont.visible||objects.confirm_cont.visible|| anim2.any_on()) {
			gres.locked.sound.play();
			return;			
		}		
		
		gres.click.sound.play();

	
		//устанавливаем окончательные данные оппонента
		opp_data=req_dialog._opp_data;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 1,'easeInBack');

		//сразу определяем начальное слово и отправляем сопернику
		let d_size = rus_dict0.length;
		let w_len = 0;
		start_word = "";
		
		while(1) {
			
			let r_num = irnd(0,d_size-1);
			start_word = rus_dict0[r_num];
			let _wlen = start_word.length;
			if (_wlen === 5)
				break;			
		}		
				
		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*299);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),start_word:start_word,game_id:game_id});

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

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');
	}

}

show_ad = function(){
		
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

main_menu = {

	activate: function() {

		//просто добавляем контейнер с кнопками
		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.desktop.texture;
		anim2.add(objects.game_header,{y:[-180,objects.game_header.sy]}, true, 0.6,'easeOutCubic');	
		anim2.add(objects.main_buttons_cont,{y:[500,objects.main_buttons_cont.sy]}, true, 0.6,'easeOutCubic');	

	},

	close : function() {

		anim2.add(objects.game_header,{y:[objects.game_header.y,-380]}, false, 0.6,'easeOutCubic');	
		anim2.add(objects.main_buttons_cont,{y:[objects.main_buttons_cont.y,500]}, false, 0.6,'easeOutCubic');	
		objects.desktop.visible=false;

	},

	play_button_down: function () {

		if (anim2.any_on()) {
			gres.locked.sound.play();
			return
		};
		game_res.resources.click.sound.play();

		this.close();
		cards_menu.activate();

	},

	lb_button_down: function () {

		if (anim2.any_on()) {
			gres.locked.sound.play();
			return
		};

		gres.click.sound.play();

		this.close();
		lb.show();

	},

	chat_button_down: function () {


		if (anim2.any_on()) {
			gres.locked.sound.play();
			return
		};

		gres.click.sound.play();
		
		this.close();
		chat.activate();


	}

}

chat = {
	
	MESSAGE_HEIGHT : 75,
	last_record_end : 0,
	drag : false,
	data:[],
	touch_y:0,
	
	activate : function() {
		
		
		objects.desktop.visible=true;
		objects.desktop.pointerdown=this.down.bind(this);
		objects.desktop.pointerup=this.up.bind(this);
		objects.desktop.pointermove=this.move.bind(this);
		objects.desktop.interactive=true;
		
		this.last_record_end = 0;
		objects.chat_records_cont.y = objects.chat_records_cont.sy;
		
		for(let rec of objects.chat_records) {
			rec.visible = false;			
			rec.msg_id = -1;	
			rec.tm=0;
		}

		if (my_data.rating<-1430)
			objects.chat_enter_button.visible=false
		else
			objects.chat_enter_button.visible=true
		
		objects.chat_cont.visible = true;
		//подписываемся на чат
		//подписываемся на изменения состояний пользователей
		firebase.database().ref('chat2').orderByChild('tm').limitToLast(20).once('value', snapshot => {chat.chat_load(snapshot.val());});		
		firebase.database().ref('chat2').on('child_changed', snapshot => {chat.chat_updated(snapshot.val());});
	},
	
	down : function(e) {
		
		this.drag=true;
        this.touch_y = e.data.global.y / app.stage.scale.y;
	},
	
	up : function(e) {
		
		this.drag=false;
		
	},
	
	move : function(e) {
		
		if (this.drag === true) {
			
			let cur_y = e.data.global.y / app.stage.scale.y;
			let dy = this.touch_y - cur_y;
			if (dy!==0){
				
				objects.chat_records_cont.y-=dy;
				this.touch_y=cur_y;
				this.wheel_event(0);
			}
			
		}
		
	},
				
	get_oldest_record : function () {
		
		let oldest = objects.chat_records[0];
		
		for(let rec of objects.chat_records)
			if (rec.tm < oldest.tm)
				oldest = rec;			
		return oldest;

	},
	
	shuffle_array : function(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	},
	
	get_oldest_index : function () {
		
		let nums=Array.from(Array(50).keys());
		this.shuffle_array(nums);
		loop1:for (let num of nums){
			
			for(let rec of objects.chat_records)
				if (rec.visible===true && rec.msg_index===num)
					continue loop1;
			return num;
		}
		
		let oldest = {tm:9671801786406 ,visible:true};		
		for(let rec of objects.chat_records)
			if (rec.visible===true && rec.tm < oldest.tm)
				oldest = rec;	
		return oldest.msg_index;		
		
	},
		
	chat_load : async function(data) {
		
		if (data === null) return;
		
		//превращаем в массив
		data = Object.keys(data).map((key) => data[key]);
		
		//сортируем сообщения от старых к новым
		data.sort(function(a, b) {	return a.tm - b.tm;});
			
		//покаываем несколько последних сообщений
		for (let c of data)
			await this.chat_updated(c);	
	},	
		
	chat_updated : async function(data) {		
	
		if(data===undefined) return;
		
		//если это сообщение уже есть в чате
		var result = objects.chat_records.find(obj => {
		  return obj.msg_id === data.msg_id;
		})
		
		if (result !== undefined)		
			return;
		
		let rec = objects.chat_records[data.msg_index];
		
		//сразу заносим айди чтобы проверять
		rec.msg_id = data.msg_id;
		
		rec.y = this.last_record_end;
		
		await rec.set(data)		
		
		this.last_record_end += this.MESSAGE_HEIGHT;		
		
		
		await anim2.add(objects.chat_records_cont,{y:[objects.chat_records_cont.y,objects.chat_records_cont.y-this.MESSAGE_HEIGHT]}, true, 0.05,'linear');		
		
	},
	
	wheel_event : function(delta) {
		
		objects.chat_records_cont.y-=delta*this.MESSAGE_HEIGHT;	
		const chat_bottom = this.last_record_end;
		const chat_top = this.last_record_end - objects.chat_records.filter(obj => obj.visible === true).length*this.MESSAGE_HEIGHT;
		
		if (objects.chat_records_cont.y+chat_bottom<450)
			objects.chat_records_cont.y = 450-chat_bottom;
		
		if (objects.chat_records_cont.y+chat_top>0)
			objects.chat_records_cont.y=-chat_top;
		
	},
	
	close : function() {
		
		objects.desktop.interactive=false;
		objects.desktop.visible=false;
		objects.chat_cont.visible = false;
		firebase.database().ref('chat2').off();
		if (objects.feedback_cont.visible === true)
			feedback.close();
	},
	
	close_down : async function() {
		
		if (anim2.any_on()) {
			gres.locked.sound.play();
			return
		};
		game_res.resources.click.sound.play();
		
		this.close();
		main_menu.activate();
		
	},
	
	open_keyboard : async function() {
		
		//пишем отзыв и отправляем его		
		let fb = await feedback.show(opp_data.uid,65);		
		if (fb[0] === 'sent') {			
			const msg_index=this.get_oldest_index();
			await firebase.database().ref('chat2/'+msg_index).set({uid:my_data.uid,name:my_data.name,msg:fb[1], tm:firebase.database.ServerValue.TIMESTAMP, msg_id:irnd(0,9999999),rating:my_data.rating,msg_index:msg_index});
		}		
	}

	
}

feedback = {
		
	rus_keys : [[50,176,80,215.07,'1'],[90,176,120,215.07,'2'],[130,176,160,215.07,'3'],[170,176,200,215.07,'4'],[210,176,240,215.07,'5'],[250,176,280,215.07,'6'],[290,176,320,215.07,'7'],[330,176,360,215.07,'8'],[370,176,400,215.07,'9'],[410,176,440,215.07,'0'],[491,176,541,215.07,'<'],[70,224.9,100,263.97,'Й'],[110,224.9,140,263.97,'Ц'],[150,224.9,180,263.97,'У'],[190,224.9,220,263.97,'К'],[230,224.9,260,263.97,'Е'],[270,224.9,300,263.97,'Н'],[310,224.9,340,263.97,'Г'],[350,224.9,380,263.97,'Ш'],[390,224.9,420,263.97,'Щ'],[430,224.9,460,263.97,'З'],[470,224.9,500,263.97,'Х'],[510,224.9,540,263.97,'Ъ'],[90,273.7,120,312.77,'Ф'],[130,273.7,160,312.77,'Ы'],[170,273.7,200,312.77,'В'],[210,273.7,240,312.77,'А'],[250,273.7,280,312.77,'П'],[290,273.7,320,312.77,'Р'],[330,273.7,360,312.77,'О'],[370,273.7,400,312.77,'Л'],[410,273.7,440,312.77,'Д'],[450,273.7,480,312.77,'Ж'],[490,273.7,520,312.77,'Э'],[70,322.6,100,361.67,'!'],[110,322.6,140,361.67,'Я'],[150,322.6,180,361.67,'Ч'],[190,322.6,220,361.67,'С'],[230,322.6,260,361.67,'М'],[270,322.6,300,361.67,'И'],[310,322.6,340,361.67,'Т'],[350,322.6,380,361.67,'Ь'],[390,322.6,420,361.67,'Б'],[430,322.6,460,361.67,'Ю'],[511,322.6,541,361.67,')'],[451,176,481,215.07,'?'],[30,371.4,180,410.47,'ЗАКРЫТЬ'],[190,371.4,420,410.47,'_'],[430,371.4,570,410.47,'ОТПРАВИТЬ'],[531,273.7,561,312.77,','],[471,322.6,501,361.67,'('],[30,273.7,80,312.77,'EN']],	
	eng_keys : [[50,176,80,215.07,'1'],[90,176,120,215.07,'2'],[130,176,160,215.07,'3'],[170,176,200,215.07,'4'],[210,176,240,215.07,'5'],[250,176,280,215.07,'6'],[290,176,320,215.07,'7'],[330,176,360,215.07,'8'],[370,176,400,215.07,'9'],[410,176,440,215.07,'0'],[491,176,541,215.07,'<'],[110,224.9,140,263.97,'Q'],[150,224.9,180,263.97,'W'],[190,224.9,220,263.97,'E'],[230,224.9,260,263.97,'R'],[270,224.9,300,263.97,'T'],[310,224.9,340,263.97,'Y'],[350,224.9,380,263.97,'U'],[390,224.9,420,263.97,'I'],[430,224.9,460,263.97,'O'],[470,224.9,500,263.97,'P'],[130,273.7,160,312.77,'A'],[170,273.7,200,312.77,'S'],[210,273.7,240,312.77,'D'],[250,273.7,280,312.77,'F'],[290,273.7,320,312.77,'G'],[330,273.7,360,312.77,'H'],[370,273.7,400,312.77,'J'],[410,273.7,440,312.77,'K'],[450,273.7,480,312.77,'L'],[471,322.6,501,361.67,'('],[70,322.6,100,361.67,'!'],[150,322.6,180,361.67,'Z'],[190,322.6,220,361.67,'X'],[230,322.6,260,361.67,'C'],[270,322.6,300,361.67,'V'],[310,322.6,340,361.67,'B'],[350,322.6,380,361.67,'N'],[390,322.6,420,361.67,'M'],[511,322.6,541,361.67,')'],[451,176,481,215.07,'?'],[30,371.4,180,410.47,'CLOSE'],[190,371.4,420,410.47,'_'],[430,371.4,570,410.47,'SEND'],[531,273.7,561,312.77,','],[30,273.7,80,312.77,'RU']],
	keyboard_layout : [],
	lang : '',
	p_resolve : 0,
	MAX_SYMBOLS : 50,
	uid:0,
	
	show : function(uid,max_symbols) {
		
		if (max_symbols)
			this.MAX_SYMBOLS=max_symbols
		else
			this.MAX_SYMBOLS=50
		
		this.set_keyboard_layout(['RU','EN'][LANG]);
				
		this.uid = uid;
		objects.feedback_msg.text ='';
		objects.feedback_control.text = `0/${this.MAX_SYMBOLS}`
				
		anim2.add(objects.feedback_cont,{y:[-400, objects.feedback_cont.sy]}, true, 0.4,'easeOutBack');	
		return new Promise(function(resolve, reject){					
			feedback.p_resolve = resolve;	  		  
		});
		
	},
	
	set_keyboard_layout(lang) {
		
		this.lang = lang;
		
		if (lang === 'RU') {
			this.keyboard_layout = this.rus_keys;
			objects.feedback_bcg.texture = gres.feedback_bcg_rus.texture;
		} 
		
		if (lang === 'EN') {
			this.keyboard_layout = this.eng_keys;
			objects.feedback_bcg.texture = gres.feedback_bcg_eng.texture;
		}
		
	},
	
	close : function() {
			
		anim2.add(objects.feedback_cont,{y:[objects.feedback_cont.y,450]}, false, 0.4,'easeInBack');		
		
	},
	
	response_message:function(s) {

		
		objects.feedback_msg.text = s.name.text.split(' ')[0]+', ';	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${feedback.MAX_SYMBOLS}`		
		
	},
	
	get_texture_for_key (key) {
		
		if (key === '<' || key === 'EN' || key === 'RU') return gres.hl_key1.texture;
		if (key === 'ЗАКРЫТЬ' || key === 'ОТПРАВИТЬ' || key === 'SEND' || key === 'CLOSE') return gres.hl_key2.texture;
		if (key === '_') return gres.hl_key3.texture;
		return gres.hl_key0.texture;
	},
	
	key_down : function(key) {
		
		
		if (objects.feedback_cont.visible === false || objects.feedback_cont.ready === false) return;
		
		key = key.toUpperCase();
		
		if (key === 'ESCAPE') key = {'RU':'ЗАКРЫТЬ','EN':'CLOSE'}[this.lang];			
		if (key === 'ENTER') key = {'RU':'ОТПРАВИТЬ','EN':'SEND'}[this.lang];	
		if (key === 'BACKSPACE') key = '<';
		if (key === ' ') key = '_';
			
		var result = this.keyboard_layout.find(k => {
			return k[4] === key
		})
		
		if (result === undefined) return;
		this.pointerdown(null,result)
		
	},
	
	pointerdown : function(e, inp_key) {
		
		let key = -1;
		let key_x = 0;
		let key_y = 0;		
		
		if (e !== null) {
			
			let mx = e.data.global.x/app.stage.scale.x - objects.feedback_cont.x;
			let my = e.data.global.y/app.stage.scale.y - objects.feedback_cont.y;;

			let margin = 5;
			for (let k of this.keyboard_layout) {			
				if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin) {
					key = k[4];
					key_x = k[0];
					key_y = k[1];
					break;
				}
			}			
			
		} else {
			
			key = inp_key[4];
			key_x = inp_key[0];
			key_y = inp_key[1];			
		}
		
		
		
		//не нажата кнопка
		if (key === -1) return;			
				
		//подсвечиваем клавишу
		objects.hl_key.x = key_x - 10;
		objects.hl_key.y = key_y - 10;		
		objects.hl_key.texture = this.get_texture_for_key(key);
		anim2.add(objects.hl_key,{alpha:[1, 0]}, false, 0.5,'linear');
						
		if (key === '<') {
			objects.feedback_msg.text=objects.feedback_msg.text.slice(0, -1);
			key ='';
		}			
		
		
		if (key === 'EN' || key === 'RU') {
			this.set_keyboard_layout(key)
			return;	
		}	
		
		if (key === 'ЗАКРЫТЬ' || key === 'CLOSE') {
			this.close();
			this.p_resolve(['close','']);	
			key ='';
			sound.play('keypress');
			return;	
		}	
		
		if (key === 'ОТПРАВИТЬ' || key === 'SEND') {
			
			if (objects.feedback_msg.text === '') return;
			
			//если нашли ненормативную лексику то закрываем
			let mats =/шлю[хш]|п[еи]д[аеор]|суч?ка|г[ао]ндо|х[ую][ейяе]л?|жоп|соси|дроч|чмо|говн|дерьм|трах|секс|сосат|выеб|пизд|срал|уеб[аико]щ?|ебень?|ебу[ч]|ху[йия]|еба[нл]|дроч|еба[тш]|педик|[ъы]еба|ебну|ебл[аои]|ебись|сра[кч]|манда|еб[лн]я|ублюд|пис[юя]/i;		
			
			let text_no_spaces = objects.feedback_msg.text.replace(/ /g,'');
			if (text_no_spaces.match(mats)) {
				sound.play('locked');
				this.close();
				this.p_resolve(['close','']);	
				key ='';
				return;
			}
			
			this.close();
			this.p_resolve(['sent',objects.feedback_msg.text]);	
			key ='';
			sound.play('keypress');
			return;	
		}	
		
		
		
		if (objects.feedback_msg.text.length >= this.MAX_SYMBOLS)  {
			sound.play('locked');
			return;			
		}
		
		if (key === '_') {
			objects.feedback_msg.text += ' ';	
			key ='';
		}			
		

		sound.play('keypress');
		
		objects.feedback_msg.text += key;	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${this.MAX_SYMBOLS}`		
		
	}
	
}

lb = {

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

		if (anim2.any_on()) {
			gres.locked.sound.play();
			return
		};


		gres.click.sound.play();
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

cards_menu = {

	_opp_data : {},
	uid_pic_url_cache : {},
	room_name_num:'',
	
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
		
		//нормальное название комнаты
		this.room_name_num={'states':1,'states2':2,'states3':3,'states4':4,'states5':5}[room_name];

		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name).on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});

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

		objects.players_online.text='Игроков онлайн: ' + num + '   ( комната #' +this.room_name_num +' )';
		
		
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > 14) {
			let num_of_tables_cut = num_of_tables - (num_of_cards - 14);			
			
			let num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			let t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		
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

	get_state_texture: function(s) {

		switch(s) {

			case 'o':
				return gres.mini_player_card_online.texture;
			break;

			case 'b':
				return gres.mini_player_card_playing_bot.texture;
			break;

			case 'p':
				return gres.mini_player_card_playing.texture;
			break;			
			
		}
	},

	place_table : function (params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400}) {
				
		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "table";
				
				
				objects.mini_cards[i].bcg.texture = gres.mini_player_card_table.texture;
				
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
		objects.mini_cards[params.id].bcg.texure=this.get_state_texture(params.state);
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
				objects.mini_cards[i].bcg.texture = this.get_state_texture(params.state);
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

		objects.mini_cards[0].bcg.texture=gres.mini_player_card_bot.texture;
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
			gres.locked.sound.play();
			return
		};


		gres.click.sound.play();
		
		anim2.add(objects.td_cont,{y:[-150,objects.td_cont.sy]}, true, 0.5,'easeOutBack');
		
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
		
		gres.close_it.sound.play();
		
		anim2.add(objects.td_cont,{y:[objects.td_cont.sy,400,]}, false, 0.5,'easeInBack');
		
	},

	show_invite_dialog: function(cart_id) {


		if (objects.invite_cont.ready === false || objects.invite_cont.visible === true || 	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			game_res.resources.locked.sound.play();
			return
		};


		pending_player="";

		gres.click.sound.play();

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
		firebase.database().ref(room_name).off();

	},

	hide_invite_dialog: function() {

		if (objects.invite_cont.ready === false)
			return;
		
		gres.close_it.sound.play();

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=="") {
			firebase.database().ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player="";
		}

		anim2.add(objects.invite_cont,{y:[objects.invite_cont.sy,400]}, false, 0.5,'easeInBack');
	},

	send_invite: function() {


		if (objects.invite_cont.ready === false || pending_player !=='' ||	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			gres.locked.sound.play();
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
			gres.click.sound.play();
			objects.invite_button.texture=game_res.resources.wait_response.texture;
			firebase.database().ref("inbox/"+cards_menu._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=cards_menu._opp_data.uid;
		}



	},

	rejected_invite: function(rej_text) {

		pending_player="";
		cards_menu._opp_data={};
		this.hide_invite_dialog();
		big_message.show(rej_text,'(((');

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

		if (objects.td_cont.visible|| objects.big_message_cont.visible||objects.req_cont.visible||objects.invite_cont.visible||anim2.any_on())	{
			gres.locked.sound.play();
			return
		};



		gres.close_it.sound.play();

		this.close();
		main_menu.activate();

	}

}

auth = function() {
	
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

			get_random_name : function(e_str) {
				
				let rnd_names = ['Gamma','Жираф','Зебра','Тигр','Ослик','Мамонт','Волк','Лиса','Мышь','Сова','Hot','Енот','Кролик','Бизон','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
				let chars = '+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
				if (e_str !== undefined) {
					
					let e_num1 = chars.indexOf(e_str[0]) + chars.indexOf(e_str[1]) + chars.indexOf(e_str[2]) +	chars.indexOf(e_str[3]);
					e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);					
					let e_num2 = chars.indexOf(e_str[4]).toString()  + chars.indexOf(e_str[5]).toString()  + chars.indexOf(e_str[6]).toString() ;	
					e_num2 = e_num2.substring(0, 3);
					return rnd_names[e_num1] + e_num2;					
					
				} else {

					let rnd_num = irnd(0, rnd_names.length - 1);
					let rand_uid = irnd(0, 999999)+ 100;
					let name_postfix = rand_uid.toString().substring(0, 3);
					let name =	rnd_names[rnd_num] + name_postfix;				
					return name;
				}							

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

						//если нет данных то создаем их
						if (my_data.name=="" || my_data.name=='')
							my_data.name = help_obj.get_random_name(my_data.uid);


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
				let local_uid = null;
				try {
					local_uid = localStorage.getItem('uid');
				} catch (e) {
					console.log(e);
				}

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");
					let rand_uid=Math.floor(Math.random() * 9999999);
					my_data.rating 		= 	1400;
					my_data.uid			=	"ls"+rand_uid;
					my_data.name 		=	 help_obj.get_random_name(my_data.uid);					
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';


					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
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

	firebase.database().ref(room_name+"/"+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

}

function vis_change() {

	if (document.hidden === true)
		hidden_state_start = Date.now();
	
	set_state({hidden : document.hidden});
	
		
}

async function load_user_data() {
	
	try {
		
		//анимация лупы
		some_process.loup_anim=function() {
			objects.id_loup.x=20*Math.sin(game_tick*8)+90;
			objects.id_loup.y=20*Math.cos(game_tick*8)+150;
		}
	
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

		


		//номер комнаты в зависимости от рейтинга игрока
		if (my_data.rating <= 1405)
			room_name= 'states';			
		if (my_data.rating >= 1406 && my_data.rating <=1479)
			room_name= 'states2';	
		if (my_data.rating >= 1480 && my_data.rating <=1580)
			room_name= 'states3';	
		if (my_data.rating >= 1581)
			room_name= 'states4';
		//room_name= 'states5';
		
		
		//устанавливаем рейтинг в попап
		objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

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
		firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

		//это событие когда меняется видимость приложения
		document.addEventListener("visibilitychange", vis_change);

		//keep-alive сервис
		setInterval(function()	{keep_alive()}, 40000);


		
		//ждем и убираем попап
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		
		//убираем лупу
		some_process.loup_anim = function(){};		
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

	//создаем приложение
	app.stage = new PIXI.Container();
	app.renderer = new PIXI.Renderer({width:M_WIDTH, height:M_HEIGHT,antialias:true});
	document.body.appendChild(app.renderer.view).style["boxShadow"] = "0 0 15px #000000";
	document.body.style.backgroundColor = 'rgb(62,52,62)';

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
	
	//идентификатор клиента
	client_id = irnd(10,999999);
	
	//запускаем главный цикл так как уже надо обрабатывать
	main_loop();
	
	//загружаем данные об игроке
	await load_user_data();
	
	//контроль за присутсвием
	var connected_control = firebase.database().ref(".info/connected");
	connected_control.on("value", (snap) => {
	  if (snap.val() === true) {
		connected = 1;
	  } else {
		connected = 0;
	  }
	});
		
	window.addEventListener("wheel", (event) => {chat.wheel_event(Math.sign(event.deltaY))});	
	window.addEventListener('keydown', function(event) { feedback.key_down(event.key)});
		
		
	//показыаем основное меню
	main_menu.activate();
	
	
	//заполняем клавиатуру
	for (let i = 0 ; i < 33 ; i ++)
		objects.keys[i].letter.text = rus_let[i];
		
	console.clear()


}

async function load_resources() {


	
	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/


	let git_src="https://akukamil.github.io/balda/"
	//git_src=""


	game_res=new PIXI.Loader();
	game_res.add('balsamic_bold', git_src+'fonts/balsamic_bold/font.fnt');
	game_res.add('balsamic', git_src+'fonts/balsamic/font.fnt');
	
	game_res.add('click',git_src+'/sounds/click.mp3');
	game_res.add('locked',git_src+'/sounds/locked.mp3');
	game_res.add('clock',git_src+'/sounds/clock.mp3');
	game_res.add('close_it',git_src+'/sounds/close_it.mp3');
	game_res.add('game_start',git_src+'/sounds/game_start.mp3');
	game_res.add('lose',git_src+'/sounds/lose.mp3');
	game_res.add('receive_move',git_src+'/sounds/receive_move.mp3');
	game_res.add('bad_word',git_src+'/sounds/bad_word.mp3');
	game_res.add('good_word',git_src+'/sounds/good_word.mp3');
	game_res.add('key_down',git_src+'/sounds/key_down.mp3');
	game_res.add('cell_down',git_src+'/sounds/cell_down.mp3');
	game_res.add('cell_move',git_src+'/sounds/cell_move.mp3');
	game_res.add('bad_move',git_src+'/sounds/bad_move.mp3');
	game_res.add('win',git_src+'/sounds/win.mp3');
	game_res.add('invite',git_src+'/sounds/invite.mp3');
	game_res.add('draw',git_src+'/sounds/draw.mp3');
	game_res.add('keypress',git_src+'/sounds/keypress.mp3');
	game_res.add('online_message',git_src+'/sounds/online_message.mp3');
	
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+"res/RUS/" + load_list[i].name + "." +  load_list[i].image_format);		


	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	

	
	await new Promise((resolve, reject)=> game_res.load(resolve))

}

function main_loop() {


	game_tick+=0.016666666;
	anim2.process();
	
	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();


	app.renderer.render(app.stage);	
	requestAnimationFrame(main_loop);
}
