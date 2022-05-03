const BUFF_SIZE = 1024;

const Decoder = new TextDecoder();
const Encoder = new TextEncoder();

interface readIntCfg{
	endian:"big"|"little";
}

export default class FileStream{
	public defaultEndian:"big"|"little"="little";
	constructor(file?:Uint8Array){
		if(file&&file.length>0){
			this.data=file;
			this.fileSize=file.length;
		}else{
			this.data=new Uint8Array(BUFF_SIZE);
		}
	}
	private data:Uint8Array;
	private fileSize=0;

	private _offset=0;
	public get offset():number{
		return this._offset;
	}

	public get length():number{
		return this.fileSize;
	}

	// public subData(index:number,length:number):Uint8Array{
	// 	const res=new Uint8Array(length);

	// 	return res;
	// }

	public readInt8():number|false{
		if(this._offset<this.fileSize){
			const data = this.data[this._offset++];
			return data;
		}
		return false;
	}
	public readInt16(cfg?:readIntCfg):number|false{
		if(this._offset+1<this.fileSize){
			this._offset+=2;
			if(((cfg&&cfg.endian)||this.defaultEndian) == "little"){
				return this.data[this._offset-2] | (this.data[this._offset-1]<<8);
			}
			return (this.data[this._offset-2]<<8) | (this.data[this._offset-1]);
		}
		return false;
	}
	public readInt32(cfg?:readIntCfg):number|false{
		if(this._offset+8<=this.fileSize){
			this._offset+=4;
			if(((cfg&&cfg.endian)||this.defaultEndian) == "little"){
				return this.data[this._offset-4] | (this.data[this._offset-3]<<8) | (this.data[this._offset-2]<<16) | (this.data[this._offset-1]<<24);
			}
			return (this.data[this._offset-4]<<24) | (this.data[this._offset-3]<<16) | (this.data[this._offset-2]<<8) | (this.data[this._offset-1]);
		}
		return false;
	}
	public readInt64(cfg?:readIntCfg):number|false{
		if(this._offset+8<=this.fileSize){
			this._offset+=8;
			if(((cfg&&cfg.endian)||this.defaultEndian) == "little"){
				return (this.data[this._offset-8] | (this.data[this._offset-7]<<8) | (this.data[this._offset-6]<<16) | (this.data[this._offset-5]<<24)
					| (this.data[this._offset-4] <<32) | (this.data[this._offset-3]<<40) | (this.data[this._offset-2]<<48) | (this.data[this._offset-1]<<56));
			}
			return ((this.data[this._offset-8]<<56) | (this.data[this._offset-7]<<48) | (this.data[this._offset-6]<<40) | (this.data[this._offset-5]<<32)
					| (this.data[this._offset-4]<<24) | (this.data[this._offset-3]<<16) | (this.data[this._offset-2]<<8) | (this.data[this._offset-1]));
		}
		return false;
	}
	public readChar(){
		return this.readInt8();
	}

	public readVarInt():number{
		let res=0;
		let r:number;
		let i=0;
		do{
			r=this.readInt8()||0;
			res+=(r&0x7F)<<i;
			i+=7;
		}while(r&0x80)
		return res;
	}
	public readStr(len?:number){
		if(typeof len == "undefined"){
			let i=this._offset;
			while(i<this.data.length){
				if(this.data[i]==0) break;
				i++;
			}
			const res=Decoder.decode(this.data.subarray(this._offset,i));
			this._offset=i+1;
			return res;
		}
		const res=Decoder.decode(this.data.subarray(this._offset,this._offset+len));
		this._offset+=len;
		return res;
	}
	public check(arr:number[]){
		//return this.data[this.index++];
		let i;
		for(i=0;i<arr.length;i++){
			if(arr[i]!=this.readInt8()) break;
		}
		return i;
	}
}