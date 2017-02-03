<?php
$valt = Loader::helper('validation/token');
if ($valt->validate('quick_user_select_' . $_REQUEST['key'], $_REQUEST['token'])) {
    $u = new User();
    Loader::model('user_list');
    $db = Loader::db();
    $userList = new UserList();
    if ($_GET['term'] != '') {
        $term = $db->quote($_GET['term'].'%');
        $userList->filter(false, '( u.uName LIKE ' . $term . ')');
    }
    $userList->sortBy('uName', 'ASC');

    echo json_encode(array_map(
        function ($ui) {
            return $ui->getUserName();
        },
        $userList->get(7)
    ));
}
