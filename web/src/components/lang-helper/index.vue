<template>
	<div id="app" @dragleave="handleCancelEven" @dragover="handleCancelEven" @drop="handleFileDrop">
		<div id="head">
			trove语言文件编辑器

			<span>
				新文件处理方式:
				<select v-model="open_mode">
					<option value="clean">清空原有</option>
					<option value="override">覆盖内容</option>
					<option value="check">比较模式</option>
					<option value="new(old)">新文件(老文件)</option>
					<option value="old(new)">老文件(新文件)</option>
				</select>
				<input type="file" ref="readfile" style="display: none;" accept=".binfab" @change="handleFileChange" multiple />
				<button @click="handleImport">读取</button>

				<select v-model="export_mode">
					<option value="all">全部</option>
					<option v-for="file in file_list" :key="file" :value="file">{{file}}</option>
				</select>
				<a ref="download"></a>
				<button @click="handleExport">导出</button>
			</span>
			<div>
				搜索<input type="text" v-model="search.value" />
				<span v-if="open_mode=='check'">
					类型:
					<select v-model="search.changetype">
						<option value="-1">全部</option>
						<option value="0">仅旧文件存在</option>
						<option value="1">相同内容</option>
						<option value="2">内容被被修改</option>
						<option value="3">仅新文件存在</option>
					</select>
				</span>
			</div>
		</div>
		<div id="main">
			<div v-for="item in data_display" :key="item.key">
				<div class="item" :changetype="open_mode=='check'?item.type:-1">
					<div>
						{{item.key}}&nbsp;
						<span class="file">{{item.file}}</span>
					</div>
					<div v-if="open_mode=='check'&&item.old_value">{{item.old_value}}</div>
					<textarea v-model="item.value"></textarea>
				</div>
			</div>
		</div>
		<div id="foot">
			<div>
				<span style="text-align: center;">
					<button @click="page--">&lt;</button>
					<input type="number" v-model="page" style="width: 42px;">/{{total_page}}
					<button @click="page++">&gt;</button></span>
				<span style="float: right;">文件打开数量{{opened_file}}/{{total_file}}</span>
			</div>
			<div>by star_ss v1.5.3.0155 2021-03-28（web 2.0 by vue3）</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
//import read from "./read.js";
//import write from "./write.js";
import {LangInfoItem} from "./types.d";
import {binfabRead,binfabWrite} from "./binfab-helper";



@Options({
	components: {
	},
})
export default class Home extends Vue {
	public $refs!: {
		readfile:HTMLInputElement,
		download:HTMLAnchorElement
	}
	// opened_file!:number,
	// total_file!:number,
	// open_mode!:string,
	// export_mode!:string,
	// list!:Array<any>,
	// hash_table:any,
	// page!:number,
	// page_size!:number,
	// search!:any

	private opened_file=0;
	private total_file=0;
	private open_mode="override";
	private export_mode="all";
	private list:LangInfoItem[]=[];
	private hash_table:any={};
	private page=1;
	private page_size=100;
	private search={
		value:"",
		changetype:-1
	};

	private get file_list(){
		var list=[];
		for(var i=0;i<this.list.length;i++){
			if(list.indexOf(this.list[i].file)==-1){
				list.push(this.list[i].file);
			}
		}
		return list;
	}
	private get total_page(){
		return Math.ceil(this.dyn_list.length/this.page_size);
	}
	private get dyn_list(){
		return this.list.filter((item:LangInfoItem)=>{
			if(this.search.value){
				if(item.key.indexOf(this.search.value)==-1&&item.value.indexOf(this.search.value)==-1){
					if(!(item.old_value&&item.old_value.indexOf(this.search.value)==-1))
						return false;
				}
			}
			if(this.open_mode=="check"&&this.search.changetype!=-1){
				if(item.type!=this.search.changetype) return false;
			}
			return true;
		});
	}
	private get data_display(){
		var list=[];
		var base=this.page_size*(this.page-1);
		for(var i=0;i<this.page_size&&base+i<this.dyn_list.length;i++){
			list.push(this.dyn_list[base+i]);
		}
		return list;
	}

	private loadflie(file:File){
		var vm=this;
		var filename=file.name;
		var exname=filename.substr(filename.lastIndexOf("."));
		if(exname==".binfab"){
			this.total_file++;
			var reader = new FileReader();
			reader.onload=function(){
				vm.opened_file++;
				var data;
				try{
					data=binfabRead(new Uint8Array(this.result as ArrayBuffer));
				}catch(e){
					console.error(filename+"打开失败"+e);
					return;
				}
				if(vm.open_mode=="clean"){
					vm.hash_table={};
					vm.list=[];
				}
				for(var i=0;i<data.list.length;i++){
					if(vm.hash_table[data.list[i].key]){
						var new_value=data.list[i].value;
						if(vm.hash_table[data.list[i].key].value==new_value){
							//vm.$set(vm.hash_table[data.list[i].key],"type",1);
							vm.hash_table[data.list[i].key].type=1;
							continue;
						}
						if(vm.open_mode=="old(new)") new_value=vm.hash_table[data.list[i].key].value+"("+new_value+")";
						else if(vm.open_mode=="new(old)") new_value=new_value+"("+vm.hash_table[data.list[i].key].value+")";
						else if(vm.open_mode=="check") vm.hash_table[data.list[i].key].old_value=vm.hash_table[data.list[i].key].value;
						vm.hash_table[data.list[i].key].value=new_value;
						vm.hash_table[data.list[i].key].file=filename;
						vm.hash_table[data.list[i].key].type=2;
					}else{
						vm.hash_table[data.list[i].key]=data.list[i];
						data.list[i].file=filename;
						data.list[i].type=3;
						vm.list.push(data.list[i]);
					}
				}
			}
			reader.readAsArrayBuffer(file);
			//reader.readAsText(files[i]);
		}
	}
	private loadfiles(files:FileList){
		if(this.opened_file==this.total_file){
			this.list.forEach((item:LangInfoItem)=>{
				item.type=0;

			})
		}
		for(var i=0;i<files.length;i++){
			this.loadflie(files[i]);
		}
	}
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
	private handleImport(){
		this.$refs.readfile.click();
	}
	private handleExport(){
		if(this.list.length==0){
			alert("没有内容可以下载");
			return;
		}
		var list=[];
		if(this.export_mode=="all"){
			list=this.list;
		}else{
			for(var i=0;i<this.list.length;i++){
				if(this.list[i].file==this.export_mode){
					list.push(this.list[i]);
				}
			}
		}
		var b=new Blob([binfabWrite(list)],{
			type: 'application/octet-stream'
		});
		this.$refs.download.href=URL.createObjectURL(b);
		this.$refs.download.download=(this.export_mode=="all"?this.list[0].file:this.export_mode);
		this.$refs.download.click();
		URL.revokeObjectURL(this.$refs.download.href);
	}
	private handleFileChange(){
		this.loadfiles(this.$refs.readfile.files as FileList);
	}
}
</script>
<style scoped>
	textarea{
		width: 100%;
		padding: 5px;
		box-sizing: border-box;
	}
	span.file{
		float: right;
	}
	#app{
		height: 100%;
	}
	#app{
		display: flex;
		flex-direction: column;
	}
	#main{
		flex-grow: 1;
		overflow: hidden scroll;
		padding: 5px;
	}
	#head,#foot{
		background: #000;
		color:#FFF;
	}
	#main>div{
		padding: 10px;
	}
	.item{
		border: 1px #000 solid;
		padding: 5px;
	}
	.item[changetype="0"]{
		background: #F88;
	}
	.item[changetype="1"]{
		background: #8F8;
	}
	.item[changetype="2"]{
		background: #8AF;
	}
	.item[changetype="3"]{
		background: #FA0;
	}
</style>