<?php
namespace star\web\trove; 
class gem_control{
	public function index_page($system){
		$system->show_head($system->lang('title','gem'));
		//
		$system->show_foot();
	}
	public function check_page($system){
		$system->show_head($system->lang('title','check_gem'));
		include $system->get_view('gem/check');
		$system->show_foot();
	}
}