<?php
defined('C5_EXECUTE') or die('Access Denied.');
$form = Loader::helper('form');
$searchWithinOther = ($searchObj->baseSearchPath != $c->getCollectionPath() && $searchObj->baseSearchPath != '' && strlen($searchObj->baseSearchPath) > 0) ? true : false;

/*
 * Post to another page, get page object.
 */
$basePostPage = null;
if (isset($searchObj->postTo_cID) && intval($searchObj->postTo_cID) > 0) {
    $basePostPage = Page::getById($searchObj->postTo_cID);
} elseif ($searchObj->pagePath != $c->getCollectionPath() && strlen($searchObj->pagePath)) {
    $basePostPage = Page::getByPath($searchObj->pagePath);
}
/*
 * Verify object.
 */
if (is_object($basePostPage) && $basePostPage->isError()) {
    $basePostPage = null;
}
?>

<?php if (!$controller->indexExists()) {
    ?>
    <div class="ccm-error"><?=t('The search index does not appear to exist. This block will not function until the reindex job has been run at least once in the dashboard.')?><br/><br/></div>
<?php
} ?>

<fieldset>

    <div class='clearfix'>
        <label for='title'><?=t('Search Title')?>:</label>
        <div class='input'>
            <?=$form->text('title', $searchObj->title);?>
        </div>
    </div>

    <div class='clearfix'>
        <label for='title'><?=t('Submit Button Text')?>:</label>
        <div class='input'>
            <?=$form->text('buttonText', $searchObj->buttonText);?>
        </div>
    </div>

    <div class='clearfix'>
        <label for='title'><?=t('Search Within Path')?>:</label>
        <div class='input'>
            <ul class='inputs-list'>
                <li>
                    <label>
                    <input type="radio" name="baseSearchPath" id="baseSearchPathEverywhere" value="" <?=($searchObj->baseSearchPath == '' || !$searchObj->baseSearchPath) ? 'checked' : ''?> onchange="searchBlock.pathSelector(this)" />
                    <?=t('everywhere')?>
                    </label>
                </li>

                <li>
                    <label>
                        <input type="radio" name="baseSearchPath" id="baseSearchPathThis" value="<?=$c->getCollectionPath()?>" <?=($searchObj->baseSearchPath != '' && $searchObj->baseSearchPath == $c->getCollectionPath()) ? 'checked' : ''?> onchange="searchBlock.pathSelector(this)" >
                        <?=t('beneath this page')?>
                    </label>
                </li>
                <li>
                    <label>
                    <input type="radio" name="baseSearchPath" id="baseSearchPathOther" value="OTHER" onchange="searchBlock.pathSelector(this)" <?=($searchWithinOther) ? 'checked' : ''?>>
                    <?=t('beneath another page')?>
                    <div id="basePathSelector" style="display:<?=($searchWithinOther) ? 'block' : 'none'?>" >

                        <?php $select_page = Loader::helper('form/page_selector');
                        if ($searchWithinOther) {
                            $cpo = Page::getByPath($baseSearchPath);
                            if (is_object($cpo)) {
                                echo $select_page->selectPage('searchUnderCID', $cpo->getCollectionID());
                            } else {
                                echo $select_page->selectPage('searchUnderCID');
                            }
                        } else {
                            echo $select_page->selectPage('searchUnderCID');
                        }
                        ?>
                    </div>
                    </label>
                </li>
            </ul>
        </div>
    </div>

    <div class='clearfix'>
        <label for='title'><?=t('Results Page')?>:</label>
        <div class='input'>
            <ul class='inputs-list'>
                <li>
                    <label>
                        <input id="ccm-searchBlock-externalTarget" name="externalTarget" type="checkbox" value="1" <?=(strlen($searchObj->resultsURL) || $basePostPage !== null) ? 'checked' : ''?> />
                        <?=t('Post to Another Page Elsewhere')?>
                    </label>
                </li>
                <li id="ccm-searchBlock-resultsURL-wrap" style=" <?=(strlen($searchObj->resultsURL) || $basePostPage !== null) ? '' : 'display:none'?>" >
                    <?php
                    if ($basePostPage !== null) {
                        echo $select_page->selectPage('postTo_cID', $basePostPage->getCollectionID());
                    } else {
                        echo $select_page->selectPage('postTo_cID');
                    }
                    ?>
                    <?=t('OR Path')?>:
                    <?=$form->text('resultsURL', $searchObj->resultsURL);?>
                </li>
            </ul>
        </div>
    </div>

</fieldset>
