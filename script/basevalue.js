(function(){
	var dom=$("#basevalue");
	dom.get_attribute=function(){
		return{
			"critical_damage":50,
			"damage":350
		};
	}
	if(dom.update) dom.update();
})();