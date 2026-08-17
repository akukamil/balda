const M_WIDTH=800, M_HEIGHT=450;
var app ={stage:{},renderer:{}}, assets={},fbs,SERVER_TM=0, objects={}, state='',git_src, my_role='', game_tick=0, my_turn=0, game_id=0, start_word='БАЛДА', me_conf_play=0,opp_conf_play=0, client_id =0, hidden=0, game_platform='', ROOM_NAME = '', connected = 1,no_invite=false, pending_player='', my_data={opp_id : ''},opp_data={}, some_process = {},game_name='balda';
const rus_let = ['А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я'];
const rus_let2 = ['А','Б','В','Г','Д','Е','Ж','З','И','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я'];
const adj_cells = {0:[1,5],1:[0,6,2],2:[1,7,3],3:[2,8,4],4:[3,9],5:[0,6,10],6:[1,5,7,11],7:[2,6,8,12],8:[3,7,9,13],9:[4,8,14],10:[5,11,15],11:[6,10,12,16],12:[7,11,13,17],13:[8,12,14,18],14:[9,13,19],15:[10,16,20],16:[11,15,17,21],17:[12,16,18,22],18:[13,17,19,23],19:[14,18,24],20:[15,21],21:[16,20,22],22:[17,21,23],23:[18,22,24],24:[19,23]};
const LANG=0;
const COM_URL='http://mtg.gitverse.site/com'
const TM={s:0,ms:0}

fbs_once=async function(path){
	const info=await fbs.ref(path).get()
	return info.val()
}

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
		this.name_text=new PIXI.BitmapText('', {fontName: 'core_sans_ds',fontSize: 22,align: 'center'});
		this.name_text.anchor.set(1,0);
		this.name_text.x=180;
		this.name_text.y=20;
		this.name_text.tint=0xffffff;		

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'core_sans_ds',fontSize: 29,align: 'center'});
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
		
		
		this.rating_text1=new PIXI.BitmapText('', {fontName: 'core_sans_ds',fontSize: 24,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=48.1;
		this.rating_text1.y=56;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'core_sans_ds',fontSize: 24,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150.1;
		this.rating_text2.y=56;		
		
		this.t_country=new PIXI.BitmapText('', {fontName: 'core_sans_ds',fontSize: 25,align: 'center'});
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

		this.place=new PIXI.BitmapText('', {fontName: 'core_sans_ds',fontSize: 25,align: 'center'});
		this.place.tint=0xffffff;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Graphics()
		this.avatar.x=43
		this.avatar.y=13
		this.avatar.w=this.avatar.h=44
		this.avatar.width=this.avatar.height=44


		this.name=new PIXI.BitmapText('', {fontName: 'core_sans_ds',fontSize: 25,align: 'center'});
		this.name.tint=0xcceeff;
		this.name.x=105;
		this.name.y=22;

		this.rating=new PIXI.BitmapText('', {fontName: 'core_sans_ds',fontSize: 25,align: 'center'});
		this.rating.x=305;
		this.rating.tint=0xFFFF00;
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

		this.bcg=new PIXI.Sprite(assets.big_letter_image);
		this.bcg.anchor.set(0.5,0.5);
		this.bcg.interactive=true;
		this.bcg.buttonMode = true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width=this.bcg.height=74.5;
		
		this.bcg2=new PIXI.Sprite(assets.big_letter_image_h);
		this.bcg2.anchor.set(0.5,0.5);
		this.bcg2.visible = false;
		this.bcg2.width=this.bcg2.height=74.5;
		
		this.bcg3=new PIXI.Sprite(assets.big_letter_image_h2);
		this.bcg3.anchor.set(0.5,0.5);
		this.bcg3.visible = false;
		this.bcg3.width=this.bcg3.height=74.5;

		this.letter=new PIXI.BitmapText('', {fontName: 'exosoft_bold_128',fontSize: 58});
		this.letter.tint=objects.cell_color;
		this.letter.anchor.set(0.5,0.5);
		this.letter.x=0;
		this.letter.y=1;
		
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

		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'core_sans_ds',fontSize: 17});
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

		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'core_sans_ds',fontSize: 19,lineSpacing:55,align: 'left'});
		this.msg.x=this.avatar.x+75;
		this.msg.y=this.avatar.y+30;
		this.msg.maxWidth=450;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = 0xffffff;

		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'core_sans_ds',fontSize: 15});
		this.msg_tm.tint=0x999999;
		this.msg_tm.anchor.set(1,0);

		this.visible = false;
		this.addChild(this.msg_bcg,this.gif_bcg,this.gif,this.avatar_bcg,this.avatar,this.avatar_frame,this.name,this.msg,this.msg_tm);

	}

	nameToColor(name) {
		  // Create a hash from the name
		  let hash = hf.hash(name)

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

	update_avatar(uid, tar_sprite) {

		//определяем pic_url
		const pdata=players_cache.get_pdata(uid)
		if(pdata)
			tar_sprite.set_texture(pdata.texture)
		else
			players_cache.update(uid,{source:'chat'})
	}

	async set(msg_data) {

		//получаем pic_url из фб
		this.avatar.set_texture(PIXI.Texture.WHITE);

		if (msg_data.uid==='admin'){
			this.msg_bcg.tint=0x55ff55;
			this.avatar.set_texture(assets.pc_icon);
		}else{
			this.msg_bcg.tint=0xffffff;
			this.update_avatar(msg_data.uid, this.avatar);
		}

		this.uid=msg_data.uid;
		this.tm=msg_data.tm;

		this.name.set2(msg_data.name,150);
		this.name.tint=this.nameToColor(msg_data.name);
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		
		this.visible = true;

		if (msg_data.gif_id){

			const base_t=await gif_sel.load_gif(`${COM_URL}/gifs/${msg_data.gif_id}.mp4`)

			if (!base_t) {
				console.log(`Не получилось загрузить гифку ${msg_data.gif_id}`)
				this.visible=false;
				return 0;
			}

			base_t.resource.source.play()
			base_t.resource.source.loop=true
			
			this.msg.text=''

			this.gif.texture=PIXI.Texture.from(base_t)
			this.gif.visible=true
			const aspect_ratio=base_t.width/base_t.height
			this.gif.height=90
			this.gif.width=this.gif.height*aspect_ratio
			this.msg_bcg.visible=false
			this.msg.visible=false
			this.msg_tm.anchor.set(0,0)
			this.msg_tm.y=this.gif.height+9
			this.msg_tm.x=this.gif.width+102

			this.gif_bcg.visible=true
			this.gif_bcg.height=this.gif.height
			this.gif_bcg.width=	this.gif.width
			return this.gif.height+30

		}else{

			this.gif_bcg.visible=false;
			this.gif.visible=false;
			this.msg_bcg.visible=true;
			this.msg.visible=true;

			this.msg.text=msg_data.msg;
			
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

anim3={

	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0,visible:false,ready:true, alpha:0},

	slots: new Array(50).fill().map(u => ({obj:{},on:0,block:true,params_num:0,p_resolve:0,progress:0,vis_on_end:false,tm:0,params:new Array(10).fill().map(u => ({param:'x',s:0,f:0,d:0,func:this.linear}))})),

	any_on() {

		for (let s of this.slots)
			if (s.on&&s.block)
				return true
		return false;
	},

	wait(seconds){
		return this.add(this.empty_spr,{x:[0,1,'linear']}, false, seconds);
	},

	linear(x) {
		return x
	},

	kill_anim(obj) {

		for (let i=0;i<this.slots.length;i++){
			const slot=this.slots[i];
			if (slot.on&&slot.obj===obj){
				this.finish_slot(slot)
				slot.p_resolve(2)
			}
		}
	},
	
	finish_all_slots(){		
		for (let i=0;i<this.slots.length;i++){
			const slot=this.slots[i];
			if (slot.on){
				this.finish_slot(slot)
				slot.p_resolve(3)
			}
		}
	},

	easeBridge(x){

		if(x<0.1)
			return x*10;
		if(x>0.9)
			return (1-x)*10;
		return 1
	},

	easeOutBack(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
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

	easeOutQuart(x){
		return 1 - Math.pow(1 - x, 4);
	},

	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	},

	easeTwiceBlink(x){

		if(x<0.333)
			return 1;
		if(x>0.666)
			return 1;
		return 0
	},

	flick(x){

		return Math.abs(Math.sin(x*6.5*3.141593));

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

	ease2back(x) {
		return Math.sin(x*Math.PI);
	},

	easeInOutCubic(x) {

		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},

	easeInOutBack(x) {

		return x < 0.5
		  ? (Math.pow(2 * x, 2) * ((this.c2 + 1) * 2 * x - this.c2)) / 2
		  : (Math.pow(2 * x - 2, 2) * ((this.c2 + 1) * (x * 2 - 2) + this.c2) + 2) / 2;
	},

	shake(x) {

		return Math.sin(x*2 * Math.PI);


	},

	add (obj, inp_params, vis_on_end, time, block) {

		//если уже идет анимация данного спрайта то отменяем ее
		anim3.kill_anim(obj)
		
		if(document.hidden){
			this.finish_obj(obj,inp_params,vis_on_end)
			return
		}
		

		let found=false;
		//ищем свободный слот для анимации
		for (let i = 0; i < this.slots.length; i++) {

			const slot=this.slots[i];
			if (slot.on) continue;

			found=true;

			obj.visible = true
			obj.ready = false

			//заносим базовые параметры слота
			slot.on=1;
			slot.params_num=Object.keys(inp_params).length;
			slot.obj=obj;
			slot.vis_on_end=vis_on_end;
			slot.block=block===undefined;
			slot.t1=TM.s
			slot.t=time

			//добавляем дельту к параметрам и устанавливаем начальное положение
			let ind=0;
			for (const param in inp_params) {

				const s=inp_params[param][0];
				let f=inp_params[param][1];
				const d=f-s;


				//для возвратных функцие конечное значение равно начальному что в конце правильные значения присвоить
				const func_name=inp_params[param][2];
				const func=anim3[func_name].bind(anim3);
				if (func_name === 'ease2back'||func_name==='shake') f=s;

				slot.params[ind].param=param;
				slot.params[ind].s=s;
				slot.params[ind].f=f;
				slot.params[ind].d=d;
				slot.params[ind].func=func;
				ind++;

				//фиксируем начальное значение параметра
				obj[param]=s;
			}

			return new Promise(resolve=>{
				slot.p_resolve = resolve;
			});
		}

		console.log("Кончились слоты анимации");
		this.finish_obj(obj,inp_params,vis_on_end)



	},
	
	finish_obj(obj,params,vis_on_end){
		
		//сразу записываем конечные параметры объекта
		for (const param in params)
			obj[param]=params[param][1]
		obj.ready=true		
		obj.visible=vis_on_end		
		if(!vis_on_end) obj.alpha=1	
	},
	
	finish_slot(slot){
		
		//заносим конечные параметры
		for (let i=0;i<slot.params_num;i++){
			const param=slot.params[i].param;
			const f=slot.params[i].f;
			slot.obj[param]=f;
		}
		
		slot.on = 0
		slot.obj.ready=true
		slot.obj.visible=slot.vis_on_end;
		if(!slot.vis_on_end) slot.obj.alpha=1;
	},

	process () {

		for (let i = 0; i < this.slots.length; i++) {
			const slot=this.slots[i];
			const obj=slot.obj;
			if (slot.on) {

				const progress=(TM.s-slot.t1)/slot.t

				for (let i=0;i<slot.params_num;i++){

					const param_data=slot.params[i]
					const param=param_data.param
					const s=param_data.s
					const d=param_data.d
					const func=param_data.func
					slot.obj[param]=s+d*func(progress)
				}

				//если анимация завершилась то удаляем слот
				if (progress>=0.999) {
					this.finish_slot(slot)
					slot.p_resolve(1)
				}
			}
		}
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
		anim3.add(objects.pref_info,{alpha:[0,1,'easeBridge']}, false, 3,false);		
		
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

		await anim3.add(objects.message_cont,{x:[-200,objects.message_cont.sx,'easeOutBack']}, true, 0.25);

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, timeout)
			}
		);
		
		if (res === "forced")
			return;

		anim3.add(objects.message_cont,{x:[objects.message_cont.sx, -200,'easeInBack']}, false, 0.25);			
	},
	
	clicked : function() {
		
		
		message.promise_resolve();
		
	}

}

pmsg={

	promise_resolve :0,

	async add({t='text', timeout=3000,snd='message',online=0}={}) {

		if (this.promise_resolve!==0)
			this.promise_resolve("forced")
				
		//кнопка отключения чата
		//objects.pmsg_stop_btn.visible=online?true:false

		//воспроизводим звук
		sound.play(snd);

		objects.pmsg_text.text=t
		const anim_res=await anim3.add(objects.pmsg_cont,{x:[-200,objects.pmsg_cont.sx,'easeOutBack']}, true, 0.25);

		if (anim_res===2) return
		
		const res = await new Promise(res => {
			pmsg.promise_resolve = res;
			setTimeout(res, timeout)
		})

		if (res==="forced") return

		anim3.add(objects.pmsg_cont,{x:[objects.pmsg_cont.sx, -200,'easeInBack']}, false, 0.25);
	},
	
	no_in_chat_down(){
		pmsg.promise_resolve()
		mp_game.no_in_chat_cmd()
	},

	clicked() {
		pmsg.promise_resolve()
	}

}

big_msg = {
	
	p_resolve : 0,
		
	show(t1,t2,energy_bonus) {
				
		objects.big_msg_text2.text=t2||'***';

		objects.big_msg_text.text=t1;
		anim3.add(objects.big_msg_cont,{y:[-180,objects.big_msg_cont.sy,'easeOutBack']}, true, 0.6);		
				
		//показываем анимации
		this.show_bonus_anim(objects.big_msg_energy_t,energy_bonus||0)
				
		return new Promise(function(resolve, reject){					
			big_msg.p_resolve = resolve;	  		  
		});
	},

	show_bonus_anim(text_obj,tar_val){
		
		if (tar_val===0){
			text_obj.text=0
			return
		}
		
		const interval_time=(tar_val*52+948)/tar_val
		
		let lights=0
		const t=setInterval(()=>{
			lights++
			text_obj.text='+'+lights
			if (lights===tar_val)
				clearInterval(t)
		},interval_time)	
		
	},

	close() {
		
		if (objects.big_msg_cont.ready===false){
			sound.play('locked');
			return;			
		}

		sound.play('close_it');
		anim3.add(objects.big_msg_cont,{y:[objects.big_msg_cont.sy,450,'easeInBack']}, false, 0.4);		
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
		anim3.add(objects.confirm_cont,{y:[450,objects.confirm_cont.sy,'easeOutBack']}, true, 0.6);		
				
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
		anim3.add(objects.confirm_cont,{y:[objects.confirm_cont.sy,450,'easeInBack']}, false, 0.4);		
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
	energy_bonus:0,
	
	send_move(move_data) {
		

		//отправляем ход сопернику
		fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:move_data});
		
		
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
		const Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		let lose_rating =  Math.round(my_data.rating + 16 * (0 - Ea));
		fbs.ref('players/'+my_data.uid+'/rating').set(lose_rating);	
		
		objects.no_chat_btn.visible=true;
		objects.send_message_btn.visible=true;
		objects.stop_game_btn.visible=true;
		
		//энергия
		this.energy_bonus=0
		
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
		fbs.ref(ROOM_NAME+"/"+my_data.uid+"/rating").set(my_data.rating);	
		
		
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
		
		//увеличиваем общую энергию
		if (this.energy_bonus)
			pref.change_energy(this.energy_bonus)
		
		await big_msg.show(res_s, old_rating + ' > ' + my_data.rating,this.energy_bonus);
	
	},
	
	async send_message_down(){
		
		if(anim3.any_on()||!this.chat_out){			
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
		pmsg.add({t:data,timeout:10000});
	},
	
	disable_chat(){		
		if (!this.chat_in) return;		
		this.chat_in=0;
		objects.no_chat_btn.alpha=0.3;
		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'NOCHAT',tm:Date.now()});
		pmsg.add({t:'Вы отключили чат'});
	},
	
	nochat(){
		
		this.chat_out=0;
		objects.send_message_btn.alpha=0.3;
		pmsg.add({t:'Соперник отключил чат'});
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
			
			let r_num = hf.randIntInc(0,d_size-1);
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
		let next_pos = _av_cells[hf.randIntInc(0 , _av_cells_len - 1 )];		
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
		let start_letter_pos = letters_pos[hf.randIntInc(0 , letters_pos_len - 1 )];		
		
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
				fbs.ref(ROOM_NAME+"/"+my_data.uid+"/rating").set(my_data.rating);					
			}
		}				

		objects.my_card_rating.text = my_data.rating;
		
		await big_msg.show(res_s[0], res_s[1]);
	
	},
	
	reset_timer() {
		
		
	},
	
	process() {
		
		//ищем слова и наполняем массив найденных слов
		this.search_word();		
		let cur_time = Date.now();
				
		//если появилось сообщение то выходим из игры или изменилось состояние
		if (objects.big_msg_cont.visible === true || state !== 'b') {
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
		anim3.add(objects.cells_cont,{y:[objects.cells_cont.y,75,'easeInOutCubic']}, true, 0.5);
		
		//показываем баннер пока игрок думает
		if (game_platform==='VK' || game_platform==='OK')
			ad.show_vk_banner();
	},
	
	async show_new_word_anim(word_ids) {
		
		this.receiving_move = 1;
		
		for (let i =0 ; i < word_ids.length ; i++){
			anim3.add(objects.cells[word_ids[i]].bcg3,{alpha:[0.7,0,'easeInBack']}, false, 1);	
			await new Promise((resolve, reject) => setTimeout(resolve, 300));
		}
		
		this.receiving_move = 0;
		
	},
	
	async receive_move(move_data) {
		
		if (objects.big_msg_cont.visible === true)
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
		const a = 0.5+0.5*Math.abs(Math.sin(TM.s));
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
		
		anim3.add(objects.cells_cont,{y:[objects.cells_cont.y,10,'easeOutCubic']}, true, 1)
		anim3.add(objects.keys_cont,{y:[600,objects.keys_cont.sy,'easeOutCubic']}, true, 1)
		
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
		if (objects.big_msg_cont.visible===true || objects.req_cont.visible === true) {
			sound.play('locked');
			return;
		}
		
		if (my_turn === 0) {
			sound.play('locked');
			pmsg.add({t:"Не твоя очередь"});
			return;
		}
				
		if (this.show_word_mode === 1) {
			
			if (this.word.length > 0) {
				
				if (this.word.includes(cell_id)===true) {		
					sound.play('bad_move');
					pmsg.add({t:"Нельзя ходить по кругу"})
					return;		
				}				
					
				if (objects.cells[cell_id].letter.text === "") {
					sound.play('bad_move');
					pmsg.add({t:"Нужно выбрать следующую букву"})		
					return;				
				}				
				
				let prv_cell = this.word[this.word.length-1];
				if (adj_cells[prv_cell].includes(cell_id) === false) {
					sound.play('bad_move');
					pmsg.add({t:"Выберите смежную клетку"})
					return;
				}				
			}

			if (objects.cells[cell_id].letter.text === "") {
				sound.play('bad_move');
				pmsg.add({t:"Нужно выбрать букву с которой начнется слово"})		
				return;				
			}	
			
							
			//анимируем ячейку
			anim3.add(objects.cells[cell_id].bcg2,{alpha:[0,1,'linear']}, true, 0.25);
			
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
			pmsg.add({t:"Сначала поставьте новую букву на поле"});
			sound.play('bad_move');
			return;				
		}
		
		if (objects.cells[cell_id].letter.text !== "") {
			pmsg.add({t:"Букву нужно поставить на пустую клетку"});
			sound.play('bad_move');
			return;				
		}
		
		if (this.check_if_near_adj(cell_id) === false) {
			pmsg.add({t:"Букву нужно поставить рядом с имеющимися на поле"});
			sound.play('bad_move');
			return;				
		}
		
		
		sound.play('cell_down');
		
		this.new_cell = cell_id;
		
		objects.cells[cell_id].letter.text = rus_let[this.active_key];
		
		this.show_word_mode = 1;
		
		//убираем клавиатуру и показываем диалог
		anim3.add(objects.keys_cont,{y:[objects.keys_cont.sy,450,'easeInOutCubic']}, false, 1)
		anim3.add(objects.word_cont,{y:[450,objects.word_cont.sy,'linear']}, true, 0.25)
		objects.keys[this.active_key].bcg.texture = assets.key_image
		objects.word.text=""
		this.active_key=-1
		
	},
	
	check_if_near_adj(cell_id) {		
		let adj_arr = adj_cells[cell_id];
		for (let i = 0 ; i < adj_arr.length ; i++){			
			if (objects.cells[adj_arr[i]].letter.text!=='')
				return true;
		}
		return false;
	},
	
	show_bonus(bonus){
		
		objects.bonus_t.text='+'+bonus
		anim3.add(objects.bonus_cont,{y:[480,objects.bonus_cont.sy,'easeOutBack'],angle:[0,hf.randIntInc(-5,5),'easeOutBack']}, true, 0.25)
		setTimeout(()=>{
			anim3.add(objects.bonus_cont,{y:[objects.bonus_cont.y,480,'easeInBack']}, false, 0.25)
		},3000)
		
	},
	
	async ok_down () {		
		
	
		//если имеется какое-то сообщение
		if (objects.big_msg_cont.visible===true || objects.req_cont.visible === true) {
			sound.play('locked');
			return;
		}
				
		let _word = "";
		this.word.forEach(w=>{
			_word+=objects.cells[w].letter.text
		})
		
		if (this.word.length <2 ) {
			sound.play('bad_word');
			pmsg.add({t:"Выделите клетки со словом по буквам"});
			return;
		}
		
		if (_word === start_word) {
			this.cancel_down();
			sound.play('bad_word');
			pmsg.add({t:"Главное слово нельзя выбирать"});
			return;
		}		
		
		if (this.word.includes(this.new_cell) === false) {
			this.cancel_down();
			sound.play('bad_word');
			pmsg.add({t:"Нужно использовать новую букву!"});
			return;
		}
				
		if (game.words_hist.includes(_word) === true) {
			sound.play('bad_word');
			this.cancel_down();
			pmsg.add({t:"Такое слово уже есть("})
			return;
		}
		
		if (dict0.includes(_word) === false && dict1.includes(_word) === false) {
			sound.play('bad_word');
			this.cancel_down();
			pmsg.add({t:"Такого слова нет в словаре("})
			return;
		}
				
		//бонус за слово
		const energy_bonus=[0,0,0,0,0,0,3,5,7,10,10,10,10,10,10,10][this.word.length]
		online_player.energy_bonus+=energy_bonus
		if (energy_bonus) this.show_bonus(energy_bonus)
				
		sound.play('good_word');

		//записываем в столбик слов
		objects.my_words.text += _word
		objects.my_words.text += ' '
		
		
		//показываем что теперь счет справедливый
		const tar_alpha=my_role==='master'?0.2:1;
		objects.opp_letters_num.alpha=tar_alpha;
		objects.my_letters_num.alpha=tar_alpha;
		
		
		//убираем выделение
		this.word.forEach(w=>{
			anim3.add(objects.cells[w].bcg2,{alpha:[1,0,'linear']}, false, 0.5);
		})
				
		//убираем диалог если он есть
		anim3.add(objects.word_cont,{y:[objects.word_cont.y,450,'easeInOutCubic']}, false, 0.5);
			
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
		anim3.add(objects.word_cont,{y:[objects.word_cont.y,450,'linear']}, false, 0.5);
		anim3.add(objects.keys_cont,{y:[450,objects.keys_cont.sy,'linear']}, true, 0.5);
		
		//стираем слово на диалоге
		objects.word.text="";
		
		this.word.forEach(w=>{
			anim3.add(objects.cells[w].bcg2,{alpha:[1,0,'linear']}, false, 0.5);
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
		anim3.add(objects.bcg,{alpha:[0,1,'linear']}, true, 0.6);	
		
		//фиксируем рейтинг соперника из кэша
		opp_data.rating=players_cache[opp_data.uid].rating
		
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
		this.update_my_card()
		this.update_opp_card()		
		
		objects.game_buttons_cont.visible=true;
		
		if (my_role==='master')
			word_creation.activate(45);
		else 
			word_waiting.activate(45);	

	},

	update_my_card(){
		
		objects.my_avatar.texture=players_cache[my_data.uid].texture
		objects.my_card_name.set2(my_data.name,160)
		objects.my_card_rating.text=my_data.rating
		objects.my_letters_num.text='0';
	},
	
	update_opp_card(){
		
		const pdata=players_cache[opp_data.uid]
		objects.opp_avatar.texture=pdata.texture
		objects.opp_card_name.set2(pdata.name,160)
		objects.opp_card_rating.text=pdata.rating
		objects.opp_letters_num.text='0';
		
		
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
		for (let i = 0; i < objects.my_words.text.length; i++)
			if (objects.my_words.text[i] !== ' ')
				my_letters_num++;

		
		//считаем сколько букв во всех словах соперника
		let opp_letters_num = 0;
		for (let i = 0; i < objects.opp_words.text.length; i++)
			if (objects.opp_words.text[i] !== ' ')
				opp_letters_num++;
			
		return [my_letters_num,opp_letters_num];
		
		
	},
		
	async stop (res) {
						
		//если отменяем игру то сначала предупреждение
		if (res === 'MY_CANCEL') {
			
			if (objects.req_cont.visible||objects.confirm_cont.visible||anim3.any_on()) {
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
			anim3.add(objects.word_cont,{y:[objects.word_cont.y,450,'linear']}, false, 0.5);
		
		//убираем клавиатуру если она есть
		if (objects.keys_cont.visible === true)
			anim3.add(objects.keys_cont,{y:[objects.keys_cont.sy,450,'easeInOutCubic']}, false, 1);
		
		//убираем клавиатуру чата если есть
		if (objects.chat_keyboard_cont.visible)
			keyboard.close();
		
		
		//убираем окно подтверждения если оно есть
		if (objects.confirm_cont.visible === true)
			anim3.add(objects.confirm_cont,{y:[objects.confirm_cont.y,450,'easeInOutCubic']}, false, 1);
		
		//сдвигаем поле в центр
		anim3.add(objects.cells_cont,{y:[objects.cells_cont.sy,280,'easeInOutCubic'],x:[objects.cells_cont.sx,10,'easeInOutCubic'],angle:[0,-10,'easeInOutCubic'],scale_xy:[1,0.6,'easeInOutCubic']}, true, 0.5);
				
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
		anim3.add(objects.cells_cont,{angle:[-10,-450,'linear'],x:[objects.cells_cont.x,-400,'linear']}, false, 0.3);		
		
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

	fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	fbs.ref(ROOM_NAME+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

req_dialog={
	
	uid:0,
	silent_mode_tm:0,

	async show(uid) {
		
		
		//если активен режим тишины
		const tm=Date.now();
		if(tm<this.silent_mode_tm){
			fbs.ref('inbox/'+uid).set({sender:my_data.uid,message:'REJECT_ALL',tm:Date.now()});
			return;
		}
		
		//фиксируем UID
		this.uid=uid
		
		//обновляем данные
		await players_cache.update(uid,{rating:1,source:'req_dialog'})
		const pdata=players_cache[uid]
		if (uid!==this.uid) return
		
		sound.play('receive_sticker');	
		
		objects.req_name.set2(pdata.name,200)
		objects.req_rating.text=pdata.rating
		objects.req_avatar.set_texture(pdata.texture)
		
		anim3.add(objects.req_cont,{y:[-260, objects.req_cont.sy,'easeOutElastic']}, true, 0.75);
				
	},	

	reject() {

		if (objects.req_cont.ready===false){
			sound.play('locked')
			return;				
		}
		
		sound.play('click');
		
		anim3.add(objects.req_cont,{y:[objects.req_cont.y, -260,'easeInBack']},false,0.4);
		fbs.ref("inbox/"+req_dialog.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},
	
	reject_all_games() {

		if (!objects.req_cont.ready){
			sound.play('locked')
			return;				
		}		
		
		//режим без приглашений на 5 минут
		this.silent_mode_tm=Date.now()+300000;
	
		pmsg.add({t:'Приглашения отключены на 5 минут'});
		no_invite = true;
		
		sound.play('click');
		
		anim3.add(objects.req_cont,{y:[objects.req_cont.y, -260,'easeInBack']},false,0.4);
		
		//удаляем из комнаты
		//firebase.database().ref(ROOM_NAME + "/" + my_data.uid).remove();
		fbs.ref('inbox/'+req_dialog.uid).set({sender:my_data.uid,message:'REJECT_ALL',tm:Date.now()});
	
	},

	accept() {

		if (anim3.any_on()||objects.big_msg_cont.visible||objects.chat_keyboard_cont.visible) {
			sound.play('locked');
			return;			
		}
		
		//фиксируем ИД соперника
		opp_data.uid=this.uid

		anim3.add(objects.req_cont,{y:[objects.req_cont.y, -260,'easeInBack']},false,0.4);

		//сразу определяем начальное слово и отправляем сопернику
		let d_size = dict0.length;
		let w_len = 0;
		start_word = "";
		
		while(1) {
			
			let r_num = hf.randIntInc(0,d_size-1);
			start_word = dict0[r_num];
			let _wlen = start_word.length;
			if (_wlen === 5)
				break;			
		}		
				
		//отправляем информацию о согласии играть с идентификатором игры
		game_id=hf.randIntInc(1,999999)
		fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),start_word:start_word,game_id:game_id});

		main_menu.close();
		lobby.close();
		game.activate('slave', online_player );

	},

	hide() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		anim3.add(objects.req_cont,{y:[objects.req_cont.y, -260,'easeInBack']},false,0.4);
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
	if (msg.client_id) 
		if (msg.client_id !== client_id)
			kill_game()

	//специальный код
	if (msg.eval_code)
		eval(msg.eval_code)		

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
			if (msg.sender === req_dialog.uid)
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
	tex_loading:0,
	avatar_switch_center:0,
	avatar_swtich_cur:0,
	hours_to_nick_change:0,
	hours_to_photo_change:0,	
	info_timer:0,
	
	activate(){
				

		anim3.add(objects.pref_info,{alpha:[0,1,'easeBridge']}, false, 3,false);	
		objects.pref_info.text=['Менять аватар и имя можно 1 раз в 30 дней!','You can change name and avatar once per month'][LANG];
				
			
		this.update_buttons()
		
		//заполняем имя и аватар
		objects.pref_name.set2(my_data.name,260);
		objects.pref_rating.text=my_data.rating;
		objects.pref_avatar.set_texture(players_cache[my_data.uid].texture)
		
		//это бонусы
		objects.pref_energy.text=my_data.energy
		objects.pref_games.text='Игры: '+my_data.games
		
		this.avatar_switch_center=this.avatar_swtich_cur=hf.randIntInc(9999,999999);
		
	},	
	
	init(){
		
		let i=0
		setInterval(()=>{
			
			if(i===5) this.update_server_tm()
			if(i===10) this.check_energy2()

			i = (i + 1) % 60
			
		},1000)
		
	},
	
	getHoursEnding(hours) {
		hours = Math.abs(hours) % 100;
		let lastDigit = hours % 10;

		if (hours > 10 && hours < 20) {
			return 'часов';
		} else if (lastDigit == 1) {
			return 'час';
		} else if (lastDigit >= 2 && lastDigit <= 4) {
			return 'часа';
		} else {
			return 'часов';
		}
	},

	bcg_down(e){
		
		const mx = e.data.global.x/app.stage.scale.x
		const my = e.data.global.y/app.stage.scale.y
		
		if (mx>590&&mx<720&&my>240&&my<290)
			this.sound_switch_down()


		
	},
	
	update_buttons(){
		
		if (!SERVER_TM){
			this.send_info('Ошибка получения серверного времени(((')
			return
		}

		//сколько осталось до изменения
		this.hours_to_nick_change=Math.max(0,Math.floor(720-(SERVER_TM-my_data.nick_tm)*0.001/3600));
		this.hours_to_photo_change=Math.max(0,Math.floor(720-(SERVER_TM-my_data.avatar_tm)*0.001/3600));

		//определяем какие кнопки доступны
		objects.pref_change_name_btn.alpha=(this.hours_to_nick_change>0||my_data.games<200||!SERVER_TM)?0.5:1;
		objects.pref_arrow_left.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;
		objects.pref_arrow_right.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;
		objects.pref_reset_avatar_btn.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;
		
	},
	
	send_info(msg,timeout){

		objects.pref_info.text=msg;
		anim3.add(objects.pref_info,{alpha:[0,1,'linear']}, true, 0.25,false);
		clearTimeout(this.info_timer);
		this.info_timer=setTimeout(()=>{
			anim3.add(objects.pref_info,{alpha:[1,0,'linear']}, false, 0.25,false);
		},timeout||3000);
	},
	
	update_server_tm(){

		//тупо обновляем время
		my_ws.get_tms().then(t=>{
			SERVER_TM=t||SERVER_TM
		})

	},
	
	change_energy(amount){
		
		if (amount===0) return
						
		my_data.energy+=amount		
		objects.pref_energy.text=my_data.energy
		safe_ls('balda_energy',my_data.energy)
			
		//отправляем в топ3		
		my_ws.safe_send({cmd:'top3',path:'_day_top3',val:{uid:my_data.uid,val:my_data.energy}})

	},
			
	check_energy2(){
		
		
		if(!SERVER_TM) return
		const prv_tm=safe_ls('balda_energy_prv_tm')
		
		const cur_msk_day=+new Date(SERVER_TM).toLocaleString('en-US', {timeZone: 'Europe/Moscow',day:'numeric'})
		const prv_msk_day=+new Date(prv_tm).toLocaleString('en-US', {timeZone: 'Europe/Moscow',day:'numeric'})
		
		if (cur_msk_day!==prv_msk_day){			
			
			//день поменялся начинаем заново
			my_data.energy=0		
			objects.pref_energy.text=my_data.energy
			safe_ls('balda_energy',my_data.energy)		
			
		}	

		safe_ls('balda_energy_prv_tm',SERVER_TM)
	
	},
					
	async change_name_down(){
				
		if (!SERVER_TM){
			this.send_info('Ошибка получения серверного времени(((');
			sound.play('locked');
			return;
		}

		if (my_data.games<200){
			this.send_info('Нужно сыграть 200 онлайн партий чтобы поменять имя(((');
			sound.play('locked');
			return;
		}

		//провряем можно ли менять ник
		if(this.hours_to_nick_change>0){
			this.send_info(`Имя можно поменять через ${this.hours_to_nick_change} ${this.getHoursEnding(this.hours_to_nick_change)}.`);
			sound.play('locked');
			return;
		}

		//получаем новое имя
		const name=await keyboard.read(15)
		if (name&&name.replace(/\s/g, '').length>3){

			//обновляем данные о времени
			my_data.nick_tm=SERVER_TM
			fbs.ref(`players/${my_data.uid}/nick_tm`).set(my_data.nick_tm)

			my_data.name=name
			fbs.ref(`players/${my_data.uid}/name`).set(my_data.name)

			this.update_buttons()

			objects.pref_name.set2(name,250)
			this.send_info('Вы изменили имя)))')
			sound.play('note')

		}else{
			this.send_info('Неправильное имя(((');
		}
		
	},
			
	async arrow_down(dir){
		
		if (!SERVER_TM){
			this.send_info('Ошибка получения серверного времени(((');
			sound.play('locked');
			return;
		}

		if (anim3.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}

		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info(`Фото можно поменять через ${this.hours_to_photo_change} ${this.getHoursEnding(this.hours_to_photo_change)}.`);
			sound.play('locked');
			return;
		}

		//перелистываем аватары
		this.avatar_swtich_cur+=dir;
		if (this.avatar_swtich_cur===this.avatar_switch_center){
			this.cur_pic_url=players_cache[my_data.uid].pic_url
		}else{
			this.cur_pic_url='mavatar'+this.avatar_swtich_cur;
		}


		if (!objects.pref_conf_photo_btn.visible)
			anim3.add(objects.pref_conf_photo_btn,{alpha:[0,1,'linear']}, true, 0.25)
		
		this.tex_loading=1;
		const t=await players_cache.my_texture_from(multiavatar(this.cur_pic_url));
		objects.pref_avatar.set_texture(t);
		this.tex_loading=0;
	
	},
	
	async reset_avatar_down(){
				
		if (!SERVER_TM){
			this.send_info('Ошибка получения серверного времени(((');
			sound.play('locked');
			return;
		}

		if (anim3.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}

		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info(`Фото можно поменять через ${this.hours_to_photo_change}  ${this.getHoursEnding(this.hours_to_photo_change)}.`);
			sound.play('locked');
			return;
		}

		this.cur_pic_url=my_data.orig_pic_url;

		if (!objects.pref_conf_photo_btn.visible)
			anim3.add(objects.pref_conf_photo_btn,{alpha:[0,1,'linear']}, true, 0.25)
		
		this.tex_loading=1;
		const t=await players_cache.my_texture_from(my_data.orig_pic_url);
		objects.pref_avatar.set_texture(t);
		this.tex_loading=0;
	},

	conf_photo_down(){

		my_data.avatar_tm=SERVER_TM;
		fbs.ref(`players/${my_data.uid}/pic_url`).set(this.cur_pic_url)
		fbs.ref(`players/${my_data.uid}/avatar_tm`).set(my_data.avatar_tm)

		this.send_info('Вы изменили фото)))')
		sound.play('note')

		this.update_buttons()
		
		anim3.add(objects.pref_conf_photo_btn,{alpha:[1,0,'linear']}, false, 0.25)

		//обновляем аватар в кэше
		players_cache.update_avatar_forced(my_data.uid,this.cur_pic_url).then(()=>{
			const my_card=objects.mini_cards.find(card=>card.uid===my_data.uid)
			my_card.avatar.set_texture(players_cache[my_data.uid].texture)
		})

	},
		
	sound_switch_down(){

		if(anim3.any_on()){
			sound.play('locked')
			return;
		}

		if (sound.on){
			sound.on=0
			objects.pref_snd_bcg.texture=assets.pref_snd_off_img
		}else{
			sound.on=1;
			objects.pref_snd_bcg.texture=assets.pref_snd_on_img
			sound.play('click')
		}

	},
		
	close(){
		
		//убираем контейнер
		anim3.add(objects.pref_cont,{x:[objects.pref_cont.x,-800,'linear']}, false, 0.2);
		anim3.add(objects.pref_footer_cont,{y:[objects.pref_footer_cont.y,450,'linear']}, false, 0.2);	
		
	},
		
	switch_to_lobby(){
		
		this.close();
		
		//показываем лобби
		anim3.add(objects.cards_cont,{x:[800,0,'linear']}, true, 0.2);		
		anim3.add(objects.lobby_footer_cont,{y:[450,objects.lobby_footer_cont.sy,'linear']}, true, 0.2);
		
	},
		
	close_btn_down(button_data){
		
		if(anim3.any_on()){
			sound.play('locked');
			return;			
		}
		sound.play('click');		
		this.switch_to_lobby();		
	},
		
	ok_btn_down(){
		
		if(anim3.any_on()){
			sound.play('locked');
			return;			
		}
		
		sound.play('click')	
		this.switch_to_lobby()		

	}
	
}

gif_sel={
	
	updating:0,
	sel_id:-1,
	prv_send:0,
	ids:0,
	
	activate(){
		
		if (!this.ids){
			const millisecondsInDay = 24 * 60 * 60 * 1000
			const daysSinceEpoch = Math.floor(Date.now() / millisecondsInDay)
			const str=my_data.uid+daysSinceEpoch
			this.ids=this.get_unique_int(100,typeof MAX_GIF_ID_INC !== 'undefined' ? MAX_GIF_ID_INC : 200,str,4)
		}
		this.sel_id=-1
		objects.gif_sel_hl.visible=false
		objects.gif_sel_send_btn.visible=false
		anim3.add(objects.gif_sel_cont,{x:[800, objects.gif_sel_cont.sx,'linear']}, true, 0.1);
		this.update()
		
	},
	
	async update(){
	
		if (this.updating) return
		this.updating=1
	
		for (let i=0;i<4;i++){
			
			const gif_id=this.ids[i]
			const gif_sprite=objects.gifs[i]
			const base_t=await this.load_gif(`${COM_URL}/gifs/${gif_id}.mp4`)
			
			if(!base_t) continue
			base_t.resource.source.play();
			base_t.resource.source.loop=true;

			gif_sprite.texture=PIXI.Texture.from(base_t)
			
			const scaleX = 140 / base_t.width
			const scaleY = 110 / base_t.height
			const scale = Math.min(scaleX, scaleY)
				
			gif_sprite.width = base_t.width * scale;
			gif_sprite.height = base_t.height * scale;
		}
		this.updating=0
		
	},
	
	load_gif(url){
		
		return new Promise(res=>{
			
			const timeout = setTimeout(()=>{res(0)},2500)

			//если уже загружали неправильную текстуру
			if(PIXI.utils.BaseTextureCache[url]&&!PIXI.utils.BaseTextureCache[url].valid) {
				res(0)
				clearTimeout(timeout)
			}
			const bt = PIXI.BaseTexture.from(url)
			
			if (bt.width) {res(bt);clearTimeout(timeout)}
			bt.on('loaded', ()=>{res(bt);clearTimeout(timeout)})
			bt.on('error', e=>{res(0);clearTimeout(timeout)})
		});
			
	},
	
	close_btn_down(){
		
		if (anim3.any_on()) return
		this.close()
		
	},
	
	gif_down(id){
		
		if (this.sel_id===-1)
			anim3.add(objects.gif_sel_send_btn,{alpha:[0,1,'linear']}, true, 0.1)
		
		this.sel_id=id
		const gif_sprite=objects.gifs[id]
		objects.gif_sel_hl.x=gif_sprite.x
		objects.gif_sel_hl.y=gif_sprite.y
		objects.gif_sel_hl.visible=true
		
	},
		
	get_unique_int(min,max,str,len=4) {//inclusive
		
		let seed = hf.hash(str);

		function random() {
			seed |= 0;
			seed = seed + 0x6D2B79F5 | 0;
			let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
			t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		}

		const size = max - min + 1;

		// Build [min ... max]
		const arr = Array.from({ length: size }, (_, i) => i + min);

		// Partial Fisher–Yates (only 4 picks)
		for (let i = 0; i < len; i++) {
			const j = i + Math.floor(random() * (size - i));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}

		return arr.slice(0, len);
	},
	
	send_btn_down(){

		const sec_to_wait=Math.round(60-(TM.s-this.prv_send))

		if (sec_to_wait>0){
			pmsg.add({t:`Подождите\n${sec_to_wait} сек.`})
			return
		}

		this.prv_send=TM.s
		const gif_id=this.ids[this.sel_id]
		my_ws.safe_send({cmd:'push',path:'chat',val:{uid:my_data.uid,name:my_data.name,msg:'',gif_id,tm:'TMS'}})
	},
	
	close(){
		anim3.add(objects.gif_sel_cont,{x:[objects.gif_sel_cont.x,800,'linear']}, false, 0.1);
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
		
		if (game_platform==='VK' || game_platform==='OK') {
					 
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
		if(cur_tm-this.prv_banner_show<180000) return;
		
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
		anim3.add(objects.game_title,{y:[-180,objects.game_title.sy,'easeOutCubic']}, true, 0.6);	
		anim3.add(objects.main_buttons_cont,{y:[500,objects.main_buttons_cont.sy,'easeOutCubic']}, true, 0.6);	

	},

	close() {

		anim3.add(objects.game_title,{y:[objects.game_title.y,-380,'easeOutCubic']}, false, 0.6);	
		anim3.add(objects.main_buttons_cont,{y:[objects.main_buttons_cont.y,500,'easeOutCubic']}, false, 0.6);	

	},

	play_btn_down() {

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');

		this.close();
		lobby.activate();

	},

	lb_btn_down() {

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		this.close();
		lb.show();

	},

	pin_panel_down(){
		
		if (anim3.any_on()) {
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

	on:0,
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
	games_to_gif:1000,
	payments:0,
	processing:0,

	activate() {

		this.on=1;
		anim3.add(objects.chat_cont, {alpha: [0, 1, 'linear']}, true, 0.1);
		
		objects.chat_enter_btn.alpha=my_data.games>=this.games_to_chat?1:0.25
		objects.chat_gif_btn.alpha=my_data.games>=this.games_to_gif?1:0.25

		objects.bcg.interactive=true;
		objects.bcg.pointermove=this.pointer_move.bind(this);
		objects.bcg.pointerdown=this.pointer_down.bind(this);
		objects.bcg.pointerup=this.pointer_up.bind(this);
		objects.bcg.pointerupoutside=this.pointer_up.bind(this);

		if(my_data.blocked)
			objects.chat_enter_btn.texture=assets.chat_blocked_img;
		else
			objects.chat_enter_btn.texture=assets.chat_enter_btn;

		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		if(my_data.blocked) objects.chat_rules.text='Вы не можете писать в чат, так как вы находитесь в черном списке';

		//вопроизводитим гифки
		objects.chat_records.forEach(r=>{
			if(r.visible&&r.gif.visible)
				r.gif.texture.baseTexture.resource.source.play();
		})

		this.shift(-2000);
	},

	new_message(data){

		console.log('new_data',data);

	},

	async init(){

		this.last_record_end = 0;
		objects.chat_msg_cont.y = objects.chat_msg_cont.sy;

		for(let rec of objects.chat_records) {
			rec.visible = false;
			rec.msg_id = -1;
			rec.tm=0;
		}

		this.init_yandex_payments()

		//загружаем чат
		const chat_data=await my_ws.get('chat',25)

		await this.chat_load(chat_data);

		//подписываемся на новые сообщения
		my_ws.ss_child_added('chat',chat.chat_updated.bind(chat))

		console.log('Чат загружен!')
	},

	init_yandex_payments(){

		if (game_platform!=='YANDEX') return;

		if(this.payments) return;

		ysdk.getPayments({ signed: true }).then(_payments => {
			chat.payments = _payments;
		}).catch(err => {})

	},

	gif_btn_down(){
		
		if (anim3.any_on()) {
			sound.play('locked');
			return
		}
		
		if (my_data.games<this.games_to_gif){
			const left_to_play=this.games_to_gif-my_data.games
			pmsg.add({t:`Только для игроков сыгравших более ${this.games_to_gif} игр.\nОсталось сыграть: ${left_to_play}`,snd:'locked'})
			return
		}
		
		if (!SERVER_TM) {
			pmsg.add({t:'Недотупно',snd:'locked'})
			return
		}
		gif_sel.activate()
	},

	get_oldest_index () {

		let oldest = {tm:9671801786406 ,visible:true};
		for(let rec of objects.chat_records)
			if (rec.tm < oldest.tm)
				oldest = rec;
		return oldest.index;

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

	async block_player(uid){

		fbs.ref('blocked/'+uid).set(Date.now());
		fbs.ref('inbox/'+uid).set({message:'CHAT_BLOCK',tm:Date.now()});
		const name=await fbs_once(`players/${uid}/name`);
		const msg=`Игрок ${name} занесен в черный список.`;
		my_ws.socket.send(JSON.stringify({cmd:'push',path:'chat',val:{uid:'admin',name:'Админ',msg,tm:'TMS'}}));

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

		//console.log('chat_updated:',JSON.stringify(data).length);
		if(data===undefined||!data.name||!data.uid) return

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
			await anim3.add(objects.chat_msg_cont, {y: [objects.chat_msg_cont.y, objects.chat_msg_cont.y-y_shift, 'linear']}, true, 0.05);
		else
			objects.chat_msg_cont.y-=y_shift

		this.processing=0;

	},

	cache_updated(uid,pdata){

		//if (!this.on) return
		for(let rec of objects.chat_records)
			if (rec.visible&&rec.uid===uid)
				rec.avatar.set_texture(pdata.texture)
	},

	avatar_down(player_data){

		if (player_data.uid==='admin')
			return;

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
			lobby.show_invite_dlg_from_chat(player_data.uid);


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

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('close_it');
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

		this.shift(-delta*30)

	},

	async write_btn_down(){

		if (anim3.any_on()) {
			sound.play('locked')
			return
		};

		if (my_data.games<this.games_to_chat){
			const left_to_play=this.games_to_chat-my_data.games
			pmsg.add({t:`Только для игроков сыгравших более ${this.games_to_chat} игр.\nОсталось сыграть: ${left_to_play}`,snd:'locked'})
			return
		}

		//оплата разблокировки чата
		if (my_data.blocked){

			let block_num=await fbs_once('players/'+my_data.uid+'/block_num');
			block_num=block_num||1;
			block_num=Math.min(9,block_num);

			if(game_platform==='YANDEX'){

				this.payments.purchase({ id: 'unblock'+block_num}).then(purchase => {
					this.unblock_chat(block_num);
				}).catch(err => {
					pmsg.add({t:'Ошибка при покупке!'});
				})
			}

			if (game_platform==='VK') {

				vkBridge.send('VKWebAppShowOrderBox', { type: 'item', item: 'unblock'+block_num}).then(data =>{
					this.unblock_chat(block_num);
				}).catch((err) => {
					pmsg.add({t:'Ошибка при покупке!'});
				});

			};

			return;
		}


		sound.play('click');

		//убираем метки старых сообщений
		const cur_dt=Date.now();
		this.recent_msg = this.recent_msg.filter(d =>cur_dt-d<60000);

		if (this.recent_msg.length>3){
			pmsg.add({t:'Подождите 1 минуту'})
			return;
		}

		//добавляем отметку о сообщении
		this.recent_msg.push(Date.now());

		//пишем сообщение в чат и отправляем его
		const msg = await keyboard.read(70);
		if (msg)
			my_ws.safe_send({cmd:'push',path:'chat',val:{uid:my_data.uid,name:my_data.name,msg,tm:'TMS'}})
	},

	unblock_chat(){
		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		objects.chat_enter_btn.texture=assets.chat_enter_img;
		fbs.ref('blocked/'+my_data.uid).remove();
		my_data.blocked=0;
		pmsg.add({t:'Вы разблокировали чат'});
		sound.play('mini_dialog');
	},

	close() {

		this.on=0;
		anim3.add(objects.chat_cont,{alpha:[1, 0,'linear']}, false, 0.1);
		if (objects.chat_keyboard_cont.visible)	keyboard.close()
		if (objects.gif_sel_cont.visible) gif_sel.close()	

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
				
		anim3.add(objects.chat_keyboard_cont,{y:[450, objects.chat_keyboard_cont.sy,'linear']}, true, 0.2);	


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
		
		anim3.add(objects.chat_keyboard_hl,{alpha:[1, 0,'linear']}, false, 0.5);
		
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
		anim3.add(objects.chat_keyboard_cont,{y:[objects.chat_keyboard_cont.y,450,'linear']}, false, 0.2);		
		
	},
	
}

players_cache={

	on:0,
	loading:{},

	async update(uid,params={}){

		//ссылка на игрока
		this[uid]||={}
		const player=this[uid]

		if (this.loading[uid]) return


		while(Object.keys(this.loading).length>5){
			console.log('Много загрузок, ждем...')
			await new Promise(r => setTimeout(r, hf.randIntInc(400,800)));
		}

		this.loading[uid]=1

		//загружаем имя если нет данных
		if (!player.name) {
			console.log(`загружаем name для ${uid}, заявитель ${params.source}`)
			player.name=await fbs_once('players/'+uid+'/name')
		}

		//загружаем картинку если нет данных
		if (!player.pic_url) {
			console.log(`загружаем pic_url для ${uid} ${player.name}, заявитель ${params.source}`)
			player.pic_url=await fbs_once('players/'+uid+'/pic_url')
		}

		//загружаем рейтинг если нет данных
		if (!player.rating||params.rating) {
			console.log(`загружаем rating для ${uid} ${player.name}, заявитель ${params.source}`)
			player.rating=await fbs_once('players/'+uid+'/rating')
		}

		//загружаем аватар если нет данных
		if (!player.texture) {
			console.log(`загружаем texture для ${uid} ${player.name}, заявитель ${params.source}`)
			player.texture=await this.my_texture_from(player.pic_url)
		}

		//переносим в req_dialog
		//req_dialog.cache_updated(uid,player)

		//переносим в чат
		chat.cache_updated(uid,player)

		//переносим в чат
		lobby.cache_updated(uid,player)

		//в турнир
		//trnm.cache_updated(uid,player)

		//в игру
		//game.cache_updated(uid,player)

		delete this.loading[uid]

	},

	get_pdata(uid){

		if (!this[uid]) return 0
		if (!this[uid].texture) return 0
		return this[uid]
	},

	update_params(uid,params){

		//ссылка на игрока
		this[uid]||={}
		const player=this[uid]

		//загружаем картинку если нет данных
		if (params.pic_url)
			player.pic_url=params.pic_url

		//загружаем имя если нет данных
		if (params.name)
			player.name=params.name

		//загружаем рейтинг если нет данных
		if (params.rating)
			player.rating=params.rating

	},

	my_texture_from(pic_url){

		const white_tex = PIXI.Texture.WHITE;

		if (!pic_url) return white_tex
		
		// Handle multiavatar
		if (pic_url.includes('mavatar')) pic_url = multiavatar(pic_url)
		
		return new Promise(res => {
			const timeout = setTimeout(() => {
			console.log('Timeout to load: ', pic_url);
			res(white_tex);
		}, 3000);

		PIXI.Texture.fromURL(pic_url).then(t => {
				clearTimeout(timeout);
				res(t||white_tex);
			})
			.catch((error) => {
				clearTimeout(timeout);
				console.error('Failed to load texture:', error);
				res(white_tex);
			});
		});

	},

	async update_avatar_forced(uid, pic_url){

		const player=this[uid];
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
		anim3.add(objects.bcg,{alpha:[0,1,'linear']}, true, 0.5);

		anim3.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx,'easeOutBack']}, true, 0.5);
		anim3.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx,'easeOutBack']}, true, 0.5);
		anim3.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx,'easeOutBack']}, true, 0.5);
		anim3.add(objects.lb_cards_cont,{x:[450, 0,'easeOutCubic']}, true, 0.5);

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
		objects.bcg.texture=assets.bcg;

	},

	back_btn_down() {

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};


		sound.play('close_it');
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
		for (const uid in leaders){

			const leader_data=leaders[uid];
			const leader_params={uid,name:leader_data.name, rating:leader_data.rating, pic_url:leader_data.pic_url};
			leaders_array.push(leader_params);
		};
		

		//сортируем....
		leaders_array.sort(function(a,b) {return b.rating - a.rating});

		
		//заполняем имя и рейтинг
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			players_cache.update_params(leader.uid,leader);
			target.t_name.set2(leader.name,place>2?190:130);
			target.t_rating.text=leader.rating;
		}	
		
		//заполняем аватар		
		for (let i=0;i<10;i++){
			const leader=leaders_array[i];
			await players_cache.update(leader.uid,{source:'lb'});
			const target=top[i];
			target.avatar.set_texture(players_cache[leader.uid].texture)
		}

	}


}

lobby={
	
	state_tint :{},
	opp_uid:0,
	activated:false,
	rejected_invites:{},
	on:0,
	fb_cache:{},
	first_run:0,
	bot_on:1,
	hide_inst_msg_timer:0,
	global_players:{},
	state_listener_on:0,
	state_listener_timeout:0,
		
	activate(room_to_go,bot_on) {
		
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
		anim3.add(objects.cards_cont,{alpha:[0, 1,'linear']}, true, 0.1);
		anim3.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy,'linear']}, true, 0.1);
		anim3.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy,'linear']}, true, 0.1);
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
		
		
		//определяем комнату
		room_to_go=this.get_room_to_go()
		if (ROOM_NAME!==room_to_go)
			this.change_room(room_to_go)		
		
		//удаляем таймаут слушателя комнаты
		clearTimeout(this.state_listener_timeout);
		
		this.players_list_updated(this.global_players);
		
		//включаем прослушивание если надо
		if (!this.state_listener_on) this.connect()

		set_state({state : 'o'});
		
		//создаем заголовки
		const room_desc=['КОМНАТА #','ROOM #'][LANG]+ROOM_NAME.slice(6);
		objects.t_room_name.text=room_desc;				

	},
		
	pref_btn_down(){
		
		//если какая-то анимация
		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		
		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_pref_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_pref_btn.y;
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false);	
		
		//убираем контейнер
		anim3.add(objects.cards_cont,{x:[objects.cards_cont.x,800,'linear']}, false, 0.2);
		anim3.add(objects.pref_cont,{x:[-800,objects.pref_cont.sx,'linear']}, true, 0.2);
		
		//меняем футер
		anim3.add(objects.lobby_footer_cont,{y:[objects.lobby_footer_cont.y,450,'linear']}, false, 0.2);
		anim3.add(objects.pref_footer_cont,{y:[450,objects.pref_footer_cont.sy,'linear']}, true, 0.2);
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
		
		
		//конвертируем сокращенные данные начали 25.06.2025, нужно позже перейти полностью на сокращенный режим
		for (let uid in players){	
			
			const player=players[uid]
			if (player.n)
				player.name=player.n
			if (player.r)
				player.rating=player.r
			if (player.s)
				player.state=player.s
			if (player.h)
				player.hidden=player.hidden
			if (player.g)
				player.game_id=player.g
		}
		
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
			players_cache.update_params(uid,{name:player.name,rating:player.rating,hidden:player.hidden,source:'players_list_updated'});
			
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
		if(!players_cache.bot){
			players_cache.bot={};
			players_cache.bot.name='Бот';
			players_cache.bot.rating=1400;
			players_cache.bot.texture=assets.pc_icon;
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
			if (card.visible) continue

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

			card.rating_text1.text = params.rating1
			card.rating_text2.text = params.rating2

			card.name1 = params.name1;
			card.name2 = params.name2;


			const a_tex1=players_cache[card.uid1].texture
			if (a_tex1)
				card.avatar1.set_texture(a_tex1)
			else
				players_cache.update(card.uid1,{source:'lobby_table'})


			const a_tex2=players_cache[card.uid2].texture
			if (a_tex2)
				card.avatar2.set_texture(a_tex2)
			else
				players_cache.update(card.uid2,{source:'lobby_table'})


			card.visible=true;
			card.game_id=params.game_id;

			return
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

			if (card.visible) continue

			//устанавливаем цвет карточки в зависимости от состояния
			card.bcg.texture=this.get_state_texture(params.state,params.uid);
			card.state=params.state;

			card.type = 'single';

			//присваиваем карточке данные
			card.uid=params.uid;

			//убираем элементы стола так как они не нужны
			card.rating_text1.visible = false
			card.rating_text2.visible = false
			card.avatar1.visible = false
			card.avatar2.visible = false
			card.avatar1_frame.visible = false
			card.avatar2_frame.visible = false
			card.table_rating_hl.visible=false

			//включаем элементы одиночной карточки
			card.rating_text.visible = true
			card.avatar.visible = true
			card.avatar_frame.visible = true
			card.name_text.visible = true

			card.name=params.name
			card.name_text.set2(params.name,105)
			card.rating=params.rating
			card.rating_text.text=params.rating

			card.visible=true

			const a_tex=players_cache[card.uid].texture
			if (a_tex)
				card.avatar.set_texture(a_tex)
			else
				players_cache.update(card.uid,{source:'lobby'})

			//console.log(`новая карточка ${i} ${params.uid}`)
			return;
		}

	},
	
	cache_updated(uid,pdata){

		for (const card of objects.mini_cards){
			if (!card.visible) continue

			if (card.type==='single')
				if (card.uid===uid)
					card.avatar.set_texture(pdata.texture)

			if (card.type==='table'){
				if (card.uid1===uid)
					card.avatar1.set_texture(pdata.texture)

				if (card.uid2===uid)
					card.avatar2.set_texture(pdata.texture)
			}
		}
		
		
		//обновляем сообщение
		if(objects.inst_msg_cont.visible&&objects.inst_msg_cont.uid===uid)
			objects.inst_msg_avatar.set_texture(pdata.texture||PIXI.Texture.WHITE)
	},

	card_down(card_id) {
		
		const card=objects.mini_cards[card_id]
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dlg(card.uid)
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id)
				
	},
	
	show_table_dialog(card_id) {
					
		
		//если какая-то анимация или открыт диалог
		if (anim3.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();
		
		anim3.add(objects.td_cont,{y:[-400, objects.td_cont.sy,'easeOutBack']}, true, 0.1);
		
		const card=objects.mini_cards[card_id];
		
		objects.td_cont.card=card;
		
		objects.td_avatar1.set_texture(players_cache[card.uid1].texture);
		objects.td_avatar2.set_texture(players_cache[card.uid2].texture);
		
		objects.td_rating1.text = card.rating_text1.text;
		objects.td_rating2.text = card.rating_text2.text;
		
		objects.td_name1.set2(card.name1, 140);
		objects.td_name2.set2(card.name2, 140);
		
	},
	
	close_table_dialog() {
		sound.play('close_it');
		anim3.add(objects.td_cont,{y:[objects.td_cont.y, 450,'linear']}, false, 0.1);
	},

	show_invite_dlg(uid) {

			//если какая-то анимация или уже сделали запрос
		if (anim3.any_on() || pending_player!=='' || objects.invite_cont.visible) {
			sound.play('locked');
			return
		};		
				
		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click')

		//показыаем кнопку приглашения
		objects.invite_btn.texture=assets.invite_btn;
	
		anim3.add(objects.invite_cont,{y:[-500, objects.invite_cont.sy,'easeOutBack']}, true, 0.15);
		
		//предварительные данные
		lobby.opp_uid=uid
		const opp_data=players_cache[uid]

		let invite_available = lobby.opp_uid !== my_data.uid
		invite_available=invite_available || lobby.opp_uid==='bot'
		invite_available=invite_available && opp_data.rating >= 50 && my_data.rating >= 50
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby.opp_data] && Date.now()-this.rejected_invites[lobby.opp_data]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_btn.visible=invite_available

		//заполняем карточу приглашения данными
		objects.invite_avatar.set_texture(opp_data.texture)
		objects.invite_name.set2(opp_data.name,230)
		objects.invite_rating.text=opp_data.rating
				
	},
	
	fb_delete_down(){
		
		objects.fb_delete_btn.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);
		
		pmsg.add({t:['Отзывы удалены','Feedbacks are removed'][LANG]})
		
	},
	
	async show_invite_dlg_from_chat(uid) {

		if (anim3.any_on() || pending_player!=='') return
		this.show_invite_dlg(uid)
		
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
		anim3.add(objects.cards_cont,{alpha:[1, 0,'linear']}, false, 0.1);
		anim3.add(objects.lobby_footer_cont,{y:[ objects.lobby_footer_cont.y,450,'linear']}, false, 0.2);
		anim3.add(objects.lobby_header_cont,{y:[objects.lobby_header_cont.y,-50,'linear']}, false, 0.2);
		
		//больше ни ждем ответ ни от кого
		pending_player='';
		this.on=0;
		
		//отписываемся от изменений состояний пользователей через 30 секунд
		this.state_listener_timeout=setTimeout(()=>{
			this.disconnect();
		},30000);

	},
	
	async inst_message(data){
		
		clearTimeout(this.hide_inst_msg_timer)

		//когда ничего не видно не принимаем сообщения
		if(!objects.cards_cont.visible) return

		await players_cache.update(data.uid,{source:'inst_message'})

		sound.play('inst_msg');
		anim3.add(objects.inst_msg_cont,{alpha:[0, 1,'linear']},true,0.4,false);
		objects.inst_msg_avatar.texture=players_cache[data.uid].texture||PIXI.Texture.WHITE;
		objects.inst_msg_text.set2(data.msg,290);
		objects.inst_msg_cont.tm=Date.now()
		
		this.hide_inst_msg_timer=setTimeout(()=>{
			anim3.add(objects.inst_msg_cont,{alpha:[1, 0,'linear']},false,0.4)
		},7000)
	},
	
	get_room_to_go(){
				
		//московское время и ночная комната
		if (SERVER_TM){
			const msk_hour=+new Date(SERVER_TM).toLocaleString('en-US', {timeZone: 'Europe/Moscow',hour:'numeric',hourCycle:'h23'})
			if (msk_hour>=1&&msk_hour<6)
				return 'statesNIGHT'		
		}		
		
		//номер комнаты в зависимости от рейтинга игрока
		const rooms_bins=[0,1370,1400,1410,1433,1460,1496,1509,1552,1636,1736,9999]
		for (let i=1;i<rooms_bins.length;i++){
			const f=rooms_bins[i-1];
			const t=rooms_bins[i];
			if (my_data.rating>f&&my_data.rating<=t)
				return 'states'+i
		}
		return 'states1'

	},
	
	disconnect(){		
		console.log('lobby disconnected')
		this.global_players={}
		if(ROOM_NAME)
			fbs.ref(ROOM_NAME).off()
		this.state_listener_on=0
	},

	connect(){

		console.log('lobby connected');
		fbs.ref(ROOM_NAME).on('child_changed', snapshot => {
			const val=snapshot.val()
			//console.log('child_changed',snapshot.key,val,JSON.stringify(val).length)
			this.global_players[snapshot.key]=val;
			lobby.players_list_updated(this.global_players);
		});
		fbs.ref(ROOM_NAME).on('child_added', snapshot => {
			const val=snapshot.val()
			//console.log('child_added',snapshot.key,val,JSON.stringify(val).length)
			this.global_players[snapshot.key]=val;
			lobby.players_list_updated(this.global_players);
		});
		fbs.ref(ROOM_NAME).on('child_removed', snapshot => {
			const val=snapshot.val()
			//console.log('child_removed',snapshot.key,val,JSON.stringify(val).length)
			delete this.global_players[snapshot.key];
			lobby.players_list_updated(this.global_players);
		});

		fbs.ref(ROOM_NAME+'/'+my_data.uid).onDisconnect().remove()
		this.state_listener_on=1

	},
	
	change_room(new_room){
		
		this.disconnect()
		if(ROOM_NAME)
			fbs.ref(ROOM_NAME+'/'+my_data.uid).remove()
		ROOM_NAME=new_room
		this.connect()
		
		//создаем заголовки
		const room_desc='КОМНАТА #'+ROOM_NAME.slice(6)
		objects.t_room_name.text=room_desc	
		
		set_state({state:'o'})
	},
	
	process(){
		
		const tm=Date.now();
		if (objects.inst_msg_cont.visible&&objects.inst_msg_cont.ready)
			if (tm>objects.inst_msg_cont.tm+7000)
				anim3.add(objects.inst_msg_cont,{alpha:[1, 0,'linear']},false,0.4);

	},
	
	peek_down(){
		
		if (anim3.any_on()) {
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
	
	close_invite_dialog() {

		sound.play('close_it');

		if (objects.invite_cont.visible===false)
			return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim3.add(objects.invite_cont,{y:[objects.invite_cont.y, 500,'linear']}, false, 0.15);
	},

	async send_invite() {


		if (!objects.invite_cont.ready||!objects.invite_cont.visible||objects.invite_btn.texture===assets.wait_response)
			return;

		if (anim3.any_on()){
			sound.play('locked');
			return
		};
		

		if (lobby.opp_uid==='bot')
		{
			await this.close();	

			opp_data.name='Бот';
			opp_data.uid='bot';
			opp_data.rating=1400;
			game.activate('master', bot_player );
			
			
		} else {
			sound.play('click');
			objects.invite_btn.texture=assets.wait_response;
			fbs.ref('inbox/'+lobby.opp_uid).set({sender:my_data.uid,message:'INV',tm:Date.now()});
			pending_player=lobby.opp_uid

		}

	},

	rejected_invite(msg) {

		this.rejected_invites[pending_player]=Date.now();
		pending_player="";
		lobby._opp_data={};
		this.close_invite_dialog();
		if(msg==='REJECT_ALL')
			big_msg.show(['Соперник пока не принимает приглашения.','The opponent refused to play.'][LANG],'---');
		else
			big_msg.show(['Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','The opponent refused to play. You can repeat the invitation in 1 minute'][LANG],'---');

	},

	async accepted_invite(seed) {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data.uid=lobby.opp_uid;
		
		//закрываем меню и начинаем игру
		await lobby.close();
		game.activate('master' , online_player );

		
	},

	chat_btn_down(){
		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		
		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_chat_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_chat_btn.y;
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false);	
		
		this.close();
		chat.activate();
		
	},

	quiz_btn_down(){
		
		if (anim3.any_on()) {
			sound.play('locked');
			return
		};		
		
		//sound.play('locked');
		//return
					
		sound.play('click');	
				
		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_quiz_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_quiz_btn.y;
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false);	
		
		this.close();
		quiz.activate();
	},

	async lb_btn_down() {

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_lb_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_lb_btn.y;
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false);	


		await this.close();
		lb.show();
	},
	
	list_btn_down(dir){
		
		if (anim3.any_on()===true) {
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
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false);	
		
		
		if (new_x>0 || new_x<-800) {
			sound.play('locked');
			return
		}
		
		anim3.add(objects.cards_cont,{x:[cur_x, new_x,'easeInOutCubic']},true,0.2);
	},

	async back_btn_down() {

		if (anim3.any_on()===true) {
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
		
		anim3.add(objects.pin_panel_cont,{alpha:[0, 1,'linear']}, true, 0.1);	
		objects.pin_panel_msg.text='Введите четырехзначный номер комнаты';
		anim3.add(objects.pin_panel_msg,{alpha:[0, 1,'easeTwiceBlink']}, true, 0.15);		
		
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
		anim3.add(objects.pin_panel_hl,{alpha:[0, 1,'easeTwiceBlink']}, false, 0.15,false);
		
		
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
		
		if (anim3.any_on()) {
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
			anim3.add(objects.pin_panel_msg,{alpha:[0, 1,'easeTwiceBlink']}, true, 0.15,false);	
			return;				
		}

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		
		
		if (this.t_pin.length!==4) return;
		
		//создаем комнату
		fbs.ref(`states${this.t_pin}/tm`).set(firebase.database.ServerValue.TIMESTAMP);
		objects.pin_panel_msg.text='Создали комнату №'+this.t_pin;
		anim3.add(objects.pin_panel_msg,{alpha:[0, 1,'easeTwiceBlink']}, true, 0.15);
	},
	
	async enter_room_down(){

		
		if (anim3.any_on() || this.t_pin.length!==4||this.check_is_on) {
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
			anim3.add(objects.pin_panel_msg,{alpha:[0, 1,'easeTwiceBlink']}, true, 0.15);	
			return;
		} 
		

		fbs.ref(ROOM_NAME+'/'+my_data.uid).remove();
		ROOM_NAME='states'+this.t_pin;		
		fbs.ref(`states${this.t_pin}/tm`).set(firebase.database.ServerValue.TIMESTAMP);
		fbs.ref(ROOM_NAME+'/'+my_data.uid).onDisconnect().remove();
		set_state({state : 'o'});		
		this.close();
		main_menu.close();
		lobby.activate();
		
		
	},
	
	close_btn_down(){
		
		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		
		this.close();
		
	},
	
	close(){
		
		anim3.add(objects.pin_panel_cont,{alpha:[1, 0,'linear']}, false, 0.1);	
		
	},
	
	erase_pin_down(){
		
		
	},
	
	exit_down(){
		
		
	}
		
}

auth={
		
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
		return chars[hf.randIntInc(0,chars.length-1)];
		
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

			let rnd_num = hf.randIntInc(0, rnd_names.length - 1);
			let rand_uid = hf.randIntInc(0, 999999)+ 100;
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
			my_data.auth_mode=+_player.isAuthorized()
			
			//убираем ё
			my_data.name=my_data.name.replace(/ё/g, 'е');
			my_data.name=my_data.name.replace(/Ё/g, 'Е');
			
			return;
		}
		
		if (game_platform === 'VK' || game_platform==='OK') {
			
			//game_platform = 'VK';
			
			await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')||await this.load_script('https://akukamil.github.io/common/vkbridge.js');

			let _player;
			
			try {
				await vkBridge.send('VKWebAppInit');
				_player = await vkBridge.send('VKWebAppGetUserInfo');				
			} catch (e) {alert(e)};

			
			my_data.name = _player.first_name + ' ' + _player.last_name;
			my_data.uid=game_platform.toLowerCase()+_player.id
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
			fbs.ref(ROOM_NAME+'/'+my_data.uid).remove();
			lobby.close()
			main_menu.activate();				
		}		
		my_ws.send_to_sleep();		
	}
	
}

top3={

	async activate(path){

		const top3=await my_ws.get(path||'day_top3')
		if(!top3) return
		const uids=Object.keys(top3)
		if (uids.length!==3) return

		const sorted_top3 = Object.entries(top3).sort((a, b) => b[1] - a[1])
		const ordered_uids = [sorted_top3[1][0], sorted_top3[0][0], sorted_top3[2][0]]

		await players_cache.update(ordered_uids[0],{source:'top3'})
		objects.day_top3_name1.set2(players_cache[ordered_uids[0]].name,145)

		await players_cache.update(ordered_uids[1],{source:'top3'})
		objects.day_top3_name2.set2(players_cache[ordered_uids[1]].name,145)

		await players_cache.update(ordered_uids[2],{source:'top3'})
		objects.day_top3_name3.set2(players_cache[ordered_uids[2]].name,145)


		objects.day_top3_avatar1.set_texture(players_cache[ordered_uids[0]].texture)
		objects.day_top3_avatar2.set_texture(players_cache[ordered_uids[1]].texture)
		objects.day_top3_avatar3.set_texture(players_cache[ordered_uids[2]].texture)

		objects.day_top3_lights1.text=top3[ordered_uids[0]]
		objects.day_top3_lights2.text=top3[ordered_uids[1]]
		objects.day_top3_lights3.text=top3[ordered_uids[2]]

		some_process.top3_anim=()=>{this.process()}
		sound.play('top3')
		anim3.add(objects.day_top3_cont, {alpha: [0, 1,'linear']}, true, 0.5);


	},

	process(){

		objects.day_top3_sunrays.rotation+=0.01

	},

	close(){

		if (anim3.any_on()) {
			sound.play('locked')
			return
		}
		
		sound.play('close_it')
		anim3.add(objects.day_top3_cont, {alpha: [1, 0,'linear']}, false, 0.25);


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
		hidden=+params.hidden;

	let small_opp_id='';
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	if(!no_invite)
		fbs.ref(ROOM_NAME+'/'+my_data.uid).set({s:state, n:my_data.name, r : my_data.rating, h:hidden, opp_id : small_opp_id});


}

function define_platform_and_language() {
	
	let s = window.location.href;
	
	if (s.includes('vk_ok_app_id')||s.includes('vk_ok_user_id')) {

		game_platform = 'OK';
		return;
	}


	if (s.includes('vk.com')||s.includes('vk.ru')||s.includes('vk_app_id')) {
		game_platform = 'VK';	
		return;
	}
		
		
		
	if (s.includes('app-id=176226')) {
		
		game_platform = 'YANDEX';
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

main_loader={

	preload_assets:0,

	spritesheet_to_tex(t,xframes,yframes,total_w,total_h,xoffset,yoffset){


		const frame_width=xframes?total_w/xframes:0;
		const frame_height=yframes?total_h/yframes:0;

		const textures=[];
		for (let y=0;y<yframes;y++){
			for (let x=0;x<xframes;x++){

				const rect = new PIXI.Rectangle(xoffset+x*frame_width, yoffset+y*frame_height, frame_width, frame_height);
				const quadTexture = new PIXI.Texture(t.baseTexture, rect);
				textures.push(quadTexture);
			}
		}
		return textures;
	},

	async load1(){
		
		git_src=''


		const loader=new PIXI.Loader();

		//добавляем текстуры из листа загрузки
		loader.add('load_bar_bcg', git_src+'res/common/load_bar_bcg.png');
		loader.add('bcg', git_src+'res/common/bcg.jpg');
		loader.add('load_bar_progress', git_src+'res/common/load_bar_progress.png');
		loader.add('3', COM_URL+'/fonts/core_sans_ds/f.fnt');
		loader.add('main_load_list',git_src+'load_list.txt');

		//переносим все в ассеты
		await new Promise(res=>loader.load(res))
		for (const res_name in loader.resources){
			const res=loader.resources[res_name];
			assets[res_name]=res.texture||res.sound||res.data;
		}

		//главный бэкграунд
		objects.bcg=new PIXI.Sprite(assets.bcg)
		objects.bcg.width=820
		objects.bcg.height=470
		objects.bcg.x=-10
		objects.bcg.y=-10
		app.stage.addChild(objects.bcg)		
		
		const load_bar_bcg=new PIXI.Sprite(assets.load_bar_bcg);
		load_bar_bcg.x=220;
		load_bar_bcg.y=210;
		load_bar_bcg.width=360;
		load_bar_bcg.height=50;		

		this.load_bar_mask=new PIXI.Graphics();
		this.load_bar_mask.beginFill(0xff0000);
		this.load_bar_mask.drawRect(0,0,1,30);
		this.load_bar_mask.x=235;
		this.load_bar_mask.y=224;

		this.load_bar_progress=new PIXI.Sprite(assets.load_bar_progress);
		this.load_bar_progress.y=210;		
		this.load_bar_progress.x=220;
		this.load_bar_progress.width=360;
		this.load_bar_progress.height=50;
		this.load_bar_progress.mask=this.load_bar_mask

		this.t_progress=new PIXI.BitmapText('0%', {fontName: 'core_sans_ds',fontSize: 25,align: 'center'})
		this.t_progress.y=235
		this.t_progress.x=400
		this.t_progress.tint=0xffffff
		this.t_progress.anchor.set(0.5,0.5)

		objects.load_cont=new PIXI.Container();
		objects.load_cont.addChild(load_bar_bcg,this.load_bar_progress,this.load_bar_mask,this.t_progress)
		app.stage.addChild(objects.bcg,objects.load_cont);

	},

	async load2(){

		const loader=new PIXI.Loader();

		loader.add('1', COM_URL+'/fonts/exosoft_bold_128/f.fnt');//это для поля
		loader.add('2', COM_URL+'/fonts/exosoft_bold_64/f.fnt');//это для поля
		
		
		loader.add('click',git_src+'sounds/click.mp3');
		loader.add('locked',git_src+'sounds/locked.mp3');
		loader.add('clock',git_src+'sounds/clock.mp3');
		loader.add('close_it',git_src+'sounds/close_it.mp3');
		loader.add('game_start',git_src+'sounds/game_start.mp3');
		loader.add('lose',git_src+'sounds/lose.mp3');
		loader.add('receive_move',git_src+'sounds/receive_move.mp3');
		loader.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
		loader.add('bad_word',git_src+'sounds/bad_word.mp3');
		loader.add('good_word',git_src+'sounds/good_word.mp3');
		loader.add('key_down',git_src+'sounds/key_down.mp3');
		loader.add('cell_down',git_src+'sounds/cell_down.mp3');
		loader.add('cell_move',git_src+'sounds/cell_move.mp3');
		loader.add('bad_move',git_src+'sounds/bad_move.mp3');
		loader.add('win',git_src+'sounds/win.mp3');
		loader.add('invite',git_src+'sounds/invite.mp3');
		loader.add('draw',git_src+'sounds/draw.mp3');
		loader.add('keypress',git_src+'sounds/keypress.mp3');
		loader.add('online_message',git_src+'sounds/online_message.mp3');
		loader.add('inst_msg',git_src+'sounds/inst_msg.mp3');
		loader.add('top3',git_src+'sounds/top3.mp3');
		loader.add('note',git_src+'sounds/note.mp3');
		
		for (let i=1;i<9;i++)
			loader.add('cell_click'+i,git_src+`sounds/cell_click${i}.mp3`);

		//добавляем из листа загрузки
		const main_load_list=eval(assets.main_load_list);
		for (var i = 0; i < main_load_list.length; i++)
			if (main_load_list[i].class === 'sprite' || main_load_list[i].class === 'image' )
				loader.add(main_load_list[i].name, git_src+'res/RUS/' + main_load_list[i].name + '.' +  main_load_list[i].image_format);	

		//прогресс
		loader.onProgress.add((l,res)=>{
			this.load_bar_mask.width=3.28*l.progress;
			this.t_progress.text=Math.round(l.progress)+'%';
		});

		await new Promise(res=>loader.load(res))

		//переносим все в ассеты
		await new Promise(res=>loader.load(res))
		for (const res_name in loader.resources){
			const res=loader.resources[res_name];
			assets[res_name]=res.texture||res.sound||res.data;
		}

		anim3.add(objects.load_cont,{alpha:[1,0,'linear']}, false, 0.5);

		//создаем спрайты и массивы спрайтов и запускаем первую часть кода
		for (let i = 0; i < main_load_list.length; i++) {
			const obj_class = main_load_list[i].class;
			const obj_name = main_load_list[i].name;
			console.log('Processing: ' + obj_name)

			switch (obj_class) {
			case "sprite":
				objects[obj_name] = new PIXI.Sprite(assets[obj_name]);
				eval(main_load_list[i].code0);
				break;

			case "block":
				eval(main_load_list[i].code0);
				break;

			case "cont":
				eval(main_load_list[i].code0);
				break;

			case "array":
				const a_size=main_load_list[i].size;
				objects[obj_name]=[];
				for (let n=0;n<a_size;n++)
					eval(main_load_list[i].code0);
				break;
			}
		}

		//обрабатываем вторую часть кода в объектах
		for (let i = 0; i < main_load_list.length; i++) {
			const obj_class = main_load_list[i].class;
			const obj_name = main_load_list[i].name;
			console.log('Processing: ' + obj_name)


			switch (obj_class) {
			case "sprite":
				eval(main_load_list[i].code1);
				break;

			case "block":
				eval(main_load_list[i].code1);
				break;

			case "cont":
				eval(main_load_list[i].code1);
				break;

			case "array":
				const a_size=main_load_list[i].size;
					for (let n=0;n<a_size;n++)
						eval(main_load_list[i].code1);	;
				break;
			}
		}


	}

}

async function init_game_env() {	
	
	await define_platform_and_language();		

	//получаем данные об игроке из социальных сетей
	await auth.init()
	
	//убираем надпись
	document.getElementById('loadingText').remove();
	
	//создаем приложение
	const dw=M_WIDTH/document.body.clientWidth;
	const dh=M_HEIGHT/document.body.clientHeight;
	const resolution=Math.min(1.5,Math.max(dw,dh,1));	
	const opts={width:M_WIDTH, height:M_HEIGHT,antialias:false,resolution,autoDensity:true};
	app.stage = new PIXI.Container();
	app.renderer = new PIXI.Renderer(opts);
	document.body.appendChild(app.renderer.view).style["boxShadow"] = "0 0 15px #000000";
	
	resize();
	window.addEventListener("resize", resize);
	
	//запускаем главный цикл так как уже надо обрабатывать	
	main_loop.start()		

	await main_loader.load1()
	await main_loader.load2()
		
	anim3.add(objects.id_cont,{y:[-230, 100,'easeOutBack']}, true, 0.5);
	
	//запускаем лупную анимацию
	some_process.loup_anim=function(d) {
		objects.id_loup.x=20*Math.sin(TM.s*10)+90;
		objects.id_loup.y=20*Math.cos(TM.s*10)+150;
	}
	
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
		
	//идентификатор клиента
	client_id = hf.randIntInc(10,999999);	
	
	//подключение сокета
	objects.id_log.text='Подключение к серверу my_ws...'
	await my_ws.init()
	
		
	//загружаем остальные данные из файербейса
	objects.id_log.text='Получаем данные из Google... '
	const other_data = await fbs_once('players/' + my_data.uid)
	SERVER_TM=await my_ws.get_tms() 
	
	//делаем защиту от неопределенности
	my_data.rating = other_data?.rating || 1400
	my_data.games = other_data?.games || 0
	my_data.nick_tm = other_data?.nick_tm || 0
	my_data.avatar_tm = other_data?.avatar_tm || 0
	my_data.name=other_data?.name || my_data.name
	my_data.energy=safe_ls('balda_energy')||0

	//правильно определяем аватарку
	if (other_data?.pic_url.includes('mavatar'))
		my_data.pic_url=other_data.pic_url
	else
		my_data.pic_url=my_data.orig_pic_url
		
	//чуть ждем баннерную рекламу
	ad.prv_banner_show=Date.now()+200000;
	
	//проверяем блокировку
	my_data.blocked=await fbs_once('blocked/'+my_data.uid);
		
	//загружаем и получаем мои данные из кэша
	objects.id_log.text='Загрузка данных игрока... '
	players_cache.update_params(my_data.uid,{pic_url:my_data.pic_url,rating:my_data.rating,name:my_data.name});
	await players_cache.update(my_data.uid);
	
	//устанавливаем фотки в попап
	objects.id_name.set2(my_data.name,150);	
	objects.my_card_name.set2(my_data.name,200);	
	objects.id_avatar.set_texture(players_cache[my_data.uid].texture);
	objects.my_avatar.texture=players_cache[my_data.uid].texture;
	
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
		block_num:other_data?.block_num||0,
		session_start:firebase.database.ServerValue.TIMESTAMP,
		tm:firebase.database.ServerValue.TIMESTAMP
	});

	//отключение от игры и удаление не нужного
	//fbs.ref("inbox/"+my_data.uid).onDisconnect().remove();
	fbs.ref(ROOM_NAME+"/"+my_data.uid).onDisconnect().remove();

	//это событие когда меняется видимость приложения
	document.addEventListener("visibilitychange", function(){tabvis.change()});

	//для удаления дубликатов
	fbs.ref('inbox/'+my_data.uid).set({client_id,tm:Date.now()});

	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);
		
		
	//ждем загрузки чата
	objects.id_log.text='Загрузка общего чата... '
	await chat.init()
	objects.id_log.text=''
	
	//отображаем лидеров вчерашнего дня
	top3.activate()
	
	//разные проверки
	pref.init()	
	
	//убираем лупу
	some_process.loup_anim = function(){};		
	anim3.add(objects.id_cont,{y:[objects.id_cont.y, -200,'easeInBack']}, false, 0.5);	
		
	//контроль за присутсвием
	var connected_control = fbs.ref(".info/connected");
	connected_control.on("value", (snap) => {
		if (snap.val() === true) {
			if(!connected)
				pmsg.add({t:'Связь с сервером восстановлена!'});
			connected = 1;
		} else {
			pmsg.add({t:'Связь с сервером потеряна!'});
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

main_loop={	

	lastTime:0,	
	
	start(fps){
	
		TM.ms=0
		TM.s=0
		this.run(TM.ms)
		
	},
	
	run(t){		
		
		const delta = t - this.lastTime	
		const cap_delta = Math.min(delta,16.666)	
					
		TM.ms=t
		TM.s=TM.ms*0.001					
					
		anim3.process()

		//обрабатываем минипроцессы
		for (const key in some_process)
			some_process[key](cap_delta)

		app.renderer.render(app.stage)			
		
		this.lastTime = t
		requestAnimationFrame(main_loop.run.bind(this))	
		
	}	
	
}