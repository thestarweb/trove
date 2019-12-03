
$("#mastery").get_attribute=function(){
	var lv=$("#mastery_lv").value;
	return {damage_:lv*0.15,max_health_:lv*0.5};
}
$("#mastery").oninput=function(){
	if(this.update) this.update();
	$("#mastery_bar div")[0].style.width=($("#mastery_lv_point").value/$("#mastery_need").innerHTML*100)+"%";
}
var get_mastery_lv_point=function(lv){//升级所需专精
	if(lv<1) return 0;
	if(lv<5) return 25;
	if(lv<10) return 50;
	if(lv<20) return 75;
	if(lv<300) return 100;
	return Math.ceil((parseInt(lv)+1)/2);
}
$("#mastery_lv").oninput=function(){
	if(this.value=="") return;
	this.value=parseInt(this.value);
	if(isNaN(this.value)) this.value=1;
	else if(this.value<1)this.value=1;
	var  point=0;
	for(var i=1;i<this.value;i++){
		point+=get_mastery_lv_point(i);
	}
	var lv_point=get_mastery_lv_point(this.value)
	$("#mastery_need").innerHTML=lv_point;
	$("#mastery_point").value=point+parseInt($("#mastery_lv_point").value||0);
}
$("#mastery_lv").onchange=function(){
	if($("#mastery_lv_point").value>=$("#mastery_need").innerHTML){
		$("#mastery_lv_point").value=parseInt($("#mastery_need").innerHTML)-1;
	}
}
$("#mastery_lv_point").oninput=function(){
	$("#mastery_lv").oninput();
}
$("#mastery_lv_point").onchange=function(){
		this.value=parseInt(this.value);
		if(isNaN(this.value)) this.value=0;
		if(this.value<0||this.value>get_mastery_lv_point($("#mastery_lv").value)){
			var temp=parseInt(this.value);
			this.value=0;
			$("#mastery_lv").oninput();//算出当前专精总共需要多少
			$("#mastery_point").value=parseInt($("#mastery_point").value)+temp;//然后和现在的值相加
			$("#mastery_point").oninput();//再扔回去计算
			$("#mastery").oninput();//通知更新
		}
}
$("#mastery_point").oninput=function(){
	if(this.value=="") return;
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
	$("#mastery_lv").value=lv;
	$("#mastery_need").innerHTML=point;
	$("#mastery_lv_point").value=temp;
}
$("#mastery_lv").onkeydown=$("#mastery_lv_point").onkeydown=$("#mastery_point").onkeydown=function(ev){
	if(ev.key&&ev.key.length==1&&!(ev.key>=0&&ev.key<=9)) return false;
	//return true;
}
$("#mastery_lv").oninput();
$("#mastery").oninput();