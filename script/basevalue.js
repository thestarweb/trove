(function(){
	var dom=$("#basevalue");
	dom.get_attribute=function(){
		return{
			"critical_damage":75,
			"critical_hit":4,
			"damage":100,
			"max_health":150,
			"health_regeneration":25,
			"energy_regeneration_":100,
			"jump":2,
			"magic_find":50,
			"attack_speed":100,
			"move_speed":40,
			"max_energy":100
		};
	}
	if(dom.update) dom.update();
})();