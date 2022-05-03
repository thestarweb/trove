<template>
	<div style="height:100%" @dragleave="handleCancelEven" @dragover="handleCancelEven" @drop="handleFileDrop">
		<img :src="test"/>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FileStream from "./test";
import Pako from "pako";

@Options({
})
export default class HelloWorld extends Vue {
	test=""
	private handleCancelEven(e:Event){
		e.stopPropagation();
		e.preventDefault();
	}
	private handleFileDrop(e:DragEvent){
		e.stopPropagation();  
		e.preventDefault();
		if((!e.dataTransfer)||e.dataTransfer.files.length==0) return;
		this.loadfiles(e.dataTransfer.files);
	}
	private loadfiles(files:FileList){
		for(var i=0;i<files.length;i++){
			this.loadflie(files[i]);
		}
	}
	private loadflie(file:File){
		const filename=file.name;
		const exname=filename.substr(filename.lastIndexOf("."));
		if(exname==".tmod"){
			const reader = new FileReader();
			reader.onload=()=>{
				const fileData=new Uint8Array(reader.result as ArrayBuffer);
				const fs = new FileStream(fileData);
				const headerSize = fs.readInt64();
				const tmodVersion = fs.readInt16();
				const propertyCount = fs.readInt16();
				if(!headerSize) return;
				console.log(headerSize,tmodVersion,propertyCount,fileData.subarray(headerSize));
				for(let i=0;i<propertyCount;i++){
					const key=fs.readStr(fs.readVarInt());
					const value=fs.readStr(fs.readVarInt());
					console.log(key,'--',value);
				}
				// const ubZipFile = Pako.ungzip(fileData.subarray(headerSize));
					const test=new Pako.Inflate();
					test.push(fileData.subarray(headerSize));//([(test.result as Uint8Array)],filePath)//
					test.onEnd(0);
					console.log(test.result);
				const ubZipFile = test.result;

				while(fs.offset<headerSize){
					const filePath=fs.readStr(fs.readVarInt());
					const archiveIndex=fs.readVarInt();
					const byteOffset=fs.readVarInt();
					const size=fs.readVarInt();
					const hash=fs.readVarInt();
					// console.log(Pako.ungzip(fileData.subarray(headerSize+byteOffset)));
					const file = new File([(ubZipFile as Uint8Array).subarray(byteOffset,byteOffset+size)],filePath);
					if(filePath.endsWith("png")){
					this.test=URL.createObjectURL(file);
					}
					console.log({
						// file,
						filePath,
						archiveIndex,
						byteOffset,
						size,
						hash,
					});
				}
			}
			reader.readAsArrayBuffer(file);
		}
	}
}
</script>