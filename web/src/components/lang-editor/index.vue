<template>
    <su-h-layout @dragleave="handleCancelEven" @dragover="handleCancelEven" @drop="handleFileDrop">
        <su-v-layout class="editor-tool-box">
            <div v-for="item in buttons" :key="item.title" :title="item.title" @click="item.fn">{{item.icon}}</div>
        </su-v-layout>
        <div v-if="showFiles" class="edit-file-box">
            <!-- <su-context-menu-box ref="treeBox" :menu="onContextMenu">
                <su-tree :tree-data="treeOpendFileData" />
            </su-context-menu-box> -->
            <file-tree :opend-files="opendFiles" @open="loadfiles" @save="APIASave" @select-file="handleSeletFile" />
        </div>
        <su-main>
            <div v-if="currentFile" class="file-input-box">
                <lang-item v-for="item in currentFile.data" :key='item.key' v-model:international="item.key" :value="item.value" @update:value="item.value=$event" @delete="currentFile.data = currentFile.data.filter(i => i!==item)" />
                <div class="button-new" @click="handleNewItem">增加一条</div>
            </div>
            <template v-else>
                no data
            </template>
        </su-main>
    </su-h-layout>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { LangInfoItem, read, write } from '@thestarweb/trove-lang-tool';
import FileTree from './file-tree.vue';
import LangItem from './lang-item.vue';
import { OpendFile } from './types';
import { func } from '@thestarweb/ui';

const keyFn = {
    s: {
        fn(this: Editor){
            this.APIASave();
        },
    },
}

@Options({
	components: {
        LangItem,
        FileTree,
	},
})
export default class Editor extends Vue {
    declare $refs:{
		treeBox:HTMLInputElement,
	}
    
    private opendFiles:Record<string,OpendFile[]>={
        default: [],
    }
    private currentType = 'default';
    private currentFile:OpendFile|null = null;

    private loadfiles(files:FileList, type?:string):void{
        Array.prototype.forEach.call(files, (file) => {
            this.loadFile(file, type);
        })
    }
    private loadFile(file:File, type?:string):void{
        const fileName = file.name;
        const exname=fileName.substr(fileName.lastIndexOf("."));
        if(exname === '.binfab'){
            const index = this.opendFiles[this.currentType].findIndex(item => item.name===fileName);
            if(index > -1 && !confirm(`${fileName}已经打开，是否覆盖？`)){
                return;
            }
            const item = {
                name: file.name,
                srcFile: file,
                loaded: false,
                data: [],
                changeHistory: [],
                hasNoSaveChange: false,
            } as OpendFile;
            if (index === -1) {
                this.opendFiles[type||this.currentType].push(item);
            } else {
                this.opendFiles[type||this.currentType][index] = item;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const data = read(new Uint8Array(reader.result as ArrayBuffer));
                item.data = data;
                item.savedData = JSON.parse(JSON.stringify(data));
                this.currentFile = item;
            }
            reader.readAsArrayBuffer(file);
        }
    }
    handleSeletFile(type:string, item:OpendFile){
        this.currentFile=item;
    }

    //private buttons:{title:string;icon:string;fn:()=>unknown}[] = [];
    private get buttons():{title:string;icon:string;fn:()=>unknown}[]{
        return [
            { title: '文件', icon: 'F', fn: this.chageShowFiles}
        ];
    }
    private showFiles = true;
    private chageShowFiles(){
        this.showFiles = !this.showFiles;
    }

    public APIASave(type?:string, fileIndex?:number):void{
        // console.log(JSON.parse(JSON.stringify(this.currentFile)));
        if(!type ||fileIndex === undefined){
            return;
        }
        if(this.opendFiles[type][fileIndex].data){
            func.download(write(this.opendFiles[type][fileIndex].data as LangInfoItem[]), this.opendFiles[type][fileIndex].name);
        }
    }
    
    private handleKeyUp(ev:KeyboardEvent):void{
        const key = ev.key.toLowerCase()
        if (key in keyFn) {
            const fnItem = keyFn[key as keyof typeof keyFn];
            if (ev.ctrlKey){
                fnItem.fn.call(this);
                ev.stopPropagation();
                ev.preventDefault();
                ev.cancelBubble = true;
            }
        }
    }
    created():void{
        if(!localStorage.getItem('get-lang-tool-msg')){
            func.modal('语言文件编辑器正在爆改，但是我是个鸽子，所以 emm');
            localStorage.setItem('get-lang-tool-msg', "1");
        }
        window.addEventListener('keydown', this.handleKeyUp);
    }
    beforeUnmount():void{
        window.removeEventListener('keydown', this.handleKeyUp);
    }
    private handleCancelEven(e:Event):void{  
		e.stopPropagation();
		e.preventDefault();
	}
	private handleFileDrop(e:DragEvent):void{
		e.stopPropagation();  
		e.preventDefault();
		if((!e.dataTransfer)||e.dataTransfer.files.length==0) return;
		this.loadfiles(e.dataTransfer.files);
    }
    private handleNewItem():void{
        if(this.currentFile && this.currentFile.data){
            this.currentFile.data.push({
                key: 'new item',
                value: '',
            })
        }
    }
}
</script>

<style scoped>
/* .lang-edit */
.su-h-layout{
    width: 100%;
}
.editor-tool-box{
    width: 50px;
    background: rgb(51,51,51);
}
.editor-tool-box>*{
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
}
.edit-file-box{
    background: rgba(37,37,37);
    width: 200px;
    overflow: auto;
}
.file-input-box{
    overflow: auto;
    height: 100%;
}
.button-new{
    text-align: center;
    cursor: pointer;
    margin: 0 20px;
    padding: 10px;
    background: rgb(30,30,30);
}
</style>