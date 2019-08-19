(function(){
	//结果控制
		var res_div=$("#res");
		function run(){
			var list=$(".type_root");
			var attribute=globla_function.get_attributes(list,$("#res_o"));
			var res_damage=(attribute[globla_function.get_damage_type()]+(attribute.damage||0))*(100+(attribute.damage_||0)+20)*0.01;
			var critical_hit=attribute.critical_hit||0;
			if(critical_hit>100)critical_hit=100;
			$("#res_damage").innerHTML=res_damage.toFixed(0);
			$("#res_health").innerHTML=((attribute.max_health||0)*(100+(attribute.max_health_||0))).toFixed(0);
			$("#res_coe").innerHTML=(res_damage*(100+attribute.critical_damage*critical_hit)/100).toFixed(2);
		}
		$(".type_root").set("update",run);
		run();
})();
