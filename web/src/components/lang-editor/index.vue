<template>
    <su-h-layout @dragleave="handleCancelEven" @dragover="handleCancelEven" @drop="handleFileDrop">
        <su-v-layout class="editor-tool-box">
            <div v-for="item in buttons" :key="item.title" :title="item.title" @click="item.fn">{{item.icon}}</div>
        </su-v-layout>
        <div v-if="showFiles" class="edit-file-box">
            <su-tree :tree-data="treeOpendFileData" />
        </div>
        <su-main>
            这里是内容
        </su-main>
    </su-h-layout>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { read, LangInfoItem } from '@thestarweb/trove-lang-tool';


@Options({
	components: {
	},
})
export default class Home extends Vue {
    private buttons:{title:string;icon:string;fn:()=>unknown}[] = [];
    private showFiles = false;
    private chageShowFiles(){
        this.showFiles = !this.showFiles;
    }
    private opendFiles:Record<string,{name:string, srcFile:File, loaded:boolean, data?:LangInfoItem[]}[]>={
        default: [],
    }
    private get treeOpendFileData(){
        return Object.keys(this.opendFiles).map((typeName) => {
            return {
                label: typeName,
                children: this.opendFiles[typeName].map(item => ({
                    label: item.name,
                })),
            };
        });
    }

    created(){
        this.buttons = [
            { title: '文件', icon: 'F', fn: this.chageShowFiles}
        ];
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
    private loadfiles(files:FileList):void{
        Array.prototype.forEach.call(files, (file) => {
            this.loadFile(file);
        })
    }
    private loadFile(file:File):void{
        const fileName = file.name;
        const exname=fileName.substr(fileName.lastIndexOf("."));
        if(exname === '.binfab'){
            const item = {
                name: file.name,
                srcFile: file,
                loaded: false,
                data: [] as LangInfoItem[],
            };
            this.opendFiles['default'].push(item);
            const reader = new FileReader();
            reader.onload = () => {
                item.data = read(new Uint8Array(reader.result as ArrayBuffer));
            }
            reader.readAsArrayBuffer(file);
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
}
</style>