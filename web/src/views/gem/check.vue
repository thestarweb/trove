<template>
	<div class="input">
		<div>
			{{$t("gem.type.name")}}
			<su-select v-model="gemType" :options="[
				{label:$t('gem.type.normal'),value:'normal'},
				{label:$t('gem.type.empowered'),value:'empowered'}
			]"></su-select>
		</div>
		<div>
			{{$t("gem.gem-lv")}}
			<su-select v-model="gemLv" :options="gemLvList"></su-select>
		</div>
		<div>
			{{$t("gem.gem-rank")}}
			<su-input v-model.number="gemRank"/>
		</div>
	</div>
	<div id="out" :res="gemGrade">
		<h2 id="res_dj">{{gemGrade}}</h2>
		<table style="display: inline-table;">
			<tr>
				<th>{{$t("gem.gem-lv")}}</th>
				<th v-for="item in gemLvList" :key="item.value">{{item.value}}</th>
			</tr>

			<tr>
				<td>{{$t("gem.gem-rank")}}</td>
				<td v-for="item in gemLvList" :key="item.value">{{gemLvTank[item.value]}}</td>
			</tr>
		</table>
		<div id="comment">{{$t('gem.comment.'+gemGrade)}}</div>
		<p class="remark-content">*由于宝石获得的基数不同，挑选宝石时请根据自己实际情况调整，特别是大宝石，前期弄不到，差也得先用着</p>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';


@Options({
})
export default class Page extends Vue {
	private get gemLvList(){
		let list=[];
		for (let i = 15; i <= 25; ++i) {
			list.push({value:i});
		}
		return list;
	}
	private gemType="normal";
	private gemLv=15;
	private gemRank:number|string=1250;
	private get_pr(lv:number):number{
		if(lv==20||lv==25) return 75;
		return 30;
	}
	public get gemLvTank():number[]{
		let temp:number[]=[];console.log(this.gemRank);
		temp[this.gemLv]=parseInt(this.gemRank as string);
		for(let i=this.gemLv-1;i>=15;i--){
			temp[i]=temp[i+1]-this.get_pr(i+1);
		}
		for(let i=this.gemLv+1;i<=25;i++){
			temp[i]=temp[i-1]+this.get_pr(i);
		}
		return temp;
	}
	private get gemGrade():string{
		let out_dj="T";
		if(this.gemType=="normal"){
			if(this.gemLvTank[15]>=1310) out_dj="O";//Outstanding （完美）
			else if(this.gemLvTank[15]>=1280) out_dj="E";//Exceeds Expectations （超出预期）
			//else if(this.gemLvTank[15]>=1280) out_dj="G";//...Good
			else if(this.gemLvTank[15]>=1250) out_dj="A";//Acceptable （及格）
			else if(this.gemLvTank[15]>=1200) out_dj="P";//Poor  （不佳）
			else if(this.gemLvTank[15]>=1150) out_dj="D";//Dreadful （差）
			else out_dj="T";//糟糕透了
		}else if(this.gemType=="empowered"){
			if(this.gemLvTank[15]>=1720) out_dj="O";//Outstanding （完美）
			else if(this.gemLvTank[15]>=1700) out_dj="E";//Exceeds Expectations （超出预期）
			//else if(this.gemLvTank[15]>=1280) out_dj="G";//...Good
			else if(this.gemLvTank[15]>=1650) out_dj="A";//Acceptable （及格）
			else if(this.gemLvTank[15]>=1610) out_dj="P";//Poor  （不佳）
			else if(this.gemLvTank[15]>=1600) out_dj="D";//Dreadful （差）
		}
		return out_dj;
	}
}
</script>
<style scoped>
*{
	text-align: center;
}
.input{
	display: flex;
	flex-direction: row;
	justify-content: center;
}
#out{
	transition:background 0.5s;
}
#out[res=O]{
	background: rgba(200,20,250,0.2);
}
#out[res=E]{
	background: rgba(0,120,250,0.2);
}
#out[res=A]{
	background: rgba(100,255,100,0.2);
}
#out[res=P]{
	background: rgba(200,200,0,0.2);
}
#out[res=D]{
	background: rgba(200,150,0,0.2);
}
#out[res=T]{
	background: rgba(255,0,0,0.2);
}
</style>
