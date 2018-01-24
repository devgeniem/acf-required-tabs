<?php
/**
 * Plugin Name: ACF Required Tabs
 * Plugin URI: https://github.com/devgeniem/acf-required-tabs
 * Description: An Advanced Custom Fields plugin that adds an indicator for tabs that contain unfilled required fields.
 * Version: 1.0.0
 * Author: Geniem Oy / Miika Arponen
 * Author URI: http://www.geniem.com
 */
class RequiredTabs {

    /**
     * Initalize the plugin and enqueue the script
     *
     * @return  void
     */
    public function __construct() {
        // Only on the admin side
        if ( is_admin() ) {
            $plugin_data = get_file_data( __FILE__, [ 'Version' => 'Version' ], 'plugin' );

            $version = $plugin_data['Version'];

            // Filter dependencies in case you for example provide jQuery separately from the WordPress system
            $dependencies = apply_filters( 'acf/required_tabs/dependencies', [ 'jquery' ] );

            wp_enqueue_script( 'acf_required_tabs', trailingslashit( plugin_dir_url( __FILE__ ) ) . 'assets/dist/main.js', $dependencies, $version, false );

            wp_enqueue_style( 'acf_required_tabs', trailingslashit( plugin_dir_url( __FILE__ ) ) . 'assets/dist/main.css', [], $version, 'all' );
        }
    }
}

new RequiredTabs();
