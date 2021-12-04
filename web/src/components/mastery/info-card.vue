<template>
    <div class="mastey-item mastey-baseinfo-display-box">
        <div class="color-mastery-total mastery-total-title">{{$t("mastery.type.total")}}</div>
        <div class="color-mastery-total mastery-total-lv">{{totalMasteryLv}}</div>
        <div class="mastery-type-sel-box">
            <div :class="{selected: dispalyType === 'trove' }" @click="dispalyType='trove'">{{$t("mastery.type.trove")}}</div>
            <div :class="{selected: dispalyType === 'geode' }" @click="dispalyType='geode'">{{$t("mastery.type.geode")}}</div>
        </div>
        <div :class="['mastery-sub-title', `color-mastery-${dispalyType}`]">
            <img :src="`/images/mastery/flag-${dispalyType}.png`" />
            <div>{{$t("mastery.lv")}}</div>
            <div>{{displayInfo.lv}}</div>
        </div>
        <div class="exp-bar">
            <exp-bar :width="displayInfo.width" />
        </div>
    </div>
</template>

<script lang="ts">
import { getLvByPoint, getMasteryLvPoint } from '@/utils/mastery';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ExpBar from './exp-bar.vue';

@Options({
    components:{
        ExpBar,
    },
})
export default class Home extends Vue {
    @Prop({
        type: String,
    })
    private readonly type!:string;
    private lType = 'trove';
    get dispalyType():string{
        return this.type || this.lType;
    }
    set dispalyType(value:string){
        if(!this.type){
            this.lType=value;
        }
        this.$emit('update:type',value);
    }
    @Prop({
        type: Number,
        default: 1,
    })
    public readonly troveMasteryPoint!:number;
    public get troveMasteryInfo():[number,number]{
        return getLvByPoint(this.troveMasteryPoint);
    }
    public get troveMasteryLv():number{
        return this.troveMasteryInfo[0];
    }
    public get troveMasteryLvPoint():number{
        return this.troveMasteryInfo[1];
    }
    public get troveMasteryPointToLvup():number{
        return getMasteryLvPoint(this.troveMasteryLv);
    }
    @Prop({
        type: Number,
        default: 1,
    })
    public readonly geodeMasteryPoint!:number;
    public get geodeMasteryInfo():[number,number]{
        return getLvByPoint(this.geodeMasteryPoint, 'geode');
    }
    public get geodeMasteryLv():number{
        return this.geodeMasteryInfo[0];
    }
    public get geodeMasteryLvPoint():number{
        return this.geodeMasteryInfo[1];
    }
    public get geodeMasteryPointToLvup():number{
        return getMasteryLvPoint(this.geodeMasteryLv, 'geode');
    }
    private get totalMasteryLv():number{
        return this.troveMasteryLv + this.geodeMasteryLv;
    }
    private get displayInfo():{
        lv: number;
        width: number;
    }{
        if(this.dispalyType==='geode'){
            return {
                lv:this.geodeMasteryLv,
                width:this.geodeMasteryPointToLvup === 0 ? 100 : this.geodeMasteryLvPoint/this.geodeMasteryPointToLvup*100,
            };
        }
        return {
            lv:this.troveMasteryLv,
            width:this.troveMasteryPointToLvup === 0 ? 100 : this.troveMasteryLvPoint/this.troveMasteryPointToLvup*100,
        };
    }
}
</script>

<style>
/* 原版样式 */
.mastery-total-title{
    font-size: 16px;
}
.mastery-total-lv{
    font-size: 26px;
}
.mastery-type-sel-box,.mastery-sub-title{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.mastery-type-sel-box>div{
    /* border: 5px groove rgb(133, 18, 1); */
    border: 2px solid rgb(128, 50, 5);
    border-radius: 10px;
    padding: 2px;
    width: 125px;
    height: 32px;
    line-height: 32px;
    /* overflow: hidden; */
    margin: 5px;
    cursor: pointer;
    position: relative;
}
.mastery-type-sel-box>div::before{
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 6px;
    height: auto;
    border: 2px solid #000;
}
.mastery-type-sel-box>div::after{
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: 12px;
    height: auto;
    border: 2px solid #000;
}
.mastery-type-sel-box>.selected::after{
    box-shadow: 0 0 5px 5px #08F inset;
}
.mastery-sub-title{
    line-height: 50px;
    font-size: 18px;
}
</style>