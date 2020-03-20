myScript.fast_ajax(DATA_BASE()+"subclass.json",function(ajax){
	var data=ajax.json;
	var sel=$("#subclass select")[0];
	for(var i in data.abilities){
		var op=myScript.set_dom("option",sel);
		op.value=i;
		op.innerHTML=$.lang("class."+i);
	}
	$("#subclass").onchange=function(){//
		if(this.update)this.update();
		globla_function.display_attributes(this.get_attribute(),$("#subclass_res"));
	}
	$("#subclass").get_attribute=function(){
		var res={};
		if(data.abilities[sel.value]){
			var base=data.abilities[sel.value].attributes;
			res[base.type]=base.data[5];
		}
		return res;
	}
	$("#subclass").onchange();
});
