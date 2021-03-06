<?php defined('C5_EXECUTE') or die("Access Denied."); ?>
<?php
if ($_REQUEST['searchDialog'] == 1) {
	$searchDialog = true;
}
if (!isset($sitemap_select_mode)) {
	if (isset($_REQUEST['sitemap_select_mode'])) {
		$sitemap_select_mode = $_REQUEST['sitemap_select_mode'];
	}
}
$sitemap_select_mode = h($sitemap_select_mode);

if (!isset($sitemap_select_callback)) {
	if (isset($_REQUEST['sitemap_select_callback'])) {
		$sitemap_select_callback = $_REQUEST['sitemap_select_callback'];
	}
}
$sitemap_select_callback = h($sitemap_select_callback);

if (isset($_REQUEST['searchInstance'])) {
	$searchInstance = h($_REQUEST['searchInstance']);
}
?>

<div id="ccm-<?=$searchInstance?>-search-results" class="ccm-page-list">

<?php if (!$searchDialog) { ?>

<div class="ccm-pane-body">

<?php } ?>

<div id="ccm-list-wrapper"><a name="ccm-<?=$searchInstance?>-list-wrapper-anchor"></a>
	<div style="margin-bottom: 10px">
		<?php $form = Loader::helper('form'); ?>

		<select id="ccm-<?=$searchInstance?>-list-multiple-operations" class="span3" disabled>
			<option value="">** <?=t('With Selected')?></option>
			<option value="properties"><?=t('Edit Properties')?></option>
			<option value="move_copy"><?=t('Move/Copy')?></option>
			<option value="speed_settings"><?=t('Speed Settings')?></option>
			<?php if (PERMISSIONS_MODEL == 'advanced') { ?>
				<option value="permissions"><?=t('Change Permissions')?></option>
				<option value="permissions_add_access"><?=t('Change Permissions - Add Access')?></option>
				<option value="permissions_remove_access"><?=t('Change Permissions - Remove Access')?></option>
			<?php } ?>
			<option value="design"><?=t('Design')?></option>
			<option value="delete"><?=t('Delete')?></option>
		</select>
	</div>

<?php
	$txt = Loader::helper('text');
	$keywords = $searchRequest['keywords'];
	$soargs = array();
	$soargs['searchInstance'] = $searchInstance;
	$soargs['sitemap_select_mode'] = $sitemap_select_mode;
	$soargs['sitemap_select_callback'] = $sitemap_select_callback;
	$soargs['searchDialog'] = $searchDialog;
	$bu = REL_DIR_FILES_TOOLS_REQUIRED . '/pages/search_results';

	if (count($pages) > 0) { ?>
		<table border="0" cellspacing="0" cellpadding="0" id="ccm-<?=$searchInstance?>-list" class="ccm-results-list">
		<tr class="ccm-results-list-header">
			<?php if (!$searchDialog) { ?><th><input id="ccm-<?=$searchInstance?>-list-cb-all" type="checkbox" /></th><?php } ?>
			<?php if ($pageList->isIndexedSearch()) { ?>
				<th class="<?=$pageList->getSearchResultsClass('cIndexScore')?>"><a href="<?=$pageList->getSortByURL('cIndexScore', 'desc', $bu, $soargs)?>"><?=t('Score')?></a></th>
			<?php } ?>
			<?php foreach($columns->getColumns() as $col) { ?>
				<?php if ($col->isColumnSortable()) { ?>
					<th class="<?=$pageList->getSearchResultsClass($col->getColumnKey())?>"><a href="<?=$pageList->getSortByURL($col->getColumnKey(), $col->getColumnDefaultSortDirection(), $bu, $soargs)?>"><?=$col->getColumnName()?></a></th>
				<?php } else { ?>
					<th><?=$col->getColumnName()?></th>
				<?php } ?>
			<?php } ?>

		</tr>
	<?php
		$h = Loader::helper('concrete/dashboard');
		$dsh = Loader::helper('concrete/dashboard/sitemap');
		foreach($pages as $cobj) {
			$cpobj = new Permissions($cobj);
			if (!isset($striped) || $striped == 'ccm-list-record-alt') {
				$striped = '';
			} else if ($striped == '') {
				$striped = 'ccm-list-record-alt';
			}

			$canEditPageProperties = $cpobj->canEditPageProperties();
			$canEditPageSpeedSettings = $cpobj->canEditPageSpeedSettings();
			$canEditPagePermissions = $cpobj->canEditPagePermissions();
			$canEditPageDesign = ($cpobj->canEditPageTheme() || $cpobj->canEditPageType());
			$canViewPageVersions = $cpobj->canViewPageVersions();
			$canDeletePage = $cpobj->canDeletePage();
			$canAddSubpages = $cpobj->canAddSubpage();
			$canAddExternalLinks = $cpobj->canAddExternalLink();

			$permissionArray = array(
				'canEditPageProperties'=> $canEditPageProperties,
				'canEditPageSpeedSettings'=>$canEditPageSpeedSettings,
				'canEditPagePermissions'=>$canEditPagePermissions,
				'canEditPageDesign'=>$canEditPageDesign,
				'canViewPageVersions'=>$canViewPageVersions,
				'canDeletePage'=>$canDeletePage,
				'canAddSubpages'=>$canAddSubpages,
				'canAddExternalLinks'=>$canAddExternalLinks
			);

			$canCompose = false;
			$ct = CollectionType::getByID($cobj->getCollectionTypeID());
			if (is_object($ct)) {
				if ($ct->isCollectionTypeIncludedInComposer()) {
					if ($canEditPageProperties && $h->canAccessComposer()) {
						$canCompose = 1;
					}
				}
			}

			?>
			<tr class="ccm-list-record <?=$striped?>"
				cName="<?=htmlentities($cobj->getCollectionName(), ENT_QUOTES, APP_CHARSET)?>"
				cID="<?=$cobj->getCollectionID()?>"
				sitemap-select-callback="<?=$sitemap_select_callback?>"
				sitemap-select-mode="<?=$sitemap_select_mode?>"
				sitemap-instance-id="<?=$searchInstance?>"
				sitemap-display-mode="search"
				cNumChildren="<?=$cobj->getNumChildren()?>"
				tree-node-cancompose="<?=$canCompose?>"

				cAlias="false"
				<?=$dsh->getPermissionsNodes($permissionArray);?>>
			<?php if (!$searchDialog) { ?><td class="ccm-<?=$searchInstance?>-list-cb" style="vertical-align: middle !important"><input type="checkbox" value="<?=$cobj->getCollectionID()?>" /></td><?php } ?>
			<?php if ($pageList->isIndexedSearch()) {?>
            <td>
                <?= $cobj->getPageIndexScore();?>
            </td>
            <?php } ?>
            <?php foreach($columns->getColumns() as $col) { ?>

                <?php if ($col->getColumnKey() == 'cvName') { ?>
                    <td class="ccm-page-list-name"><?=$txt->highlightSearch($cobj->getCollectionName(), $keywords)?></td>
                <?php } else { ?>
                    <td><?=$col->getColumnValue($cobj)?></td>
                <?php } ?>
            <?php } ?>

            </tr>
            <?php
        }
    ?>

    </table>



    <?php } else { ?>

        <div class="ccm-results-list-none"><?=t('No pages found.')?></div>


    <?php } ?>

</div>
<?php
    $pageList->displaySummary();
?>
<?php if (!$searchDialog) { ?>
</div>

<div class="ccm-pane-footer">
    <?php  $pageList->displayPagingV2($bu, false, $soargs); ?>
</div>

<?php } else { ?>
    <div class="ccm-pane-dialog-pagination">
        <?php  $pageList->displayPagingV2($bu, false, $soargs); ?>
    </div>
<?php } ?>

</div>
