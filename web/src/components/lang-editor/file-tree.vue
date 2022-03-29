<template>
    <su-context-menu-box ref="treeBox" :menu="onContextMenu">
        <su-tree :tree-data="treeOpendFileData" @node-click="handleNodeClick" />
        <su-modal :visible="editTypeName !== null" @update:visable="editTypeName = null">
            <su-form>
                <su-form-item label="分类名"><su-input v-model="currentInputName" /></su-form-item>
            </su-form>
            <su-button @click="handleSubmitTypeName">确认</su-button>
        </su-modal>
        <input ref="fileInput" type="file" style="display: none;" accept=".binfab" multiple @change="handleFileChange" />
    </su-context-menu-box>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { OpendFile } from './types';

@Options({
	components: {},
})
export default class Editor extends Vue {
    declare $refs:{
		treeBox:HTMLInputElement,
        fileInput: HTMLInputElement,
	}
    editTypeName: string|null = null
    currentInputName = '';
    currentType = '';
    @Prop()
    opendFiles!:Record<string, OpendFile[]>;
    private get treeOpendFileData(){
        console.log(this.opendFiles)
        return Object.keys(this.opendFiles).map((typeName) => {
            return {
                label: typeName,
                children: this.opendFiles[typeName].map(item => ({
                    label: item.name,
                    raw: {
                        item,
                        type: typeName,
                    }
                })),
            };
        });
    }
    handleNodeClick(data: any){
        if(data.raw){
            this.$emit('select-file',data.raw.type, data.raw.item)
        }
    }

    private onContextMenu(ev: MouseEvent): any[]{
        let item: HTMLElement|null = ev.target as HTMLElement;
        const path:number[] = [];
        while(item && item !== this.$refs.treeBox){
            if(item.className && item.className.split(' ').includes('star-ui-tree-item')){
                path.unshift(Array.prototype.indexOf.call((item.parentElement as HTMLElement).children, item));
            }
            item = item.parentElement;
        }
        const menu = [];
        if(path.length <= 1){
            menu.push({
                title: '打开',
                click:()=>{
                    this.currentType = this.treeOpendFileData[path[0]].label;
                    this.$refs.fileInput.click();
                }
            });
            menu.push({title: '创建分类', click: () => this.editTypeName = ''});
        }
        if(path.length === 1){
            menu.push({
                title: '修改分类名',
                click: () => {
                    this.editTypeName = this.treeOpendFileData[path[0]].label;
                    this.currentInputName = this.editTypeName
                }
            });
        } else if(path.length === 2){
            menu.push({
                title: '保存',
                click: () => {
                    const current = this.treeOpendFileData[path[0]];
                    this.$emit('save', current.label, path[1])
                }
            });
        }
        return menu;
    }
    handleSubmitTypeName(){
        if(!this.currentInputName){
            return;
        }
        if(this.editTypeName && this.editTypeName in this.opendFiles){
            this.opendFiles[this.currentInputName] = this.opendFiles[this.editTypeName];
            delete this.opendFiles[this.editTypeName];
        } else {
            this.opendFiles[this.currentInputName] = [];
        }
        this.editTypeName = null;
    }
    handleFileChange(){
        this.$emit('open', this.$refs.fileInput.files, this.currentType);
        this.$refs.fileInput.value='';
    }
}
</script>