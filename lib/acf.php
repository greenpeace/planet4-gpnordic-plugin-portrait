<?php
// Define path and URL to the ACF plugin.
define( 'MY_ACF_PATH', GPPT_PLUGIN_ROOT_URI . '/includes/acf/' );
define( 'MY_ACF_URL', GPPT_PLUGIN_ROOT . '/includes/acf/' );

// Include the ACF plugin.
include_once( MY_ACF_PATH . 'acf.php' );
include_once( GPPT_PLUGIN_ROOT_URI . '/lib/custom-fields/petition.php' );

// Customize the url setting to fix incorrect asset URLs.
add_filter('acf/settings/url', 'gpp_acf_settings_url');
function gpp_acf_settings_url( $url ) {
  return MY_ACF_URL;
}

// Hide the ACF admin menu item.
function gpp_acf_settings_show_admin( $show_admin ) {
  return true;
}
add_filter('acf/settings/show_admin', 'gpp_acf_settings_show_admin');
