<?php
namespace GPPT\Controllers;

use \Google\Cloud\Storage\StorageClient;

class GPPT_Image_Controller {

	public static function update_image($args) {
		require plugin_dir_path( __FILE__ ) . '../../vendor/autoload.php';
		$key_file = get_field('google_service_account_key_file', 'options');
		$project_id = get_field('google_cloud_project_id', 'options');
		$bucket_name = get_field('google_cloud_bucket_name', 'options');
		// Authenticating with keyfile data.
		$storage = new StorageClient([
			'keyFile' => json_decode($key_file, true),
			'projectId' => $project_id
		]);
		$bucket = $storage->bucket($bucket_name);
		$object = $bucket->object( $args['id'] );
		$prefix = ($args['approved'] ? 'approved' : 'rejected') . '/' . $args['petition_id'] . '/';
		$filname_path = explode('/', $args['id']);
    	$object->copy($bucket, ['name' => $prefix . end($filname_path)]);
		$object->delete();
	}

	public static function get_images($args) {
		require plugin_dir_path( __FILE__ ) . '../../vendor/autoload.php';

		$key_file = get_field('google_service_account_key_file', 'options');
		$project_id = get_field('google_cloud_project_id', 'options');
		$bucket_name = get_field('google_cloud_bucket_name', 'options');
		// Authenticating with keyfile data.
		$storage = new StorageClient([
			'keyFile' => json_decode($key_file, true),
			'projectId' => $project_id
		]);
		$bucket = $storage->bucket($bucket_name);
		$prefix = $args['petition_id'];
		if( $args['approved'] ) {
			$prefix = 'approved/' . $prefix . '/';
		}
		$options = array( 'prefix' => $prefix );
		$objects = $bucket->objects($options);
		$images = [];
		foreach ($objects as $object) {
			$images[$object->name()] = $object->signedUrl(new \DateTime('tomorrow'));
		}
	
		return $images;
	}
	public static function upload_image($args) {
		require plugin_dir_path( __FILE__ ) . '../../vendor/autoload.php';

		$key_file = get_field('google_service_account_key_file', 'options');
		$project_id = get_field('google_cloud_project_id', 'options');
		$bucket_name = get_field('google_cloud_bucket_name', 'options');
		// Authenticating with keyfile data.
		$storage = new StorageClient([
			'keyFile' => json_decode($key_file, true),
			'projectId' => $project_id
		]);
		$bucket = $storage->bucket($bucket_name);
		$object = $bucket->upload($args['image'], [
			'name' => $args['attachment_data']['petition_id'] . "/" . $args['filename'],
			'metadata' => array(
				'metadata' => $args['attachment_data']
			)
		]);
		$info = $object->info();
		return $info['mediaLink'];
	}
	public static function register_api_routes() {
	// 	register_rest_route( "gppt/v1", '/images', array(
	// 		'methods' => 'GET',
	// 		'callback' => __NAMESPACE__ . '\\GPPT_Image_Controller::get_images',
	// 	) );
	// 	register_rest_route( "gppt/v1", '/images', array(
	// 		'methods' => 'POST',
	// 		'callback' => __NAMESPACE__ . '\\GPPT_Image_Controller::upload_image',
	// 	) );
	}

}
add_action( 'rest_api_init', __NAMESPACE__ . '\\GPPT_Image_Controller::register_api_routes' );
