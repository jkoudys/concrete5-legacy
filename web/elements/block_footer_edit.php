<?php
defined('C5_EXECUTE') or die("Access Denied.");
$step = ($_REQUEST['step']) ? "&step=" . h($_REQUEST['step']) : "";
$closeWindowCID=(intval($rcID))?intval($rcID):$c->getCollectionID();
?>

</div>

<?php global $c; ?>

	<?php if (is_array($extraParams)) { // defined within the area/content classes
		foreach($extraParams as $key => $value) { ?>
			<input type="hidden" name="<?=$key?>" value="<?=$value?>">
		<?php } ?>
	<?php } ?>

<?php if (!$b->getProxyBlock()) { ?>
	<div class="ccm-buttons dialog-buttons">
	<a style="float: right" href="javascript:clickedButton = true;$('#ccm-form-submit-button').get(0).click()" class="btn primary"><?=t('Save')?> <i class="icon-ok icon-white"></i></a>
	<a style="float:left" href="javascript:void(0)" <?php if ($replaceOnUnload) { ?>onclick="location.href='<?=DIR_REL?>/<?=DISPATCHER_FILENAME?>?cID=<?=$closeWindowCID ?><?=$step?>'; return true" class="btn"<?php } else { ?>class="btn" onclick="ccm_blockWindowClose()" <?php } ?>><?=t('Cancel')?></a>
	</div>
<?php } ?>

	<input type="hidden" name="update" value="1" />
	<input type="hidden" name="rcID" value="<?=$rcID?>" />
	<input type="submit" name="ccm-edit-block-submit" value="submit" style="display: none" id="ccm-form-submit-button" />
	<input type="hidden" name="processBlock" value="1">

	</form>


<?php
$cont = $bt->getController();
if ($b->getBlockTypeHandle() == BLOCK_HANDLE_SCRAPBOOK_PROXY) {
	$bx = Block::getByID($b->getController()->getOriginalBlockID());
	$cont = $bx->getController();
}

if ($cont->getBlockTypeWrapperClass() != '') { ?>
</div>
<?php } ?>
