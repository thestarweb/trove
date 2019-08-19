
$("#mastery").get_attribute=function(){
	var lv=$("#mastery_lv").value;
	return {damage_:lv*0.15,max_helth_:lv*0.5};
}
$("#mastery").onchange=function(){
	if(this.update) this.update();
}
var get_mastery_lv_point=function(lv){
	if(lv<5) return 25;
	if(lv<10) return 50;
	if(lv<20) return 75;
	if(lv<300) return 100;
	return lv/2;
}
$("#mastery_lv").onchange=function(){
	var  point=0;
	for(var i=1;i<=this.value;i++){
		point+=get_mastery_lv_point(i);
	}
	$("#mastery_point").value=point;
}
$("#mastery").onchange();