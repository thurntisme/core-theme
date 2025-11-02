<?php
/**
 * Template Name: Portal Page
 */
get_header();
?>

<div id="portal-app">
    <!-- React app will be mounted here -->
</div>

<?php get_footer(); ?>

<!-- Load built React assets -->
<script src="<?php echo get_template_directory_uri(); ?>/react-app/static/js/main.js"></script>
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/react-app/static/css/main.css" />