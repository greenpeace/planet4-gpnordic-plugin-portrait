<?php
namespace GPPT\Controllers;

class GPPT_Petition_Controller {
	public static function enqueue_public_assets() {
		if( ! function_exists('get_plugin_data') ){
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}
		$plugin_data = get_plugin_data( __FILE__ );
		$version = $plugin_data['Version'];
		$plugin_uri  = GPPT_PLUGIN_ROOT;
		wp_enqueue_style( 'plugin-gppt', $plugin_uri . '/css/app.css', [], $version );
		wp_register_script( 'vue', $plugin_uri . 'bower_components/vue/dist/vue.min.js', array(), $version, true );
		wp_register_script( 'lottie', $plugin_uri . 'bower_components/bodymovin/build/player/lottie_light.min.js', array(), $version, true );
		wp_register_script( 'lodash', $plugin_uri . 'bower_components/lodash/dist/lodash.min.js', array(), $version, true );
		wp_register_script( 'fontfaceobserver', '//rawgit.com/bramstein/fontfaceobserver/master/fontfaceobserver.js', array(), $version, true );
		wp_register_script( 'backgroundimage', $plugin_uri . 'public/js/modules/background-image.js', array('vue', 'lodash', 'jquery'), $version, true );
		wp_register_script( 'loader', $plugin_uri . 'public/js/modules/loader.js', array('vue', 'lottie'), $version, true );
		wp_register_script( 'video', $plugin_uri . 'public/js/modules/video.js', array('vue', 'lodash', 'jquery'), $version, true );
		wp_register_script( 'canvas', $plugin_uri . 'public/js/modules/canvas.js', array('vue', 'lodash', 'jquery', 'fontfaceobserver'), $version, true );
		wp_register_script( 'plugin-gppt', $plugin_uri . 'public/js/app.js', array('backgroundimage', 'video', 'canvas', 'fabric', 'lottie', 'loader'), $version, true );
		wp_enqueue_script( 'fabric', $plugin_uri . 'assets/js/fabric.min.js', array(), $version, false );
		wp_enqueue_script( 'plugin-gppt' );
	}

	public static function handle_shortcode( $atts = array() ) {
		GPPT_Petition_Controller::enqueue_public_assets();
		$petition_id = $atts['id'];
		$localize = array(
			'site_url' => get_site_url(),
			'gppt_url' => GPPT_PLUGIN_ROOT,
			'petition_id' => $petition_id,
			'utm' => $_SERVER['QUERY_STRING'],
			'nonce' => wp_create_nonce( 'gppt-nonce' ),
			'petition' => array(
				'id' => $petition_id,
				'categories' => get_field( 'categories', $petition_id ),
				'cta' => get_field( 'cta', $petition_id ),
			)
		);
		wp_localize_script( 'plugin-gppt', 'greenpeace_petition_ajax', $localize );
		$data = array(
			'title' => get_the_title( $petition_id ) ,
			'content' => get_the_content( null, false, $petition_id ),
			'petition_id' => $petition_id,
		);
		$block_output = \Timber::compile( GPPT_PLUGIN_ROOT_URI . 'templates/blocks/petition.twig', $data, 10, \Timber\Loader::CACHE_NONE );
		return $block_output;
		// compile( array/string $filenames, array $data=array(), bool/bool/int $expires=false, string $cache_mode="default", bool $via_render=false )
		// return "<div id='background' data-petition-id='" . $atts['id'] . "' v-cloak></div><div id='app' data-petition-id='" . $atts['id'] . "' v-cloak></div>";
	}
}
add_shortcode('petition', __NAMESPACE__ . '\\GPPT_Petition_Controller::handle_shortcode');
