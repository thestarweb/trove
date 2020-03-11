<?php
namespace star\web\trove; 
class gem_control{
	public function check_page($system){
		$system->show_head($system->lang('gem','check.title').' by star_ss');
		include $system->get_view('gem/check');
		$system->show_foot();
	}
}