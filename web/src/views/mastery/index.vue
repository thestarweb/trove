<template>
    <su-auto-direction class="mastey-box">
        <MasteryInfo class="mastey-baseinfo" :type="type" @update:type="handleSetType" :troveMasteryPoint="troveMasteryPoint" :geodeMasteryPoint="geodeMasteryPoint"></MasteryInfo>
        <su-v-line />
        <div class="e-info">
            <div class="mastey-input">
                <MasteryCalculation v-if="type==='trove'" type="trove" v-model:totalPoint="troveMasteryPoint"></MasteryCalculation>
                <MasteryCalculation v-if="type==='geode'" type="geode" v-model:totalPoint="geodeMasteryPoint"></MasteryCalculation>
            </div>
            <div class="sigils-box">
                <div v-for="(item,index) in sigils" :key="item" class="sigils-item">
                    <div>{{item}}</div>
                    <img :src="`/images/mastery/sigil/${index+1}.png`" />
                </div>
            </div>
        </div>
    </su-auto-direction>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import MasteryInfo from '@/components/mastery/info-card.vue';
import MasteryCalculation from '@/components/mastery/mastery-calculation.vue';
import cfg from '@/config/mastery.json';

const allType = ['trove','geode'];
@Options({
    components:{
        MasteryInfo,
        MasteryCalculation
    }
})
export default class extends Vue {
    @Prop()
    private readonly type!:string;
    handleSetType(type:string):void{
        this.$router.replace({
            name: 'mastery',
            params: {
                type,
            },
        });
    }
    troveMasteryPoint=147450;
    geodeMasteryPoint=13591;
    get sigils():string[]{
        const list:string[]=cfg.sigil.map((max, index) => {
            return `${cfg.sigil[index-1]||0}-${max-1}`;
        });
        list.push(`${cfg.sigil[cfg.sigil.length-1]}+`);
        return list;
    }
}
</script>
<style scoped>
.mastey-box{
    /* max-width: 800px; */
    width: 80%;
    margin: 0 auto;
}
.mastey-baseinfo{
    width: 390px;
}
.e-info{
    flex: 1 1 0;
}
.mastey-input{
    padding: 10px;
}
.mastey-baseinfo-display-box{
    text-align: center;
}
.sigils-box{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    text-align: center;
}
.su-view-control-mobile .mastey-box{
    width: 100%;
}
.su-view-control-mobile .mastey-baseinfo{
    width: 90%;
    margin: 0 auto;
}

</style>