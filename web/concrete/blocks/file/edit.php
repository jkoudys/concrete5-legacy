<?php
$al = Loader::helper('concrete/asset_library');
$bf = ($controller->getFileID() > 0) ? $controller->getFileObject() : null;
?>
<h2><?= t('File') ?></h2>
<?= $al->file('ccm-b-file', 'fID', t('Choose File'), $bf) ?>
<br/>
<h2><?= t('Link Text') ?></h2>
<input
    type="text"
    style="width: 200px"
    name="fileLinkText"
    value="<?= $controller->getLinkText() ?>"
/>
<br/>
