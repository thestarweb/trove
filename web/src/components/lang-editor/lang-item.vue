<template>
    <div class="item-box">
        <div class="item">
            <div class="title">{{international}}</div>
            <div class="content">
                <textarea ref="input" :value="value" @input="handleValueChange"></textarea>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class LangItem extends Vue{
    declare $refs:{
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
}

</script>

<style scoped>
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
</style>
