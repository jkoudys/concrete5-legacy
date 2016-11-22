<?php defined('C5_EXECUTE') or die("Access Denied."); ?>

<?php if (isset($key)) { ?>

<?=Loader::helper('concrete/dashboard')->getDashboardPaneHeaderWrapper(t('Edit Attribute'), false, false, false)?>
<form method="post" action="<?=$this->action('edit')?>" id="ccm-attribute-key-form">



<?php Loader::element("attribute/type_form_required", array('category' => $category, 'type' => $type, 'key' => $key)); ?>

</form>

<?=Loader::helper('concrete/dashboard')->getDashboardPaneFooterWrapper(false);?>




<?php } elseif ($this->controller->getTask() == 'select_type' || $this->controller->getTask() == 'add' || $this->controller->getTask() == 'edit') { ?>

    <?=Loader::helper('concrete/dashboard')->getDashboardPaneHeaderWrapper(t('User Attributes'), false, false, false)?>

    <?php if (isset($type)) { ?>
        <form method="post" action="<?=$this->action('add')?>" id="ccm-attribute-key-form">

        <?php Loader::element("attribute/type_form_required", array('category' => $category, 'type' => $type)); ?>

        </form>
    <?php } ?>

    <?=Loader::helper('concrete/dashboard')->getDashboardPaneFooterWrapper(false);?>



<?php } else { ?>

    <?=Loader::helper('concrete/dashboard')->getDashboardPaneHeaderWrapper(t('User Attributes'), false, false, false)?>

    <?php
    $attribs = UserAttributeKey::getList();
    Loader::element('dashboard/attributes_table', array('category' => $category, 'attribs'=> $attribs, 'editURL' => '/dashboard/users/attributes')); ?>


    <div class="ccm-pane-body ccm-pane-body-footer" style="margin-top: -25px">

    <form method="get" class="form-stacked inline-form-fix" action="<?=$this->action('select_type')?>" id="ccm-attribute-type-form">
    <div class="clearfix">
    <?=$form->label('atID', t('Add Attribute'))?>
    <div class="input">

    <?=$form->select('atID', $types)?>
    <?=$form->submit('submit', t('Add'))?>

    </div>
    </div>

    </form>

    </div>

    <?=Loader::helper('concrete/dashboard')->getDashboardPaneFooterWrapper(false);?>

<?php } ?>

<script type="text/javascript">
$(function() {
    $("div.ccm-attributes-list").sortable({
        handle: 'img.ccm-attribute-icon',
        cursor: 'move',
        opacity: 0.5,
        stop: function() {
            var ualist = $(this).sortable('serialize');
            $.post('<?=REL_DIR_FILES_TOOLS_REQUIRED?>/dashboard/user_attributes_update.php', ualist, function(r) {

            });
        }
    });
});

</script>

<style type="text/css">
div.ccm-attributes-list img.ccm-attribute-icon:hover {cursor: move}
</style>
