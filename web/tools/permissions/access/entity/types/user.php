<?php
if (Loader::helper('validation/token')->validate('process')) {
    $obj = new stdClass();
    $ui = UserInfo::getByID($_REQUEST['uID']);
    if (is_object($ui)) {
        $pae = UserPermissionAccessEntity::getOrCreate($ui);
        $obj->peID = $pae->getAccessEntityID();
        $obj->label = $pae->getAccessEntityLabel();
    }
    echo json_encode($obj);
}
