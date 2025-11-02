<?php

function core_theme_portal_enqueue_react_app()
{
    // Exit early in admin area (we only need React on the frontend)
    if (is_admin())
        return;

    // Get the current page template file name
    $template = get_page_template_slug(get_queried_object_id());

    // Only enqueue React app if the page uses the "portal.php" template
    if ($template === 'template-portal.php') {

        $theme_uri = get_template_directory_uri() . '/wp-next/next-build/_next/static/';
        $theme_dir = get_template_directory() . '/wp-next/';
        $build_dir = $theme_dir . 'next-build/_next/static/chunks/';

        // ✅ Enqueue all root-level JS chunks
        foreach (glob($build_dir . '*.js') as $file_path) {
            $file_name = basename($file_path);
            wp_enqueue_script(
                'next-chunk-' . $file_name,
                $theme_uri . 'chunks/' . $file_name,
                [],
                null,
                true
            );
        }

        // ✅ Enqueue app chunks (like app/page-xxxxx.js)
        $app_dir = $build_dir . 'app/';
        if (is_dir($app_dir)) {
            foreach (glob($app_dir . '*.js') as $file_path) {
                $file_name = basename($file_path);
                wp_enqueue_script(
                    'next-app-' . $file_name,
                    $theme_dir . '/wp-next/next-build/_next/static/chunks/app/' . $file_name,
                    [],
                    null,
                    true
                );
            }
        }

        // ✅ Optionally enqueue CSS (if exported)
        $css_dir = $theme_dir . '/wp-next/next-build/_next/static/css/app/';
        $css_path = get_template_directory() . '/wp-next/next-build/_next/static/css/app/';
        if (is_dir($css_path)) {
            foreach (glob($css_path . '*.css') as $file_path) {
                $file_name = basename($file_path);
                wp_enqueue_style(
                    'next-style-' . $file_name,
                    $css_dir . $file_name,
                    [],
                    null
                );
            }
        }
    }
}
add_action('wp_enqueue_scripts', 'core_theme_portal_enqueue_react_app');