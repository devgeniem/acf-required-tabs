<?php
/**
 * Plugin Name: ACF Required Tabs
 * Plugin URI: https://github.com/devgeniem/acf-required-tabs
 * Description: An Advanced Custom Fields plugin that adds an indicator for tabs that contain unfilled required fields.
 * Version: 1.0.4
 * Author: Geniem Oy / Miika Arponen
 * Author URI: http://www.geniem.com
 */

/**
 * Class RequiredTabs
 */
class RequiredTabs {

    /**
     * Holds the plugin version.
     *
     * @var string
     */
    protected $version = '';

    /**
     * Holds plugin scripts dependencies.
     *
     * @var array
     */
    protected $dependencies = [];

    /**
     * Initalize the plugin and enqueue the script
     *
     * @return  void
     */
    public function __construct() {

        // Get plugin data for scripts and styles versions.
        $plugin_data = get_plugin_data( __FILE__ );
        $this->version = $plugin_data['Version'];

        // Filter dependencies in case you for example provide jQuery separately from the WordPress system
        $this->dependencies = apply_filters( 'acf/required_tabs/dependencies', [ 'jquery' ] );

        add_action( 'admin_enqueue_scripts', [ $this, 'required_tabs_scripts_and_styles' ] );
    }

    /**
     * Required tabs scripts and styles.
     *
     * @return void
     */
    public function required_tabs_scripts_and_styles() {
        wp_enqueue_style( 'acf_required_tabs', trailingslashit( plugin_dir_url( __FILE__ ) ) . 'assets/dist/main.css', [], $this->version, 'all' );
        wp_enqueue_script( 'acf_required_tabs', trailingslashit( plugin_dir_url( __FILE__ ) ) . 'assets/dist/main.js', $this->dependencies, $this->version, false );
    }
}

new RequiredTabs();
