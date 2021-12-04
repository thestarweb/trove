<template>
    <div>
        <MasteryCalculation></MasteryCalculation>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import MasteryCalculation from './mastery-calculation.vue';


@Options({
    components:{
        MasteryCalculation
    }
})
export default class extends Vue {
}
</script>

<style scoped>
</style>
