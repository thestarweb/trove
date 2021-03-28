function writer(){
	this.buffs=[];
	this.malloc();
}
writer.prototype.buff_size=1024;
writer.prototype.text_helper=new TextEncoder();
writer.prototype.malloc=function(char){
	this.buff&&this.buffs.push(this.buff);
	this.buff=new Uint8Array(this.buff_size);
	this.index=0;
}
writer.prototype.char=function(char){
	if(this.index>=this.buff_size){
		this.malloc();
	}
	this.buff[this.index++]=char;
}
writer.prototype.var_int=function(int){
	while(int>0x7F){
		this.char((int&0x7F)|0x80);
		int>>=7;
	}
	this.char(int);
}
writer.prototype.arr=function(arr){
	for(var i=0;i<arr.length;i++) this.char(arr[i]);
}
writer.prototype.str=function(str){
	this.arr(this.text_helper.encode(str));
}
writer.prototype.str_with_len=function(str){
	var buff=this.text_helper.encode(str);
	this.var_int(buff.length);
	this.arr(buff);
}
Object.defineProperties(writer.prototype,{
	data:{
		get(){
			var res=new Uint8Array(this.buff_size*this.buffs.length+this.index);
			var base=0
			for(let i=0;i<this.buffs.length;i++){
				for(var j=0;j<this.buff_size;j++){
					res[base+j]=this.buffs[i][j];
				}
				base+=this.buff_size;
			}
			for(let i=0;i<this.buff.length;i++){
				res[base+i]=this.buff[i];
			}
			return res;
		}
	}
});
var write=function(list){
	var w=new writer();
	w.char(0x3E);
	w.char(0xAE);
	w.var_int(list.length);
	w.char(0);
	for(var i=0;i<list.length;i++){
		//写入文件头
		w.var_int((i<<4)|4);
		//写入国际化
		w.char(0x08);
		// w.var_int(list[i].key.length);
		// w.str(list[i].key);
		w.str_with_len(list[i].key);

		//写入本地化
		w.char(0x18);
		// w.var_int(list[i].value.length);//字符串长度级算和解长度级算结果不一样 所以不能这样算
		// w.str(list[i].value);
		w.str_with_len(list[i].value);
		w.arr([0xBE,0x03,0x08,0x00,0x08,0x1E]);
	}
	w.arr([0x08,0x1E]);
	return w.data;
}
export default write;