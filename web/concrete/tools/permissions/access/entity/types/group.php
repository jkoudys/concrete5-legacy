<?php
if (Loader::helper('validation/token')->validate('process')) {
    $obj = new stdClass;
    $g = Group::getByID($_REQUEST['gID']);
    if (is_object($g)) {
        $pae = GroupPermissionAccessEntity::getOrCreate($g);
        $obj->peID = $pae->getAccessEntityID();
        $obj->label = $pae->getAccessEntityLabel();
    }
    echo json_encode($obj);
}
