<?php
namespace GPPT\Controllers;

class GPPT_Answer_Controller {
  // Get Petition
  public static function get($args) {
    try {
      $petition_id = $args['petition_id'];
      $petitions = new \WP_Query( array(
        'post_type' => 'attachment',
        'posts_per_page' => isset($args['num_images']) ? $args['num_images'] : 10,
        'orderby' => 'rand',
        'post_status' => 'any',
        'meta_query' => array(
          'relation' => 'AND',
  				array(
  					'key' => 'image_approved',
  					'compare' => '1',
  				),
          array(
            'key'     => 'petition_id',
            'value'   => $petition_id,
            'compare' => '==',
          ),
        ),
      ) );
      $images = [];
      foreach( $petitions->posts as $petition ) {
        $images[] = wp_get_attachment_image_src( $petition->ID, 'medium' )[0];
      }
      return $images;
    } catch( Exception $e ) {
    }
  }

  // Update Petition
  public static function set($args) {
    $nonce = $args['nonce'];
    if( !wp_verify_nonce( $nonce, 'gppt-nonce' ) )
      return new \WP_Error( 'not_allowed', "Nonce '$nonce' not valid", array( 'status' => 405 ) );
    try {
      $dateTime = new \DateTime();
      $petition_id = $args['petition_id'];
      $firstname = $args['firstname'];
      $lastname = $args['lastname'];
      $email = $args['email'];
      $phone = $args['phone'];
      $own_protest = $args['own_protest'];
      $terms = $args['terms'];
      $newsletter = 1; // $args['newsletter'];
      $projections = $args['projections'];
      $articles = $args['articles'];
      $date = date('Y-m-d');
      $hash = wp_generate_uuid4();
      $utm = $args['utm'] !== '' ? $args['utm'] . '&hash=' . $hash : 'hash=' . $hash;
      $image = str_replace(' ', '+', $args['image']);
      $image = substr($image, strpos($image, ',') + 1);
      $image = base64_decode($image);
      $image_no_text = str_replace(' ', '+', $args['image_no_text']);
      $image_no_text = substr($image_no_text, strpos($image_no_text, ',') + 1);
      $image_no_text = base64_decode($image_no_text);
      $country = get_field( 'country', $petition_id );
      $source_code = get_field( 'source_code', $petition_id );
      $images = array(
        'image' => $image,
        'image_no_text' => $image_no_text,
      );
      // $timestamp = $dateTime->format('Y-m-d H:i:s');

      $hostname = get_field('petition_db_host', 'options');
      $username = get_field('petition_db_username', 'options');
      $password = get_field('petition_db_password', 'options');
      $dbname = get_field('petition_db_table_name', 'options');
      $remote_db = new \wpdb($username, $password, $dbname, $hostname);

      $results = $remote_db->get_results("INSERT INTO LEADS VALUES (null, '$email', '$firstname', '$lastname', '$date', '$newsletter', '$source_code', '$country', '$phone', '$utm', CURRENT_TIMESTAMP);");
      $remote_db->close();

      $upload_dir = wp_upload_dir();
      $path = $upload_dir['basedir'] . '/petitions/' . $petition_id;
      foreach( $images as $key => $i ) {
        $filename = basename( "$hash-$key.jpg" );
        if ( wp_mkdir_p( $path ) ) {
          $file = $path . '/' . $filename;
        } else {
          $file = $upload_dir['basedir'] . '/' . $filename;
        }

        $source = imagecreatefromstring( $i );
        imagejpeg($source, $file, 100);
        $wp_filetype = wp_check_filetype( $filename, null );

        $attachment = array(
          'post_mime_type' => $wp_filetype['type'],
          'post_title' => sanitize_file_name( $filename ),
          'post_content' => '',
          'post_status' => 'inherit',
          'post_excerpt' => $own_protest
        );

        $attach_id = wp_insert_attachment( $attachment, $file );
        require_once( ABSPATH . 'wp-admin/includes/image.php' );
        $attach_data = wp_generate_attachment_metadata( $attach_id, $file );
        wp_update_attachment_metadata( $attach_id, $attach_data );
        update_post_meta( $attach_id, 'petition_id', $petition_id );
        update_post_meta( $attach_id, 'hash', $hash );
        update_post_meta( $attach_id, 'image_type', $key );
        update_post_meta( $attach_id, 'approved_terms', $terms );
        update_post_meta( $attach_id, 'newsletter', $newsletter );
        update_post_meta( $attach_id, 'approve_for_projections', $projections );
        update_post_meta( $attach_id, 'approve_for_articles', $articles );
      }
      return true;
    } catch( Exception $e ) {
      return $e;
    }
  }

  public static function approve_reject($args) {
    // TODO: Check so that user is logged in
    update_post_meta( $args['id'], 'image_approved', $args['approve'] );
    return true;
  }

  public static function register_api_routes() {
    // Get Petition
    register_rest_route( "gppt/v1", '/answers', array(
      'methods' => 'GET',
      'callback' => __NAMESPACE__ . '\\GPPT_Answer_Controller::get',
    ) );

    // Post Petition
    register_rest_route( "gppt/v1", '/answers', array(
      'methods' => 'POST',
      'callback' => __NAMESPACE__ . '\\GPPT_Answer_Controller::set',
    ) );

    // Approve / Reject
    register_rest_route( "gppt/v1", '/answers/(?P<id>\d+)', array(
      'methods' => 'POST',
      'callback' => __NAMESPACE__ . '\\GPPT_Answer_Controller::approve_reject',
    ) );
  }
}
add_action( 'rest_api_init', __NAMESPACE__ . '\\GPPT_Answer_Controller::register_api_routes' );
