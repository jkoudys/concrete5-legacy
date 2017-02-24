<?php

function getAttributeOptionHTML($v){
	if ($v == 'TEMPLATE') {
		$akSelectValueID = 'TEMPLATE_CLEAN';
		$akSelectValue = 'TEMPLATE';
	} else {
		if ($v->getSelectAttributeOptionTemporaryID() != false) {
			$akSelectValueID = $v->getSelectAttributeOptionTemporaryID();
		} else {
			$akSelectValueID = $v->getSelectAttributeOptionID();
		}
		$akSelectValue = $v->getSelectAttributeOptionValue();
	}
		?>
		<div id="akSelectValueDisplay_<?=$akSelectValueID?>" >
			<div class="rightCol">
				<input class="btn" type="button" onClick="ccmAttributesHelper.editValue('<?=addslashes($akSelectValueID)?>')" value="<?=t('Edit')?>" />
				<input class="btn" type="button" onClick="ccmAttributesHelper.deleteValue('<?=addslashes($akSelectValueID)?>')" value="<?=t('Delete')?>" />
			</div>
			<span onClick="ccmAttributesHelper.editValue('<?=addslashes($akSelectValueID)?>')" id="akSelectValueStatic_<?=$akSelectValueID?>" class="leftCol ccm-select-option-value"><?=$akSelectValue ?></span>
		</div>
		<div id="akSelectValueEdit_<?=$akSelectValueID?>" style="display:none">
			<span class="leftCol">
				<input name="akSelectValueOriginal_<?=$akSelectValueID?>" type="hidden" value="<?=$akSelectValue?>" />
				<?php if (is_object($v) && $v->getSelectAttributeOptionTemporaryID() == false) { ?>
					<input id="akSelectValueExistingOption_<?=$akSelectValueID?>" name="akSelectValueExistingOption_<?=$akSelectValueID?>" type="hidden" value="<?=$akSelectValueID?>" />
				<?php } else { ?>
					<input id="akSelectValueNewOption_<?=$akSelectValueID?>" name="akSelectValueNewOption_<?=$akSelectValueID?>" type="hidden" value="<?=$akSelectValueID?>" />
				<?php } ?>
				<input id="akSelectValueField_<?php echo $akSelectValueID?>" onkeypress="ccmAttributesHelper.keydownHandler(event);" class="akSelectValueField" data-select-value-id="<?php echo $akSelectValueID; ?>" name="akSelectValue_<?php echo $akSelectValueID?>" type="text" value="<?php echo $akSelectValue?>" size="20" />
			</span>
			<div class="rightCol">
				<input class="btn" type="button" onClick="ccmAttributesHelper.editValue('<?=addslashes($akSelectValueID)?>')" value="<?=t('Cancel')?>" />
				<input class="btn" type="button" onClick="ccmAttributesHelper.changeValue('<?=addslashes($akSelectValueID)?>')" value="<?=t('Save')?>" />
			</div>
		</div>
		<div class="ccm-spacer">&nbsp;</div>
<?php } ?>

<fieldset>
<legend><?=t('Select Options')?></legend>

<div class="clearfix">
<label><?=t("Multiple Values")?></label>
<div class="input">
<ul class="inputs-list">
<li><label><?=$form->checkbox('akSelectAllowMultipleValues', 1, $akSelectAllowMultipleValues)?> <span><?=t('Allow multiple options to be chosen.')?></span></label></li>
</ul>
</div>
</div>

<div class="clearfix">
<label><?=t("User Submissions")?></label>
<div class="input">
<ul class="inputs-list">
<li><label><?=$form->checkbox('akSelectAllowOtherValues', 1, $akSelectAllowOtherValues)?> <span><?=t('Allow users to add to this list.')?></span></label></li>
</ul>
</div>
</div>

<div class="clearfix">
<label for="akSelectOptionDisplayOrder"><?=t("Option Order")?></label>
<div class="input">
	<?php
	$displayOrderOptions = array(
		'display_asc' => t('Display Order'),
		'alpha_asc' => t('Alphabetical'),
		'popularity_desc' => t('Most Popular First')
	);
	?>

	<?=$form->select('akSelectOptionDisplayOrder', $displayOrderOptions, $akSelectOptionDisplayOrder)?>
</div>
</div>

<div class="clearfix">
<label><?=t('Values')?></label>
<div class="input">
	<div id="attributeValuesInterface">
	<div id="attributeValuesWrap">
	<?php
	Loader::helper('text');
	foreach($akSelectValues as $v) {
		if ($v->getSelectAttributeOptionTemporaryID() != false) {
			$akSelectValueID = $v->getSelectAttributeOptionTemporaryID();
		} else {
			$akSelectValueID = $v->getSelectAttributeOptionID();
		}
		?>
		<div id="akSelectValueWrap_<?=$akSelectValueID?>" class="akSelectValueWrap <?php if ($akSelectOptionDisplayOrder == 'display_asc') { ?> akSelectValueWrapSortable <?php } ?>">
			<?=getAttributeOptionHTML( $v )?>
		</div>
	<?php } ?>
	</div>

	<div id="akSelectValueWrapTemplate" class="akSelectValueWrap" style="display:none">
		<?=getAttributeOptionHTML('TEMPLATE') ?>
	</div>

	<div id="addAttributeValueWrap">
		<input id="akSelectValueFieldNew" name="akSelectValueNew" type="text" value="<?=$defaultNewOptionNm ?>" size="40" class="faint"
		onfocus="ccmAttributesHelper.clrInitTxt(this,'<?=$defaultNewOptionNm ?>','faint',0)"
		onblur="ccmAttributesHelper.clrInitTxt(this,'<?=$defaultNewOptionNm ?>','faint',1)"
		onkeypress="ccmAttributesHelper.keydownHandler(event);"
		 />
		<input class="btn" type="button" onClick="ccmAttributesHelper.saveNewOption(); $('#ccm-attribute-key-form').unbind()" value="<?=t('Add') ?>" />
	</div>
	</div>

</div>
</div>


</fieldset>
<?php if ($akSelectOptionDisplayOrder == 'display_asc') { ?>
<script type="text/javascript">
//<![CDATA[
$(function() {
	ccmAttributesHelper.makeSortable();
});
//]]>
</script>
<?php } ?>
