//龙模块
myScript.fast_ajax(DATA_BASE()+"dragon.json",function(ajax){
	var dragon=ajax.json;
	var attribute_cache={};
	var data=$("#dragon_data");
	for(var i in dragon){
		var self=$.set("div",data);
		self.innerHTML=myScript.template_get_html("dragon_type",{name:$.lang('dragon.'+i)});
		self.className="dragon_type";
		self.totla=0;
		self.has=0;
		var data_div=myScript.$get(".dragon_data",self)[0];
		for(var j=0;j<dragon[i].length;j++){
			var item=$.set("div",data_div);
			item.className="dragon_item block";
			$.set("div",item).innerHTML="<input type='checkbox' checked/>"+$.lang('dragon.'+dragon[i][j].name);
			globla_function.display_attributes(dragon[i][j].attribute,$.set("div",item));
			item.get_attribute=(function(i,j){
				return function(){
					return myScript.$get("input",this)[0].checked?dragon[i][j].attribute:{};
				}
			})(i,j);

			self.totla++;
			self.has++;
		}
		myScript.$get(".number",self)[0].innerHTML=self.has+"/"+self.totla;

	}
	$("#dragon").run=function(){
		attribute_cache=globla_function.get_attributes($(".dragon_item"),$("#dragon_res"));
		if(this.update)this.update();
	}

	//绑定获取数据的函数至dom上
	$("#dragon").get_attribute=function(){
		return attribute_cache;
	}

	$("#dragon").onchange=function(ev){
		this.run();
		console.log(ev);
		for(var i=0;i<ev.path.length;i++){
			if(ev.path[i].className=="dragon_type"){
				var self=ev.path[i];
				if(ev.srcElement.checked) self.has++;
				else self.has--;
				myScript.$get(".number",self)[0].innerHTML=self.has+"/"+self.totla;
			}
		}
	}
	$("#dragon").run();
});
