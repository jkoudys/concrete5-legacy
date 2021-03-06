<?php
header('Content-type: text/javascript'); ?>

var ccmi18n = {

	error: <?= json_encode(t('Error')); ?>,
	deleteBlock: <?= json_encode(t('Delete')); ?>,
	deleteBlockMsg: <?= json_encode(t('The block has been removed successfully.')); ?>,
	addBlock: <?= json_encode(t('Add Block')); ?>,
	addBlockNew: <?= json_encode(t('Add Block')); ?>,
	addBlockStack: <?= json_encode(t('Add Stack')); ?>,
	addBlockPaste: <?= json_encode(t('Paste from Clipboard')); ?>,
	changeAreaCSS: <?= json_encode(t('Design')); ?>,
	editAreaLayout: <?= json_encode(t('Edit Layout')); ?>,
	addAreaLayout: <?= json_encode(t('Add Layout')); ?>,
	moveLayoutUp: <?= json_encode(t('Move Up')); ?>,
	moveLayoutDown: <?= json_encode(t('Move Down')); ?>,
	moveLayoutAtBoundary: <?= json_encode(t('This layout section can not be moved further in this direction.')); ?>,
	lockAreaLayout: <?= json_encode(t('Lock Layout')); ?>,
	unlockAreaLayout: <?= json_encode(t('Unlock Layout')); ?>,
	deleteLayout: <?= json_encode(t('Delete')); ?>,
	deleteLayoutOptsTitle: <?= json_encode(t('Delete Layout')); ?>,
	confirmLayoutPresetDelete: <?= json_encode(t('Are you sure you want to delete this layout preset?')); ?>,
	setAreaPermissions: <?= json_encode(t('Set Permissions')); ?>,
	addBlockMsg: <?= json_encode(t('The block has been added successfully.')); ?>,
	updateBlock: <?= json_encode(t('Update Block')); ?>,
	updateBlockMsg: <?= json_encode(t('The block has been saved successfully.')); ?>,
	copyBlockToScrapbookMsg: <?= json_encode(t('The block has been added to your clipboard.')); ?>,
	closeWindow: <?= json_encode(t('Close')); ?>,
	editBlock: <?= json_encode(t('Edit')); ?>,
	editBlockWithName: <?= json_encode(tc('%s is a block type name', 'Edit %s')); ?>,
	setPermissionsDeferredMsg: <?= json_encode(t('Permission setting saved. You must complete the workflow before this change is active.')); ?>,
	editStackContents: <?= json_encode(t('Manage Stack Contents')); ?>,
	compareVersions: <?= json_encode(t('Compare Versions')); ?>,
	blockAreaMenu: <?= json_encode(t("Add Block")); ?>,
	arrangeBlock: <?= json_encode(t('Move')); ?>,
	arrangeBlockMsg: <?= json_encode(t('Blocks arranged successfully.')); ?>,
	copyBlockToScrapbook: <?= json_encode(t('Copy to Clipboard')); ?>,
	changeBlockTemplate: <?= json_encode(t('Custom Template')); ?>,
	changeBlockCSS: <?= json_encode(t("Design")); ?>,
	errorCustomStylePresetNoName: <?= json_encode(t('You must give your custom style preset a name.')); ?>,
	changeBlockBaseStyle: <?= json_encode(t("Set Block Styles")); ?>,
	confirmCssReset: <?= json_encode(t("Are you sure you want to remove all of these custom styles?")); ?>,
	confirmCssPresetDelete: <?= json_encode(t("Are you sure you want to delete this custom style preset?")); ?>,
	setBlockPermissions: <?= json_encode(t('Set Permissions')); ?>,
	setBlockAlias: <?= json_encode(t('Setup on Child Pages')); ?>,
	setBlockComposerSettings: <?= json_encode(t("Composer Settings")); ?>,
	themeBrowserTitle: <?= json_encode(t('Get More Themes')); ?>,
	themeBrowserLoading: <?= json_encode(t('Retrieving theme data from concrete5.org marketplace.')); ?>,
	addonBrowserLoading: <?= json_encode(t('Retrieving add-on data from concrete5.org marketplace.')); ?>,
	clear: <?= json_encode(t('Clear')); ?>,
	requestTimeout: <?= json_encode(t('This request took too long.')); ?>,
	generalRequestError: <?= json_encode(t('An unexpected error occurred.')); ?>,
	helpPopup: <?= json_encode(t('Help')); ?>,
	community: <?= json_encode(t('concrete5 Community')); ?>,
	communityCheckout: <?= json_encode(t('concrete5 Community - Purchase &amp; Checkout')); ?>,
	noIE6: <?= json_encode(t('concrete5 does not support Internet Explorer 6 in edit mode.')); ?>,
	helpPopupLoginMsg: <?= json_encode(t('Get more help on your question by posting it to the concrete5 help center on concrete5.org')); ?>,
	marketplaceErrorMsg: <?= json_encode(t('<p>You package could not be installed.  An unknown error occured.</p>')); ?>,
	marketplaceInstallMsg: <?= json_encode(t('<p>Your package will now be downloaded and installed.</p>')); ?>,
	marketplaceLoadingMsg: <?= json_encode(t('<p>Retrieving information from the concrete5 Marketplace.</p>')); ?>,
	marketplaceLoginMsg: <?= json_encode(t('<p>You must be logged into the concrete5 Marketplace to install add-ons and themes.  Please log in.</p>')); ?>,
	marketplaceLoginSuccessMsg: <?= json_encode(t('<p>You have successfully logged into the concrete5 Marketplace.</p>')); ?>,
	marketplaceLogoutSuccessMsg: <?= json_encode(t('<p>You are now logged out of concrete5 Marketplace.</p>')); ?>,
	deleteAttributeValue: <?= json_encode(t('Are you sure you want to remove this value?')); ?>,
	customizeSearch: <?= json_encode(t('Customize Search')); ?>,
	properties: <?= json_encode(t('Properties')); ?>,
	savePropertiesMsg: <?= json_encode(t('Page Properties saved.')); ?>,
	saveSpeedSettingsMsg: <?= json_encode(t("Full page caching settings saved.")); ?>,
	saveUserSettingsMsg: <?= json_encode(t("User Settings saved.")); ?>,
	ok: <?= json_encode(t('Ok')); ?>,
	scheduleGuestAccess: <?= json_encode(t('Schedule Guest Access')); ?>,
	scheduleGuestAccessSuccess: <?= json_encode(t('Timed Access for Guest Users Updated Successfully.')); ?>,
	newsflowLoading: <?= json_encode(t("Checking for updates.")); ?>,
	authoredBy: <?= json_encode(t('by')); ?>,
	x: <?= json_encode(t('x')); ?>,
	user_activate: <?= json_encode(t('Activate Users')); ?>,
	user_deactivate: <?= json_encode(t('Deactivate Users')); ?>,
	user_delete: <?= json_encode(t('Delete')); ?>,
	user_group_remove: <?= json_encode(t('Remove From Group')); ?>,
	user_group_add: <?= json_encode(t('Add to Group')); ?>
};

var ccmi18n_sitemap = {

	visitExternalLink: <?= json_encode(t('Visit')); ?>,
	editExternalLink: <?= json_encode(t('Edit External Link')); ?>,
	deleteExternalLink: <?= json_encode(t('Delete')); ?>,
	copyProgressTitle: <?= json_encode(t('Copy Progress')); ?>,
	addExternalLink: <?= json_encode(t('Add External Link')); ?>,
	sendToTop: <?= json_encode(t('Send To Top')); ?>,
	sendToBottom: <?= json_encode(t('Send To Bottom')); ?>,
	emptyTrash: <?= json_encode(t('Empty Trash')); ?>,
	restorePage: <?= json_encode(t('Restore Page')); ?>,
	deletePageForever: <?= json_encode(t('Delete Forever')); ?>,
	previewPage: <?= json_encode(t('Preview')); ?>,
	visitPage: <?= json_encode(t('Visit')); ?>,
	pageProperties: <?= json_encode(t('Properties')); ?>,
	speedSettings: <?= json_encode(t('Full Page Caching')); ?>,
	speedSettingsTitle: <?= json_encode(t('Full Page Caching')); ?>,
	pagePropertiesTitle: <?= json_encode(t('Page Properties')); ?>,
	pagePermissionsTitle: <?= json_encode(t('Page Permissions')); ?>,
	setPagePermissions: <?= json_encode(t('Set Permissions')); ?>,
	setPagePermissionsMsg: <?= json_encode(t('Page permissions updated successfully.')); ?>,
	pageDesignMsg: <?= json_encode(t('Theme and page type updated successfully.')); ?>,
	pageDesign: <?= json_encode(t('Design')); ?>,
	pageVersions: <?= json_encode(t('Versions')); ?>,
	deletePage: <?= json_encode(t('Delete')); ?>,
	deletePages: <?= json_encode(t('Delete Pages')); ?>,
	deletePageSuccessMsg: <?= json_encode(t('The page has been removed successfully.')); ?>,
	deletePageSuccessDeferredMsg: <?= json_encode(t('Delete request saved. You must complete the workflow before the page is fully removed.')); ?>,
	addPage: <?= json_encode(t('Add Page')); ?>,
	moveCopyPage: <?= json_encode(t('Move/Copy')); ?>,
	reorderPage: <?= json_encode(t('Change Page Order')); ?>,
	reorderPageMessage: <?= json_encode(t('Move or reorder pages by dragging their icons.')); ?>,
	moveCopyPageMessage: <?= json_encode(t('Choose a new parent page from the sitemap.')); ?>,
	editInComposer: <?= json_encode(t('Edit in Composer')); ?>,

	searchPages: <?= json_encode(t('Search Pages')); ?>,
	explorePages: <?= json_encode(t('Flat View')); ?>,
	backToSitemap: <?= json_encode(t('Back to Sitemap')); ?>,
	searchResults: <?= json_encode(t('Search Results')); ?>,
	createdBy: <?= json_encode(t('Created By')); ?>,
	choosePage: <?= json_encode(t('Choose a Page')); ?>,
	viewing: <?= json_encode(t('Viewing')); ?>,
	results: <?= json_encode(t('Result(s)')); ?>,
	max: <?= json_encode(t('max')); ?>,
	noResults: <?= json_encode(t('No results found.')); ?>,
	areYouSure: <?= json_encode(t('Are you sure?')); ?>,
	loadError: <?= json_encode(t('Unable to load sitemap data. Response received: ')); ?>,
	loadErrorTitle: <?= json_encode(t('Unable to load sitemap data.')); ?>,
	on: <?= json_encode(t('on')); ?>

};

var ccmi18n_spellchecker = {

	resumeEditing: <?= json_encode(t('Resume Editing')); ?>,
	noSuggestions: <?= json_encode(t('No Suggestions')); ?>

};

var ccmi18n_filemanager = {

	view: <?= json_encode(t('View')); ?>,
	download: <?= json_encode(t('Download')); ?>,
	select: <?= json_encode(t('Choose')); ?>,
	duplicateFile: <?= json_encode(t('Copy File')); ?>,
	clear: <?= json_encode(t('Clear')); ?>,
	edit: <?= json_encode(t('Edit')); ?>,
	replace: <?= json_encode(t('Replace')); ?>,
	duplicate: <?= json_encode(t('Copy')); ?>,
	chooseNew: <?= json_encode(t('Choose New File')); ?>,
	sets: <?= json_encode(t('Sets')); ?>,
	permissions: <?= json_encode(t('Access & Permissions')); ?>,
	properties: <?= json_encode(t('Properties')); ?>,
	deleteFile: <?= json_encode(t('Delete')); ?>,
	title: <?= json_encode(t('File Manager')); ?>,
	uploadErrorChooseFile: <?= json_encode(t('You must choose a file.')); ?>,
	rescan: <?= json_encode(t('Rescan')); ?>,
	pending: <?= json_encode(t('Pending')); ?>,
	uploadComplete: <?= json_encode(t('Upload Complete')); ?>,

	PTYPE_CUSTOM: <?php echo '""'; //$jh->encode(FilePermissions::PTYPE_CUSTOM); ?>,
	PTYPE_NONE: <?php echo '""'; //$jh->encode(FilePermissions::PTYPE_NONE); ?>,
	PTYPE_ALL: <?php echo '""'; //$jh->encode(FilePermissions::PTYPE_ALL); ?>,

	FTYPE_IMAGE: <?= json_encode(FileType::T_IMAGE); ?>,
	FTYPE_VIDEO: <?= json_encode(FileType::T_VIDEO); ?>,
	FTYPE_TEXT: <?= json_encode(FileType::T_TEXT); ?>,
	FTYPE_AUDIO: <?= json_encode(FileType::T_AUDIO); ?>,
	FTYPE_DOCUMENT: <?= json_encode(FileType::T_DOCUMENT); ?>,
	FTYPE_APPLICATION: <?= json_encode(FileType::T_APPLICATION); ?>

};

var ccmi18n_chosen = {

	placeholder_text_multiple: <?= json_encode(t('Select Some Options')); ?>,
	placeholder_text_single: <?= json_encode(t('Select an Option')); ?>,
	no_results_text: <?= json_encode(t(/*i18n After this text we have a search criteria: for instance 'No results match "Criteria"'*/'No results match')); ?>

};
