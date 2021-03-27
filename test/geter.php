<?php
// $html='<a href="/wiki/Permanent_Stat_Boost" title="Permanent Stat Boost">Permanent Stat Boost</a>, granting 5% <a href="/wiki/Player_Stats" title="Player Stats" class="mw-redirect">Energy Regeneration</a>, 1,000 <a href="/wiki/Player_Stats" title="Player Stats" class="mw-redirect">Maximum Health</a> and 50 <a href="/wiki/Player_Stats" title="Player Stats" class="mw-redirect">Magic Find</a>.';
// preg_match_all('/\\+([\\d\\.,]+)(%?) <a href="\/wiki\/Player_Stats" title="Player Stats" class="mw-redirect">([a-z ]+?)(,|\\.| and|\n|<)/i', $html, $res);
// 	var_dump(!$res[0]);
// 	exit;
set_time_limit(0);
$str='';
$temp=file_get_contents(__DIR__.'/list.text');
$list=explode("\n",$temp);
foreach ($list as $v) {
	echo " geting ".$v." \n ";
	$html=file_get_contents($v);
	preg_match('/<title>(.+)<\\/title>/i', $html, $res);
	$a=explode('|',$res[1]);
	$str.='{"name":"'.$a[0].'","attribute":{';
	preg_match_all('/\\+([\\d\\.,]+)(%?)([a-z ]+?)(,|\\.| and|\n|<)/i', $html, $res);
	if(!$res[0])preg_match_all('/([\\d\\.,]+)(%?) <a href="\/wiki\/Player_Stats" title="Player Stats" class="mw-redirect">([a-z ]+?)(,|\\.| and|\n|<)/i', $html, $res);
	var_dump($res);
	foreach ($res[1] as $k=>$v) {
		$name=strtolower(str_replace(' ','_', trim($res[3][$k])));
		if($res[2][$k]=="%") $name.="_";
		$str.='"'.$name.'":'.str_replace(',','',$v).',';
	}
	$str.='},"has":true},';
}
file_put_contents(__DIR__.'/out.txt',$str);