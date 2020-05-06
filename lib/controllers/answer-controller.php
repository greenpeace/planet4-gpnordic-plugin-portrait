<?php
namespace GPPT\Controllers;

class GPPT_Answer_Controller {
  // Get Petition
  public static function get($args) {
    try {
      $petition_id = $args['petition_id'];
      $petitions = new \WP_Query( array(
        'post_type' => 'attachment',
        'posts_per_page' => 1,
        'orderby' => 'rand',
        'post_status' => 'any',
        'meta_query' => array(
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
      $petition_id = $args['petition_id'];
      $firstname = $args['firstname'];
      $lastname = $args['lastname'];
      $email = $args['email'];
      $phone = $args['phone'];
      $date = date('Y-m-d');
      $utm = $args['utm'];

      $image = str_replace(' ', '+', $args['image']);
      $image = substr($image, strpos($image, ',') + 1);
      $image = base64_decode($image);
      $image_no_text = str_replace(' ', '+', $args['image_no_text']);
      $image_no_text = substr($image_no_text, strpos($image_no_text, ',') + 1);
      $image_no_text = base64_decode($image_no_text);
      $country = get_field( 'country', $petition_id );
      error_log( $country );
      $images = array(
        'image' => $image,
        'image_no_text' => $image_no_text,
      );
      //
      // ini_set ('error_reporting', E_ALL);
      // ini_set ('display_errors', '1');
      // error_reporting (E_ALL|E_STRICT);

      $db = mysqli_init();
      mysqli_options($db, MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, true);
      $db->ssl_set(GPPT_PLUGIN_ROOT_URI . 'cert/client-key.pem', GPPT_PLUGIN_ROOT_URI . 'cert/client-cert.pem', GPPT_PLUGIN_ROOT_URI . 'cert/server-ca.pem', NULL, NULL);
      $link = mysqli_real_connect($db, '35.228.154.201', 'leads_storage', '4$5GHY_78jh', 'LEADS_STORAGE', 3306, NULL, MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT);
      if ($link) {
        /*
        ID: "13"
        EMAIL: "kit@kitkline.co.uk"
        FIRST_NAME: "Kit"
        LAST_NAME: "Kline"
        DATE_SIGNED: "2020-04-17"
        CONSENT_EMAIL_GIVEN: "1"
        SOURCE: "FORESTS_CAMPAIGN"
        COUNTRY: "DK"
        MOBILE: "+44 123455678"
        UTM: "A UTM string"
        */
        $result = $db->query("INSERT INTO LEADS VALUES (null,'$email','$firstname','$lastname','$date',true,'PETITION_$petition_id','$country','$phone','$utm');");
        // $result = $db->query("SELECT * FROM LEADS;");
        // TODO: Store UTM, phone and countrycode
        $db->close();
        // return $result->fetch_object();
      }

      $upload_dir = wp_upload_dir();
      $hash = wp_generate_uuid4();
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
          'post_status' => 'inherit'
        );

        $attach_id = wp_insert_attachment( $attachment, $file );
        require_once( ABSPATH . 'wp-admin/includes/image.php' );
        $attach_data = wp_generate_attachment_metadata( $attach_id, $file );
        wp_update_attachment_metadata( $attach_id, $attach_data );
        update_post_meta( $attach_id, 'petition_id', $petition_id );
      }
      return true;
    } catch( Exception $e ) {
      return $e;
    }
  }

  public static function register_api_routes() {
    // Get Petition
    register_rest_route( "gppt/v1", '/answers', array(
      'methods' => 'GET',
      'callback' => __NAMESPACE__ . '\\GPPT_Answer_Controller::get',
    ) );

    // Set Petition
    register_rest_route( "gppt/v1", '/answers', array(
      'methods' => 'POST',
      'callback' => __NAMESPACE__ . '\\GPPT_Answer_Controller::set',
    ) );
  }
}
add_action( 'rest_api_init', __NAMESPACE__ . '\\GPPT_Answer_Controller::register_api_routes' );
