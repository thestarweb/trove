<template>
	<div class="home">
		宝藏世界工具emmm
		<div class="menu-list">
			<page-menu-item v-for="item in list" :key="item.page" :page="item.page" :icon="item.icon" :name="item.name"></page-menu-item>
		</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import PageMenuItem from "@/components/page-menu-item/index.vue"


@Options({
	components: {
		PageMenuItem
	},
})
export default class Home extends Vue {
	private list=[
		{name:"检查宝石",page:"/gem/check",icon:"/images/gem.png"},
		{name:"语言文件工具",page:"/lang/editer",icon:"/images/lang.svg"},
	];
}
</script>
<style scoped="">
	.menu-list{
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
</style>
