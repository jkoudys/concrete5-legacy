<?php defined('C5_EXECUTE') or die("Access Denied."); ?>

<?php $included = $permissionAccess->getAccessListItems(PermissionKey::ACCESS_TYPE_INCLUDE); ?>
<?php $excluded = $permissionAccess->getAccessListItems(PermissionKey::ACCESS_TYPE_EXCLUDE); ?>
<?php $btl = new BlockTypeList();
$blockTypes = $btl->getBlockTypeList();
?>
<?php $form = Loader::helper('form'); ?>

<?php if (count($included) > 0 || count($excluded) > 0) { ?>

<?php if (count($included) > 0) { ?>

<h3><?=t('Who can add what?')?></h3>

<?php foreach ($included as $assignment) {
    $entity = $assignment->getAccessEntityObject();
?>


<div class="clearfix">
    <label><?=$entity->getAccessEntityLabel()?></label>
    <div class="input">
    <?=$form->select('blockTypesIncluded[' . $entity->getAccessEntityID() . ']', array('A' => t('All Block Types'), 'C' => t('Custom')), $assignment->getBlockTypesAllowedPermission())?><br/><br/>
    <ul class="inputs-list" <?php if ($assignment->getBlockTypesAllowedPermission() != 'C') {
?>style="display: none"<?php
} ?>>
        <?php foreach ($blockTypes as $bt) { ?>
            <li><label><input type="checkbox" name="btIDInclude[<?=$entity->getAccessEntityID()?>][]" value="<?=$bt->getBlockTypeID()?>" <?php if (in_array($bt->getBlockTypeID(), $assignment->getBlockTypesAllowedArray())) {
?> checked="checked" <?php
} ?> /> <span><?=t($bt->getBlockTypeName())?></span></label></li>
        <?php } ?>
    </ul>
    </div>
</div>

<?php }
} ?>


<?php if (count($excluded) > 0) { ?>

<h3><?=t('Who can\'t add what?')?></h3>

<?php foreach ($excluded as $assignment) {
    $entity = $assignment->getAccessEntityObject();
?>


<div class="clearfix">
    <label><?=$entity->getAccessEntityLabel()?></label>
    <div class="input">
    <?=$form->select('blockTypesExcluded[' . $entity->getAccessEntityID() . ']', array('N' => t('No Block Types'), 'C' => t('Custom')), $assignment->getBlockTypesAllowedPermission())?><br/><br/>
    <ul class="inputs-list" <?php if ($assignment->getBlockTypesAllowedPermission() != 'C') {
?>style="display: none"<?php
} ?>>
        <?php foreach ($blockTypes as $bt) { ?>
            <li><label><input type="checkbox" name="btIDExclude[<?=$entity->getAccessEntityID()?>][]" value="<?=$bt->getBlockTypeID()?>" <?php if (in_array($bt->getBlockTypeID(), $assignment->getBlockTypesAllowedArray())) {
?> checked="checked" <?php
} ?> /> <span><?=t($bt->getBlockTypeName())?></span></label></li>
        <?php } ?>
    </ul>
    </div>
</div>



<?php }
} ?>

<?php } else {  ?>
    <p><?=t('No users or groups selected.')?></p>
<?php } ?>

<script type="text/javascript">
$(function() {
    $("#ccm-tab-content-custom-options select").change(function() {
        if ($(this).val() == 'C') {
            $(this).parent().find('ul.inputs-list').show();
        } else {
            $(this).parent().find('ul.inputs-list').hide();
        }
    });
});
</script>
