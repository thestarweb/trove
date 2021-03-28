function reader(data){
	this.data=data;
	this.index=0;
}
reader.prototype.text_helper=new TextDecoder();
reader.prototype.read_char=function(){
	return this.data[this.index++];
}
reader.prototype.read_varint=function(){
	var res=0;
	var r;
	var i=0;
	do{
		r=this.data[this.index++];
		res+=(r&0x7F)<<i;
		i+=7;
	}while(r&0x80)
	return res;
}
reader.prototype.read_str=function(len){
	var res=this.text_helper.decode(this.data.subarray(this.index,this.index+len));
	this.index+=len;
	return res;
}
reader.prototype.check=function(arr){
	//return this.data[this.index++];
	for(var i=0;i<arr.length;i++){
		if(arr[i]!=this.data[this.index++]) break;
	}
	return i;
}
var read=function(data){
	var fd=new reader(data);
	//if(data[0]!=0x3E||data[1]!=0xAE){
	if(fd.read_char()!=0x3E||fd.read_char()!=0xAE){
		throw new Error("无效文件头");
	}
	var len=fd.read_varint();//词条数量
	fd.read_char();//一般是00，暂时不懂啥意思
	var list=[];
	var hash_table={};
	var read_count=0;
	while(read_count<len&&fd.index<fd.data.length){
		//console.log(fd.read_varint()>>4);
		fd.read_varint();

		//读取国际化部分
		if(fd.read_char()!=0x08){
			throw new Error("无效国际化");
			// console.log(data[index-2],data[index-1],data[index]);
			// index--;
			// continue;
		}
		var len_int=fd.read_varint();
		var str_int=fd.read_str(len_int);

		//读取本地化部分
		if(fd.read_char()!=0x18){
			throw new Error("无效本地化");
		}
		var len_loca=fd.read_varint();
		var str_loca=fd.read_str(len_loca);
		var end_array=[0xBE,0x03,0x08,0x00,0x08,0x1E];
		//if(fd.read_char()!=0xBE||fd.read_char()!=0x03||fd.read_char()!=0x08||fd.read_char()!=0x00||data[index++]!=0x08||data[index++]!=0x1E){
		if(fd.check(end_array)!=end_array.length){
			throw new Error("无效词条结尾");
		}
		list.push({key:str_int,value:str_loca});
		hash_table[str_int]=str_loca;
		read_count++;
	}
	return {list:list,hash_table:hash_table};
}
export default read;