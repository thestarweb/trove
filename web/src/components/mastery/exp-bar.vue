<template>
    <div class="exp-bar">
        <div class="exp-bar-innere" :style="`width: ${width}%`"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';


@Options({})
export default class Home extends Vue {
    @Prop({
        type: Number,
    })
    private readonly width!:number;
}
</script>

<style scoped>
.exp-bar{
	margin: 2px;
	padding: 1px;
	height: 2px;
	border: solid 1px #aa0;
}
.exp-bar-innere{
	height: 100%;
	background: #aa0;
}
</style>