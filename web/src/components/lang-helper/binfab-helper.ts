import {LangInfoItem} from "./types.d";



class ReadSteam{
	constructor(data:Uint8Array) { 
        this.data = data; 
    }
	private text_helper=new TextDecoder();
	private index=0;
	private data!:Uint8Array;
	public readChar(){
		return this.data[this.index++];
	}
	public readVarInt(){
		let res=0;
		let r:number;
		let i=0;
		do{
			r=this.data[this.index++];
			res+=(r&0x7F)<<i;
			i+=7;
		}while(r&0x80)
		return res;
	}
	public readStr(len:number){
		const res=this.text_helper.decode(this.data.subarray(this.index,this.index+len));
		this.index+=len;
		return res;
	}
	public check(arr:number[]){
		//return this.data[this.index++];
		let i;
		for(i=0;i<arr.length;i++){
			if(arr[i]!=this.data[this.index++]) break;
		}
		return i;
	}
}

class WriteSteam{
	private static text_helper=new TextEncoder();
	private index=0;
	private buff!:Uint8Array;
	private buffs:Uint8Array[]=[];
	private buff_size=1024;

	constructor() { 
        this.malloc(); 
    }

	public malloc(){
		this.buff&&this.buffs.push(this.buff);
		this.buff=new Uint8Array(this.buff_size);
		this.index=0;
	}
	public char(char:number){
		if(this.index>=this.buff_size){
			this.malloc();
		}
		this.buff[this.index++]=char;
	}
	public var_int(int:number){
		while(int>0x7F){
			this.char((int&0x7F)|0x80);
			int>>=7;
		}
		this.char(int);
	}
	public arr(arr:number[]|Uint8Array){
		for(let i=0;i<arr.length;i++) this.char(arr[i]);
	}
	public str(str:string){
		this.arr(WriteSteam.text_helper.encode(str));
	}
	public str_with_len(str:string){
		const buff=WriteSteam.text_helper.encode(str);
		this.var_int(buff.length);
		this.arr(buff);
	}
	public get data(){
		const res=new Uint8Array(this.buff_size*this.buffs.length+this.index);
		let base=0
		for(let i=0;i<this.buffs.length;i++){
			for(let j=0;j<this.buff_size;j++){
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

const end_array=[0xBE,0x03,0x08,0x00,0x08,0x1E];
export const binfabRead=function(data:Uint8Array){
	const fd=new ReadSteam(data);
	//if(data[0]!=0x3E||data[1]!=0xAE){
	if(fd.readChar()!=0x3E||fd.readChar()!=0xAE){
		throw new Error("无效文件头");
	}
	const len=fd.readVarInt();//词条数量
	fd.readChar();//一般是00，暂时不懂啥意思
	const list:LangInfoItem[]=[];
	const hash_table=new Map();
	let read_count=0;
	while(read_count<len){
		//console.log(fd.readVarInt()>>4);
		fd.readVarInt();

		//读取国际化部分
		if(fd.readChar()!=0x08){
			throw new Error("无效国际化");
		}
		const len_int=fd.readVarInt();
		const str_int=fd.readStr(len_int);

		//读取本地化部分
		if(fd.readChar()!=0x18){
			throw new Error("无效本地化");
		}
		const len_loca=fd.readVarInt();
		const str_loca=fd.readStr(len_loca);
		//if(fd.readChar()!=0xBE||fd.readChar()!=0x03||fd.readChar()!=0x08||fd.readChar()!=0x00||data[index++]!=0x08||data[index++]!=0x1E){
		if(fd.check(end_array)!=end_array.length){
			throw new Error("无效词条结尾");
		}
		const item={key:str_int,value:str_loca} as LangInfoItem;
		list.push(item);
		//hash_table[str_int]=str_loca;
		hash_table.set(str_int,item);
		read_count++;
	}
	return {list:list,hash_table:hash_table};
}
export const binfabWrite=function(list:LangInfoItem[]){
	const w=new WriteSteam();
	w.char(0x3E);
	w.char(0xAE);
	w.var_int(list.length);
	w.char(0);
	for(let i=0;i<list.length;i++){
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