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
				'thank_you_text' => get_field( 'thank_you_text', $petition_id ),
				'thank_you_image' => get_field( 'thank_you_image', $petition_id ),
				'terms_url' => get_field( 'terms_url', $petition_id ),
				'join_protest_text' => get_field( 'join_protest_text', $petition_id ),
				'projections_title' => get_field( 'projections_title', $petition_id ),
				'projections_text' => get_field( 'projections_text', $petition_id ),
				'articles_title' => get_field( 'articles_title', $petition_id ),
				'articles_text' => get_field( 'articles_text', $petition_id ),
				'encouragement' => get_field( 'encouragement', $petition_id ),
			),
			'translations' => array(
				'Join the protest' => __( 'Join the protest', 'gppt' ),
				'About this demand' => __( 'About this demand', 'gppt' ),
				'Snap a picture and join the protest by allowing the app to use the camera on your device. You can also proceed without a picture.' => __( 'Snap a picture and join the protest by allowing the app to use the camera on your device. You can also proceed without a picture.' ),
				'First Name' => __('First Name', 'gppt'),
				'Last Name' => __('Last Name', 'gppt'),
				'E-mail' => __('E-mail', 'gppt'),
				'Phone' => __('Phone', 'gppt'),
				'Phone' => __('Phone', 'gppt'),
				'Leave a comment' => __('Leave a comment', 'gppt'),
				'I accept the terms' => __('I accept the terms', 'gppt'),
				'Keep me posted' => __('Keep me posted', 'gppt'),
				'Make sure you have entered your name and provided a working e-mail address.' => __('Make sure you have entered your name and provided a working e-mail address.', 'gppt'),
				'Back' => __('Back', 'gppt'),
				'Send' => __('Send', 'gppt'),
				'Next step' => __('Next step', 'gppt'),
				'Take photo' => __('Take photo', 'gppt'),
				'Proceed without camera' => __('Proceed without camera', 'gppt'),
				'Please enable your camera to snap a picture of yourself.' => __('Please enable your camera to snap a picture of yourself.', 'gppt'),
				'Or click here to continue without camera.' => __('Or click here to continue without camera.', 'gppt'),
				'the terms' => __('the terms', 'gppt'),
				'YES' => __('YES', 'gppt'),
				'NO' => __('NO', 'gppt'),
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
	}

	/**
	 * Register meta box(es).
	 */
	public static function register_meta_boxes() {
		add_meta_box( 'mapped-comments', __( 'Map Comments', 'greenwash' ), __NAMESPACE__ . '\\GPPT_Petition_Controller::petition_image_display_callback', 'petition' );
	}

	/**
	 * Meta box display callback.
	 *
	 * @param WP_Post $post Current post object.
	 */
	public static function petition_image_display_callback( $post ) {
		$image_query = new \WP_Query( array(
			'post_type' => 'attachment',
			'posts_per_page' => -1,
			'orderby' => 'ID',
			'post_status' => 'any',
			'meta_query' => array(
				'relation' => 'AND',
				array(
					'key'   => 'petition_id',
					'value'  => $post->ID,
					'compare' => '==',
				),
				array(
					'key' => 'image_approved',
					'compare' => 'NOT EXISTS',
				),
			),
		) );
		$images = [];
		foreach( $image_query->posts as $image ) {
			$images[] = array(
				'ID' => $image->ID,
				'image' => wp_get_attachment_image_src( $image->ID, 'medium' )[0]
			);
		}

		$plugin_data = get_plugin_data( __FILE__ );
		$version = $plugin_data['Version'];
		$plugin_uri  = GPPT_PLUGIN_ROOT;
		wp_register_script( 'vue', $plugin_uri . 'bower_components/vue/dist/vue.min.js', array(), $version, false );
		wp_enqueue_script( 'gp-petition-image-editor', $plugin_uri . 'assets/js/petition-image-editor.js', array( 'vue' ), $version, false );
		wp_localize_script( 'gp-petition-image-editor', 'greenpeace_petition_admin_ajax', array( 'images' => $images, 'site_url' => get_site_url() ) );
		$block_output = \Timber::compile( GPPT_PLUGIN_ROOT_URI . 'templates/blocks/petition-image-editor.twig', [], 10, \Timber\Loader::CACHE_NONE );
		echo $block_output;
	}

}
add_shortcode( 'petition', __NAMESPACE__ . '\\GPPT_Petition_Controller::handle_shortcode' );
add_action( 'add_meta_boxes', __NAMESPACE__ . '\\GPPT_Petition_Controller::register_meta_boxes' );