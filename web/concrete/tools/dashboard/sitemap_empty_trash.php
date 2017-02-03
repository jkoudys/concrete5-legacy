<?php
$pk = PermissionKey::getByHandle('empty_trash');
if (!$pk->validate()) {
    die(t("Access Denied."));
}

$trash = Page::getByPath(TRASH_PAGE_PATH);
$i = 0;
if (is_object($trash) && !$trash->isError()) {
    Loader::model('page_list');
    $pl = new PageList();
    $pl->filterByParentID($trash->getCollectionID());
    $pl->includeInactivePages();
    $pl->displayUnapprovedPages();
    $pages = $pl->get();
    foreach ($pages as $pc) {
        $cp = new Permissions($pc);
        if ($cp->canDeletePage()) {
            $i++;
            $pc->delete();
        }
    }
}

echo json_encode([
    'message' => t2('%d page deleted.', '%d pages deleted.', $i, $i)
]);
