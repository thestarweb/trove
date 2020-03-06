myScript.fast_ajax(DATA_BASE()+"food.json",function(ajax){
	var foods=ajax.json;
	var sel=$("#food select")[0];
	for(var i in foods){
		var op=myScript.set_dom("option",sel);
		op.value=i;
		op.innerHTML=i;
	}
	$("#food").onchange=function(){//
		if(this.update)this.update();
	}
	$("#food").get_attribute=function(){
		return foods[sel.value];
	}
	$("#food").onchange();
});
