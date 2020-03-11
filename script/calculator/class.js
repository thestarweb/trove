//职业模块
myScript.fast_ajax(DATA_BASE()+"class_info.json",function(ajax){
	var classes=ajax.json;
	var select=$("#select_class");
	var attribute_cache={};
	select.onchange=function(){
		//获取div
		var class_lv_body=$("#class_lv_body"),class_lv_header=$("#class_lv_header"),class_lv_footer=$("#class_lv_footer");
		//清空原有内容
		class_lv_body.innerHTML=class_lv_header.innerHTML=class_lv_footer.innerHTML="";
		//清空属性缓存
		attribute_cache={};

		$.set("span",class_lv_header).innerHTML="lv";
		var cache={},NO=1;
		var head_list=[];
		for(var i=0;i<classes[this.value].levup.length;i++){//遍历等级（行）
			var data=classes[this.value].levup[i];
			var p=$.set("div",class_lv_body),now_list=[];
			now_list[j]=$.set("span",p).innerHTML=i;
			for(var j=1;j<NO;j++){//先显示已知列
				now_list[j]=$.set("span",p);
			}
			for(var j in data){
				//遍历列
				if(!cache[j]){
					//列不存在，先创建
					$.set("span",class_lv_header).innerHTML=$.lang("base."+j);
					now_list[NO]=$.set("span",p);
					cache[j]=NO++;
				}
				//现在列肯定存在了，直接插入数据
				now_list[cache[j]].innerHTML=data[j];
				//写入数据缓存
				if(attribute_cache[j]){
					attribute_cache[j]+=data[j];
				}else{
					attribute_cache[j]=data[j];
				}
			}
		}
		//显示职业结论
		$.set("span",class_lv_footer).innerHTML="all";
		now_list=[];
		for(var i=1;i<NO;i++){//设置好结论div
			now_list[i]=$.set("span",class_lv_footer);
		}
		for(var i in attribute_cache){
			now_list[cache[i]].innerHTML=attribute_cache[i].toFixed(2);
		}
		globla_function.set_damage_type(classes[this.value].damage_type);
		if($("#class").update) $("#class").update();
	}
	for(var i in classes){
		var item=$.set("option",select);
		item.innerHTML=$.lang("class."+i);
		item.value=i;
	}

	//绑定获取数据的函数至dom上
	$("#class").get_attribute=function(){
		return attribute_cache;
	}
	//所有方法绑定完毕后调用一次事件更新数据
	select.onchange();
});