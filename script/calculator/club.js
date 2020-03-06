myScript.fast_ajax(DATA_BASE()+"club.json",function(ajax){
	var attribute_cache={};
	var club_data=ajax.json;
	for(var i in club_data){
		var item=$.set("div",$("#club_body"));
		item.innerHTML=myScript.template_get_html("club_item",{name:i});
		item.className="club_item";
		item.type=i;
		item.get_attribute=function(){
			var sel=myScript.$get("select",this)[0];
			if(sel.value!=-1){
				return club_data[this.type].attributes[sel.value];
			}
		}
	}
	$("#club").onchange=function(){
		attribute_cache=globla_function.get_attributes($(".club_item"),$("#club_res"));
		if(this.update)this.update();
	}
	$("#club").get_attribute=function(){
		return attribute_cache;
	}
	$("#club").onchange();
});
