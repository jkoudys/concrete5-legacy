<?php
$v = View::getInstance();
$c = $v->getCollectionObject();
if (is_object($c)) {
    $cp = new Permissions($c);
}

/**
 * Handle page title
 */
if (is_object($c)) {
    // We can set a title 3 ways:
    // 1. It comes through programmatically as $pageTitle. If this is the case then we pass it through, no questions asked
    // 2. It comes from meta title
    // 3. It comes from getCollectionName()
    // In the case of 3, we also pass it through page title format.

    $pageTitle = $pageTitle ?: $c->getCollectionAttributeValue('meta_title') ?: $c->getCollectionName();
    if ($c->isSystemPage()) {
        $pageTitle = t($pageTitle);
    }

    $escapedPageTitle = sprintf(PAGE_TITLE_FORMAT, SITE, h($pageTitle));

    $pageDescription = $pageDescription ?? $c->getCollectionDescription();
    $cID = $c->getCollectionID();
} else {
    $cID = 1;
}
?>
<meta http-equiv="content-type" content="text/html; charset=<?= APP_CHARSET ?>" />
<?php
if (is_object($c)) {
    $akd = $c->getCollectionAttributeValue('meta_description');
    $akk = $c->getCollectionAttributeValue('meta_keywords');
}
?>
<title><?= $escapedPageTitle ?></title>
<?php
if ($akd) { ?>
<meta name="description" content="<?= htmlspecialchars($akd, ENT_COMPAT, APP_CHARSET) ?>" />
<?php } else { ?>
<meta name="description" content="<?= htmlspecialchars($pageDescription, ENT_COMPAT, APP_CHARSET) ?>" />
<?php }
if ($akk) { ?>
<meta name="keywords" content="<?= htmlspecialchars($akk, ENT_COMPAT, APP_CHARSET) ?>" />
<?php }
if (is_object($c) && $c->getCollectionAttributeValue('exclude_search_index')) { ?>
    <meta name="robots" content="noindex" />
<?php } ?>
<?php
if (defined('APP_VERSION_DISPLAY_IN_HEADER') && APP_VERSION_DISPLAY_IN_HEADER) {
    echo '<meta name="generator" content="concrete5 - ' . APP_VERSION . '" />';
} else {
    echo '<meta name="generator" content="concrete5" />';
}

$u = new User();

$exports = [
    'CCM_EDIT_MODE' => $c->isEditMode(),
    'CCM_ARRANGE_MODE' => $c->isArrangeMode(),
    'CCM_DISPATCHER_FILENAME' => DIR_REL . '/' . DISPATCHER_FILENAME,
    'CCM_CID' => $cID ?? 0,
    'CCM_IMAGE_PATH' => ASSETS_URL_IMAGES,
    'CCM_TOOLS_PATH' => REL_DIR_FILES_TOOLS_REQUIRED,
    'CCM_BASE_URL' => BASE_URL,
    'CCM_REL' => DIR_REL,
];
?>
<script type="text/javascript">
Object.assign(window, <?= json_encode($exports) ?>);
</script>

<?php
$html = Loader::helper('html');
$v->addHeaderItem($html->css('ccm.base.css'), 'CORE');
$v->addHeaderItem($html->javascript('ccm.base.js', false), 'CORE');

$favIconFID=intval(Config::get('FAVICON_FID'));
$appleIconFID =intval(Config::get('IPHONE_HOME_SCREEN_THUMBNAIL_FID'));
$modernIconFID = intval(Config::get('MODERN_TILE_THUMBNAIL_FID'));
$modernIconBGColor = strval(Config::get('MODERN_TILE_THUMBNAIL_BGCOLOR'));

if ($favIconFID) {
    $f = File::getByID($favIconFID); ?>
    <link rel="shortcut icon" href="<?= $f->getRelativePath()?>" type="image/x-icon" />
    <link rel="icon" href="<?= $f->getRelativePath()?>" type="image/x-icon" />
<?php }

if ($appleIconFID) {
    $f = File::getByID($appleIconFID); ?>
    <link rel="apple-touch-icon" href="<?= $f->getRelativePath() ?>" />
<?php
}

if ($modernIconFID) {
    $f = File::getByID($modernIconFID);
    ?><meta name="msapplication-TileImage" content="<?= $f->getRelativePath() ?>" /><?php
    echo "\n";
    if (strlen($modernIconBGColor)) {
        ?><meta name="msapplication-TileColor" content="<?= $modernIconBGColor ?>" /><?php
        echo "\n";
    }
}

if (is_object($cp)) {
    if ($v->editingEnabled()) {
        Loader::element('page_controls_header', array('cp' => $cp, 'c' => $c));
    }

    if ($v->areLinksDisabled()) {
        $v->addHeaderItem('<script type="text/javascript">window.onload = function() {ccm_disableLinks()}</script>', 'CORE');
    }
}

echo $v->controller->outputHeaderItems();
$_trackingCodePosition = Config::get('SITE_TRACKING_CODE_POSITION');
if (empty($disableTrackingCode) && $_trackingCodePosition === 'top') {
    echo Config::get('SITE_TRACKING_CODE');
}
echo ( is_object($c) ) ? $c->getCollectionAttributeValue('header_extra_content') : '';
