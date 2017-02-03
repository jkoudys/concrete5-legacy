<?php
$valt = Loader::helper('validation/token');
if ($valt->validate('quick_page_select_' . $_REQUEST['key'], $_REQUEST['token'])) {
    $u = new User();
    Loader::model('page_list');
    $db = Loader::db();
    $pl = new PageList();
    if ($_GET['term'] != '') {
        $pl->filterByName($_GET['term']);
    }

    echo json_encode(array_map(
        function ($c) {
            return [
                'label' => $c->getCollectionName(),
                'value' => $c->getCollectionID(),
            ];
        },
        (array) $pl->getPage()
    ));
}
