
$("#mastery").get_attribute=function(){
	var lv=$("#mastery_lv").value;
	return {damage_:lv*0.15,max_health_:lv*0.5};
}
$("#mastery").onchange=function(){
	if(this.update) this.update();
}
var get_mastery_lv_point=function(lv){//升级所需专精
	if(lv<1) return 0;
	if(lv<5) return 25;
	if(lv<10) return 50;
	if(lv<20) return 75;
	if(lv<300) return 100;
	return Math.ceil((lv+1)/2);
}
$("#mastery_lv").onchange=function(){
	this.value=parseInt(this.value);
	if(isNaN(this.value)) this.value=1;
	else if(this.value<1)this.value=1;
	var  point=0;
	for(var i=1;i<this.value;i++){
		point+=get_mastery_lv_point(i);
	}
	$("#mastery_point").value=point;
}
$("#mastery_point").onchange=function(){
	this.value=parseInt(this.value);
	if(isNaN(this.value)) this.value=1;
	else if(this.value<1)this.value=1;
	var lv=1;
	var point;
	var temp=this.value;
	while(temp>=(point=get_mastery_lv_point(lv))){
		temp-=point;
		lv++;
	}
	console.log(lv,temp);
	$("#mastery_lv").value=lv;
}
$("#mastery").onchange();