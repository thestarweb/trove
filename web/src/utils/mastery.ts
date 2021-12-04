export function getMasteryLvPoint(lv:number,type='trove',maxLv?:number):number{//升级所需专精
	let max = maxLv;
	if(!maxLv){
		switch(type){
			case 'trove':
				max=1000;
				break;
			case 'geode':
				max=100;
				break;
			default:
				max=0;
		}
	}
	if(lv >= (max as number)) return 0;
	if(lv<1) return 0;
	if(lv<5) return 25;
	if(lv<10) return 50;
	if(lv<20) return 75;
	if(lv<300) return 100;
	return Math.ceil((lv+1)/2);
}
export function getLvByPoint(point:number,type='trove',maxLv?:number):[number, number]{
	let lv=1;
	let lvPoint:number;
	let temp=point;
	while(temp>=(lvPoint=getMasteryLvPoint(lv,type,maxLv))&&lvPoint!==0){
		temp-=lvPoint;
		lv++;
	}
    return [lv, temp];
}
export function getPointByLv(lv:number,point=0,type='trove',maxLv?:number):number{
    let totalPoint=0;
	for(let i=1;i<lv;i++){
		const lvPoint = getMasteryLvPoint(i,type,maxLv);
		if(lvPoint === 0) break;
		totalPoint+=lvPoint;
	}
    return totalPoint+point;
}
