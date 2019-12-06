<?php
namespace strove; 
class player_info_control{
	public function index_page($system){
		$system->show_head('coe计算器 by star_ss');
		include $system->get_view('coe');
		include $system->get_view('player_info_ctrl');
		$system->show_foot();
	}
	public function save_info_page($system){
		$system->show_json(['is_ok'=>false]);
		// if(isset($_POST['key'])&&($uid=$system->succ->is_login($_POST['key'],$_SERVER['HTTP_USER_AGENT']))!==false){
		// 	if(isset($_POST['data']['mastery']))$system->server('player_info')->set_player_mastery($uid,$_POST['data']['mastery']);
		// 	$system->show_json(['is_ok'=>true]);
		// }
	}
	public function get_info_page($system,$uid){
		if($uid||(isset($_POST['key'])&&($uid=$system->succ->is_login($_POST['key'],$_SERVER['HTTP_USER_AGENT']))!==false)){
			$data=[];
			$server=$system->server('player_info');
			$data['mastery']=$server->get_player_mastery($uid);
			$system->show_json(['data'=>$data]);
		}
	}
}