<?php
$u = new User();
$form = Loader::helper('form');
$fp = FilePermissions::getGlobal();

if (!$fp->canAccessFileManager()) {
    die(t("Unable to access the file manager."));
}

if ($_POST['task'] == 'duplicate_multiple_files') {
    $json['error'] = false;

    if (is_array($_POST['fID'])) {
        foreach ($_POST['fID'] as $fID) {
            $f = File::getByID($fID);
            $fp = new Permissions($f);
            if ($fp->canCopyFile()) {
                $nf = $f->duplicate();
                $json['fID'][] = $nf->getFileID();
            } else {
                $json['error'] = t('Unable to copy one or more files.');
            }
        }
    }
    echo json_encode($json);
    exit;
}


if (!is_array($_REQUEST['fID'])) {
    $obj = new stdClass;
    $obj->message = '';
    $obj->error = 0;

    $f = File::getByID($_REQUEST['fID']);
    $fp = new Permissions($f);
    if (!is_object($f) || $f->isError()) {
        $obj->error = 1;
        $obj->message = t('Invalid file.');
    } elseif (!$fp->canCopyFile()) {
        $obj->error = 1;
        $obj->message = t('You do not have the ability to copy this file.');
    }

    if (!$obj->error) {
        $nf = $f->duplicate();
        if (is_object($nf)) {
            $obj->fID = $nf->getFileID();
        }
    }

    echo json_encode($obj);
    exit;
} else {
    $files = array();

    foreach ($_REQUEST['fID'] as $fID) {
        $files[] = File::getByID($fID);
    }

    $fcnt = 0;
    foreach ($files as $f) {
        $fp = new Permissions($f);
        if ($fp->canCopyFile()) {
            $fcnt++;
        }
    }

    $searchInstance = Loader::helper('text')->entities($_REQUEST['searchInstance']);

    $dh = Loader::helper('date');
    /* @var $dh DateHelper */
    ?>

<div class="ccm-ui">

    <?php if ($fcnt == 0) { ?>
        <?=t("You do not have permission to copy any of the selected files."); ?>
    <?php } else { ?>
        <?=t('Are you sure you want to copy the following files?')?><br/><br/>

        <form id="ccm-<?=$searchInstance?>-duplicate-form" method="post" action="<?=REL_DIR_FILES_TOOLS_REQUIRED?>/files/duplicate">
        <?=$form->hidden('task', 'duplicate_multiple_files')?>
    <table border="0" cellspacing="0" cellpadding="0" width="100%" class="table table-bordered">

        <?php foreach ($files as $f) {
            $fp = new Permissions($f);
            if ($fp->canCopyFile()) {
                $fv = $f->getApprovedVersion();
                if (is_object($fv)) { ?>

                <?=$form->hidden('fID[]', $f->getFileID())?>

                <tr>
                    <td><?=$fv->getType()?></td>
                    <td class="ccm-file-list-filename" width="100%"><div style="width: 150px; word-wrap: break-word"><?=$fv->getTitle()?></div></td>
                    <td><?=$dh->formatSpecial('DASHBOARD_SEARCH_RESULTS_FILES', $f->getDateAdded())?></td>
                    <td><?=$fv->getSize()?></td>
                    <td><?=$fv->getAuthorName()?></td>
                </tr>

                <?php                                                                                                                                                                                                                                                                                                                                                                                                                                 }
            }
} ?>
        </table>
        </form>
        <?php $ih = Loader::helper('concrete/interface')?>
        <div class="dialog-buttons">
            <?=$ih->button_js(t('Copy'), 'ccm_alDuplicateFiles(\'' . $searchInstance . '\')', 'right', 'primary')?>
            <?=$ih->button_js(t('Cancel'), 'jQuery.fn.dialog.closeTop()', 'left')?>
        </div>



        <?php
}
}?>
</div>
