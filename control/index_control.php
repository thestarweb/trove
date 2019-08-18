<?php
class index_control{
	public function index_page($system){
		//
	}
	public function coe_page($system){
		$system->show_head('coe计算器 by star_ss');
		include $system->get_view('coe');
		$system->show_foot();
	}
}