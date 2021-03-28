<template>
	<Ui></Ui>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Ui from "@/components/lang-helper/index.vue"


@Options({
	components: {
		Ui
	},
})
export default class Home extends Vue {}
</script>
