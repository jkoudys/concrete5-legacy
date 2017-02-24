<?php
if (Loader::helper('validation/token')->validate('process')) {
    $obj = new stdClass;
    $pae = FileUploaderPermissionAccessEntity::getOrCreate();
    $obj->peID = $pae->getAccessEntityID();
    $obj->label = $pae->getAccessEntityLabel();
    echo json_encode($obj);
}
