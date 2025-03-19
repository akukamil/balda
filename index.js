var M_WIDTH=800, M_HEIGHT=450;
var app ={stage:{},renderer:{}}, assets={},fbs, objects={}, state='',git_src, my_role='', game_tick=0, my_turn=0, game_id=0, start_word='БАЛДА', me_conf_play=0,opp_conf_play=0, client_id =0, h_state=0, game_platform='', room_name = '', connected = 1,no_invite=false, pending_player='', my_data={opp_id : ''},opp_data={}, some_process = {},game_name='balda';
const rus_let = ['А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я'];
const rus_let2 = ['А','Б','В','Г','Д','Е','Ж','З','И','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я'];
const adj_cells = {0:[1,5],1:[0,6,2],2:[1,7,3],3:[2,8,4],4:[3,9],5:[0,6,10],6:[1,5,7,11],7:[2,6,8,12],8:[3,7,9,13],9:[4,8,14],10:[5,11,15],11:[6,10,12,16],12:[7,11,13,17],13:[8,12,14,18],14:[9,13,19],15:[10,16,20],16:[11,15,17,21],17:[12,16,18,22],18:[13,17,19,23],19:[14,18,24],20:[15,21],21:[16,20,22],22:[17,21,23],23:[18,22,24],24:[19,23]};
const LANG=0;

fbs_once=async function(path){
	const info=await fbs.ref(path).get();
	return info.val();	
}

irnd = function (min,max) {	
	//мин и макс включительно
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rgb_to_hex = (r,g,b) => '0x' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = 'single';
		this.x=x;
		this.y=y;
		
		
		this.bcg=new PIXI.Sprite(assets.mini_player_card);
		this.bcg.width=200;
		this.bcg.height=90;
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){lobby.card_down(id)};
		
		this.table_rating_hl=new PIXI.Sprite(assets.table_rating_hl);
		this.table_rating_hl.width=200;
		this.table_rating_hl.height=90;
		
		this.avatar=new PIXI.Graphics();
		this.avatar.x=16;
		this.avatar.y=16;
		this.avatar.w=this.avatar.h=58.2;
		
		this.avatar_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar_frame.x=16-11.64;
		this.avatar_frame.y=16-11.64;
		this.avatar_frame.width=this.avatar_frame.height=81.48;
				
		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 22,align: 'center'});
		this.name_text.anchor.set(1,0);
		this.name_text.x=180;
		this.name_text.y=20;
		this.name_text.tint=0xffffff;		

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 29,align: 'center'});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(1,0.5);
		this.rating_text.x=185;
		this.rating_text.y=65;		
		this.rating_text.tint=0xffff00;

		//аватар первого игрока
		this.avatar1=new PIXI.Graphics();
		this.avatar1.x=19;
		this.avatar1.y=16;
		this.avatar1.w=this.avatar1.h=58.2;
		
		this.avatar1_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar1_frame.x=this.avatar1.x-11.64;
		this.avatar1_frame.y=this.avatar1.y-11.64;
		this.avatar1_frame.width=this.avatar1_frame.height=81.48;



		//аватар второго игрока
		this.avatar2=new PIXI.Graphics();
		this.avatar2.x=121;
		this.avatar2.y=16;
		this.avatar2.w=this.avatar2.h=58.2;
		
		this.avatar2_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar2_frame.x=this.avatar2.x-11.64;
		this.avatar2_frame.y=this.avatar2.y-11.64;
		this.avatar2_frame.width=this.avatar2_frame.height=81.48;
		
		
		this.rating_text1=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=48.1;
		this.rating_text1.y=56;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150.1;
		this.rating_text2.y=56;		
		
		this.t_country=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.t_country.tint=0xffff00;
		this.t_country.anchor.set(1,0.5);
		this.t_country.x=100;
		this.t_country.y=60;		
		this.t_country.tint=0xaaaa99;
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar,this.avatar_frame,this.avatar1, this.avatar1_frame, this.avatar2,this.avatar2_frame,this.rating_text,this.table_rating_hl,this.rating_text1,this.rating_text2, this.name_text,this.t_country);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(assets.lb_player_card_bcg);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=18;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=12;
		this.avatar.width=this.avatar.height=47;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=19;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 32,align: 'center'});
		this.rating.x=300;
		this.rating.tint=rgb_to_hex(255,242,204);
		this.rating.y=18;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class cells_class extends PIXI.Container {
		
	constructor(x,y,id) {
		super();

		this.id = id;
		this.x=x;
		this.y=y;

		this.bcg=new PIXI.Sprite(assets.big_letter_image);
		this.bcg.interactive=true;
		this.bcg.buttonMode = true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width=this.bcg.height=60;
		
		this.bcg2=new PIXI.Sprite(assets.big_letter_image_h);
		this.bcg2.visible = false;
		this.bcg2.width=this.bcg2.height=60;
		
		this.bcg3=new PIXI.Sprite(assets.big_letter_image_h2);
		this.bcg3.visible = false;
		this.bcg3.width=this.bcg3.height=60;

		this.letter=new PIXI.BitmapText('', {fontName: 'exosoft_bold_128',fontSize: 58});
		this.letter.tint=objects.cell_color;
		this.letter.anchor.set(0.5,0.5);
		this.letter.x=30;
		this.letter.y=31;
		
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

		this.bcg=new PIXI.Sprite(assets.key_image);
		this.bcg.width=40;
		this.bcg.height=40;
		this.bcg.interactive=true;
		this.bcg.buttonMode = true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width=this.bcg.height=50;
		

		this.letter=new PIXI.BitmapText("", {fontName: 'exosoft_bold_64',fontSize: 35});
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
		this.index=0;
		this.uid='';	

		
		this.avatar = new PIXI.Graphics();
		this.avatar.w=50;
		this.avatar.h=50;
		this.avatar.x=30;
		this.avatar.y=13;		
				
		this.avatar_bcg = new PIXI.Sprite(assets.chat_avatar_bcg_img);
		this.avatar_bcg.width=70;
		this.avatar_bcg.height=70;
		this.avatar_bcg.x=this.avatar.x-10;
		this.avatar_bcg.y=this.avatar.y-10;
		this.avatar_bcg.interactive=true;
		this.avatar_bcg.pointerdown=()=>chat.avatar_down(this);		
					
		this.avatar_frame = new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar_frame.width=70;
		this.avatar_frame.height=70;
		this.avatar_frame.x=this.avatar.x-10;
		this.avatar_frame.y=this.avatar.y-10;
		
		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 17});
		this.name.anchor.set(0,0.5);
		this.name.x=this.avatar.x+72;
		this.name.y=this.avatar.y-1;	
		this.name.tint=0xFBE5D6;
		
		this.gif=new PIXI.Sprite();
		this.gif.x=this.avatar.x+65;	
		this.gif.y=22;
		
		this.gif_bcg=new PIXI.Graphics();
		this.gif_bcg.beginFill(0x111111)
		this.gif_bcg.drawRect(0,0,1,1);
		this.gif_bcg.x=this.gif.x+3;	
		this.gif_bcg.y=this.gif.y+3;
		this.gif_bcg.alpha=0.5;
		
		
				
		this.msg_bcg = new PIXI.NineSlicePlane(assets.msg_bcg,50,18,50,28);
		//this.msg_bcg.width=160;
		//this.msg_bcg.height=65;	
		this.msg_bcg.scale_xy=0.66666;		
		this.msg_bcg.x=this.avatar.x+45;	
		this.msg_bcg.y=this.avatar.y+2;
		
		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 19,lineSpacing:55,align: 'left'}); 
		this.msg.x=this.avatar.x+75;
		this.msg.y=this.avatar.y+30;
		this.msg.maxWidth=450;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = 0xffffff;
		
		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'mfont',fontSize: 15}); 		
		this.msg_tm.tint=0xffffff;
		this.msg_tm.alpha=0.6;
		this.msg_tm.anchor.set(1,0);
		
		this.visible = false;
		this.addChild(this.msg_bcg,this.gif_bcg,this.gif,this.avatar_bcg,this.avatar,this.avatar_frame,this.name,this.msg,this.msg_tm);
		
	}
		
	nameToColor(name) {
		  // Create a hash from the name
		  let hash = 0;
		  for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
			hash = hash & hash; // Convert to 32bit integer
		  }

		  // Generate a color from the hash
		  let color = ((hash >> 24) & 0xFF).toString(16) +
					  ((hash >> 16) & 0xFF).toString(16) +
					  ((hash >> 8) & 0xFF).toString(16) +
					  (hash & 0xFF).toString(16);

		  // Ensure the color is 6 characters long
		  color = ('000000' + color).slice(-6);

		  // Convert the hex color to an RGB value
		  let r = parseInt(color.slice(0, 2), 16);
		  let g = parseInt(color.slice(2, 4), 16);
		  let b = parseInt(color.slice(4, 6), 16);

		  // Ensure the color is bright enough for a black background
		  // by normalizing the brightness.
		  if ((r * 0.299 + g * 0.587 + b * 0.114) < 128) {
			r = Math.min(r + 128, 255);
			g = Math.min(g + 128, 255);
			b = Math.min(b + 128, 255);
		  }

		  return (r << 16) + (g << 8) + b;
	}
		
	async update_avatar(uid, tar_sprite) {		
	
		//определяем pic_url
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);
		tar_sprite.set_texture(players_cache.players[uid].texture);	
	}
	
	async set(msg_data) {
						
		//получаем pic_url из фб
		this.avatar.set_texture(PIXI.Texture.WHITE);
				
		await this.update_avatar(msg_data.uid, this.avatar);

		this.uid=msg_data.uid;
		this.tm = msg_data.tm;			
		this.index = msg_data.index;		
		
		this.name.set2(msg_data.name,150);
		this.name.tint=this.nameToColor(msg_data.name);
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		this.msg.text=msg_data.msg;
		this.visible = true;
		
		if (msg_data.msg.startsWith('GIF')){			
			
			const mp4BaseT=await new Promise((resolve, reject)=>{
				const baseTexture = PIXI.BaseTexture.from('https://akukamil.github.io/common/gifs/'+msg_data.msg+'.mp4');
				if (baseTexture.width>1) resolve(baseTexture);
				baseTexture.on('loaded', () => resolve(baseTexture));
				baseTexture.on('error', (error) => resolve(null));
			});
			
			if (!mp4BaseT) {
				this.visible=false;
				return 0;
			}
			
			mp4BaseT.resource.source.play();
			mp4BaseT.resource.source.loop=true;
			
			this.gif.texture=PIXI.Texture.from(mp4BaseT);
			this.gif.visible=true;	
			const aspect_ratio=mp4BaseT.width/mp4BaseT.height;
			this.gif.height=90;
			this.gif.width=this.gif.height*aspect_ratio;
			this.msg_bcg.visible=false;
			this.msg.visible=false;
			this.msg_tm.anchor.set(0,0);
			this.msg_tm.y=this.gif.height+9;
			this.msg_tm.x=this.gif.width+102;
			
			this.gif_bcg.visible=true;
			this.gif_bcg.height=this.gif.height;
			this.gif_bcg.width=	this.gif.width;
			return this.gif.height+30;
			
		}else{
			
			this.gif_bcg.visible=false;
			this.gif.visible=false;	
			this.msg_bcg.visible=true;
			this.msg.visible=true;
			
			//бэкграунд сообщения в зависимости от длины
			const msg_bcg_width=Math.max(this.msg.width,100)+100;			
			this.msg_bcg.width=msg_bcg_width*1.5;				
					
			if (msg_bcg_width>300){
				this.msg_tm.anchor.set(1,0);
				this.msg_tm.y=this.avatar.y+52;
				this.msg_tm.x=msg_bcg_width+55;
			}else{
				this.msg_tm.anchor.set(0,0);
				this.msg_tm.y=this.avatar.y+37;
				this.msg_tm.x=msg_bcg_width+62;
			}	
			
			return 70;
		}		
	}		

}

anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0, visible:false, ready:true, alpha:0},
		
	slot: Array(30).fill(null),
		
	
	any_on() {		
		for (let s of this.slot)
			if (s !== null&&s.block)
				return true
		return false;			
	},
	
	linear(x) {
		return x
	},
	
	kill_anim(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj){
					this.slot[i].p_resolve('finished');		
					this.slot[i].obj.ready=true;					
					this.slot[i]=null;	
				}
	
	},
	
	flick(x){
		
		return Math.abs(Math.sin(x*6.5*3.141593));
		
	},
	
	easeBridge(x){
		
		if(x<0.1)
			return x*10;
		if(x>0.9)
			return (1-x)*10;
		return 1		
	},
	
	ease3peaks(x){

		if (x < 0.16666) {
			return x / 0.16666;
		} else if (x < 0.33326) {
			return 1-(x - 0.16666) / 0.16666;
		} else if (x < 0.49986) {
			return (x - 0.3326) / 0.16666;
		} else if (x < 0.66646) {
			return 1-(x - 0.49986) / 0.16666;
		} else if (x < 0.83306) {
			return (x - 0.6649) / 0.16666;
		} else if (x >= 0.83306) {
			return 1-(x - 0.83306) / 0.16666;
		}		
	},
	
	easeTwiceBlink(x){
		
		if(x<0.333)
			return 1;
		if(x>0.666)
			return 1;
		return 0		
	},
		
	easeOutBack(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutBack2(x) {
		return -5.875*Math.pow(x, 2)+6.875*x;
	},
	
	easeOutElastic(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad(x) {
		return x * x;
	},
	
	easeOutBounce(x) {
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
	
	easeInCubic(x) {
		return x * x * x;
	},
	
	ease2back(x) {
		return Math.sin(x*Math.PI);
	},
	
	easeInOutCubic(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	shake(x) {
		
		return Math.sin(x*2 * Math.PI);	
		
	},	
	
	add (obj, params, vis_on_end, time, func, block=true) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);

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
				if (func === 'ease2back' || func === 'shake' || func === 'ease3peaks')
					for (let key in params)
						params[key][1]=params[key][0];				
					
				this.slot[i] = {
					obj,
					block,
					params,
					vis_on_end,
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
		
	process() {
		
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
		
	},
	
	async wait(time) {
		
		await this.add(this.empty_spr,{x:[0, 1]}, false, time,'linear');	
		
	}
}

sound = {
	
	on : 1,
	
	play(snd_res) {
		
		if (this.on === 0)
			return;
		
		if (!assets[snd_res])
			return;
		
		assets[snd_res].play();	
		
	},
	
	switch(){
		
		if (this.on){
			this.on=0;
			objects.pref_info.text=['Звуки отключены','Sounds is off'][LANG];
			
		} else{
			this.on=1;
			objects.pref_info.text=['Звуки включены','Sounds is on'][LANG];
		}
		anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);		
		
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

big_message = {
	
	p_resolve : 0,
		
	show(t1,t2) {
				
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

	close() {
		
		if (objects.big_message_cont.ready===false){
			sound.play('locked');
			return;			
		}


		sound.play('close_it');
		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

confirm_dialog = {
	
	p_resolve : 0,
		
	show(msg) {
				
				
		if (objects.confirm_cont.visible === true) {
			sound.play('locked');
			return;			
		}		
				
		objects.confirm_msg.text=msg;
		
		sound.play('bad_move');
		anim2.add(objects.confirm_cont,{y:[450,objects.confirm_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			confirm_dialog.p_resolve = resolve;	  		  
		});
	},
	
	btn_down(res) {
		
		if (objects.confirm_cont.ready===false){
			sound.play('locked');
			return;			
		}

		sound.play('click');
		anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve(res);	
		
	}

}

online_player = {
		
	timer : 0,
	time_t : 0,
	control_time : 0,
	disconnect_time : 0,
	start_time : 0,
	chat_out:1,
	chat_in:1,
	
	send_move  (move_data) {
		

		//отправляем ход сопернику
		fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:move_data});
		
		//if (my_data.name === "Мышь205" || opp_data.name === "Мышь205" || my_data.name === "debug100" || opp_data.name === "debug100")
		//	fbs.ref("TEST_ILONA").push([game_id, client_id, move_data,"SEND",my_data.name, Date.now()]);	
		
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
		fbs.ref('players/'+my_data.uid+'/rating').set(lose_rating);	
		
		objects.no_chat_btn.visible=true;
		objects.send_message_btn.visible=true;
		objects.stop_game_btn.visible=true;
		
		//возможность чата
		this.chat_out=1;
		this.chat_in=1;
		objects.no_chat_btn.alpha=1;
		objects.send_message_btn.alpha=1;
		
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
			sound.play('clock');
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
			sound.play('draw');
			int_res=0;
		}
		if (res === 'MY_WIN' || res === 'OPP_NO_TIME' || res === 'OPP_CANCEL') {
			my_data.rating = Math.round(my_data.rating + 16 * (1 - Ea));
			sound.play('win');
			int_res=1;
			
		}
		if (res === 'MY_LOSE' || res === 'MY_NO_TIME' || res === 'MY_CANCEL' || res === 'MY_NO_CONNECTION') {
			my_data.rating = Math.round(my_data.rating + 16 * (0 - Ea));
			sound.play('lose');
			int_res=-1;
		}
		
		objects.my_card_rating.text = my_data.rating;
		fbs.ref("players/"+my_data.uid+"/rating").set(my_data.rating);	
		fbs.ref(room_name+"/"+my_data.uid+"/rating").set(my_data.rating);	
		
		
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
			fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"OPP_CANCEL",tm:Date.now()});
		}


		objects.game_buttons_cont.visible=false;
		//записываем в историю партий
		if (res !== 'NO_CONNECTION') {
			
			
			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			
			fbs.ref("finishes/"+game_id + my_role).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':res,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
			my_data.games++;
			fbs.ref("players/"+my_data.uid+"/games").set(my_data.games);	
			
		}
		
		await big_message.show(res_s,"Рейтинг: " + old_rating + ' > ' + my_data.rating);
	
	},
	
	async send_message_down(){
		
		if(anim2.any_on()||!this.chat_out){			
			sound.play('locked');
			return;			
		}

		sound.play('click');
		const msg = await keyboard.read();
		
		if (msg) fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"CHAT",tm:Date.now(),data:msg});	
		
	},
	
	chat(data) {		
		if (!this.chat_in) return;
		sound.play('online_message');
		message.add(data, 10000);
	},
	
	disable_chat(){		
		if (!this.chat_in) return;		
		this.chat_in=0;
		objects.no_chat_btn.alpha=0.3;
		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'NOCHAT',tm:Date.now()});
		message.add('Вы отключили чат');
	},
	
	nochat(){
		
		this.chat_out=0;
		objects.send_message_btn.alpha=0.3;
		message.add('Соперник отключил чат');
	},

};

bot_player = {
	
	true_rating : 0,	
	timer : 0,
	found_data : {},
	found_words : [],
	time_t : 0,
	search_start_time : 0,
		
	async send_move() {

		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
				
		//начинаем поиск слова
		this.found_words = [];
		this.found_data = {};
		this.search_start_time = Date.now();
		some_process.bot_search_word = this.process.bind(this);

	},
	
	init() {
		
		set_state({state : 'b'});
		
		//выбираем случайным образом стартовое слово
		let d_size = dict0.length;
		while(1) {
			
			let r_num = irnd(0,d_size-1);
			start_word = dict0[r_num];
			let _wlen = start_word.length;
			if (_wlen === 5)
				break;			
		}
		
		//отключаем таймер...........................
		objects.timer.visible=false;
			
		objects.no_chat_btn.visible=false;
		objects.send_message_btn.visible=false;
		objects.stop_game_btn.visible=true;
	
	},
	
	get_adj_cells(field) {
		
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
	
	make_move(field, acc_word, acc_pos) {
		
		
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
		
	search_surrogate_match(dir_sur, inv_sur, new_letter_cell_id, acc_pos) {
		
		
		//длина суррогата
		let sur_len = dir_sur.length;		
	
		
		for (let word of dict0) {
			
			if (word.length !== sur_len + 1 || word === start_word || this.found_words.includes(word) === true || game.words_hist.includes(word) === true)
				continue;
				
				
			//убираем первую букву для проверки прямого суррогата
			let dir_surrogated_word = word.substring(1, sur_len + 1);			
			if (dir_surrogated_word === dir_sur) {				
				this.found_words.push(word);
				//console.log("Совп. прямого суррогата ", word);	
				this.found_data[word.length]=[new_letter_cell_id, word[0], acc_pos.slice()];	
			}
			
				
			//убираем первую букву для проверки обратного суррогата
			let inv_surrogated_word = word.substring(0, sur_len);			
			if (inv_surrogated_word === inv_sur) {
				this.found_words.push(word);
				//console.log("Совп. обратного суррогата ", word);
				this.found_data[word.length]=[new_letter_cell_id, word[word.length - 1], acc_pos.slice().reverse()];	
			}		

		};		
		
	},
	
	search_word() {
		
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
		
		if ( this.found_words.includes(acc_word[0]) !== true && game.words_hist.includes(acc_word[0]) !== true && dict0.includes(acc_word[0])=== true) {
			this.found_data[acc_word[0].length]=[new_letter_cell_id, new_letter, acc_pos.slice()];		
			this.found_words.push(acc_word[0]);	
			console.log('Совпадение #4 ',acc_word[0] )
		}
		
		//если 4 буквы проверяем еще 3 буквы
		if (acc_word[0].length === 4) {			
			let acc_word3 = acc_word[0].substring(0, 3);	
			acc_pos.pop();				
			if ( this.found_words.includes(acc_word3) !== true && game.words_hist.includes(acc_word3) !== true && dict0.includes(acc_word3)=== true) {
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
		
	read_random_word(field, start_cell) {
		
		
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
	
	read_random_word4(field, letters_pos) {
						
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
			
	async stop(res) {
		
		some_process.bot_search_word = function(){};
		
		
		
		if (res === 'DRAW')
			sound.play('draw');
		
		if (res === 'MY_LOSE' || res === 'MY_CANCEL')
			sound.play('lose');	
		
				
		
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
		
			sound.play('win');		

			if (my_data.rating > 1500) {
				
				res_s[1]=")))"
				
			} else {
				
				my_data.rating = my_data.rating + 1;			
				fbs.ref("players/"+my_data.uid+"/rating").set(my_data.rating);	
				fbs.ref(room_name+"/"+my_data.uid+"/rating").set(my_data.rating);					
			}
		}				

		objects.my_card_rating.text = my_data.rating;
		
		await big_message.show(res_s[0], res_s[1]);
	
	},
	
	reset_timer() {
		
		
	},
	
	process() {
		
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
	
	async activate(init_time) {		
						
		my_turn = 0;
		
		objects.timer.x = 595;
		game.opponent.reset_timer(init_time);
		
		//процесс ожидания
		some_process.wait_opponent_move = this.process;
		objects.wait_opponent_move.visible=true;
				
		//сдвигаем поле в центр
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.y,75]}, true, 0.5,'easeInOutCubic');
		
		//показываем баннер пока игрок думает
		if(game_platform==='VK') ad.show_vk_banner();
	},
	
	async show_new_word_anim(word_ids) {
		
		this.receiving_move = 1;
		
		for (let i =0 ; i < word_ids.length ; i++){
			anim2.add(objects.cells[word_ids[i]].bcg3,{alpha:[0.7,0]}, false, 1,'easeInBack');	
			await new Promise((resolve, reject) => setTimeout(resolve, 300));
		}
		
		this.receiving_move = 0;
		
	},
	
	async receive_move(move_data) {
		
		if (objects.big_message_cont.visible === true)
			return;
		
		//защита от двойного прихода
		if (my_turn === 1)
			return;		
		
		const cell_id = move_data[0];
		const letter = move_data[1];
		const word_ids = move_data[2];		
		
		//защите от неправильного прихода
		if (objects.cells[cell_id].letter.text!=='') return;
				
		//воспроизводим уведомление о том что соперник произвел ход
		sound.play('receive_move');
		
		//показываем что теперь счет справедливый
		const tar_alpha=my_role==='master'?1:0.2;
		objects.opp_letters_num.alpha=tar_alpha;
		objects.my_letters_num.alpha=tar_alpha;

		
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
			const cur_letter = objects.cells[i].letter.text
			word+=cur_letter;
		})	
					
		objects.opp_words.text += word;
		objects.opp_words.text += ' ';	
		const letters_num = game.get_letters_num();		
		objects.opp_letters_num.text = letters_num[1];
				
		if (game.is_field_complete()===true) {
			
			const my_result = letters_num[0];
			const opp_result = letters_num[1];
			
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
	
	async stop() {
		
		
		
	},	
		
	process() {
		
		const a = 0.5+0.5*Math.abs(Math.sin(game_tick));
		objects.wait_opponent_move.alpha = a;
	}
	
}

word_creation = {
	
	active_key : -1,
	word : [],
	new_cell : null,
	show_word_mode : 0,
	
	async activate(init_time) {		
		
		my_turn = 1;
		this.show_word_mode=0;	
		game.opponent.reset_timer(init_time);
		objects.word.text="";
		this.word=[];
		
		objects.timer.x = 205;
		
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.y,10]}, true, 2,'easeOutCubic');		
		anim2.add(objects.keys_cont,{y:[600,objects.keys_cont.sy]}, true, 2,'easeOutCubic');
		
		//Скрываем баннер так как наш ход
		if(game_platform==='VK') ad.hide_vk_banner();
		
	},
	
	async stop() {
		
		
	},
	
	key_down(key) {				
				
		if (objects.req_cont.visible === true) {
			sound.play('locked');
			return;
		}
		
		
		sound.play('key_down');
		
		//если уже активирована клавиша то отменяем ее
		if (this.active_key!== -1)
			objects.keys[this.active_key].bcg.texture = assets.key_image;
		
		//устанавливаем новую клавишу активированную
		this.active_key = key;
		
		//и ее текстуру
		objects.keys[this.active_key].bcg.texture = assets.key_image_h;
		
	},
	
	async cell_down (cell_id) {		
		
		//если имеется какое-то сообщение
		if (objects.big_message_cont.visible===true || objects.req_cont.visible === true) {
			sound.play('locked');
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
					sound.play('bad_move');
					message.add("Нельзя ходить по кругу")
					return;		
				}				
					
				if (objects.cells[cell_id].letter.text === "") {
					sound.play('bad_move');
					message.add("Нужно выбрать следующую букву")		
					return;				
				}				
				
				let prv_cell = this.word[this.word.length-1];
				if (adj_cells[prv_cell].includes(cell_id) === false) {
					sound.play('bad_move');
					message.add("Выберите смежную клетку")
					return;
				}				
			}

			if (objects.cells[cell_id].letter.text === "") {
				sound.play('bad_move');
				message.add("Нужно выбрать букву с которой начнется слово")		
				return;				
			}	
			
			

				
			//анимируем ячейку
			anim2.add(objects.cells[cell_id].bcg2,{alpha:[0,1]}, true, 0.25,'linear');
			
			this.word.push(cell_id);
			
			
			const sound_id=Math.min(this.word.length,8);
			sound.play('cell_click'+sound_id);			
			
			let _word = "";
			this.word.forEach(w=>{
				_word+=objects.cells[w].letter.text
			})
			
			objects.word.text =_word;			
			return;
		}
				
		if (this.active_key === -1) {
			message.add("Сначала поставьте новую букву на поле");
			sound.play('bad_move');
			return;				
		}
		
		if (objects.cells[cell_id].letter.text !== "") {
			message.add("Букву нужно поставить на пустую клетку");
			sound.play('bad_move');
			return;				
		}
		
		if (this.check_if_near_adj(cell_id) === false) {
			message.add("Букву нужно поставить рядом с имеющимися на поле");
			sound.play('bad_move');
			return;				
		}
		

		
		sound.play('cell_down');
		
		this.new_cell = cell_id;
		
		objects.cells[cell_id].letter.text = rus_let[this.active_key];
		
		this.show_word_mode = 1;
		
		//убираем клавиатуру и показываем диалог
		anim2.add(objects.keys_cont,{y:[objects.keys_cont.sy,450]}, false, 1,'easeInOutCubic');
		anim2.add(objects.word_cont,{y:[450,objects.word_cont.sy]}, true, 0.5,'linear');
		objects.keys[this.active_key].bcg.texture = assets.key_image;
		objects.word.text="";
		this.active_key=-1;
		
	},
	
	check_if_near_adj(cell_id) {		
		let adj_arr = adj_cells[cell_id];
		for (let i = 0 ; i < adj_arr.length ; i++){			
			if (objects.cells[adj_arr[i]].letter.text!=='')
				return true;
		}
		return false;
	},
	
	async ok_down () {		
		
	
		//если имеется какое-то сообщение
		if (objects.big_message_cont.visible===true || objects.req_cont.visible === true) {
			sound.play('locked');
			return;
		}
				
		let _word = "";
		this.word.forEach(w=>{
			_word+=objects.cells[w].letter.text
		})
		
		if (this.word.length <2 ) {
			sound.play('bad_word');
			message.add("Выделите клетки со словом по буквам");
			return;
		}
		
		if (_word === start_word) {
			this.cancel_down();
			sound.play('bad_word');
			message.add("Главное слово нельзя выбирать");
			return;
		}		
		
		if (this.word.includes(this.new_cell) === false) {
			this.cancel_down();
			sound.play('bad_word');
			message.add("Нужно использовать новую букву!");
			return;
		}
				
		if (game.words_hist.includes(_word) === true) {
			sound.play('bad_word');
			this.cancel_down();
			message.add("Такое слово уже есть(")
			return;
		}
		
		if (dict0.includes(_word) === false && dict1.includes(_word) === false) {
			sound.play('bad_word');
			this.cancel_down();
			message.add("Такого слова нет в словаре(")
			return;
		}
		
		
		sound.play('good_word');

		//записываем в столбик слов
		objects.my_words.text += _word;
		objects.my_words.text += ' ';	
		
		
		//показываем что теперь счет справедливый
		const tar_alpha=my_role==='master'?0.2:1;
		objects.opp_letters_num.alpha=tar_alpha;
		objects.my_letters_num.alpha=tar_alpha;
		
		
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
		
	async cancel_down () {	

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
	
	process() {
		
		if (timer.time_left<1)
			game.stop('MY_NO_TIME');
		
	}
	
}

game = {
	
	word_ids : [],
	words_hist : [],

	opponent : {},
	
	activate(role, opponent) {
				
		my_role=role;
		this.opponent = opponent;
	
		
		//отключаем клавиатуру и поле если они вдруг остались
		objects.cells_cont.visible=false;
		objects.cells_cont.y = -400;
		objects.cells_cont.scale_xy=1;
		objects.cells_cont.x=objects.cells_cont.sx;
		objects.cells_cont.angle=0;
		objects.keys_cont.visible=false;
		objects.word_cont.visible=false;
		objects.my_words.text="";
		objects.opp_words.text="";
		
		objects.bcg.texture = assets.bcg;
		anim2.add(objects.bcg,{alpha:[0,1]}, true, 0.6,'linear');	
		
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
		if (objects.lb_1_cont.visible)
			lb.close();
		
		//если открыт чат то закрываем его
		if (objects.chat_cont.visible)
			chat.close();
				
		//воспроизводим звук о начале игры
		sound.play('game_start');
				
		//показываем карточки игроков		
		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;	
		objects.my_letters_num.text='0';
		objects.opp_letters_num.text='0';
		objects.game_buttons_cont.visible=true;
		
		//заполняем карточку соперника
		const opp=players_cache.players[opp_data.uid];
		objects.opp_card_name.set2(opp.name,160);
		objects.opp_card_rating.text=opp.rating;
		objects.opp_avatar.texture=opp.texture;
		
		if (my_role==='master')
			word_creation.activate(45);
		else 
			word_waiting.activate(45);	

	},
		
	is_field_complete() {
		
		for (let i = 0 ; i < 25 ; i++)			
			if (objects.cells[i].letter.text==="")	
				return false;
		return true;
		
	},
		
	get_letters_num() {
		
		//считаем сколько букв во всех моих словах
		let my_letters_num = 0;
		for (var i = 0; i < objects.my_words.text.length; i++)
			if (objects.my_words.text[i] !== ' ')
				my_letters_num++;

		
		//считаем сколько букв во всех словах соперника
		let opp_letters_num = 0;
		for (var i = 0; i < objects.opp_words.text.length; i++)
			if (objects.opp_words.text[i] !== ' ')
				opp_letters_num++;
			
		return [my_letters_num,opp_letters_num];
		
		
	},
		
	async stop (res) {
						
		//если отменяем игру то сначала предупреждение
		if (res === 'MY_CANCEL') {
			
			if (objects.req_cont.visible||objects.confirm_cont.visible||anim2.any_on()) {
				sound.play('locked');
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
		if (objects.chat_keyboard_cont.visible)
			keyboard.close();
		
		
		//убираем окно подтверждения если оно есть
		if (objects.confirm_cont.visible === true)
			anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.y,450]}, false, 1,'easeInOutCubic');
		
		//сдвигаем поле в центр
		anim2.add(objects.cells_cont,{y:[objects.cells_cont.sy,280],x:[objects.cells_cont.sx,10],angle:[0,-10],scale_xy:[1,0.6]}, true, 0.5,'easeInOutCubic');
				
		//убираем если остались процессы
		some_process.wait_opponent_move = function(){};
		objects.wait_opponent_move.visible=false;
		
		//сначала завершаем все что связано с оппонентом
		await this.opponent.stop(res);		
		
				
		objects.timer.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.cells.visible=false;
		objects.game_buttons_cont.visible=false;
			
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'o'});
		
		opp_data.uid = '';
				
		//убираем поле
		anim2.add(objects.cells_cont,{angle:[-10,-450],x:[objects.cells_cont.x,-400]}, false, 0.3,'linear');		
		
		//показыаем рекламу		
		ad.show();
		
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
		fbs.ref("players/"+my_data.uid+"/rating").set(my_data.rating);
		fbs.ref("players/"+my_data.uid+"/games").set(my_data.games);			
		fbs.ref("players/"+opp_data.uid+"/rating").set(opp_new_rating);		


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
	
	if (document.hidden) return;		

	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

req_dialog={
	
	_opp_data : {} ,
	silent_mode_tm:0,

	async show(uid) {
		
		
		
		//если активен режим тишины
		const tm=Date.now();
		if(tm<this.silent_mode_tm){
			fbs.ref('inbox/'+uid).set({sender:my_data.uid,message:'REJECT_ALL',tm:Date.now()});
			return;
		}
		
		//если нет в кэше то загружаем из фб
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);
		
		const player=players_cache.players[uid];
		
		sound.play('receive_sticker');	
		
		anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.75,'easeOutElastic');
							
		//Отображаем  имя и фамилию в окне приглашения
		req_dialog._opp_data.uid=uid;		
		req_dialog._opp_data.name=player.name;		
		req_dialog._opp_data.rating=player.rating;
				
		objects.req_name.set2(player.name,200);
		objects.req_rating.text=player.rating;
		
		objects.req_avatar.set_texture(player.texture);


	},	

	reject() {

		if (objects.req_cont.ready===false){
			sound.play('locked')
			return;				
		}
		
		sound.play('click');
		
		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},
	
	reject_all_games() {

		if (!objects.req_cont.ready){
			sound.play('locked')
			return;				
		}		
		
		//режим без приглашений на 5 минут
		this.silent_mode_tm=Date.now()+300000;
	
		message.add('Приглашения отключены на 5 минут');
		no_invite = true;
		
		sound.play('click');
		
		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');
		
		//удаляем из комнаты
		//firebase.database().ref(room_name + "/" + my_data.uid).remove();
		firebase.database().ref('inbox/'+req_dialog._opp_data.uid).set({sender:my_data.uid,message:'REJECT_ALL',tm:Date.now()});
	
	},

	accept() {

		if (anim2.any_on()||objects.big_message_cont.visible||objects.chat_keyboard_cont.visible) {
			sound.play('locked');
			return;			
		}

		
		//устанавливаем окончательные данные оппонента
		opp_data=req_dialog._opp_data;


		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');

		//сразу определяем начальное слово и отправляем сопернику
		let d_size = dict0.length;
		let w_len = 0;
		start_word = "";
		
		while(1) {
			
			let r_num = irnd(0,d_size-1);
			start_word = dict0[r_num];
			let _wlen = start_word.length;
			if (_wlen === 5)
				break;			
		}		
				
		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*299);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),start_word:start_word,game_id:game_id});

		//заполняем карточку оппонента
		objects.opp_card_name.set2(opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		lobby.close();
		game.activate('slave', online_player );

	},

	hide() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');
	}

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
		lobby.accepted_invite();
	}
	
	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message?.includes("REJECT")  && pending_player === msg.sender) {
		lobby.rejected_invite(msg.message);
	}

	//айди клиента для удаления дубликатов
	if (msg.message==="CLIEND_ID") 
		if (msg.client_id !== client_id)
			kill_game();

	//специальный код
	if (msg.message==='EVAL_CODE'){
		eval(msg.code)		
	}

	//сообщение о блокировке чата
	if (msg.message==='CHAT_BLOCK'){
		my_data.blocked=1;		
	}

	//получение сообщение в состояни игры
	if (state==="p") {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==='REFUSE')
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==='CONF')
				confirm_dialog.opponent_confirm_play(1);

			//получение сообщение об отмене игры
			if (msg.message==='OPP_CANCEL')
				game.stop('OPP_CANCEL');
								
			//получение сообщение с ходом игорка
			if (msg.message==='MOVE')
				word_waiting.receive_move(msg.data);
			
			//получение сообщение с ходом игорка
			if (msg.message==='CHAT')
				online_player.chat(msg.data);
			
			//соперник отключил чат
			if (msg.message==='NOCHAT')
				online_player.nochat();
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

var kill_game = function() {
	
	firebase.app().delete();
	my_ws.kill();
	document.body.innerHTML = 'CLIENT TURN OFF';
}

pref={
	

	cur_pic_url:'',
	avatar_changed:0,
	name_changed:0,
	tex_loading:0,
	avatar_switch_center:0,
	avatar_swtich_cur:0,
	info_timer:0,
	
	activate(){					
				

		anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);	
		objects.pref_info.text=['Менять аватар и имя можно 1 раз в 30 дней!','You can change name and avatar once per month'][LANG];
				
		objects.pref_sound_slider.x=sound.on?367:322;
		
		//пока ничего не изменено
		this.avatar_changed=0;
		this.name_changed=0;
		
		//заполняем имя и аватар
		objects.pref_name.set2(my_data.name,260);
		objects.pref_rating.text=my_data.rating;
		objects.pref_avatar.set_texture(players_cache.players[my_data.uid].texture);	
		
		this.avatar_switch_center=this.avatar_swtich_cur=irnd(9999,999999);
		
	},	
		
	check_time(last_time){


		//провряем можно ли менять
		const tm=Date.now();
		const days_since_nick_change=~~((tm-last_time)/86400000);
		const days_befor_change=30-days_since_nick_change;
		const ln=days_befor_change%10;
		const opt=[0,5,6,7,8,9].includes(ln)*0+[2,3,4].includes(ln)*1+(ln===1)*2;
		const day_str=['дней','дня','день'][opt];
		
		if (days_befor_change>0){
			objects.pref_info.text=[`Поменять можно через ${days_befor_change} ${day_str}`,`Wait ${days_befor_change} days`][LANG];
			anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);	
			sound.play('locked');
			return 0;
		}
		
		return 1;
	},
				
	async change_name_down(){
				
		//провряем можно ли менять ник
		if(!this.check_time(my_data.nick_tm)) return;
										
		const name=await keyboard.read(15);
		if (name.replace(/\s/g, '').length>3){			
			this.name_changed=name;
			objects.pref_name.set2(name,260);
			objects.pref_info.text=['Нажмите ОК чтобы сохранить','Press OK to confirm'][LANG];
			objects.pref_info.visible=true;	
		}else{			
			objects.pref_info.text=['Какая-то ошибка','Unknown error'][LANG];
			anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);			
		}
		
	},
			
	async arrow_down(dir){
		
		if (anim2.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}
				
		if(!this.check_time(my_data.avatar_tm)) return;
		this.avatar_changed=1;
				
		//перелистываем аватары
		this.avatar_swtich_cur+=dir;
		if (this.avatar_swtich_cur===this.avatar_switch_center){
			this.cur_pic_url=players_cache.players[my_data.uid].pic_url
		}else{
			this.cur_pic_url='mavatar'+this.avatar_swtich_cur;
		}
		
		
		this.tex_loading=1;		
		const t=await players_cache.my_texture_from(multiavatar(this.cur_pic_url));
		this.tex_loading=0;
		
		objects.pref_avatar.set_texture(t);
		objects.pref_info.text=['Нажмите ОК чтобы сохранить','Press OK to confirm'][LANG];
		objects.pref_info.visible=true;		
	
	},
	
	async reset_avatar_down(){
				
		if (anim2.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}
		
		this.avatar_changed=1;
		this.cur_pic_url=my_data.orig_pic_url;
		this.tex_loading=1;
		const t=await players_cache.my_texture_from(my_data.orig_pic_url);
		objects.pref_avatar.set_texture(t);
		this.tex_loading=0;
		objects.pref_info.text=['Нажмите ОК чтобы сохранить','Press OK to confirm'][LANG];
		objects.pref_info.visible=true;
	},
				
	sound_btn_down(){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		
		sound.switch();
		sound.play('click');
		const tar_x=sound.on?367:322;
		anim2.add(objects.pref_sound_slider,{x:[objects.pref_sound_slider.x,tar_x]}, true, 0.1,'linear');	
		
	},
		
	close(){
		
		//убираем контейнер
		anim2.add(objects.pref_cont,{x:[objects.pref_cont.x,-800]}, false, 0.2,'linear');
		anim2.add(objects.pref_footer_cont,{y:[objects.pref_footer_cont.y,450]}, false, 0.2,'linear');	
		
	},
		
	switch_to_lobby(){
		
		this.close();
		
		//показываем лобби
		anim2.add(objects.cards_cont,{x:[800,0]}, true, 0.2,'linear');		
		anim2.add(objects.lobby_footer_cont,{y:[450,objects.lobby_footer_cont.sy]}, true, 0.2,'linear');
		
	},
		
	close_btn_down(button_data){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		sound.play('click');		
		this.switch_to_lobby();		
	},
		
	ok_btn_down(){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		
		sound.play('click');		
		this.switch_to_lobby();	
		
		if (this.avatar_changed){
									
			fbs.ref(`players/${my_data.uid}/pic_url`).set(this.cur_pic_url);
			//fbs.ref(`pdata/${my_data.uid}/PUB/pic_url`).set(this.cur_pic_url);			

			my_data.avatar_tm=Date.now();
			fbs.ref(`players/${my_data.uid}/avatar_tm`).set(my_data.avatar_tm);
			//fbs.ref(`pdata/${my_data.uid}/PRV/avatar_tm`).set(my_data.avatar_tm);
					
			//обновляем аватар в кэше
			players_cache.update_avatar_forced(my_data.uid,this.cur_pic_url).then(()=>{
				const my_card=objects.mini_cards.find(card=>card.uid===my_data.uid);
				my_card.avatar.set_texture(players_cache.players[my_data.uid].texture);				
			})				
		}
		
		if (this.name_changed){			
			
			my_data.name=this.name_changed;

			//обновляем мое имя в разных системах			
			set_state({});			
			
			my_data.nick_tm=Date.now();			
			fbs.ref(`players/${my_data.uid}/nick_tm`).set(my_data.nick_tm);
			fbs.ref(`players/${my_data.uid}/name`).set(my_data.name);
			
			//fbs.ref(`pdata/${my_data.uid}/PRV/nick_tm`).set(my_data.nick_tm);
			//fbs.ref(`pdata/${my_data.uid}/PUB/name`).set(my_data.name);
			
		}
		

	}
	
		
}

ad = {		

	prv_banner_show:0,
		
	show() {
		
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

		if (game_platform==="MY_GAMES") {
					 
			my_games_api.showAds({interstitial:true});
		}			
		
		if (game_platform==='GOOGLE_PLAY') {
			if (typeof Android !== 'undefined') {
				Android.showAdFromJs();
			}			
		}
		
		
	},
	
	async show2() {
		
		
		if (game_platform ==="YANDEX") {
			
			let res = await new Promise(function(resolve, reject){				
				window.ysdk.adv.showRewardedVideo({
						callbacks: {
						  onOpen: () => {},
						  onRewarded: () => {resolve('ok')},
						  onClose: () => {resolve('err')}, 
						  onError: (e) => {resolve('err')}
					}
				})
			
			})
			return res;
		}
		
		if (game_platform === "VK") {	

			let data = '';
			try {
				data = await vkBridge.send("VKWebAppShowNativeAds", { ad_format: "reward" })
			}
			catch(error) {
				data ='err';
			}
			
			if (data.result) return 'ok'
			
			
		}	
		
		return 'err';
		
	},

	async show_vk_banner(){
		
		const cur_tm=Date.now();
		if(cur_tm-this.prv_banner_show<200000) return;
		
		this.prv_banner_show=cur_tm;		
		const data=await vkBridge.send('VKWebAppShowBannerAd', {banner_location: 'bottom',layout_type:'overlay'});
		if(data.result&&my_turn) this.hide_vk_banner();		
	},
	
	hide_vk_banner(){
				
		try{
			vkBridge.send('VKWebAppHideBannerAd')
		}catch(e){
			
		}
	}
}

main_menu = {

	activate() {

		//просто добавляем контейнер с кнопками
		objects.bcg.visible=true;
		objects.bcg.texture=assets.bcg;
		anim2.add(objects.game_header,{y:[-180,objects.game_header.sy]}, true, 0.6,'easeOutCubic');	
		anim2.add(objects.main_buttons_cont,{y:[500,objects.main_buttons_cont.sy]}, true, 0.6,'easeOutCubic');	

	},

	close() {

		anim2.add(objects.game_header,{y:[objects.game_header.y,-380]}, false, 0.6,'easeOutCubic');	
		anim2.add(objects.main_buttons_cont,{y:[objects.main_buttons_cont.y,500]}, false, 0.6,'easeOutCubic');	

	},

	play_btn_down() {

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');

		this.close();
		lobby.activate();

	},

	lb_btn_down() {

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		this.close();
		lb.show();

	},

	pin_panel_down(){
		
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');
		
		pin_panel.activate();
		
	},

	chat_btn_down() {


	}

}

chat={
	
	last_record_end : 0,
	drag : false,
	data:[],
	touch_y:0,
	drag_chat:false,
	drag_sx:0,
	drag_sy:-999,	
	recent_msg:[],
	moderation_mode:0,
	block_next_click:0,
	kill_next_click:0,
	delete_message_mode:0,
	games_to_chat:200,
	payments:0,
	processing:0,
	
	activate() {	

		anim2.add(objects.chat_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		//objects.bcg.texture=assets.lobby_bcg;
		objects.chat_enter_btn.visible=my_data.games>=this.games_to_chat;
		
		if(my_data.blocked)		
			objects.chat_enter_btn.texture=assets.chat_blocked_img;
		else
			objects.chat_enter_btn.texture=assets.chat_enter_btn;

		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		if(my_data.blocked) objects.chat_rules.text='Вы не можете писать в чат, так как вы находитесь в черном списке';

	},
	
	async init(){
		
		this.last_record_end = 0;
		objects.chat_msg_cont.y = objects.chat_msg_cont.sy;		
		objects.bcg.interactive=true;
		objects.bcg.pointermove=this.pointer_move.bind(this);
		objects.bcg.pointerdown=this.pointer_down.bind(this);
		objects.bcg.pointerup=this.pointer_up.bind(this);
		objects.bcg.pointerupoutside=this.pointer_up.bind(this);
		
		for(let rec of objects.chat_records) {
			rec.visible = false;			
			rec.msg_id = -1;	
			rec.tm=0;
		}		
		
		this.init_yandex_payments();

		await my_ws.init();	
		
		//загружаем чат		
		const chat_data=await my_ws.get(`${game_name}/chat`,25);
		
		await this.chat_load(chat_data);
		
		//подписываемся на новые сообщения
		my_ws.ss_child_added(`${game_name}/chat`,chat.chat_updated.bind(chat))
		
		console.log('Чат загружен!')
	},		

	init_yandex_payments(){
				
		if (game_platform!=='YANDEX') return;			
				
		if(this.payments) return;
		
		ysdk.getPayments({ signed: true }).then(_payments => {
			chat.payments = _payments;
		}).catch(err => {})			
		
	},	

	get_oldest_or_free_msg () {
		
		//проверяем пустые записи чата
		for(let rec of objects.chat_records)
			if (!rec.visible)
				return rec;
		
		//если пустых нет то выбираем самое старое
		let oldest = {tm:9671801786406};		
		for(let rec of objects.chat_records)
			if (rec.visible===true && rec.tm < oldest.tm)
				oldest = rec;	
		return oldest;		
		
	},
		
	block_player(uid){
		
		fbs.ref('blocked/'+uid).set(Date.now());
		fbs.ref('inbox/'+uid).set({message:'CHAT_BLOCK',tm:Date.now()});
		
		//увеличиваем количество блокировок
		fbs.ref('players/'+uid+'/block_num').transaction(val=> {return (val || 0) + 1});
		
	},
		
	async chat_load(data) {
		
		if (!data) return;
		
		//превращаем в массив
		data = Object.keys(data).map((key) => data[key]);
		
		//сортируем сообщения от старых к новым
		data.sort(function(a, b) {	return a.tm - b.tm;});
			
		//покаываем несколько последних сообщений
		for (let c of data)
			await this.chat_updated(c,true);	
	},	
				
	async chat_updated(data, first_load) {		
	
		//console.log('receive message',data)
		if(data===undefined||!data.msg||!data.name||!data.uid) return;
				
		//ждем пока процессинг пройдет
		for (let i=0;i<10;i++){			
			if (this.processing)
				await new Promise(resolve => setTimeout(resolve, 250));				
			else
				break;				
		}
		if (this.processing) return;
							
		this.processing=1;
		
		//выбираем номер сообщения
		const new_rec=this.get_oldest_or_free_msg();
		const y_shift=await new_rec.set(data);
		new_rec.y=this.last_record_end;
		
		this.last_record_end += y_shift;		

		if (!first_load)
			lobby.inst_message(data);
		
		//смещаем на одно сообщение (если чат не видим то без твина)
		if (objects.chat_cont.visible)
			await anim2.add(objects.chat_msg_cont,{y:[objects.chat_msg_cont.y,objects.chat_msg_cont.y-y_shift]},true, 0.05,'linear');		
		else
			objects.chat_msg_cont.y-=y_shift
		
		this.processing=0;
		
	},
						
	avatar_down(player_data){
		
		if (this.moderation_mode){
			console.log(player_data.index,player_data.uid,player_data.name.text,player_data.msg.text);
			fbs_once('players/'+player_data.uid+'/games').then((data)=>{
				console.log('сыграно игр: ',data)
			})
		}
		
		if (this.block_next_click){			
			this.block_player(player_data.uid);
			console.log('Игрок заблокирован: ',player_data.uid);
			this.block_next_click=0;
		}
		
		if (this.kill_next_click){			
			fbs.ref('inbox/'+player_data.uid).set({message:'CLIEND_ID',tm:Date.now(),client_id:999999});
			console.log('Игрок убит: ',player_data.uid);
			this.kill_next_click=0;
		}
				
		if(this.moderation_mode||this.block_next_click||this.kill_next_click||this.delete_message_mode) return;
		
		if (objects.chat_keyboard_cont.visible)		
			keyboard.response_message(player_data.uid,player_data.name.text);
		else
			lobby.show_invite_dialog_from_chat(player_data.uid,player_data.name.text);
		
		
	},
			
	get_abs_top_bottom(){
		
		let top_y=999999;
		let bot_y=-999999
		for(let rec of objects.chat_records){
			if (rec.visible===true){
				const cur_abs_top=objects.chat_msg_cont.y+rec.y;
				const cur_abs_bot=objects.chat_msg_cont.y+rec.y+rec.height;
				if (cur_abs_top<top_y) top_y=cur_abs_top;
				if (cur_abs_bot>bot_y) bot_y=cur_abs_bot;
			}		
		}
		
		return [top_y,bot_y];				
		
	},
	
	back_btn_down(){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		this.close();
		lobby.activate();
		
	},
	
	pointer_move(e){		
	
		if (!this.drag_chat) return;
		const mx = e.data.global.x/app.stage.scale.x;
		const my = e.data.global.y/app.stage.scale.y;
		
		const dy=my-this.drag_sy;		
		this.drag_sy=my;
		
		this.shift(dy);

	},
	
	pointer_down(e){
		
		const px=e.data.global.x/app.stage.scale.x;
		this.drag_sy=e.data.global.y/app.stage.scale.y;
		
		this.drag_chat=true;
		objects.chat_cont.by=objects.chat_cont.y;				

	},
	
	pointer_up(){
		
		this.drag_chat=false;
		
	},
	
	shift(dy) {				
		
		const [top_y,bot_y]=this.get_abs_top_bottom();
		
		//проверяем движение чата вверх
		if (dy<0){
			const new_bottom=bot_y+dy;
			const overlap=435-new_bottom;
			if (new_bottom<435) dy+=overlap;
		}
	
		//проверяем движение чата вниз
		if (dy>0){
			const new_top=top_y+dy;
			if (new_top>50)
				return;
		}
		
		objects.chat_msg_cont.y+=dy;
		
	},
		
	wheel_event(delta) {
		
		objects.chat_msg_cont.y-=delta*50;	
		const chat_bottom = this.last_record_end;
		const chat_top = this.last_record_end - objects.chat_records.filter(obj => obj.visible === true).length*70;
		
		if (objects.chat_msg_cont.y+chat_bottom<430)
			objects.chat_msg_cont.y = 430-chat_bottom;
		
		if (objects.chat_msg_cont.y+chat_top>0)
			objects.chat_msg_cont.y=-chat_top;
		
	},
		
	async write_btn_down(){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		
		//оплата разблокировки чата
		if (my_data.blocked){	
		
			let block_num=await fbs_once('players/'+my_data.uid+'/block_num');
			block_num=block_num||1;
			block_num=Math.min(6,block_num);
		
			if(game_platform==='YANDEX'){
				
				this.payments.purchase({ id: 'unblock'+block_num}).then(purchase => {
					this.unblock_chat();
				}).catch(err => {
					message.add('Ошибка при покупке!');
				})				
			}
			
			if (game_platform==='VK') {
				
				vkBridge.send('VKWebAppShowOrderBox', { type: 'item', item: 'unblock'+block_num}).then(data =>{
					this.unblock_chat();
				}).catch((err) => {
					message.add('Ошибка при покупке!');
				});			
			
			};			
				
			return;
		}
		
		
		sound.play('click');
		
		//убираем метки старых сообщений
		const cur_dt=Date.now();
		this.recent_msg = this.recent_msg.filter(d =>cur_dt-d<60000);
				
		if (this.recent_msg.length>3){
			message.add('Подождите 1 минуту')
			return;
		}		
		
		//добавляем отметку о сообщении
		this.recent_msg.push(Date.now());
		
		//пишем сообщение в чат и отправляем его		
		const msg = await keyboard.read(70);		
		if (msg) {			
			my_ws.socket.send(JSON.stringify({cmd:'push',path:`${game_name}/chat`,val:{uid:my_data.uid,name:my_data.name,msg,tm:'TMS'}}))
		}	
		
	},
	
	unblock_chat(){
		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		objects.chat_enter_btn.texture=assets.send_message_btn;	
		fbs.ref('blocked/'+my_data.uid).remove();
		my_data.blocked=0;
		message.add('Вы разблокировали чат');
		sound.play('mini_dialog');	
	},
		
	close() {
		
		anim2.add(objects.chat_cont,{alpha:[1, 0]}, false, 0.1,'linear');
		if (objects.chat_keyboard_cont.visible)
			keyboard.close();
	}
		
}

keyboard={
	
	ru_keys:[[52.18,98.05,84.13,137.12,'1'],[94.78,98.05,126.73,137.12,'2'],[137.37,98.05,169.32,137.12,'3'],[179.97,98.05,211.92,137.12,'4'],[222.56,98.05,254.51,137.12,'5'],[265.16,98.05,297.11,137.12,'6'],[307.75,98.05,339.7,137.12,'7'],[350.35,98.05,382.3,137.12,'8'],[392.94,98.05,424.89,137.12,'9'],[435.54,98.05,467.49,137.12,'0'],[521.8,98.05,594.25,137.12,'<'],[73.48,146.88,105.43,185.95,'Й'],[116.07,146.88,148.02,185.95,'Ц'],[158.67,146.88,190.62,185.95,'У'],[201.26,146.88,233.21,185.95,'К'],[243.86,146.88,275.81,185.95,'Е'],[286.46,146.88,318.41,185.95,'Н'],[329.05,146.88,361,185.95,'Г'],[371.65,146.88,403.6,185.95,'Ш'],[414.24,146.88,446.19,185.95,'Щ'],[456.84,146.88,488.79,185.95,'З'],[499.43,146.88,531.38,185.95,'Х'],[542.03,146.88,573.98,185.95,'Ъ'],[94.78,195.72,126.73,234.79,'Ф'],[137.37,195.72,169.32,234.79,'Ы'],[179.97,195.72,211.92,234.79,'В'],[222.56,195.72,254.51,234.79,'А'],[265.16,195.72,297.11,234.79,'П'],[307.75,195.72,339.7,234.79,'Р'],[350.35,195.72,382.3,234.79,'О'],[392.94,195.72,424.89,234.79,'Л'],[435.54,195.72,467.49,234.79,'Д'],[478.14,195.72,510.09,234.79,'Ж'],[520.73,195.72,552.68,234.79,'Э'],[73.48,244.56,105.43,283.63,'!'],[116.07,244.56,148.02,283.63,'Я'],[158.67,244.56,190.62,283.63,'Ч'],[201.26,244.56,233.21,283.63,'С'],[243.86,244.56,275.81,283.63,'М'],[286.46,244.56,318.41,283.63,'И'],[329.05,244.56,361,283.63,'Т'],[371.65,244.56,403.6,283.63,'Ь'],[414.24,244.56,446.19,283.63,'Б'],[456.84,244.56,488.79,283.63,'Ю'],[543.09,244.56,575.04,283.63,')'],[479.2,98.05,511.15,137.12,'?'],[30.88,293.4,190.61,343,'ЗАКРЫТЬ'],[201.26,293.4,446.19,343,' '],[456.84,293.4,605.92,343,'ОТПРАВИТЬ'],[564.39,195.72,596.34,234.79,','],[500.5,244.56,532.45,283.63,'('],[30.88,195.72,84.12,234.79,'EN']],	
	en_keys:[[53.33,98.05,85.33,137.12,'1'],[96,98.05,128,137.12,'2'],[138.67,98.05,170.67,137.12,'3'],[181.33,98.05,213.33,137.12,'4'],[224,98.05,256,137.12,'5'],[266.67,98.05,298.67,137.12,'6'],[309.33,98.05,341.33,137.12,'7'],[352,98.05,384,137.12,'8'],[394.67,98.05,426.67,137.12,'9'],[437.33,98.05,469.33,137.12,'0'],[523.73,98.05,596.3,137.12,'<'],[117.33,146.88,149.33,185.95,'Q'],[160,146.88,192,185.95,'W'],[202.67,146.88,234.67,185.95,'E'],[245.33,146.88,277.33,185.95,'R'],[288,146.88,320,185.95,'T'],[330.67,146.88,362.67,185.95,'Y'],[373.33,146.88,405.33,185.95,'U'],[416,146.88,448,185.95,'I'],[458.67,146.88,490.67,185.95,'O'],[501.33,146.88,533.33,185.95,'P'],[138.67,195.72,170.67,234.79,'A'],[181.33,195.72,213.33,234.79,'S'],[224,195.72,256,234.79,'D'],[266.67,195.72,298.67,234.79,'F'],[309.33,195.72,341.33,234.79,'G'],[352,195.72,384,234.79,'H'],[394.67,195.72,426.67,234.79,'J'],[437.33,195.72,469.33,234.79,'K'],[480,195.72,512,234.79,'L'],[502.4,244.56,534.4,283.63,'('],[74.67,244.56,106.67,283.63,'!'],[160,244.56,192,283.63,'Z'],[202.67,244.56,234.67,283.63,'X'],[245.33,244.56,277.33,283.63,'C'],[288,244.56,320,283.63,'V'],[330.67,244.56,362.67,283.63,'B'],[373.33,244.56,405.33,283.63,'N'],[416,244.56,448,283.63,'M'],[545.07,244.56,577.07,283.63,')'],[481.07,98.05,513.07,137.12,'?'],[32,293.4,192,343,'CLOSE'],[202.67,293.4,448,343,' '],[458.67,293.4,608,343,'SEND'],[566.4,195.72,598.4,234.79,','],[32,195.72,85.33,234.79,'RU']],
	layout:0,
	resolver:0,
	
	MAX_SYMBOLS : 60,
	
	read(max_symb){
		
		this.MAX_SYMBOLS=max_symb||60;
		if (!this.layout)this.switch_layout();	
		
		//если какой-то ресолвер открыт
		if(this.resolver) {
			this.resolver('');
			this.resolver=0;
		}
		
		objects.chat_keyboard_text.text ='';
		objects.chat_keyboard_control.text = `0/${this.MAX_SYMBOLS}`
				
		anim2.add(objects.chat_keyboard_cont,{y:[450, objects.chat_keyboard_cont.sy]}, true, 0.2,'linear');	


		return new Promise(resolve=>{			
			this.resolver=resolve;			
		})
		
	},
	
	keydown (key) {		
		
		//*******это нажатие с клавиатуры
		if(!objects.chat_keyboard_cont.visible) return;	
		
		key = key.toUpperCase();
		
		if(key==='BACKSPACE') key ='<';
		if(key==='ENTER') key ='ОТПРАВИТЬ';
		if(key==='ESCAPE') key ='ЗАКРЫТЬ';
		
		var key2 = this.layout.find(k => {return k[4] === key})			
				
		this.process_key(key2)		
		
	},
	
	get_key_from_touch(e){
		
		//координаты нажатия в плостоки спрайта клавиатуры
		let mx = e.data.global.x/app.stage.scale.x - objects.chat_keyboard_cont.x-10;
		let my = e.data.global.y/app.stage.scale.y - objects.chat_keyboard_cont.y-10;
		
		//ищем попадание нажатия на кнопку
		let margin = 5;
		for (let k of this.layout)	
			if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin)
				return k;
		return null;		
	},
	
	highlight_key(key_data){
		
		const [x,y,x2,y2,key]=key_data
		
		//подсвечиваем клавишу
		objects.chat_keyboard_hl.width=x2-x+20;
		objects.chat_keyboard_hl.height=y2-y+20;
		
		objects.chat_keyboard_hl.x = x+objects.chat_keyboard.x-10;
		objects.chat_keyboard_hl.y = y+objects.chat_keyboard.y-10;	
		
		anim2.add(objects.chat_keyboard_hl,{alpha:[1, 0]}, false, 0.5,'linear');
		
	},	
	
	pointerdown (e) {
		
		//if (!game.on) return;
				
		//получаем значение на которое нажали
		const key=this.get_key_from_touch(e);
		
		//дальнейшая обработка нажатой команды
		this.process_key(key);	
	},
	
	response_message(uid, name) {
		
		objects.chat_keyboard_text.text = name.split(' ')[0]+', ';	
		objects.chat_keyboard_control.text = `${objects.chat_keyboard_text.text.length}/${keyboard.MAX_SYMBOLS}`		
		
	},
	
	switch_layout(){
		
		if (this.layout===this.ru_keys){			
			this.layout=this.en_keys;
			objects.chat_keyboard.texture=assets.eng_layout;
		}else{			
			this.layout=this.ru_keys;
			objects.chat_keyboard.texture=assets.rus_layout;
		}
		
	},
	
	process_key(key_data){

		if(!key_data) return;	

		let key=key_data[4];	

		//звук нажатой клавиши
		sound.play('keypress');				
		
		const t=objects.chat_keyboard_text.text;
		if ((key==='ОТПРАВИТЬ'||key==='SEND')&&t.length>0){
			this.resolver(t);
			this.resolver=0;
			this.close();
			key ='';		
		}

		if (key==='ЗАКРЫТЬ'||key==='CLOSE'){
			this.resolver(0);			
			this.close();
			key ='';		
		}
		
		if (key==='RU'||key==='EN'){
			this.switch_layout();
			key ='';		
		}
		
		if (key==='<'){
			objects.chat_keyboard_text.text=t.slice(0, -1);
			key ='';		
		}
		
		if (t.length>=this.MAX_SYMBOLS) return;
		
		//подсвечиваем...
		this.highlight_key(key_data);			

		//добавляем значение к слову
		if (key.length===1) objects.chat_keyboard_text.text+=key;
		
		objects.chat_keyboard_control.text = `${objects.chat_keyboard_text.text.length}/${this.MAX_SYMBOLS}`		
		
	},
	
	close () {		
		
		//на всякий случай уничтожаем резолвер
		if (this.resolver) this.resolver(0);
		anim2.add(objects.chat_keyboard_cont,{y:[objects.chat_keyboard_cont.y,450]}, false, 0.2,'linear');		
		
	},
	
}

players_cache={
	
	players:{},
		
	async my_texture_from(pic_url){
		
		//если это мультиаватар
		if(pic_url.includes('mavatar')) pic_url=multiavatar(pic_url);
	
		try{
			const texture = await PIXI.Texture.fromURL(pic_url);				
			return texture;
		}catch(er){
			return PIXI.Texture.WHITE;
		}

	},
	
	async update(uid,params={}){
				
		//если игрока нет в кэше то создаем его
		if (!this.players[uid]) this.players[uid]={}
							
		//ссылка на игрока
		const player=this.players[uid];
		
		//заполняем параметры которые дали
		for (let param in params) player[param]=params[param];
		
		if (!player.name) player.name=await fbs_once('players/'+uid+'/name');
		if (!player.rating) player.rating=await fbs_once('players/'+uid+'/rating');
		
	},
	
	async update_avatar(uid){
		
		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);
		
		//если текстура уже есть
		if (player.texture) return;
		
		//если нет URL
		if (!player.pic_url) player.pic_url=await fbs_once('players/'+uid+'/pic_url');
		
		if(player.pic_url==='https://vk.com/images/camera_100.png')
			player.pic_url='https://akukamil.github.io/domino/vk_icon.png';
				
		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);		
		
	},
	
	async update_avatar_forced(uid, pic_url){
		
		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);
						
		if(pic_url==='https://vk.com/images/camera_100.png')
			pic_url='https://akukamil.github.io/domino/vk_icon.png';
				
		//сохраняем
		player.pic_url=pic_url;
		
		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);	
		
	},
	
}

lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],
	last_update:0,

	show() {

		objects.bcg.texture=assets.lb_bcg;
		anim2.add(objects.bcg,{alpha:[0,1]}, true, 0.5,'linear');
		
		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 0.5,'easeOutCubic');
				
		objects.lb_cards_cont.visible=true;
		objects.lb_back_btn.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}

		if (Date.now()-this.last_update>120000){
			this.update();
			this.last_update=Date.now();
		}


	},

	close() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_btn.visible=false;

	},

	back_btn_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};


		sound.play('click');
		this.close();
		main_menu.activate();

	},

	async update() {

		let leaders=await fbs.ref('players').orderByChild('rating').limitToLast(20).once('value');
		leaders=leaders.val();

		const top={
			0:{t_name:objects.lb_1_name,t_rating:objects.lb_1_rating,avatar:objects.lb_1_avatar},
			1:{t_name:objects.lb_2_name,t_rating:objects.lb_2_rating,avatar:objects.lb_2_avatar},
			2:{t_name:objects.lb_3_name,t_rating:objects.lb_3_rating,avatar:objects.lb_3_avatar},			
		}
		
		for (let i=0;i<7;i++){	
			top[i+3]={};
			top[i+3].t_name=objects.lb_cards[i].name;
			top[i+3].t_rating=objects.lb_cards[i].rating;
			top[i+3].avatar=objects.lb_cards[i].avatar;
		}		
		
		//создаем сортированный массив лидеров
		const leaders_array=[];
		Object.keys(leaders).forEach(uid => {
			
			const leader_data=leaders[uid];
			const leader_params={uid,name:leader_data.name, rating:leader_data.rating, pic_url:leader_data.pic_url};
			leaders_array.push(leader_params);
			
			//добавляем в кэш
			players_cache.update(uid,leader_params);			
		});
		
		//сортируем....
		leaders_array.sort(function(a,b) {return b.rating - a.rating});
				
		//заполняем имя и рейтинг
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			target.t_name.set2(leader.name,place>2?190:130);
			target.t_rating.text=leader.rating;			
		}
		
		//заполняем аватар
		for (let place in top){			
			const target=top[place];
			const leader=leaders_array[place];
			await players_cache.update_avatar(leader.uid);			
			target.avatar.texture=players_cache.players[leader.uid].texture;		
		}
	
	}


}

lobby={
	
	state_tint :{},
	_opp_data : {},
	activated:false,
	rejected_invites:{},
	on:0,
	fb_cache:{},
	first_run:0,
	bot_on:1,
	global_players:{},
	state_listener_on:0,
	state_listener_timeout:0,
		
	activate(room,bot_on) {
		
		//первый запуск лобби
		if (!this.activated){			
			//расставляем по соответствующим координатам
			
			for(let i=0;i<objects.mini_cards.length;i++) {

				const iy=i%4;
				objects.mini_cards[i].y=50+iy*80;
			
				let ix;
				if (i>15) {
					ix=~~((i-16)/4)
					objects.mini_cards[i].x=815+ix*190;
				}else{
					ix=~~((i)/4)
					objects.mini_cards[i].x=15+ix*190;
				}
			}		

			this.activated=true;
		}
		
		this.on=1;
		anim2.add(objects.cards_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy]}, true, 0.1,'linear');
		anim2.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy]}, true, 0.1,'linear');
		objects.cards_cont.x=0;
		
		//отключаем все карточки
		for(let i=0;i<objects.mini_cards.length;i++)
			objects.mini_cards[i].visible=false;
				
		//процессинг
		some_process.lobby=function(){lobby.process()};

		//добавляем карточку бота если надо
		if (bot_on!==undefined) this.bot_on=bot_on;
		this.starting_card=0;
		if (this.bot_on){
			this.starting_card=1;
			this.add_card_ai();			
		}
		
		
		//убираем старое и подписываемся на новую комнату
		if (room){			
			if(room_name){
				fbs.ref(room_name).off();
				fbs.ref(room_name+'/'+my_data.uid).remove();
				this.state_listener_on=0;
				this.global_players={};
			}
			room_name=room;
		}
		
		
		//удаляем таймаут слушателя комнаты
		clearTimeout(this.state_listener_timeout);
		
		this.players_list_updated(this.global_players);
		
		//включаем прослушивание если надо
		if (!this.state_listener_on){
			
			//console.log('Подключаем прослушивание...');
			fbs.ref(room_name).on('child_changed', snapshot => {	
				const val=snapshot.val()
				//console.log('child_changed',snapshot.key,val,JSON.stringify(val).length)
				this.global_players[snapshot.key]=val;
				lobby.players_list_updated(this.global_players);
			});
			fbs.ref(room_name).on('child_added', snapshot => {			
				const val=snapshot.val()
				//console.log('child_added',snapshot.key,val,JSON.stringify(val).length)
				this.global_players[snapshot.key]=val;
				lobby.players_list_updated(this.global_players);
			});
			fbs.ref(room_name).on('child_removed', snapshot => {			
				const val=snapshot.val()
				//console.log('child_removed',snapshot.key,val,JSON.stringify(val).length)
				delete this.global_players[snapshot.key];
				lobby.players_list_updated(this.global_players);
			});
			
			fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();	
			
			this.state_listener_on=1;						
		}

		set_state({state : 'o'});
		
		//создаем заголовки
		const room_desc=['КОМНАТА #','ROOM #'][LANG]+room_name.slice(6);
		objects.t_room_name.text=room_desc;				

	},
	
	change_room(new_room){
				
		//создаем заголовки
		const room_desc=['КОМНАТА #','ROOM #'][LANG]+new_room.slice(6);
		objects.t_room_name.text=room_desc;
		
		//отписываемся от изменений текущей комнаты
		fbs.ref(room_name).off('value');
		
		//анимации разные
		anim2.add(objects.cards_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy]}, true, 0.1,'linear');
		anim2.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy]}, true, 0.1,'linear');
		objects.cards_cont.x=0;
		
		//отключаем все карточки
		objects.mini_cards.forEach(c=>c.visible=false);
		
		room_name=new_room;
		
		set_state ({state : 'o'});
		
		//бота нету
		this.bot_on=0;
		
		//подписываемся на изменения состояний пользователей
		fbs.ref(room_name).on('value', snapshot => {lobby.players_list_updated(snapshot.val());});
		
	},
		
	pref_btn_down(){
		
		//если какая-то анимация
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		
		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_pref_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_pref_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	
		
		//убираем контейнер
		anim2.add(objects.cards_cont,{x:[objects.cards_cont.x,800]}, false, 0.2,'linear');
		anim2.add(objects.pref_cont,{x:[-800,objects.pref_cont.sx]}, true, 0.2,'linear');
		
		//меняем футер
		anim2.add(objects.lobby_footer_cont,{y:[objects.lobby_footer_cont.y,450]}, false, 0.2,'linear');
		anim2.add(objects.pref_footer_cont,{y:[450,objects.pref_footer_cont.sy]}, true, 0.2,'linear');
		pref.activate();
		
	},

	players_list_updated(players) {
	
		//console.log(new Date(Date.now()).toLocaleTimeString());
		//если мы в игре то пока не обновляем карточки
		//if (state==='p'||state==='b')
		//	return;				

		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};
		
		//удаляем инвалидных игроков
		for (let uid in players){	
			if(!players[uid].name||!players[uid].rating||!players[uid].state)
				delete players[uid];
		}

		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков и обновляем кэш
		for (let uid in players){	

			const player=players[uid];

			//обновляем кэш с первыми данными			
			players_cache.update(uid,{name:player.name,rating:player.rating,hidden:player.hidden});
			
			if (player.state!=='p'&&!player.hidden)
				single[uid] = player.name;						
		}
		
		//оставляем только тех кто за столом
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			const small_opp_id = p_data[uid].opp_id;			
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
		for (let uid in p_data) {
			const opp_id = p_data[uid].opp_id;		
			if (p_data[opp_id]) {				
				if (uid === p_data[opp_id].opp_id && !tables[uid]) {					
					tables[uid] = opp_id;					
					delete p_data[opp_id];				
				}				
			}		
		}							
					
		//считаем сколько одиночных игроков и сколько столов
		const num_of_single = Object.keys(single).length;
		const num_of_tables = Object.keys(tables).length;
		const num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > objects.mini_cards.length) {
			const num_of_tables_cut = num_of_tables - (num_of_cards - objects.mini_cards.length);			
			const num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			const t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}
		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				const card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state, rating:players[card_uid].rating, name:players[card_uid].name});
			}
		}
		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=0;i<objects.mini_cards.length;i++) {			
			
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
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {			
		
			if (objects.mini_cards[i].visible && objects.mini_cards[i].type === 'table') {
				
				const uid1 = objects.mini_cards[i].uid1;	
				const uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {					
					const t_uid1 = t;
					const t_uid2 = tables[t];									
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
			this.place_new_card({uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем НОВЫЕ столы где свободно
		for (let uid in tables) {			
			const name1=players[uid].name
			const name2=players[tables[uid]].name
			
			const rating1= players[uid].rating
			const rating2= players[tables[uid]].rating
			
			const game_id=players[uid].game_id;
			this.place_table({uid1:uid,uid2:tables[uid],name1, name2, rating1, rating2,game_id});
		}
		
	},

	add_card_ai() {
		
		const card=objects.mini_cards[0]
		
		//убираем элементы стола так как они не нужны
		card.rating_text1.visible = false;
		card.rating_text2.visible = false;
		card.avatar1.visible = false;
		card.avatar2.visible = false;
		card.avatar1_frame.visible = false;
		card.avatar2_frame.visible = false;
		card.table_rating_hl.visible = false;
		card.bcg.texture=assets.mini_player_card_ai;

		card.visible=true;
		card.uid='bot';
		card.name=card.name_text.text=['Бот','Bot'][LANG];

		card.rating=1400;		
		card.rating_text.text = card.rating;
		card.avatar.set_texture(assets.pc_icon);
		
		//также сразу включаем его в кэш
		if(!players_cache.players.bot){
			players_cache.players.bot={};
			players_cache.players.bot.name=['Бот','Bot'][LANG];
			players_cache.players.bot.rating=1400;
			players_cache.players.bot.texture=assets.pc_icon;			
		}
	},
	
	get_state_texture(s,uid) {
	
	
		switch(s) {

			case 'o':
				return assets.mini_player_card;
			break;

			case 'b':
				return assets.mini_player_card_bot;
			break;

			case 'p':
				return assets.mini_player_card;
			break;
			
			case 'b':
				return assets.mini_player_card;
			break;

		}
	},
	
	place_table(params={uid1:0,uid2:0,name1: 'X',name2:'X', rating1: 1400, rating2: 1400,game_id:0}) {
				
				
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {
			
			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state);
				card.state=params.state;

				card.type = "table";				
				
				card.bcg.texture = assets.mini_player_card_table;
				
				//присваиваем карточке данные
				//card.uid=params.uid;
				card.uid1=params.uid1;
				card.uid2=params.uid2;
												
				//убираем элементы свободного стола
				card.rating_text.visible = false;
				card.avatar.visible = false;
				card.avatar_frame.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.name_text.visible = false;

				//Включаем элементы стола 
				card.table_rating_hl.visible=true;
				card.rating_text1.visible = true;
				card.rating_text2.visible = true;
				card.avatar1.visible = true;
				card.avatar2.visible = true;
				card.avatar1_frame.visible = true;
				card.avatar2_frame.visible = true;
				//card.rating_bcg.visible = true;

				card.rating_text1.text = params.rating1;
				card.rating_text2.text = params.rating2;
				
				card.name1 = params.name1;
				card.name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:card.avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:card.avatar2});


				card.visible=true;
				card.game_id=params.game_id;

				break;
			}
		}
		
	},

	update_existing_card(params={id:0, state:'o' , rating:1400, name:''}) {

		//устанавливаем цвет карточки в зависимости от состояния( аватар не поменялись)
		const card=objects.mini_cards[params.id];
		card.bcg.texture=this.get_state_texture(params.state,card.uid);
		card.state=params.state;

		card.name_text.set2(params.name,105);
		card.rating=params.rating;
		card.rating_text.text=params.rating;
		card.visible=true;
	},

	place_new_card(params={uid:0, state: 'o', name:'X ', rating: rating}) {

		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			//ссылка на карточку
			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state,params.uid);
				card.state=params.state;

				card.type = 'single';
				
				//присваиваем карточке данные
				card.uid=params.uid;

				//убираем элементы стола так как они не нужны
				card.rating_text1.visible = false;
				card.rating_text2.visible = false;
				card.avatar1.visible = false;
				card.avatar2.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.table_rating_hl.visible=false;
				
				//включаем элементы одиночной карточки
				card.rating_text.visible = true;
				card.avatar.visible = true;
				card.avatar_frame.visible = true;
				card.name_text.visible = true;

				card.name=params.name;
				card.name_text.set2(params.name,105);
				card.rating=params.rating;
				card.rating_text.text=params.rating;

				card.visible=true;


				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:card.avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				return;
			}
		}

	},

	async load_avatar2 (params={}) {		
		
		//обновляем или загружаем аватарку
		await players_cache.update_avatar(params.uid);
		
		//устанавливаем если это еще та же карточка
		params.tar_obj.set_texture(players_cache.players[params.uid].texture);			
	},

	card_down(card_id) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog(card_id) {
					
		
		//если какая-то анимация или открыт диалог
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();
		
		anim2.add(objects.td_cont,{y:[-400, objects.td_cont.sy]}, true, 0.1,'easeOutBack');
		
		const card=objects.mini_cards[card_id];
		
		objects.td_cont.card=card;
		
		objects.td_avatar1.set_texture(players_cache.players[card.uid1].texture);
		objects.td_avatar2.set_texture(players_cache.players[card.uid2].texture);
		
		objects.td_rating1.text = card.rating_text1.text;
		objects.td_rating2.text = card.rating_text2.text;
		
		objects.td_name1.set2(card.name1, 140);
		objects.td_name2.set2(card.name2, 140);
		
	},
	
	close_table_dialog() {
		sound.play('close_it');
		anim2.add(objects.td_cont,{y:[objects.td_cont.y, 450]}, false, 0.1,'linear');
	},

	show_invite_dialog(card_id) {

			//если какая-то анимация или уже сделали запрос
		if (anim2.any_on() || pending_player!=='' || objects.invite_cont.visible) {
			sound.play('locked');
			return
		};		
				
		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		const card=objects.mini_cards[card_id];
		pending_player="";

		sound.play('click');			

		//показыаем кнопку приглашения
		objects.invite_btn.texture=assets.invite_btn;
	
		anim2.add(objects.invite_cont,{y:[-500, objects.invite_cont.sy]}, true, 0.15,'easeOutBack');
		
		//копируем предварительные данные
		lobby._opp_data = {uid:card.uid,name:card.name,rating:card.rating};
			

		let invite_available = 	lobby._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (card.state==='o' || card.state==='b');
		invite_available=invite_available || lobby._opp_data.uid==='bot';
		invite_available=invite_available && lobby._opp_data.rating >= 50 && my_data.rating >= 50;
		
		//показываем сыгранные игры
		if (lobby._opp_data.uid === my_data.uid){
			objects.invite_games.text='Игры: '+my_data.games;
		}else{
			objects.invite_games.text='';
		}
		
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_btn.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.set_texture(players_cache.players[card.uid].texture);
		objects.invite_name.set2(lobby._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[card_id].rating_text.text;
				
	},
	
	fb_delete_down(){
		
		objects.fb_delete_btn.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);
		
		message.add(['Отзывы удалены','Feedbacks are removed'][LANG])
		
	},
	
	async show_invite_dialog_from_chat(uid,name) {

		//если какая-то анимация или уже сделали запрос
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};		
				
		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');			
		

		//показыаем кнопку приглашения
		objects.invite_btn.texture=assets.invite_btn;
	
		anim2.add(objects.invite_cont,{y:[-500, objects.invite_cont.sy]}, true, 0.15,'easeOutBack');
		
		let player_data={uid};
		//await this.update_players_cache_data(uid);
					
		//копируем предварительные данные
		lobby._opp_data = {uid,name:players_cache.players[uid].name,rating:players_cache.players[uid].rating};
										
		
		let invite_available=lobby._opp_data.uid !== my_data.uid;
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_btn.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.set_texture(players_cache.players[uid].texture);
		objects.invite_name.set2(players_cache.players[uid].name,230);
		objects.invite_rating.text=players_cache.players[uid].rating;
	},

	async show_feedbacks(uid) {	


			
		//получаем фидбэки сначала из кэша, если их там нет или они слишком старые то загружаем из фб
		let fb_obj;		
		if (!this.fb_cache[uid] || (Date.now()-this.fb_cache[uid].tm)>120000) {
			let _fb = await fbs.ref("fb/" + uid).once('value');
			fb_obj =_fb.val();	
			
			//сохраняем в кэше отзывов
			this.fb_cache[uid]={};			
			this.fb_cache[uid].tm=Date.now();					
			if (fb_obj){
				this.fb_cache[uid].fb_obj=fb_obj;				
			}else{
				fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
				this.fb_cache[uid].fb_obj=fb_obj;				
			}

			//console.log('загрузили фидбэки в кэш')				
			
		} else {
			fb_obj =this.fb_cache[uid].fb_obj;	
			//console.log('фидбэки из кэша ,ура')
		}

		
		
		var fb = Object.keys(fb_obj).map((key) => [fb_obj[key][0],fb_obj[key][1],fb_obj[key][2]]);
		
		//сортируем отзывы по дате
		fb.sort(function(a,b) {
			return b[1]-a[1]
		});	
	
		
		//сначала убираем все фидбэки
		objects.feedback_records.forEach(fb=>fb.visible=false)

		let prv_fb_bottom=0;
		const fb_cnt=Math.min(fb.length,objects.feedback_records.length);
		for (let i = 0 ; i < fb_cnt;i++) {
			const fb_place=objects.feedback_records[i];
			
			let sender_name =  fb[i][2] || 'Неизв.';
			if (sender_name.length > 10) sender_name = sender_name.substring(0, 10);		
			fb_place.set(sender_name,fb[i][0]);
			
			
			const fb_height=fb_place.text.textHeight*0.85;
			const fb_end=prv_fb_bottom+fb_height;
			
			//если отзыв будет выходить за экран то больше ничего не отображаем
			const fb_end_abs=fb_end+objects.invite_cont.y+objects.invite_feedback.y;
			if (fb_end_abs>450) return;
			
			fb_place.visible=true;
			fb_place.y=prv_fb_bottom;
			prv_fb_bottom+=fb_height;
		}
	
	},

	async close() {

		if (objects.invite_cont.visible === true)
			this.close_invite_dialog();
		
		if (objects.td_cont.visible === true)
			this.close_table_dialog();
		
		some_process.lobby=function(){};
		
		if (objects.pref_cont.visible)
			pref.close();

		//плавно все убираем
		anim2.add(objects.cards_cont,{alpha:[1, 0]}, false, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[ objects.lobby_footer_cont.y,450]}, false, 0.2,'linear');
		anim2.add(objects.lobby_header_cont,{y:[objects.lobby_header_cont.y,-50]}, false, 0.2,'linear');
		
		//больше ни ждем ответ ни от кого
		pending_player='';
		this.on=0;
		
		//отписываемся от изменений состояний пользователей через 30 секунд
		this.state_listener_timeout=setTimeout(()=>{
			fbs.ref(room_name).off();
			this.state_listener_on=0;
			//console.log('Отключаем прослушивание...');
		},30000);

	},
	
	async inst_message(data){
		
		//когда ничего не видно не принимаем сообщения
		if(!objects.cards_cont.visible) return;		

		await players_cache.update(data.uid);
		await players_cache.update_avatar(data.uid);		
		
		sound.play('inst_msg');		
		anim2.add(objects.inst_msg_cont,{alpha:[0, 1]},true,0.4,'linear',false);		
		objects.inst_msg_avatar.texture=players_cache.players[data.uid].texture||PIXI.Texture.WHITE;
		objects.inst_msg_text.set2(data.msg,290);
		objects.inst_msg_cont.tm=Date.now();
	},
	
	get_room_index_from_rating(){		
		//номер комнаты в зависимости от рейтинга игрока
		const rooms_bins=[0,1366,1437,1580,9999];
		let room_to_go='state1';
		for (let i=1;i<rooms_bins.length;i++){
			const f=rooms_bins[i-1];
			const t=rooms_bins[i];		
			if (my_data.rating>f&&my_data.rating<=t)
				return i;
		}				
		return 1;
		
	},
	
	process(){
		
		const tm=Date.now();
		if (objects.inst_msg_cont.visible&&objects.inst_msg_cont.ready)
			if (tm>objects.inst_msg_cont.tm+7000)
				anim2.add(objects.inst_msg_cont,{alpha:[1, 0]},false,0.4,'linear');

	},
	
	peek_down(){
		
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		this.close();	
		
		//активируем просмотр игры
		game_watching.activate(objects.td_cont.card);
	},
	
	wheel_event(dir) {
		
	},
	
	async fb_my_down() {
		
		
		if (this._opp_data.uid !== my_data.uid || objects.feedback_cont.visible === true)
			return;
		
		let fb = await feedback.show(this._opp_data.uid);
		
		//перезагружаем отзывы если добавили один
		if (fb[0] === 'sent') {
			let fb_id = irnd(0,50);			
			await fbs.ref("fb/"+this._opp_data.uid+"/"+fb_id).set([fb[1], firebase.database.ServerValue.TIMESTAMP, my_data.name]);
			this.show_feedbacks(this._opp_data.uid);			
		}
		
	},

	close_invite_dialog() {

		sound.play('close_it');

		if (objects.invite_cont.visible===false)
			return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim2.add(objects.invite_cont,{y:[objects.invite_cont.y, 500]}, false, 0.15,'linear');
	},

	async send_invite() {


		if (!objects.invite_cont.ready||!objects.invite_cont.visible||objects.invite_btn.texture===assets.wait_response)
			return;

		if (anim2.any_on()){
			sound.play('locked');
			return
		};
		

		if (lobby._opp_data.uid==='bot')
		{
			await this.close();	

			opp_data.name='Бот';
			opp_data.uid='bot';
			opp_data.rating=1400;
			game.activate('master', bot_player );
			
			
		} else {
			sound.play('click');
			objects.invite_btn.texture=assets.wait_response;
			fbs.ref('inbox/'+lobby._opp_data.uid).set({sender:my_data.uid,message:'INV',tm:Date.now()});
			pending_player=lobby._opp_data.uid;

		}

	},

	rejected_invite(msg) {

		this.rejected_invites[pending_player]=Date.now();
		pending_player="";
		lobby._opp_data={};
		this.close_invite_dialog();
		if(msg==='REJECT_ALL')
			big_message.show(['Соперник пока не принимает приглашения.','The opponent refused to play.'][LANG],'---');
		else
			big_message.show(['Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','The opponent refused to play. You can repeat the invitation in 1 minute'][LANG],'---');

	},

	async accepted_invite(seed) {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=lobby._opp_data;
		
		//закрываем меню и начинаем игру
		await lobby.close();
		game.activate('master' , online_player );

		
	},

	chat_btn_down(){
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		
		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_chat_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_chat_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	
		
		this.close();
		chat.activate();
		
	},

	quiz_btn_down(){
		
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};		
		
		//sound.play('locked');
		//return
					
		sound.play('click');	
				
		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_quiz_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_quiz_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	
		
		this.close();
		quiz.activate();
	},

	async lb_btn_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_lb_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_lb_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	


		await this.close();
		lb.show();
	},
	
	list_btn_down(dir){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		const cur_x=objects.cards_cont.x;
		const new_x=cur_x-dir*800;
		
		
		//подсветка
		const tar_btn={'-1':objects.lobby_left_btn,'1':objects.lobby_right_btn}[dir];
		objects.lobby_btn_hl.x=tar_btn.x;
		objects.lobby_btn_hl.y=tar_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	
		
		
		if (new_x>0 || new_x<-800) {
			sound.play('locked');
			return
		}
		
		anim2.add(objects.cards_cont,{x:[cur_x, new_x]},true,0.2,'easeInOutCubic');
	},

	async back_btn_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		main_menu.activate();

	}

}

pin_panel={
	
	buttons_data:[[20,101,69.13,150,'pin_btn_1'],[80,101,129.13,150,'pin_btn_2'],[140,101,190,151,'pin_btn_3'],[20,160,70,210,'pin_btn_4'],[80,160,130,210,'pin_btn_5'],[140,160,190,210,'pin_btn_6'],[20,220,70,271,'pin_btn_7'],[80,221,130,271,'pin_btn_8'],[140,221,190,271,'pin_btn_9'],[20,281,130,331,'pin_btn_create'],[140,281,250,331,'pin_btn_enter'],[200,21,250,71,'pin_btn_erase'],[200,101,250,151,'pin_btn_close']],
	t_pin:'',
	check_is_on:0,
	admin_mode:0,
	
	activate(){
		
		anim2.add(objects.pin_panel_cont,{alpha:[0, 1]}, true, 0.1,'linear');	
		objects.pin_panel_msg.text='Введите четырехзначный номер комнаты';
		anim2.add(objects.pin_panel_msg,{alpha:[0, 1]}, true, 0.15,'easeTwiceBlink');		
		
	},
		
	btn_down(e){

		//координаты нажатия в плоскости спрайта клавиатуры
		let mx = e.data.global.x/app.stage.scale.x - objects.pin_panel_bcg.x;
		let my = e.data.global.y/app.stage.scale.y - objects.pin_panel_bcg.y;
		
		//ищем попадание нажатия на кнопку
		let margin = 2;
		let button_data=0;
		for (let k of this.buttons_data){
			if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin){
				button_data=k;
				break;
			}			
		}	
		
		if(!button_data) return;
		
		let [x,y,x2,y2,key]=button_data;
		
		//подсвечиваем клавишу
		objects.pin_panel_hl.width=20+x2-x;
		objects.pin_panel_hl.height=20+y2-y;		
		objects.pin_panel_hl.x = x+objects.pin_panel_bcg.x-10;
		objects.pin_panel_hl.y = y+objects.pin_panel_bcg.y-10;			
		anim2.add(objects.pin_panel_hl,{alpha:[0, 1]}, false, 0.15,'easeTwiceBlink',false);
		
		
		key=key.slice(8);
		
		if (isNaN(key)){
			
			if (key==='erase'){
				this.t_pin='';
				this.update_pin();				
			}			
			
			if (key==='enter')
				this.enter_room_down();					
			
			
			if (key==='create')
				this.create_room_down();			
			
			
			if (key==='close')
				this.close_btn_down();		
			
			
		}else{
			
			this.pin_btn_down(key)
			
		}
		
		console.log(button_data);
	
		
	},
	
	pin_btn_down(num){
		
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		
		this.t_pin+=num;
		if (this.t_pin.length>4) return;
		this.update_pin();		
	},
	
	
	update_pin(){
		
		const t_pins=[objects.t_pin0,objects.t_pin1,objects.t_pin2,objects.t_pin3];		
		t_pins.forEach(t=>t.text='');
		for (let c=0;c<this.t_pin.length;c++)
			t_pins[c].text=this.t_pin[c];
		
	},
			
	create_room_down(){
		
		if(!this.admin_mode){
			objects.pin_panel_msg.text='Это функция недоступна';
			anim2.add(objects.pin_panel_msg,{alpha:[0, 1]}, true, 0.15,'easeTwiceBlink',false);	
			return;				
		}

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		
		
		if (this.t_pin.length!==4) return;
		
		//создаем комнату
		fbs.ref(`states${this.t_pin}/tm`).set(firebase.database.ServerValue.TIMESTAMP);
		objects.pin_panel_msg.text='Создали комнату №'+this.t_pin;
		anim2.add(objects.pin_panel_msg,{alpha:[0, 1]}, true, 0.15,'easeTwiceBlink');
	},
	
	async enter_room_down(){

		
		if (anim2.any_on() || this.t_pin.length!==4||this.check_is_on) {
			sound.play('locked');
			return
		};		
		
		
		this.check_is_on=1;
		sound.play('click');			
		
		const check_room=await fbs_once('states'+this.t_pin);
		this.check_is_on=0;		
		if (!check_room){
			this.t_pin='';
			this.update_pin();
			objects.pin_panel_msg.text='Такой комнаты не существует';
			anim2.add(objects.pin_panel_msg,{alpha:[0, 1]}, true, 0.15,'easeTwiceBlink');	
			return;
		} 
		

		fbs.ref(room_name+'/'+my_data.uid).remove();
		room_name='states'+this.t_pin;		
		fbs.ref(`states${this.t_pin}/tm`).set(firebase.database.ServerValue.TIMESTAMP);
		fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();
		set_state({state : 'o'});		
		this.close();
		main_menu.close();
		lobby.activate();
		
		
	},
	
	close_btn_down(){
		
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		
		this.close();
		
	},
	
	close(){
		
		anim2.add(objects.pin_panel_cont,{alpha:[1, 0]}, false, 0.1,'linear');	
		
	},
	
	erase_pin_down(){
		
		
	},
	
	exit_down(){
		
		
	}
		
}

auth = {
		
	load_script(src) {
	  return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.onload = () => resolve(1)
        script.onerror = () => resolve(0)
        script.src = src
        document.head.appendChild(script)
	  })
	},
		
	get_random_char() {		
		
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		return chars[irnd(0,chars.length-1)];
		
	},
		
	get_random_name(e_str) {
		
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
	
	get_random_uid_for_local (prefix) {
		
		let uid = prefix;
		for ( let c = 0 ; c < 12 ; c++ )
			uid += this.get_random_char();
		
		//сохраняем этот uid в локальном хранилище
		try {
			localStorage.setItem('poker_uid', uid);
		} catch (e) {alert(e)}
					
		return uid;
		
	},
		
	async init() {	
			
		if (game_platform === 'YANDEX') {
				

			function loadSDK() {
				return new Promise((resolve, reject) => {
					var s = document.createElement('script');
					s.src = "https://sdk.games.s3.yandex.net/sdk.js";
					s.async = true;
					s.onload = resolve;
					s.onerror = reject;
					document.body.appendChild(s);
				});
			}

			async function initSDK() {
				try {
					await loadSDK();
					// Your SDK initialization code here
					console.log("SDK loaded successfully");
				} catch (error) {
					console.error("Failed to load SDK:", error);
				}
			}

			await initSDK();
	
			let _player;			
			try {
				window.ysdk = await YaGames.init({});			
				_player = await window.ysdk.getPlayer();
			} catch (e) { alert(e)};
			
			my_data.name=_player.getName();
			my_data.uid=_player.getUniqueID().replace(/\//g, "Z");
			my_data.orig_pic_url=_player.getPhoto('medium');						
			my_data.name = my_data.name || this.get_random_name(my_data.uid);
			my_data.auth_mode=_player.getMode()==='lite'?0:1;
			
			//убираем ё
			my_data.name=my_data.name.replace(/ё/g, 'е');
			my_data.name=my_data.name.replace(/Ё/g, 'Е');
			
			return;
		}
		
		if (game_platform === 'VK') {
			
			game_platform = 'VK';
			
			await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')||await this.load_script('https://akukamil.github.io/common/vkbridge.js');

			let _player;
			
			try {
				await vkBridge.send('VKWebAppInit');
				_player = await vkBridge.send('VKWebAppGetUserInfo');				
			} catch (e) {alert(e)};

			
			my_data.name = _player.first_name + ' ' + _player.last_name;
			my_data.uid  = "vk"+_player.id;
			my_data.orig_pic_url = _player.photo_100;
			my_data.auth_mode=1;
			
			//убираем ё
			my_data.name=my_data.name.replace(/ё/g, 'е');
			my_data.name=my_data.name.replace(/Ё/g, 'Е');
			return;
			
		}
		
		if (game_platform === 'DEBUG') {		

			my_data.name = my_data.uid = 'debug' + prompt('Отладка. Введите ID', 100);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;	
			my_data.auth_mode='debug';			
			return;
		}
		
		if (game_platform === 'UNKNOWN') {
			
			//если не нашли платформу
			alert('Неизвестная платформа. Кто Вы?')
			my_data.uid = this.get_random_uid_for_local('LS_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;		
			my_data.auth_mode=0;
		}
	}
	
}

tabvis={
	
	inactive_timer:0,
	sleep:0,
	
	change(){
		
		if (document.hidden){
			
			//start wait for
			this.inactive_timer=setTimeout(()=>{this.send_to_sleep()},120000);
			
		}else{
			
			if(this.sleep){		
				console.log('Проснулись');
				my_ws.reconnect('wakeup');
				this.sleep=0;
			}
			
			clearTimeout(this.inactive_timer);			
		}		
		
		set_state({hidden : document.hidden});
		
	},
	
	send_to_sleep(){		
		
		console.log('погрузились в сон')
		this.sleep=1;
		if (lobby.on){
			fbs.ref(room_name+'/'+my_data.uid).remove();
			lobby.close()
			main_menu.activate();				
		}		
		my_ws.send_to_sleep();		
	}
	
}

function resize() {
    const vpw = document.body.clientWidth;  // Width of the viewport
    const vph = document.body.clientHeight; // Height of the viewport
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

	let small_opp_id='';
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	if(!no_invite)
		fbs.ref(room_name+'/'+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

}

function define_platform_and_language() {
	
	let s = window.location.href;
	
	if (s.includes('yandex')) {
		
		game_platform = 'YANDEX';
		return;
	}
	
	if (s.includes('vk.com')) {
		game_platform = 'VK';	
		return;
	}
			
	if (s.includes('google_play')) {
			
		game_platform = 'GOOGLE_PLAY';	
		return;
	}	

	if (s.includes('my_games')) {
			
		game_platform = 'MY_GAMES';	
		return;	
	}	
	
	if (s.includes('192.168.')||s.includes('127.0.')) {
			
		game_platform = 'DEBUG';	
		return;	
	}	
	
	game_platform = 'UNKNOWN';	
	
}

async function load_resources() {
	
	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/

	git_src="https://akukamil.github.io/balda/"
	//git_src=""

	const loader=new PIXI.Loader();
	loader.add('1', git_src+'fonts/exosoft_bold_128/font.fnt');//это для поля
	loader.add('2', git_src+'fonts/exosoft_bold_64/font.fnt');//это для поля
	loader.add('3', git_src+'fonts/core_sans_ds/font.fnt');
	
	loader.add('click',git_src+'/sounds/click.mp3');
	loader.add('locked',git_src+'/sounds/locked.mp3');
	loader.add('clock',git_src+'/sounds/clock.mp3');
	loader.add('close_it',git_src+'/sounds/close_it.mp3');
	loader.add('game_start',git_src+'/sounds/game_start.mp3');
	loader.add('lose',git_src+'/sounds/lose.mp3');
	loader.add('receive_move',git_src+'/sounds/receive_move.mp3');
	loader.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
	loader.add('bad_word',git_src+'/sounds/bad_word.mp3');
	loader.add('good_word',git_src+'/sounds/good_word.mp3');
	loader.add('key_down',git_src+'/sounds/key_down.mp3');
	loader.add('cell_down',git_src+'/sounds/cell_down.mp3');
	loader.add('cell_move',git_src+'/sounds/cell_move.mp3');
	loader.add('bad_move',git_src+'/sounds/bad_move.mp3');
	loader.add('win',git_src+'/sounds/win.mp3');
	loader.add('invite',git_src+'/sounds/invite.mp3');
	loader.add('draw',git_src+'/sounds/draw.mp3');
	loader.add('keypress',git_src+'/sounds/keypress.mp3');
	loader.add('online_message',git_src+'/sounds/online_message.mp3');
	loader.add('inst_msg',git_src+'sounds/inst_msg.mp3');
	
	for (let i=1;i<9;i++)
		loader.add('cell_click'+i,git_src+`sounds/cell_click${i}.mp3`);

	//добавляем смешные загрузки
	loader.add('fun_logs', 'https://akukamil.github.io/common/fun_logs.txt');	
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === 'sprite' || load_list[i].class === 'image' )
            loader.add(load_list[i].name, git_src+'res/RUS/' + load_list[i].name + '.' +  load_list[i].image_format);		

	loader.onProgress.add(l=>{
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	})	
	await new Promise(resolve=> loader.load(resolve));
	
	//загружаем и переносим в assets
	await new Promise(resolve=> loader.load(resolve));
	for (const res_name in loader.resources){
		const res=loader.resources[res_name];			
		assets[res_name]=res.texture||res.sound||res.data;			
	}	

}

async function init_game_env() {	
	
	await define_platform_and_language();	
	
	//ждем когда загрузятся ресурсы
	await load_resources();

	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";

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
	
	//коротко файрбейс
	fbs=firebase.database();

	//создаем приложение
	
	const dw=M_WIDTH/document.body.clientWidth;
	const dh=M_HEIGHT/document.body.clientHeight;
	const resolution=Math.min(1.5,Math.max(dw,dh,1));	
	const opts={width:M_WIDTH, height:M_HEIGHT,antialias:false,resolution,autoDensity:true};
	app.stage = new PIXI.Container();
	app.renderer = new PIXI.Renderer(opts);
	document.body.appendChild(app.renderer.view).style["boxShadow"] = "0 0 15px #000000";
	document.body.style.backgroundColor = 'rgb(62,52,62)';

	//доп функция для текста битмап
	PIXI.BitmapText.prototype.set2=function(text,w){		
		const t=this.text=text;
		for (i=t.length;i>=0;i--){
			this.text=t.substring(0,i)
			if (this.width<w) return;
		}	
	}

	//доп функция для применения текстуры к графу
	PIXI.Graphics.prototype.set_texture=function(texture){		
	
		if(!texture) return;
		// Get the texture's original dimensions
		const textureWidth = texture.baseTexture.width;
		const textureHeight = texture.baseTexture.height;

		// Calculate the scale to fit the texture to the circle's size
		const scaleX = this.w / textureWidth;
		const scaleY = this.h / textureHeight;

		// Create a new matrix for the texture
		const matrix = new PIXI.Matrix();

		// Scale and translate the matrix to fit the circle
		matrix.scale(scaleX, scaleY);
		const radius=this.w*0.5;
		this.clear();
		this.beginTextureFill({texture,matrix});		
		this.drawCircle(radius, radius, radius);		
		this.endFill();		
		
	}
		
	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(assets[obj_name]);
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
	
	//анимация лупы
	some_process.loup_anim=function() {
		objects.id_loup.x=20*Math.sin(game_tick*8)+90;
		objects.id_loup.y=20*Math.cos(game_tick*8)+150;
	}

	//смешные логи
	const runScyfiLogs=async () => {
		const scyfi_logs=JSON.parse(assets.fun_logs);	
		for (let i=0;i<10;i++){				
			const log_index=irnd(0,scyfi_logs.length-1);
			objects.scyfi_log.text=scyfi_logs[log_index];
			await new Promise(resolve=>setTimeout(resolve, irnd(300,700)));		
		}
	};
	runScyfiLogs();

	//подгружаем библиотеку аватаров
	await auth.load_script(git_src+'/multiavatar.min.js');

	//получаем данные об игроке из социальных сетей
	await auth.init();
		
	//загружаем остальные данные из файербейса
	const other_data = await fbs_once('players/' + my_data.uid);
	
	//делаем защиту от неопределенности
	my_data.rating = other_data?.rating || 1400;
	my_data.games = other_data?.games || 0;
	my_data.nick_tm = other_data?.nick_tm || 0;
	my_data.avatar_tm = other_data?.avatar_tm || 0;
	my_data.name=other_data?.name || my_data.name;

	//правильно определяем аватарку
	if (other_data?.pic_url.includes('mavatar'))
		my_data.pic_url=other_data.pic_url
	else
		my_data.pic_url=my_data.orig_pic_url		
		
	//чуть ждем баннерную рекламу
	ad.prv_banner_show=Date.now()+200000;
	
	//проверяем блокировку
	my_data.blocked=await fbs_once('blocked/'+my_data.uid);
		
	//загружаем мои данные в кэш
	await players_cache.update(my_data.uid,{pic_url:my_data.pic_url, rating:my_data.rating});
	await players_cache.update_avatar(my_data.uid);
	
	//устанавливаем фотки в попап
	objects.id_name.set2(my_data.name,150);	
	objects.my_card_name.set2(my_data.name,150);	
	objects.id_avatar.set_texture(players_cache.players[my_data.uid].texture);
	objects.my_avatar.texture=players_cache.players[my_data.uid].texture;

	//номер комнаты в зависимости от рейтинга игрока
	const rooms_bins=[0,1374,1399,1415,1444,1485,1511,1584,1738,9999];
	for (let i=1;i<rooms_bins.length;i++){
		const f=rooms_bins[i-1];
		const t=rooms_bins[i];		
		if (my_data.rating>f&&my_data.rating<=t){
			room_name='states'+i;
			break;
		}
	}
			
	
	//room_name= 'states10';

	
	//устанавливаем рейтинг в попап
	objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

	//обновляем почтовый ящик
	fbs.ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

	//подписываемся на новые сообщения
	fbs.ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

	//обновляем данные в файербейс так как могли поменяться имя или фото
	fbs.ref("players/"+my_data.uid).set({
		name:my_data.name,
		pic_url: my_data.pic_url,
		auth_mode:my_data.auth_mode||0,
		avatar_tm:my_data.avatar_tm,
		nick_tm:my_data.nick_tm,
		rating : my_data.rating,		
		games : my_data.games,
		nav:navigator?.userAgent||'no',
		session_start:firebase.database.ServerValue.TIMESTAMP,
		tm:firebase.database.ServerValue.TIMESTAMP});

	//устанавливаем мой статус в онлайн
	set_state({state : 'o'});

	//отключение от игры и удаление не нужного
	fbs.ref("inbox/"+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	//это событие когда меняется видимость приложения
	document.addEventListener("visibilitychange", function(){tabvis.change()});

	//для удаления дубликатов
	fbs.ref('inbox/'+my_data.uid).set({message:'CLIEND_ID',tm:Date.now(),client_id});

	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);
	
	//загрузка сокета
	await auth.load_script('https://akukamil.github.io/common/my_ws.js');	
		
	//ждем загрузки чата
	await Promise.race([
		chat.init(),
		new Promise(resolve=> setTimeout(() => {console.log('chat is not loaded!');resolve()}, 5000))
	]);
	
	
	//убираем лупу
	some_process.loup_anim = function(){};		
	anim2.add(objects.id_cont,{y:[objects.id_cont.y, -200]}, false, 1,'easeInBack');	
		
	//контроль за присутсвием
	var connected_control = fbs.ref(".info/connected");
	connected_control.on("value", (snap) => {
		if (snap.val() === true) {
			if(!connected)
				message.add('Связь с сервером восстановлена!');
			connected = 1;
		} else {
			message.add('Связь с сервером потеряна!');
			connected = 0;
		}
	});
		
	//событие ролика мыши в карточном меню и нажатие кнопки
	window.addEventListener("wheel", (event) => {chat.wheel_event(Math.sign(event.deltaY))});	
	window.addEventListener('keydown',function(event){keyboard.keydown(event.key)});
		
	//показыаем основное меню
	main_menu.activate();
		
	//заполняем клавиатуру
	for (let i = 0 ; i < 33 ; i ++)
		objects.keys[i].letter.text = rus_let[i];
	
	if (game_platform==='YANDEX')
		window.ysdk.features.LoadingAPI?.ready()
		
	console.clear()

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