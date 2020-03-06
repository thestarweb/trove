//宝石模块
(function(){
	var gem_data=[
		{
			name:"红宝石",
			dragon:true//龙
		},
		{
			name:"黄宝石",
			dragon:true
		},
		{
			name:"蓝宝石",
			dragon:true
		},
		{
			name:"宇宙宝石",
			cosmic_gem:true,
			dragon:false
		},
	];
	var gem_attribute={
		//大宝石
		empowered:{
			//物理
			physical_damage:{
				base:6314,
				jump:3724
			},
			//魔法
			magic_damage:{
				base:6314,
				jump:3724
			},
			//爆伤
			critical_damage:{
				base:90.2,
				jump:53.2
			},
			critical_hit:{
				base:9,
				jump:5.3
			},
			light:{
				base:451,
				jump:266
			},
			max_health:{
				base:22550,
				jump:13300
			},
			max_health_:{
				base:226,
				jump:133
			}
		},
		normal:{
			physical_damage:{
				base:5390,
				jump:2800
			},
			magic_damage:{
				base:5390,
				jump:2800
			},
			critical_damage:{
				base:77,
				jump:40
			},
			critical_hit:{
				base:7.7,
				jump:4
			},
			light:{
				base:385,
				jump:200
			},
			max_health:{
				base:16000,
				jump:10000
			},
			max_health_:{
				base:160,
				jump:100
			}
		}
	}

	//创建模板
	for(var i=0;i<gem_data.length;i++){
		var item=$.set("div",$("#gem_data"));
		item.innerHTML=myScript.template_get_html("gem_class",{name:gem_data[i].name,dragon:gem_data[i].dragon?"checked":"",cosmic_gem:gem_data[i].cosmic_gem})//mb_gem_class.replace("__gem_class__","gem").replace("__name__",gem_data[i].name).replace("__gem__",mb_gem);
		//item.innerHTML=mb.replace("__gem__","gem"+i).replace("__name__",gem_data[i].name);
		//item.className="gem_item";

	}
	//创建select
	var list=$(".gem_attribute_select");
	var option_str="";
	var yz_option_str=""
	for(var j in attributes){//创建列表
		if(attributes[j].gem){
			option_str+="<option value='"+j+"'>"+attributes[j].name+"</option>";
		}else if(attributes[j].cosmic_gem){
			yz_option_str+="<option value='"+j+"'>"+attributes[j].name+"</option>";
		}
	}
	for(var i=0;i<list.length;i++){//将列表插入到选项框
		
		if(list[i].getAttribute("cosmic_gem")=="true"){
			list[i].innerHTML+=yz_option_str;
			list[i].setAttribute("selectedOptions","light")
		}else{
			list[i].innerHTML=option_str;
			list[i].value=globla_function.get_attribute_name(list[i].getAttribute("selectedOptions"));
		}
	}
	var peibi_ctrl=$("#gem_paibi_main,#gem_paibi_o");
	peibi_ctrl.set("onchange",function(){
		var o;
		for(var i=0;i<2;i++){
			if(peibi_ctrl[i]!=this){
				o=peibi_ctrl[i];
				break;
			}
		}
		var type=globla_function.get_attribute_type(this.value);
		if(type==o.getAttribute("selectedOptions")){//同类型，认为是交换
			o.value=globla_function.get_attribute_name(this.getAttribute("selectedOptions"));
			o.setAttribute("selectedOptions",this.getAttribute("selectedOptions"))
		}
		this.setAttribute("selectedOptions",type);
	});
	//select的更新
	globla_function.add_listener(function(){
		var list=$(".gem_attribute_select");
		for(var i=0;i<list.length;i++){
			var n=globla_function.get_attribute_name(list[i].getAttribute("selectedOptions"));
			// if(n!==list[i].value){
				list[i].value=n;
				//if(list[i].onchange) list[i].onchange();
			// }
		}
		list=$(".gem_data");
		for(var i=0;i<list.length;i++){
			list[i].run();//更新数据
		}
	});

	//单个宝石属性计算方法绑定
	var list=$(".gem_data");
	//在外面定义减少定义次数
	var kj_keydown_fanzhuan=function(ev){
		switch(ev.keyCode){//将上下按键翻转成正常功能
			case 38:
				this.value--;
				this.onchange();
				return false;
			case 40:
				this.value++;
				this.onchange();//手动修改数据后需要自己调用
				return false;
		}
	}
	for(var i=0;i<list.length;i++){
		// list[i].run=
		(function(self){
			var data_cache={};
			var jump_cache=[0,0];//总次数 伤害 爆伤
			self.run=function(){
				//清空缓存
				data_cache={};
				jump_cache=[0,0];
				var a=gem_attribute[this.getAttribute("type")];
				if(a){
					var res={},res_show=myScript.$get(".gem_res span",this);
					//计算3跳位置
					var jump=myScript.$get(".jump input",this),jumpres=[];
					for(var j=0;j<jump.length;j++){
						if(jumpres[jump[j].value]) jumpres[jump[j].value]++;
						else jumpres[jump[j].value]=1;
					}
					var sx_type=myScript.$get(".gem_attribute_type select",this);
					for(var j=0;j<sx_type.length;j++){
						if(a[sx_type[j].value])
						{
							data_cache[sx_type[j].value]=a[sx_type[j].value].base+a[sx_type[j].value].jump*(jumpres[j]||0);
							res_show[j].innerHTML=a[sx_type[j].value].base+a[sx_type[j].value].jump*(jumpres[j]||0);
							//存储跳法
							if(sx_type[j].value==$("#gem_paibi_main").value){
								jump_cache[0]=jumpres[j]||0;
							}else if(sx_type[j].value==$("#gem_paibi_o").value){
								jump_cache[1]=jumpres[j]||0;
							}
						}
					}
				}

				if(self.update)self.update();
			};
			self.run();
			self.set_jump=function(time,f){
				var jump_list=myScript.$get(".jump input",this);
				if(time<0) time=0;
				else if(time>jump_list.length) time=jump_list.length;
				//else if((!f)&&time>jump_cache[0]) time=jump_cache[0];//不可超范围设置

				var list=myScript.$get("select",this),src_index=-1,baoshang=-1,outher=-1;
				for(var i=0;i<list.length;i++){
					if(list[i].value==$("#gem_paibi_main").value) src_index=i;
					else if(list[i].value==$("#gem_paibi_o").value) baoshang=i;
					else outher=i;
				}
				if(src_index==-1) return 0;//没有伤害属性，无法设置
				var time_set=0,src_list=[],bsl=[],ol=[];
				for(var i=0;i<jump_list.length;i++){
					if(jump_list[i].value==src_index) src_list.push(i);
					else if(jump_list[i].value==baoshang) bsl.push(i);
					else ol.push(i);
				}
				if(time==src_list.length) return time;//次数一致无须修改
				if(baoshang==-1&&!f){//没有爆伤还不让修改其他属性
					return src_list.length;//那就只能保持不变了
				}
				if(time<src_list.length){//需要减少
					var to=baoshang==-1?outher:baoshang;//有爆伤就和爆伤交换 没有就和别的交换
					for(var i=src_list.length;i>time;i--){
						jump_list[src_list.pop()].value=to;
					}
				}else{//需要增加
					for(var i=src_list.length;i<time;i++){
						var no=bsl.pop();
						if(typeof no!="undefined"){
							jump_list[no].value=src_index;
						}else if(f){//爆伤的取完了 但是可以取别的
							jump_list[ol.pop()].value=src_index;
						}else{//爆伤用完也不能修改别的属性，只能结束
							time=i;
							break;
						}
					}
				}
				self.run();
				return time;
			}
			self.change_jump=function(d,f){
				var temp=jump_cache[0];
				return this.set_jump(temp+d,f)-temp;
			}
			self.get_attribute=function(){
				return data_cache;
			}
			self.get_jump=function(){
				return jump_cache;
			}
			var kj=myScript.$get(".jump input,.gem_attribute_type select",list[i]);

			var kj_value_change_event=function(){
				if(this.tagName.toLowerCase()=="select"){
					var list=myScript.$get(".gem_attribute_type select",self);
					var now_type=globla_function.get_attribute_type(this.value);
					for(var i=0;i<list.length;i++){
						if(list[i]==this) continue;
						if(list[i].getAttribute("selectedOptions")==now_type){
							this.value=globla_function.get_attribute_name(this.getAttribute("selectedOptions"));
							myScript.message("同一宝石不能设置两个相同属性！","","red");
							return;
						}
					}
					this.setAttribute("selectedOptions",now_type);
				}
				self.run();
			};
			for(j=0;j<kj.length;j++){
				kj[j].onchange=kj_value_change_event;
				if(kj[j].tagName.toLowerCase()=="input"){
					kj[j].onkeydown=kj_keydown_fanzhuan;
				}
			}
		})(list[i]);
		list[i].run();	// var kj1=myScript.$get(".jump input",list[i]);
		// var kj2=myScript.$get(".gem_attribute_type select",list[i]);
	}



	//宝石组计算
	var list=$(".gem_class");
	for(var i=0;i<list.length;i++){
		(function(self){
			var peibi_input=myScript.$get(".peibi",self);
			var attribute_cache={};
			var jump_cache=[0,0,0,0];
			self.run=function(){
				attribute_cache={};
				var c=myScript.$get(".gem_data",this);
				for(var i=0;i<c.length;i++){
					var ca=c[i].get_attribute();
					for(var j in ca){
						var attribute=ca[j];
						if(self.has_dragon()) attribute*=1.1;//有钻龙时属性提升
						if(attribute_cache[j]) attribute_cache[j]+=attribute;
						else attribute_cache[j]=attribute;
					}
				}
				jump_cache=[0,0,0,0];
				var c=myScript.$get(".gem_data",this);
				for(var i=0;i<c.length;i++){
					var ca=c[i].get_jump(),base=2;
					if(c[i].getAttribute("type")=="empowered"){
						base=0;
					}
					for(var j=0;j<2;j++){
						jump_cache[base+j]+=ca[j];
					}
				}
				
				for(var i=0;i<peibi_input.length;i++){
					peibi_input[i].value=jump_cache[i];
				}
				if(this.update) this.update();
			}
			self.get_attribute=function(){
				return attribute_cache;
			}
			self.get_jump=function(){
				return jump_cache;
			}
			self.has_dragon=function(){
				return myScript.$get(".has_dragon",self)[0].checked;
			}
			myScript.$get(".gem_data",self).set("update",function(){
				self.run();
			});
			self.run();
			myScript.$get(".has_dragon",self)[0].onchange=function(){
				self.run();
			}
			self.set_jump=function(gem_type,time,f){
				var c=myScript.$get(".gem_data",self);
				var now=jump_cache[2];
				if(gem_type=="empowered"){
					now=jump_cache[0];
				}
				var need_change=time-now;
				for(var i=0;i<c.length;i++){
					if(c[i].getAttribute("type")==gem_type){
						need_change-=c[i].change_jump(need_change,f);
						if(need_change==0)break;
					}
				}
				return time-need_change;
			}
			self.change_jump=function(gem_type,time,f){
				var need_change=time;
				var c=myScript.$get(".gem_data",self);
				for(var i=0;i<c.length;i++){
					if(c[i].getAttribute("type")==gem_type){
						need_change-=c[i].change_jump(need_change,f);
						if(need_change==0)break;
					}
				}
				return time-need_change;
			}
			peibi_input[0].onchange=function(){
				this.value=self.set_jump("empowered",this.value);
			}
			peibi_input[2].onchange=function(){
				this.value=self.set_jump("normal",this.value);
			}
		})(list[i]);
	}

	//所有宝石的属性处理
	var gem_top=$("#gem");
	var attribute={};
	var jump_cache=[0,0,0,0,0,0,0,0,0,0,0,0];
	var peibi_input=myScript.$get("#main_peibi .peibi");
	var main_peibi=myScript.$get("#main_peibi");
	//手动设置配比事件
	main_peibi.onchange=function(e){
		var i=0;
		while(main_peibi.children[i]!==e.target)i++;
		var need_change=e.target.value-jump_cache[i];
		var c=myScript.$get(".gem_class",gem_top);
		for(var j=0;j<c.length;j++){
			if((i<4?c[j].has_dragon():!c[j].has_dragon())){//有无钻龙
				need_change-=c[j].change_jump(i%4<2?"empowered":"normal",need_change);
				if(need_change==0)break;
			}
		}
		if(need_change==e.target.value-jump_cache[i]){
			//没有实际变化时，子控件不会返回事件，因此需要手动将值改回去
			e.target.value=jump_cache[i];
		}
	}
	gem_top.run=function(){
		jump_cache=[0,0,0,0,0,0,0,0],base=4;
		//gem_res
		attribute=globla_function.get_attributes(list,$("#gem_res"));
		for(var i=0;i<list.length;i++){
			// var a=list[i].get_attribute();
			// for(var j in a){
			// 	if(attribute[j]) attribute[j]+=a[j];
			// 	else attribute[j]=a[j];
			// }
			a=list[i].get_jump();
			if(list[i].has_dragon()){
				base=0;
			}else{
				base=4;
			}
			for(var j=0;j<4;j++){
				jump_cache[base+j]+=a[j]
			}
			//更新显示
			for(var j=0;j<peibi_input.length;j++){
				peibi_input[j].value=jump_cache[j];
			}
		}
		if(this.update) this.update();
	}
	list.set("update",function(){
		gem_top.run();
	});
	gem_top.get_attribute=function(){
		return attribute;
	}
	gem_top.run();
	
})();