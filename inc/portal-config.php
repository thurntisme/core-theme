<?php

function core_theme_portal_enqueue_react_app()
{
    // Exit early in admin area (we only need React on the frontend)
    if (is_admin())
        return;

    // Get the current page template file name
    $template = get_page_template_slug(get_queried_object_id());

    // Only enqueue React app if the page uses the "template-portal.php" template
    if ($template === 'template-portal.php') {
        $theme_dir = get_template_directory_uri() . '/frontend/dist/';
        $manifest_path = get_template_directory() . '/frontend/dist/.vite/manifest.json';

        if (!file_exists($manifest_path))
            return;

        $manifest = json_decode(file_get_contents($manifest_path), true);
        $js_file = $manifest['index.html']['file'];
        $css_files = $manifest['index.html']['css'] ?? [];

        // Enqueue CSS
        foreach ($css_files as $css) {
            wp_enqueue_style(
                'mytheme-react-app-' . $css,
                $theme_dir . $css,
                array(),
                null
            );
        }

        // Enqueue JS
        wp_enqueue_script(
            'mytheme-react-app',
            $theme_dir . $js_file,
            array(),
            null,
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'core_theme_portal_enqueue_react_app');