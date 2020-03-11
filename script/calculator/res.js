$(function(){
	//结果控制
		var res_div=$("#res");
		var el_res_magic_damage=$("#res_magic_damage");
		var el_res_physical_damage=$("#res_physical_damage");
		var el_res_health=$("#res_health");
		var el_res_health_regeneration=$("#res_health_regeneration");
		var el_res_coe=$("#res_coe");
		var el_res_energy_regeneration=$("#res_energy_regeneration");
		var el_res_max_energy=$("#res_max_energy");
		var list=$(".type_root");
		var set_value=function(dom,base_value,addition_value,base_name,addition_name){
			dom.innerHTML=((base_value||0)*(100+(addition_value||0))/100).toFixed(0);
			dom.parentNode.title=base_name+":"+(base_value||0)+"\n"+addition_name+":"+(addition_value||0);
		}
		function run(){
			var attribute=globla_function.get_attributes(list,$("#res_o"));

			var res_damages={};
			res_damages.magic_damage={
				base:(attribute.magic_damage||0)+(attribute.damage||0),
				addition:(attribute.damage_||0)+(attribute.magic_damage_||0)+20
			}
			res_damages.physical_damage={
				base:(attribute.physical_damage||0)+(attribute.damage||0),
				addition:(attribute.damage_||0)+(attribute.physical_damage_||0)+20
			}
			for(var i in res_damages){
				res_damages[i].value=res_damages[i].base*(100+res_damages[i].addition)*0.01;
			}

			var critical_hit=attribute.critical_hit||0;
			if(critical_hit>100)critical_hit=100;

			set_value(el_res_magic_damage,res_damages.magic_damage.base,res_damages.magic_damage.addition,
				$.lang("base.magic_damage"),$.lang("base.damage_"));
			set_value(el_res_physical_damage,res_damages.physical_damage.base,res_damages.physical_damage.addition,
				$.lang("base.physical_damage"),$.lang("base.damage_"));
			el_res_coe.innerHTML=(res_damages[globla_function.get_damage_type()].value*(10000+attribute.critical_damage*critical_hit)/10000).toFixed(2);

			var glist={//需要算加成的属性名及对应节点
				max_health:el_res_health,
				health_regeneration:el_res_health_regeneration,
				energy_regeneration:el_res_energy_regeneration
			}
			for(var i in glist){
				set_value(glist[i],attribute[i],attribute[i+"_"],$.lang("base."+i),$.lang("base."+i+"_"));
			}

			el_res_max_energy.innerHTML=(attribute.max_energy||0);
		}
		$(".type_root").set("update",run);
		run();
});
