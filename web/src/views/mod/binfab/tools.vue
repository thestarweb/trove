<template>
    <div class="tools">
        当前选中长度{{currentFile.selPos[1] - currentFile.selPos[0] + 1}}，起始位置{{currentFile.selPos[0]}}，结束位置{{currentFile.selPos[1]}}
        读取工具
        <su-h-line />
        尝试获取可变长度数字
        <su-button @click="readVarUInt">开始</su-button>
        <su-h-line />
        写入工具
        <su-h-line />
        <su-button @click="deleteSelect">删除所选</su-button>
        <su-select :options="inputFns" v-model="selectInputFnName" />
        <su-input :modelValue="inputFnProp" @update:modelValue="handleInputFnPropInput" />
        <su-button @click="handleWrite">写入</su-button>
        <su-h-line />
        <su-button @click="handleExport">导出文件</su-button>
    </div>
</template>

<script lang="ts">
import { func } from '@thestarweb/ui';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import {OpendFile} from './types';

function insertData(f:OpendFile, data:Uint8Array){
    const oldData = f.fileData;
    const newData = new Uint8Array(oldData.length + data.length);
    for(let i = 0; i<f.selPos[0]; i++){
        newData[i] = oldData[i];
    }
    for(let i = 0; i<data.length; i++){
        newData[i+f.selPos[0]] = data[i];
    }
    for(let i = f.selPos[0]; i<oldData.length; i++){
        newData[i+data.length] = oldData[i];
    }
    return newData;
}

function getVarUIntData(data:number){
    let int=data;
    const ret = []
    while(int>0x7F){
        ret.push((int&0x7F)|0x80);
        int>>=7;
    }
    ret.push(int);
    return new Uint8Array(ret);
}

@Options({
    watch:{
        selectInputFn(value){
            console.log(value);
        }
    }
})
export default class BinfabHelper extends Vue{
    @Prop({})
    currentFile!:OpendFile;

    public readVarUInt(maxLen = 8):number{
        let res=0;
		let r:number;
		let i=0;
        let d = 0;
		do{
			r=this.currentFile.fileData[this.currentFile.clickPos+d];
			res+=(r&0x7F)<<i;
			i+=7;
            d++;
            if(d>maxLen){
                alert("Data too long!");
                return NaN;
            }
		}while(r&0x80)
		alert(`${res}, length: ${d}`);
        return res;
	}
    public deleteSelect(){
        const oldData = this.currentFile.fileData;
        const newData=new Uint8Array(oldData.length - (this.currentFile.selPos[1] - this.currentFile.selPos[0] + 1));
        // newData.copyWithin
        // this.currentFile.fileData.
        for(let i = 0; i<this.currentFile.selPos[0]; i++){
            newData[i] = oldData[i];
        }
        for(let i = 0,j = this.currentFile.selPos[1] +1; j<oldData.length; i++, j++){
            newData[this.currentFile.selPos[0]+i] = oldData[j];
        }
        this.currentFile.fileData=newData;
        if(this.currentFile.selPos[0] > 0){
            this.currentFile.selPos = [this.currentFile.selPos[0]-1, this.currentFile.selPos[0]-1];
        }else{
            this.currentFile.selPos = [0,0];
        }
    }
    inputFns = [
        {
            label: '变长数字',
            value: 'var_number',
            check(value: string){
                return /^\d+$/.test(value) && parseInt(value) < Number.MAX_SAFE_INTEGER;
            },
            fn(input:string){
                const number = parseInt(input);
                return getVarUIntData(number);
            }
        }
    ];
    selectInputFnName = this.inputFns[0].value;
    get selectInputFn(){
        return this.inputFns.find(({value}) => value === this.selectInputFnName);
    }
    inputFnProp="";
    handleInputFnPropInput(value:string){
        if(!this.selectInputFn){
            return;
        }
        if(value === '' || this.selectInputFn.check(value)){
            this.inputFnProp=value;
        }
    }
    handleWrite(){
        if(this.selectInputFn &&  this.selectInputFn.check(this.inputFnProp)){
            this.currentFile.fileData = insertData(this.currentFile,this.selectInputFn.fn(this.inputFnProp))
        }else{
            alert('数据不合法');
        }
    }
    handleExport(){
        func.download(this.currentFile.fileData, this.currentFile.filename);
    }
}
</script>