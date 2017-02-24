<?php
session_write_close();

if ($_REQUEST['q']) {
    session_write_close();
    $r = Loader::helper("file")->getContents(MENU_HELP_SERVICE_URL . '?q=' . $_REQUEST['q']);
    if ($r) {
        echo $r;
    } else {
        echo json_encode([]);
    }
    exit;
}
