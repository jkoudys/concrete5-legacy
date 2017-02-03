<?php
if ($_REQUEST['task'] === 'copy_permission_set' && Loader::helper("validation/token")->validate('copy_permission_set')) {
    $ps = new PermissionSet();
    $ps->setPermissionKeyCategory($_POST['pkCategoryHandle']);
    foreach ($_POST['pkID'] as $pkID => $paID) {
        $ps->addPermissionAssignment($pkID, $paID);
    }
    $ps->saveToSession();
    $r = new stdClass;
    $r->success = 1;
    echo json_encode($r);
}

if ($_REQUEST['task'] == 'paste_permission_set' && Loader::helper("validation/token")->validate('paste_permission_set')) {
    $ps = PermissionSet::getSavedPermissionSetFromSession();
    $r = array();
    if (is_object($ps) && $ps->getPermissionKeyCategory() == $_POST['pkCategoryHandle']) {
        $permissions = $ps->getPermissionAssignments();
        foreach ($permissions as $pkID => $paID) {
            $obj = new stdClass;
            $obj->pkID = $pkID;
            $obj->paID = $paID;

            $pk = PermissionKey::getByID($pkID);
            $pa = PermissionAccess::getByID($paID, $pk);
            ob_start();
            Loader::element('permission/labels', array('pk' => $pk, 'pa' => $pa));
            $html = ob_get_contents();
            ob_end_clean();
            $obj->html = $html;
            $r[] = $obj;
        }
        echo json_encode($r);
    }
}
