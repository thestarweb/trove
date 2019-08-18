(function(){
	//结果控制
		var res_div=$("#res");
		// for(var i in attributes){
		// 	$.set("div",res_div).innerHTML=attributes[i].name+":<span id='res_"+i+"'></span>";
		// }
		function run(){
			console.log("man update");
			var list=$(".type_root");
			var attribute=globla_function.get_attributes(list,$("#res_o"));
			$("#res_coe").innerHTML=((attribute[globla_function.get_damage_type()]+(attribute.damage||0))*(100+attribute.damage_+20)*0.01*((100+10)*0.01)*attribute.critical_damage/100).toFixed(2);
		}
		$(".type_root").set("update",run);
		run();
})();