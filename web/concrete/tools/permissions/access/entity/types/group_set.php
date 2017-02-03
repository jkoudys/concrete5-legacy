<?php
if (Loader::helper('validation/token')->validate('process')) {
    $obj = new stdClass();
    $gs = GroupSet::getByID($_REQUEST['gsID']);
    if (is_object($gs)) {
        $pae = GroupSetPermissionAccessEntity::getOrCreate($gs);
        $obj->peID = $pae->getAccessEntityID();
        $obj->label = $pae->getAccessEntityLabel();
    }
    echo json_encode($obj);
}
