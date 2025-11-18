<?php
/**
 * Plugin Name: Media Manager Tutorial
 * Description: A custom media management interface using DataViews and DataForm
 * Version: 1.0.0
 * Requires at least: 6.5
 *
 * @package media-manager-tutorial
 */

defined( 'ABSPATH' ) || exit;

add_action( 'admin_menu', 'mmt_add_admin_menu' );

/**
 * Add admin menu
 *
 * @return void
 */
function mmt_add_admin_menu() {
	add_media_page(
		__( 'Media Manager', 'media-manager-tutorial' ),
		__( 'Media Manager', 'media-manager-tutorial' ),
		'upload_files',
		'media-manager-tutorial',
		function () {
			echo '<div id="media-manager-root"></div>';
		}
	);
}

/**
 * Enqueue assets
 *
 * @param string $hook_suffix Admin page hook suffix.
 * @return void
 */
add_action( 'admin_enqueue_scripts', 'mmt_enqueue_assets' );

/**
 * Enqueue assets
 *
 * @param string $hook_suffix Admin page hook suffix.
 * @return void
 */
function mmt_enqueue_assets( $hook_suffix ) {
	if ( 'media_page_media-manager-tutorial' !== $hook_suffix ) {
		return;
	}

	$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	wp_enqueue_script(
		'media-manager-tutorial',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_enqueue_style(
		'media-manager-tutorial',
		plugin_dir_url( __FILE__ ) . 'build/style-index.css',
		array( 'wp-components' ),
		$asset['version']
	);

	// Add REST API nonce for authentication.
	wp_localize_script(
		'media-manager-tutorial',
		'mediaManagerData',
		array(
			'apiUrl' => home_url( '/wp-json' ),
			'nonce'  => wp_create_nonce( 'wp_rest' ),
		)
	);
}
