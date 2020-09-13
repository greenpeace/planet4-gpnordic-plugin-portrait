<?php
namespace GPPT\Controllers;

class GPPT_Petition_Controller {
	public static function enqueue_public_assets() {
		if( ! function_exists('get_plugin_data') ){
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}
		$plugin_data = get_plugin_data( GPPT_PLUGIN_ROOT_FILE );
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
		wp_register_script( 'facebook-image', $plugin_uri . 'public/js/modules/facebook-image.js', array('vue', 'lodash', 'jquery'), $version, true );
		wp_register_script( 'canvas', $plugin_uri . 'public/js/modules/canvas.js', array('vue', 'lodash', 'jquery', 'fontfaceobserver'), $version, true );
		wp_register_script( 'plugin-gppt', $plugin_uri . 'public/js/app.js', array('backgroundimage', 'video', 'canvas', 'fabric', 'lottie', 'loader', 'facebook-image'), $version, true );
		wp_enqueue_script( 'fabric', $plugin_uri . 'assets/js/fabric.min.js', array(), $version, false );
		wp_enqueue_script( 'plugin-gppt' );
	}
	public static function handle_shortcode( $atts = array() ) {
		global $post;
		GPPT_Petition_Controller::enqueue_public_assets();
		$petition_id = $atts['id'];
		$translations = get_field( 'translations', $petition_id );
		$localize = array(
			'site_url' => get_site_url(),
			'gppt_url' => GPPT_PLUGIN_ROOT,
			'petition_id' => $petition_id,
			'utm' => $_SERVER['QUERY_STRING'],
			'nonce' => wp_create_nonce( 'wp_rest' ),
			'facebook_app_id' => get_field( 'facebook_app_id', 'options' ),
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
				'legal_text' => get_field( 'legal_text', $petition_id ),
				'url' => get_permalink( $post ),
			),
			'translations' => array(
				'Join the protest' => $translations['join_the_protest'],
				'About this demand' => $translations['about_this_demand'],
				'Snap a picture and join the protest by allowing the app to use the camera on your device. You can also proceed without a picture.' => $translations['snap_a_picture_and_join_the_protest_by_allowing_the_app_to_use_the_camera_on_your_device_you_can_also_proceed_without_a_picture'],
				'First Name' => $translations['first_name'],
				'Last Name' => $translations['last_name'],
				'E-mail' => $translations['e-mail'],
				'Phone' => $translations['phone'],
				'Leave a comment' => $translations['leave_a_comment'],
				'I accept the terms' => $translations['i_accept_the_terms'],
				'Keep me posted' => $translations['keep_me_posted'],
				'Make sure you have entered your name and provided a working e-mail address.' => $translations['make_sure_you_have_entered_your_name_and_provided_a_working_e-mail_address'],
				'Back' => $translations['back'],
				'Send' => $translations['send'],
				'Next step' => $translations['next_step'],
				'Take photo' => $translations['take_photo'],
				'Proceed without camera' => $translations['proceed_without_camera'],
				'Please enable your camera to snap a picture of yourself.' => $translations['please_enable_your_camera_to_snap_a_picture_of_yourself'],
				'Use my facebook profile picture' => $translations['use_my_facebook_profile_picture'],
				'Use device camera' => $translations['use_device_camera'],
				'If the webcam is not working please visit shorturl in your usual browser!' => $translations['if_the_webcam_is_not_working_please_visit_shorturl_in_your_usual_browser'],
				'Or click here to continue without camera.' => $translations['or_click_here_to_continue_without_camera'],
				// 'the terms' => __('the terms', 'gppt'),
				'Yes' => $translations['yes'],
				'No' => $translations['no'],
				'Download image' => $translations['download_image'],
				'Category' => $translations['category'],
				'Loading' => get_field('loader_texts', $petition_id)
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

	public static function handle_grid_shortcode( $atts = array() ) {
		global $post;
		GPPT_Petition_Controller::enqueue_public_assets();
		$petition_id = isset($atts['petition_id']) ? $atts['petition_id'] : 0;
		$petition_page_id = isset($atts['page_id']) ? $atts['page_id'] : $post->post_parent;
		// echo( $petition_id );
		$image_query = new \WP_Query( array(
			'post_type' => 'attachment',
			'posts_per_page' => -1,
			'orderby' => 'ID',
			'post_status' => 'any',
			'meta_query' => array(
				'relation' => 'AND',
				array(
					'key'   => 'petition_id',
					'value'  => $petition_id,
					'compare' => '==',
				),
				array(
					'key' => 'image_approved',
					'value'  => '1',
					'compare' => '==',
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
		$data = array(
			'images' => $images,
			'petition_url' => get_permalink( $petition_page_id ),
			'translations' => get_field( 'translations', $petition_id )
		);
		// print_r( $images );
		// $translations = get_field( 'translations', $petition_page_id );
		// wp_localize_script( 'plugin-gppt', 'greenpeace_petition_ajax', $localize );
		// $data = array(
		// 	'title' => get_the_title( $petition_id ) ,
		// 	'content' => get_the_content( null, false, $petition_id ),
		// 	'petition_id' => $petition_id,
		// );
		$block_output = \Timber::compile( GPPT_PLUGIN_ROOT_URI . 'templates/blocks/petition-grid.twig', $data, 10, \Timber\Loader::CACHE_NONE );

		return $block_output;
	}

	/**
	 * Register meta box(es).
	 */
	public static function register_meta_boxes() {
		add_meta_box( 'mapped-comments', __( 'Approve Images', 'gppt' ), __NAMESPACE__ . '\\GPPT_Petition_Controller::petition_image_display_callback', 'petition' );
	}

	/**
	 * Meta box display callback.
	 *
	 * @param WP_Post $post Current post object.
	 */
	public static function petition_image_display_callback( $post ) {
		$images = [];
		$google_bucket_name = get_field('google_cloud_bucket_name', 'options');

		if( $google_bucket_name !== '' ) { // Use Google Cloud
			$image_query = GPPT_Image_Controller::get_images(array( 'petition_id' => $post->ID, 'approved' => false ));
			foreach( $image_query as $key => $image ) {
				$images[] = array(
					'ID' => $key,
					'image' => $image
				);
			}
		} else {
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
			foreach( $image_query->posts as $image ) {
				$images[] = array(
					'ID' => $image->ID,
					'image' => wp_get_attachment_image_src( $image->ID, 'medium' )[0]
				);
			}
		}

		$plugin_data = get_plugin_data( GPPT_PLUGIN_ROOT_FILE );
		$version = $plugin_data['Version'];
		$plugin_uri  = GPPT_PLUGIN_ROOT;
		wp_register_script( 'vue', $plugin_uri . 'bower_components/vue/dist/vue.min.js', array(), $version, false );
		wp_enqueue_script( 'gp-petition-image-editor', $plugin_uri . 'assets/js/petition-image-editor.js', array( 'vue' ), $version, false );
		wp_localize_script( 'gp-petition-image-editor', 'greenpeace_petition_admin_ajax', array( 'images' => $images, 'petition_id' => $post->ID, 'site_url' => get_site_url() ) );
		$block_output = \Timber::compile( GPPT_PLUGIN_ROOT_URI . 'templates/blocks/petition-image-editor.twig', [], 10, \Timber\Loader::CACHE_NONE );
		echo $block_output;
	}

}
add_shortcode( 'petition', __NAMESPACE__ . '\\GPPT_Petition_Controller::handle_shortcode' );
add_shortcode( 'petition-grid', __NAMESPACE__ . '\\GPPT_Petition_Controller::handle_grid_shortcode' );
add_action( 'add_meta_boxes', __NAMESPACE__ . '\\GPPT_Petition_Controller::register_meta_boxes' );
