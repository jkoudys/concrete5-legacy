<?php defined('C5_EXECUTE') or die("Access Denied.");

if (!defined('DIR_BASE')) {
	define('DIR_BASE', dirname(realpath($_SERVER['SCRIPT_FILENAME'])));
}

if (!defined('DIR_CONFIG_SITE')) {
	define('DIR_CONFIG_SITE', DIR_BASE . '/config');
}

if (!defined('DIRNAME_UPDATES')) {
	define('DIRNAME_UPDATES', 'updates');
}
