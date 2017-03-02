<?php
require_once __DIR__ . '/autoload.php';

$cdir = dirname(__FILE__);
## This constant ensures that we're operating inside dispatcher.php. There is a LATER check to ensure that dispatcher.php is being called correctly. ##
if (!defined("C5_EXECUTE")) {
    define('C5_EXECUTE', true);
}

if (!defined('C5_RUNTIME_HASH')) {
    define('C5_RUNTIME_HASH', md5(uniqid()));
}

if (defined("E_DEPRECATED")) {
    error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED); // E_DEPRECATED required for php 5.3.0 because of depreciated function calls in 3rd party libs (adodb).
} else {
    error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT);
}

## Startup check ##
require $cdir . '/config/base_pre.php';

## Startup check ##
require $cdir . '/startup/config_check.php';

## Load the base config file ##
require $cdir . '/config/base.php';

## Required Loading
require $cdir . '/startup/required.php';

## Autoload core classes
spl_autoload_register(array('Loader', 'autoloadCore'), true);

## Autoload settings
require $cdir . '/startup/autoload.php';

if (file_exists(DIR_CONFIG_SITE . '/site_post_autoload.php')) {
    require DIR_CONFIG_SITE . '/site_post_autoload.php';
}

## Exception handler
require $cdir . '/startup/exceptions.php';

## Set default permissions for new files and directories ##
require $cdir . '/startup/file_permission_config.php';

## Startup check, install ##
require $cdir . '/startup/magic_quotes_gpc_check.php';

## Default routes for various content items ##
require $cdir . '/config/theme_paths.php';

## Load session handlers
## Must come before full page caching
require $cdir . '/startup/session.php';

## Check host for redirection ##
require $cdir . '/startup/url_check.php';

## Early loading full page cache
if (!$config_check_failed) {
    require $cdir . '/startup/check_page_cache.php';
}

## Setup timezone support
require $cdir . '/startup/timezone.php'; // must be included before any date related functions are called (php 5.3 +)

## First we ensure that dispatcher is not being called directly
require $cdir . '/startup/file_access_check.php';

require $cdir . '/startup/localization.php';

## Load the database ##
Loader::database();

## User level config ##
if (!$config_check_failed) {
    require $cdir . '/config/app.php';
}

## Startup check ##
require $cdir . '/startup/encoding_check.php';

## Security helpers
require $cdir . '/startup/security.php';

# Startup check, install ##
require $cdir . '/startup/config_check_complete.php';

## Determines whether we can use the more efficient permission local caching
require $cdir . '/startup/permission_cache_check.php';

## Localization ##
## This MUST be run before packages start - since they check ACTIVE_LOCALE which is defined here ##
require $cdir . '/config/localization.php';

## File types ##
## Note: these have to come after config/localization.php ##
require $cdir . '/config/file_types.php';

## Package events
require $cdir . '/startup/packages.php';

# Not sure why this said it had to come in front of startup/packages - but that causes a problem when a package
# defines autoload classes like for permissions and then has to act on permissions in upgrade. It can't find the classes
require $cdir . '/startup/tools_upgrade_check.php';

## Load permissions and attributes
PermissionKey::loadAll();

## Set debug-related and logging activities
require $cdir . '/startup/debug_logging.php';

## Site-level config POST user/app config ##
if (file_exists(DIR_CONFIG_SITE . '/site_post.php')) {
    require DIR_CONFIG_SITE . '/site_post.php';
}

## Site-level config POST user/app config - managed by c5, do NOT add your own stuff here ##
if (file_exists(DIR_CONFIG_SITE . '/site_post_restricted.php')) {
    require DIR_CONFIG_SITE . '/site_post_restricted.php';
}

## Specific site routes for various content items (if they exist) ##
if (file_exists(DIR_CONFIG_SITE . '/site_theme_paths.php')) {
    @include(DIR_CONFIG_SITE . '/site_theme_paths.php');
}

## Specific site routes for various content items (if they exist) ##
if (file_exists(DIR_CONFIG_SITE . '/site_file_types.php')) {
    @include(DIR_CONFIG_SITE . '/site_file_types.php');
}

## Add additional core menu options
require $cdir . '/startup/optional_menu_buttons.php';

# site events - we have to include before tools
if (defined('ENABLE_APPLICATION_EVENTS') && ENABLE_APPLICATION_EVENTS == true &&  file_exists(DIR_CONFIG_SITE . '/site_events.php')) {
    @include(DIR_CONFIG_SITE . '/site_events.php');
}

// Now we check to see if we're including CSS, Javascript, etc...
// Include Tools. Format: index.php?task=include_frontend&fType=TOOL&filename=test.php
require $cdir . '/startup/tools.php';

## Check online, user-related startup routines
require $cdir . '/startup/user.php';
