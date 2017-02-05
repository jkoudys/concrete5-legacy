<?php defined('C5_EXECUTE') or die("Access Denied."); ?>

<?php
$records = WorkflowProgressHistory::getList($wp);
$dh = Loader::helper('date');
/* @var $dh DateHelper */
foreach ($records as $r) { ?>

    <div>
        <strong><?=$dh->formatDateTime($r->getWorkflowProgressHistoryTimestamp(), true, false)?></strong>.
        <?=$r->getWorkflowProgressHistoryDescription();?>
    </div>

<?php } ?>
