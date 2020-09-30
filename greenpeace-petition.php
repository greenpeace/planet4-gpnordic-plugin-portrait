<?php
/**
 * Plugin Name: Greenpeace - Petition
 * Description: Petitions with device camera for attaching a photo.
 * Plugin URI:
 * Version: 1.1.6
 * Php Version: 7.0
 *
 * Author: Simma Lugnt
 * Author URI: https://simmalugnt.se
 * Text Domain: greenpeace-petition
 *
 * License:     GPLv3
 * Copyright (C) 2017 Simma Lugnt
 *
 * @package GPPT
 */

/**
 * Followed WordPress plugins best practices from https://developer.wordpress.org/plugins/the-basics/best-practices/
 * Followed WordPress-Core coding standards https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/
 * Followed WordPress-VIP coding standards https://vip.wordpress.com/documentation/code-review-what-we-look-for/
 * Added namespacing and PSR-4 auto-loading.
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) or die( 'Direct access is forbidden!' );

if ( ! defined( 'GPPT_PLUGIN_ROOT_FILE' ) ) {
	define( 'GPPT_PLUGIN_ROOT_FILE', __FILE__ );
}
if ( ! defined( 'GPPT_PLUGIN_ROOT' ) ) {
	define( 'GPPT_PLUGIN_ROOT', plugin_dir_url( __FILE__ ) );
}
if ( ! defined( 'GPPT_PLUGIN_ROOT_URI' ) ) {
	define( 'GPPT_PLUGIN_ROOT_URI', plugin_dir_path( __FILE__ ) );
}


$roots_includes = array(
	// 'lib/blocks/class-base-block.php',
	// 'lib/blocks/class-petition-block.php',
	'lib/acf.php',
	'lib/options.php',
	'lib/controllers/answer-controller.php',
	'lib/controllers/image-controller.php',
	'lib/controllers/petition-controller.php',
	'lib/post-types/petition.php',
);

foreach ($roots_includes as $file) {
  require_once $file;
}
unset($file, $filepath);
