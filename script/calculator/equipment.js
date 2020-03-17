//装备模块
myScript.fast_ajax(DATA_BASE()+"equipment.json",function(ajax){
	var equipment=ajax.json;
	var attribute_cache={};
	for(var i in equipment.type){
		var item=$.set("div",$("#equipment_body"));
		var option="";
		for(var j in equipment.type[i]){
			option+="<option value='"+j+"'>"+$.lang("base."+j)+"</option>"
		}
		item.innerHTML=myScript.template_get_html("equipment_item",{name:$.lang("base."+i),typedata:option});

		item.className="equipment_item";

		item.set_select=function(){
			var list=myScript.$get(".equipment_attribute",this);
			for(var i=0;i<list.length;i++){
				var options=myScript.$get("option",list[i]);
				for(var j=0;j<options.length;j++){
					var s=globla_function.get_attribute_name(options[j].getAttribute("dnmae"));
					options[j].innerHTML=$.lang("base."+s);
					options[j].value=s
					//globla_function.get_attribute_name(t[k])
				}
				list[i].value=globla_function.get_attribute_name(list[i].getAttribute("selectedOptions"));
			}
			this.run();
		}

		item.type=i;
		item.get_attribute=function(){
			return this.attribute_cache;
		}
		item.run=function(){
			var list=myScript.$get(".equipment_attributes p",this);
			this.attribute_cache={};
			for(var i=0;i<list.length;i++){
				var name=myScript.$get("select",list[i])[0].value;
				var as=equipment.type[this.type][myScript.$get(".equipment_type",this)[0].value][i].as;
				if(as==-1)as=i;
				var value=equipment.data[myScript.$get(".equipment_type",this)[0].value][myScript.$get(".equipment_lv",this)[0].value][as][name];
				this.attribute_cache[name]=value;
				myScript.$get("span",list[i])[0].innerHTML=value;
			}
			if(this.update) this.update();
		}
		item.onchange=function(ev){
			var target;
			if(ev) target=ev.target;
			else target=myScript.$get(".equipment_type",this)[0];

			if(target.className=="equipment_type"){//改变大的类型或新建时需要重新创建

				var display=$("#equipment_data").style.display;
				$("#equipment_data").style.display="";

				var option="";
				for(var j in equipment.data[target.value]){
					option+="<option value='"+j+"'>"+$.lang("base."+j)+"</option>"
				}
				var equipment_lv=myScript.$get(".equipment_lv",this)[0];
				equipment_lv.innerHTML=option;

				var data="";
				for(var j=0;j<equipment.type[this.type][target.value].length;j++){
					var temp=equipment.type[this.type][target.value][j].as;
					if(temp==-1) temp=j;
					option="";
					var t=equipment.type[this.type][target.value][temp].attributes;
					for(var k=0;k<t.length;k++){
						var name=t[k];
						option+="<option dnmae='"+name+"'></option>";
					}
					var default_sel=equipment.type[this.type][target.value][j].default;
					data+=myScript.template_get_html("equipment_attribute",{option:option,select:globla_function.get_attribute_type(t[default_sel])});
				}
				myScript.$get(".equipment_attributes",this)[0].innerHTML=data;
				//设置高度，纵向居中
				myScript.$get(".equipment_item_base",this)[0].style.lineHeight=(this.offsetHeight-40)+"px";

				$("#equipment_data").style.display=display;
				
				this.set_select();//刷新属性框数据
			}else{
				console.log(target.className);
				if(target.className=="equipment_attribute"){
					var list=myScript.$get(".equipment_attribute",this);
					for(var i=0;i<list.length;i++){
						if(list[i].value==target.value&&list[i]!=target){//不同的地方选择了相同的属性，这是不允许的
							myScript.message("选择失败","你的选择与第"+(i+1)+"属性冲突","red");
							target.value=globla_function.get_attribute_name(target.getAttribute("selectedOptions"));
							return;
						}
					}
					target.setAttribute("selectedOptions",globla_function.get_attribute_type(target.value));
				}
				this.run();//
			}

			//

			//if(this.update) this.update();
		}

		item.update=function(){
			attribute_cache=globla_function.get_attributes($(".equipment_item"),$("#equipment_res"));
			if($("#equipment").update)$("#equipment").update();
		}

		item.onchange();
	}
	$("#equipment").get_attribute=function(){
		return attribute_cache;
	}
	globla_function.add_listener(function(){
		var list=$(".equipment_item");
		for(var i=0;i<list.length;i++){
			list[i].set_select();
		}
	})
	//var rigs={};
	// $("#equipment").get_attribute=function(){
	// 	return {critical_damage:42.9*3,magic_damage:10400+3432+5825};
	// }
});
