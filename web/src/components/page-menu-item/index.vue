<template>
	<router-link :to="page">
		<img :src="icon">
		<div>{{name}}</div>
	</router-link>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
	props: {
		page:{
			type:String
		},
		name:{
			type:String
		},
		icon:{
			type:String
		},
	},
})
export default class Home extends Vue {
	//
}
</script>

<style scoped>
	a{
		display: inline-flex;
		flex-direction: column;
		text-decoration: none;
		padding: 5px;
		margin: 5px;
		border: 1px solid #DDD;
		text-align: center;
		color: #EEE;
	}
	a>img{
		width: 100px;
		height: 100px;
	}
	a:hover{
		transform: scale(1.1,1.1)
	}
</style>
