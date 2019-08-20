//装备模块
myScript.fast_ajax(DATA_BASE()+"equipment.json",function(ajax){
	var equipment=ajax.json;
	var attribute_cache={};
	for(var i in equipment.type){
		var item=$.set("div",$("#equipment_body"));
		var option="";
		for(var j in equipment.type[i]){
			option+="<option value='"+j+"'>"+j+"</option>"
		}
		item.innerHTML=myScript.template_get_html("equipment_item",{name:i,typedata:option});

		item.className="equipment_item";

		item.type=i;
		item.onchange=function(ev){
			console.log("hello");
			var target;
			if(ev) target=ev.target;
			else target=myScript.$get(".equipment_type",this)[0];

			if(target.className=="equipment_type"){

				var display=$("#equipment_body").style.display;
				$("#equipment_body").style.display="";

				var option="";
				for(var j in equipment.data[target.value]){
					option+="<option value='"+j+"'>"+j+"</option>"
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
						option+="<option value='"+t[k]+"'"+(equipment.type[this.type][target.value][j].default==k?" selected":"")+">"+t[k]+"</option>";
					}
					data+=myScript.template_get_html("equipment_attribute",{option:option});
				}
				myScript.$get(".equipment_attributes",this)[0].innerHTML=data;

				//设置高度，纵向居中
				myScript.$get(".equipment_item_base",this)[0].style.lineHeight=(this.offsetHeight-40)+"px";

				$("#equipment_body").style.display=display;
			}

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
			this.get_attribute=function(){
				return this.attribute_cache;
			}

			if(this.update) this.update();
		}

		item.update=function(){
			attribute_cache=globla_function.get_attributes($(".equipment_item"));
			console.log(attribute_cache);
		}

		item.onchange();
	}
	$("#equipment").get_attribute=function(){
		return attribute_cache;
	}
	//var rigs={};
	// $("#equipment").get_attribute=function(){
	// 	return {critical_damage:42.9*3,magic_damage:10400+3432+5825};
	// }
});