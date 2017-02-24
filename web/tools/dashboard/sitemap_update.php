<?php
$sh = Loader::helper('concrete/dashboard/sitemap');
if (!$sh->canRead()) {
    die(t('Access Denied'));
}

if (isset($_REQUEST['cID']) && is_array($_REQUEST['cID'])) {
    foreach ($_REQUEST['cID'] as $displayOrder => $cID) {
        $v = array($displayOrder, $cID);
        $c = Page::getByID($cID);
        $c->updateDisplayOrder($displayOrder, $cID);
    }
}

echo json_encode([
    'error' => false,
    'message' => t('Display order saved.'),
]);
