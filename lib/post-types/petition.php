<?php
namespace GPPT;

// Create post type
function create_petition_post_type() {
  register_post_type(
    'petition',
    array(
      'labels' => array(
        'name' => __( 'Rich Engagement' ),
        'singular_name' => __( 'Petition' )
      ),
      'public' => true,
      'has_archive' => true,
      'supports' => array('title', 'editor', 'thumbnail'),
      'menu_icon' => 'dashicons-welcome-write-blog',
    )
  );
}
add_action( 'init', __NAMESPACE__ . '\\create_petition_post_type' );
