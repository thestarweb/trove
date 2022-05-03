<template>
    <div class="item-box">
        <div class="item">
            <div class="header">
                <su-input v-if="editTitle" ref="titleInput" v-model="currentInputTitle" @blur="handleStopEditTitle" />
                <span v-else class="title" @click="handleEditTitle">{{international}}</span>
                <span class="delete" @click="$emit('delete')">删除</span>
            </div>
            <div class="content">
                <textarea ref="input" :value="value" @input="handleValueChange"></textarea>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { SuInput } from '@thestarweb/ui';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class LangItem extends Vue{
    declare $refs:{
        titleInput: SuInput;
        input: HTMLTextAreaElement;
    };
    @Prop({
        type: String,
        default: '',
    })
    private readonly international!:string;
    @Prop({
        type: String,
        default: '',
    })
    private readonly value!:string;
    private handleValueChange():void {
        this.$emit('update:value', this.$refs.input.value)
    }
    private editTitle = false;
    private currentInputTitle = '';
    private handleEditTitle(){
        this.currentInputTitle = this.international;
        console.log(this.currentInputTitle);
        this.editTitle = true;
        this.$nextTick(() => this.$refs.titleInput.focus())
    }
    private handleStopEditTitle(){
        this.editTitle = false;
        if(this.currentInputTitle){
            this.$emit('update:international', this.currentInputTitle);
        }
    }
}

</script>

<style scoped>
.header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 5px;
}
textarea{
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
    background: rgb(15,15,15);
    color: #FFF;
    resize: none;
}
.item-box{
    padding: 10px 20px;
}
.item{
    background: rgb(30,30,30);
    padding: 5px;
}
.delete,.title{
    cursor: pointer;
}
</style>
