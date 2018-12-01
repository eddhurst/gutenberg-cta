<?php
/**
 * Plugin Name: Gutenberg - CTA Block
 * Description: A standalone CTA Block for Gutenberg.
 * Author: eddhurst
 * Author URI: https://eddhurst.co.uk
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
