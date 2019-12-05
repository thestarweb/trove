(function(){
	var dom=$("#basevalue");
	dom.get_attribute=function(){
		return{
			"critical_damage":50,
			"damage":350,
			"jump":2,
			"magic_find":50,
			"attack_speed":100,
			"move_speed":40,
			"max_energy":100
		};
	}
	if(dom.update) dom.update();
})();