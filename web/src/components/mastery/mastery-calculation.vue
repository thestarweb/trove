<template>
    <div class="mastery-calculation">
        <div>
            <su-form :label-width="0">
                <su-form-item :label="$t('mastery.point')">
                    <su-input v-model.number="point" @update:modelValue="setByPoint" />
                </su-form-item>
                <su-h-line />
                <su-form-item :label="$t('mastery.lv')">
                    <su-input v-model.number="lv" @update:modelValue="setLv" />
                </su-form-item>
                <su-form-item :label="$t('mastery.lv-point')">
                    <su-input v-model.number="lvPoint" @update:modelValue="setLvPoint" />
                </su-form-item>
                <su-form-item :label="$t('mastery.point-to-lvup')">
                    {{pointToLvup}}
                </su-form-item>
            </su-form>
        </div>
    </div>
</template>

<script lang="ts">
import { getLvByPoint, getMasteryLvPoint, getPointByLv } from '@/utils/mastery';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

type InputNumber = number|"";

@Options({
    watch:{
        totalPoint(value){
            if(value!=this.point){
                this.setByPoint(value);
            }
        },
        point(value){
            this.$emit("update:totalPoint", value);
        },
        lv(value){
            this.$emit("update:lv", value);
        },
        lvPoint(value){
            this.$emit("update:lvPoint", value);
        },
    }
})
export default class Home extends Vue {
    @Prop({
        type:String,
        default:'trove',
    })
    private readonly type!:string;
    @Prop({
        type: Number,
    })
    private readonly totalPoint!:number;
    created(){
        if(this.totalPoint){
            this.setByPoint(this.totalPoint);
        }
    }
    public point:InputNumber=0;
    public lv:InputNumber=0;
    public lvPoint:InputNumber=0;
    public get pointToLvup():number{
        let ret = 0;
        if(this.lv!==""){
            ret = getMasteryLvPoint(this.lv, this.type);
        }
        this.$emit("update:pointToLvup", ret);
        return ret;
    }
    setByPoint(value:InputNumber):void{
        if(value!==""){
            const [lv, lvPoint] = getLvByPoint(value, this.type);
            this.lv=lv;
            this.lvPoint=lvPoint;
            this.point=value;
        }
    }
    setLv(value:InputNumber):void{
        if(value!==""){
            let eValue = value;
            if(eValue<0){
                eValue=0;
            }else if(eValue>1000){
                eValue=1000;
            }
            this.lv=eValue;
            if(this.lvPoint!==""){
                this.point = getPointByLv(eValue, this.lvPoint, this.type);
            }
        }
    }
    setLvPoint(value:InputNumber):void{
        if(value!=="" && this.lv!==""){
            if(value>=this.pointToLvup){
                this.setByPoint((this.point||0)+value);
            } else {
                this.point = getPointByLv(this.lv, value, this.type);
            }
        }
    }
}
</script>

<style scoped>
/* .mastery-calculation{
    //
} */
</style>
