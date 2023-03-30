<template>
    <su-h-layout class="tool">
        <su-main class="main" @dragleave="handleCancelEven" @dragover="handleCancelEven" @drop="handleFileDrop">
            <div class="content-box" v-if="currentOpenFile" @mouseup="isSelect=false" @mouseleave="isSelect=false">
                <div
                    v-for="(code, index) in currentOpenFile.fileData"
                    :key="index"
                    :class="[
                        'content-item',
                        {
                            selected: index>=currentOpenFile.selPos[0] && index<=currentOpenFile.selPos[1],
                            current: index==currentOpenFile.clickPos
                        }
                    ]"
                    @mousedown="handleStartSelect(index)"
                    @mouseenter="handleSelectMove(index)"    
                >
                    <div>{{String.fromCharCode(code)}}</div>
                    <div>{{code.toString(16)}}</div>
                </div>
            </div>
        </su-main>
            <tools class="tools" v-if="currentOpenFile" :currentFile="currentOpenFile">
            </tools>
    </su-h-layout>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Tools from './tools.vue';
import {OpendFile} from './types';

@Options({
    components:{
        Tools,
    }
})
export default class BinfabHelper extends Vue{
    currentFileIndex=0;
    opendFiles:OpendFile[] = [];
    get currentOpenFile():OpendFile|null{
        if(this.currentFileIndex < this.opendFiles.length){
            return this.opendFiles[this.currentFileIndex]
        }
        return null;
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
    private loadfiles(files:FileList){
		for(var i=0;i<files.length;i++){
			this.loadflie(files[i]);
		}
	}
    private loadflie(file:File){
		const filename=file.name;
        const reader = new FileReader();
        reader.onload=()=>{
            const fileData=new Uint8Array(reader.result as ArrayBuffer);
            this.opendFiles.push({
                fileData,
                filename,
                selPos: [0, 0],
                clickPos: 0,
            });
            console.log(this.opendFiles);
        }
        reader.readAsArrayBuffer(file);
	}
    isSelect = false;
    handleStartSelect(index: number){
        this.isSelect=true;
        this.opendFiles[this.currentFileIndex].clickPos=index;
        this.opendFiles[this.currentFileIndex].selPos=[index, index];
    }
    handleSelectMove(index:number){
        if(this.isSelect){
            const start=this.opendFiles[this.currentFileIndex].clickPos;
            this.opendFiles[this.currentFileIndex].selPos = index < start ? [index, start] : [start, index];
        }
    }
}
</script>

<style scoped>
.main{
    height: 100%;
    overflow: auto;
}
.content-box{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    user-select: none;
    overflow: auto;
}
.content-item{
    padding: 5px;
    border: 1px rgba(100, 100, 100, 0.2) solid;
    text-align: center;
    width: 40px;
    box-sizing: border-box;
}
.content-item.selected{
    background-color: rgba(100, 100, 100, 0.5);
}
.content-item.current{
    background-color: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.8);
}
.tools{
    width: 500px;
}
</style>
