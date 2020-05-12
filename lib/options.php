<?php

/* Register options page */
function gppt_add_options_page() {
	acf_add_options_page();
	acf_add_options_sub_page(array(
		'page_title' 	=> 'Rich Engagement',
		'menu_title' 	=> 'Rich Engagement',
	));
}
add_action( 'after_setup_theme', 'gppt_add_options_page' );
