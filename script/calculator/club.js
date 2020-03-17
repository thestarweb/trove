myScript.fast_ajax(DATA_BASE()+"club.json",function(ajax){
	var attribute_cache={};
	var club_data=ajax.json;
	for(var i in club_data){
		var typediv=$.set("div",$("#club_body"));
		typediv.className="block";
		$.set("div",typediv).innerHTML=$.lang("club.Fixture."+i);
		for(var j in club_data[i]){
			var item=$.set("div",typediv);
			item.innerHTML=myScript.template_get_html("club_item",{name:$.lang("club.Fixture."+j)});
			item.className="club_item";
			item.type=i;
			item.name=j;
			item.get_attribute=function(){
				var sel=myScript.$get("select",this)[0];
				if(sel.value!=-1){
					return club_data[this.type][this.name].attributes[sel.value];
				}
			}
			myScript.$get("select",item)[0].value=('default' in club_data[i][j])?club_data[i][j].default-1:-1;
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
