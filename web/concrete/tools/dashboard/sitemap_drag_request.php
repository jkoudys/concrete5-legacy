<?php
$sh = Loader::helper('concrete/dashboard/sitemap');
if (!$sh->canRead()) {
    die(t('Access Denied'));
}

Loader::model('collection_types');

$error = t("An unspecified error has occurred.");

$originalPages = array();
if (isset($_REQUEST['origCID']) && is_numeric($_REQUEST['origCID'])) {
    $originalPages[] = Page::getByID($_REQUEST['origCID']);
}

if (isset($_REQUEST['destCID']) && is_numeric($_REQUEST['destCID'])) {
    $dc = Page::getByID($_REQUEST['destCID']);
    $dcp = new Permissions($dc);
}
$u = new User();


$canReadSource = true;
$canAddSubContent = true;
$canMoveCopyTo = true;
$canCopyChildren = true;
$canMoveCopyPages = true;
if (isset($_REQUEST['origCID']) && strpos($_REQUEST['origCID'], ',') > -1) {
    $ocs = explode(',', $_REQUEST['origCID']);
    foreach ($ocs as $ocID) {
        $originalPages[] = Page::getByID($ocID);
    }
}

foreach ($originalPages as $oc) {
    $ocp = new Permissions($oc);
    if (!$ocp->canRead()) {
        $canReadSource = false;
    }
    if (!$ocp->canMoveOrCopyPage()) {
        $canMoveCopyPages = false;
    }
    $ct = CollectionType::getByID($oc->getCollectionTypeID());
    if (!$dcp->canAddSubpage($ct)) {
        $canAddSubContent = false;
    }
    if (!$oc->canMoveCopyTo($dc)) {
        $canMoveCopyTo = false;
    }
    if ((!$u->isSuperUser()) || ($oc->getCollectionPointerID() > 0)) {
        $canCopyChildren = false;
    }
}



$valt = Loader::helper('validation/token');

$json = array();
$json['error'] = false;
$json['message'] = false;

if (!$canReadSource) {
    $error = t("You cannot view the source page(s).");
} elseif (!$canMoveCopyPages) {
    $error = t("You cannot move or copy the source page(s).");
} elseif (!$canAddSubContent) {
    $error = t("You do not have sufficient privileges to add this page or these pages to this destination.");
} elseif (!$canMoveCopyTo) {
    $error = t("You may not move/copy/alias the chosen page(s) to that location.");
} else {
    $error = false;
}

if (!$error) {
    if ($_REQUEST['ctask']) {
        if ($valt->validate()) {
            switch ($_REQUEST['ctask']) {
                case "ALIAS":
                    foreach ($originalPages as $oc) {
                        $ncID = $oc->addCollectionAlias($dc);
                        $successMessage .= '"' . $oc->getCollectionName() . '" '.t('was successfully aliased beneath').' "' . $dc->getCollectionName() . '" ';
                        $newCID[] = $ncID;
                    }
                    break;
                case "COPY":
                    if ($_REQUEST['copyAll'] && $u->isSuperUser()) {
                        foreach ($originalPages as $oc) {
                            $nc2 = $oc->duplicateAll($dc); // new collection is passed back
                            if (is_object($nc2)) {
                                $successMessage .= '"' . $oc->getCollectionName() . '" '.t('and all its children were successfully copied beneath').' "' . $dc->getCollectionName() . '" ';
                            }
                        }
                    } else {
                        foreach ($originalPages as $oc) {
                            $nc2 = $oc->duplicate($dc);
                            if (is_object($nc2)) {
                                $successMessage .= '"' . $oc->getCollectionName() . '" '.t('was successfully copied beneath').' "' . $dc->getCollectionName() . '" ';
                            }
                        }
                    }
                    if (!is_object($nc2)) {
                        $error = t("An error occurred while attempting the copy operation.");
                    } else {
                        $newCID[] = $nc2->getCollectionID();
                    }
                    break;
                case "MOVE":
                    foreach ($originalPages as $oc) {
                        $ocp = new Permissions($oc);
                        $_SESSION['movePageSaveOldPagePath'] = $_REQUEST['saveOldPagePath'];
                        $pkr = new MovePagePageWorkflowRequest();
                        $pkr->setRequestedPage($oc);
                        $pkr->setRequestedTargetPage($dc);
                        $pkr->setSaveOldPagePath($_REQUEST['saveOldPagePath']);
                        $pkr->setRequesterUserID($u->getUserID());
                        $u->unloadCollectionEdit($oc);
                        $r = $pkr->trigger();
                        if ($r instanceof WorkflowProgressResponse) {
                            $successMessage .= '"' . $oc->getCollectionName() . '" '.t('was moved beneath').' "' . $dc->getCollectionName() . '." ';
                        } else {
                            $successMessage .= t("Your request to move \"%s\" beneath \"%s\" has been stored. Someone with approval rights will have to activate the change.\n", $oc->getCollectionName(), $dc->getCollectionName());
                        }
                    }
                    $newCID[] = $oc->getCollectionID();
                    break;
            }
        } else {
            $error = $valt->getErrorMessage();
        }
    }
}

if ($successMessage) {
    $json['error'] = false;
    $json['message'] = $successMessage;
    $json['cID'] = $newCID;
    $json['instance_id'] = $_REQUEST['instance_id'];
    echo json_encode($json);
    exit;
} elseif ($error) {
    if ($_REQUEST['ctask']) {
        $json['error'] = true;
        $json['message'] = $error;
        echo json_encode($json);
    } else {
        print '<div class="error">' . $error . '</div><div class="dialog-buttons"><a href="javascript:void(0)" onclick="$.fn.dialog.closeTop()" id="ccm-exit-drag-request" class="ccm-button-left btn">' . t('Cancel') . '</a></div>';
    }
    exit;
}

?>

<div class="ccm-ui">

<h3>
<?php if (count($originalPages) > 1) { ?>
    <?=t('What do you wish to do?')?>
<?php } else { ?>
    <?=t('You dragged "%s" onto "%s." What do you wish to do?', $oc->getCollectionName(), $dc->getCollectionName())?>
<?php } ?>
</h3><br/>
    <form>

        <input type="hidden" name="origCID" id="origCID" value="<?=h($_REQUEST['origCID'])?>" />
        <input type="hidden" name="destParentID" id="destParentID" value="<?=$dc->getCollectionParentID()?>" />
        <input type="hidden" name="destCID" id="destCID" value="<?=h($_REQUEST['destCID'])?>" />
        <input type="hidden" name="instance_id" id="instance_id" value="<?=h($_REQUEST['instance_id'])?>" />
        <input type="hidden" name="select_mode" id="select_mode" value="<?=h($_REQUEST['select_mode'])?>" />
        <input type="hidden" name="display_mode" id="display_mode" value="<?=h($_REQUEST['display_mode'])?>" />

        <input type="radio" checked style="vertical-align: middle" id="ctaskMove" name="ctask" value="MOVE" onclick="toggleMove()" />
        <strong><?=t('Move')?></strong> <?php if (count($originalPages) == 1) {
?>"<?=$oc->getCollectionName()?>"<?php
} ?> <?=t('beneath')?> "<?=$dc->getCollectionName()?>"
        <div style="margin: 4px 0px 0px 20px">
        <input type="checkbox" id="saveOldPagePath" name="saveOldPagePath" value="1" style="vertical-align: middle" <?php if (isset($_SESSION['movePageSaveOldPagePath']) && $_SESSION['movePageSaveOldPagePath']) {
?> checked="checked" <?php
} ?> /> <?=t('Save old page path')?>
        </div>
        <br/>

        <?php if ($oc->getCollectionPointerID() < 1) { ?>
        <input type="radio" style="vertical-align: middle" id="ctaskAlias" name="ctask" value="ALIAS" onclick="toggleAlias()" />
        <strong><?=t('Alias')?></strong> <?php if (count($originalPages) == 1) {
?>"<?=$oc->getCollectionName()?>"<?php
} ?> <?=t('beneath')?> "<?=$dc->getCollectionName()?>" - <?=t('Pages appear in both locations; all edits to originals will be reflected in their alias.')?>
        <br/><br/>
        <?php } ?>

        <input type="radio" style="vertical-align: middle" id="ctaskCopy" name="ctask" value="COPY" onclick="toggleCopy()" />
        <strong><?=t('Copy')?></strong> <?php if (count($originalPages) == 1) {
?>"<?=$oc->getCollectionName()?>"<?php
} ?> <?=t('beneath')?> "<?=$dc->getCollectionName()?>"
        <div style="margin: 4px 0px 0px 20px">
        <?php if ($canCopyChildren) { ?>
            <input type="radio" id="copyThisPage" name="copyAll" value="0" style="vertical-align: middle" disabled /> <?=t('Copy page.')?><br/>
            <input type="radio" id="copyChildren" name="copyAll" value="1" style="vertical-align: middle" disabled /> <?=t('Copy page + children.')?>
        <?php } else { ?>
            <?=t('Your copy operation will only affect the current page - not any children.')?>
        <?php } ?>
        </div>

        <br/>

    <div class="dialog-buttons">
    <?php if ($_REQUEST['sitemap_mode'] == 'move_copy_delete') { ?>
        <a href="javascript:void(0)" onclick="$.fn.dialog.closeTop()" id="ccm-exit-drag-request" title="<?=t('Choose Page')?>" class="ccm-button-left btn"><?=t('Cancel')?></a>
    <?php } else { ?>
        <a href="javascript:void(0)" onclick="showBranch(<?=$oc->getCollectionID()?>);$.fn.dialog.closeTop()" class="ccm-button-left btn"><?=t('Cancel')?></a>
    <?php } ?>
    <a href="javascript:void(0)" onclick="moveCopyAliasNode(<?php if ($_REQUEST['select_mode'] == 'move_copy_delete') {
?>true<?php
} ?>)" class="ccm-button-right btn primary"><span><?=t('Go')?></span></a>
    </div>

    <div class="ccm-spacer">&nbsp;</div>
    </form>

</div>
