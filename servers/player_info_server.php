<?php
namespace star\web\trove; 
class player_info_server{
	const table='@%_player_baseinfo';
	private $system;
	public function __construct($system){
		$this->system=$system;
	}
	public function set_player_mastery($uid,$mastery){
		$db=$this->system->db();
		$db->update_or_insert(self::table,['uid'=>$uid],['mastery'=>$mastery]);
	}
	public function get_player_mastery($uid){
		$db=$this->system->db();
		$res=$db->u_exec('SELECT `mastery` FROM `'.self::table.'` WHERE `uid`=?',[$uid]);
		return $res?$res[0]['mastery']:0;
	}
}