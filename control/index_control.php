<?php
namespace star\web\trove; 
class index_control{
	public function index_page($system){
		//
	}
	public function coe_page($system){
		$system->show_head('coe计算器 by star_ss');
		include $system->get_view('coe');
		$system->show_foot();
	}
	public function lang_page($system,$c='zh-cn'){
		if(in_array($c,$system->ini_get('lang_list'))){
			$loads=explode(',','class,base');
			$langdir=$system->ini_get('lang_dir');
			$res=[];
			foreach ($loads as $v) {
				$file=$langdir.$c.'/'.$v.'.lang';
				if(file_exists($file)){
					$res[$v]=include $file;
				}
			}
			echo json_encode($res,JSON_UNESCAPED_UNICODE);
		}
	}
}