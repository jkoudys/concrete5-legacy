<?php
/* @var $h ConcreteDashboardHelper */
$h = Loader::helper('concrete/dashboard');
/* @var $ih ConcreteInterfaceHelper */
$ih = Loader::helper('concrete/interface');
/* @var $nh NavigationHelper */
$nh = Loader::helper('navigation');
/* @var $text TextHelper */
$text = Loader::helper('text');
/* @var $dh DateHelper*/
$dh = Loader::helper('date');
/* @var $urlhelper UrlHelper */
$urlhelper = Loader::helper('url');
/* @var $valt ValidationTokenHelper */
$valt = Loader::helper('validation/token');
/* @var $db DataBase */
$db = Loader::db();
?>
<script>
jQuery(function($) {
    var deleteResponse = <?= json_encode(t('Are you sure you want to delete this form submission?')) ?>,
        deleteForm = <?= json_encode(t('Are you sure you want to delete this form and its form submissions?')) ?>,
        deleteFormAnswers = <?= json_encode(t('Are you sure you want to delete this form submissions?')) ?>;
    $('.delete-response').live('click', function(e) {
        if (!confirm(deleteResponse)) {
            e.preventDefault();
        }
    });
    $('.delete-form').live('click', function(e) {
        if (!confirm(deleteForm)) {
            e.preventDefault();
        }
    });
    $('.delete-form-answers').live('click', function(e) {
        if (!confirm(deleteFormAnswers)) {
            e.preventDefault();
        }
    });
});
</script>
<style>
::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
    height: 6px;
}
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}

#wide-content-notification {
    margin-left: 5px;
    display: none;
    color: #aaa;
}

.form-results-container {
    width: 100%;
    overflow: auto;
}

</style>
<?php
if (!isset($questionSet)) {
    echo $h->getDashboardPaneHeaderWrapper(t('Form Results'));
    $showTable = false;
    foreach ($surveys as $qsid => $survey) {
        $block = Block::getByID((int) $survey['bID']);
        if (is_object($block)) {
            $showTable = true;
            break;
        }
    }
    if ($showTable) {
        ?><table class="table table-striped">
            <thead>
                <tr>
                    <th><?= t('Form')?></th>
                    <th><?= t('Submissions')?></th>
                    <th><?= t('Options')?></th>
                </tr>
            </thead>
            <tbody><?php
            foreach ($surveys as $qsid => $survey) {
                $block = Block::getByID((int) $survey['bID']);
                if (!is_object($block)) {
                    continue;
                }
                $in_use = (int) $db->getOne(
                    '
							SELECT
								count(*)
							FROM
								CollectionVersionBlocks
								INNER JOIN Pages ON CollectionVersionBlocks.cID = Pages.cID
								INNER JOIN CollectionVersions ON CollectionVersions.cID = Pages.cID
							WHERE
								CollectionVersions.cvIsApproved = 1
								AND CollectionVersionBlocks.cvID = CollectionVersions.cvID
								AND CollectionVersionBlocks.bID = ?
						',
                    array($block->bID)
                );
                $url = $nh->getLinkToCollection($block->getBlockCollectionObject());
            ?><tr>
                <td><?=h($survey['surveyName'])?></td>
                <td><?=h($survey['answerSetCount'])?></td>
                <td>
                    <?=$ih->button(t('View Responses'), DIR_REL . '/index.php?cID=' . $c->getCollectionID().'&qsid=' . $qsid, 'left', 'small')?>
                    <?=$ih->button(t('Open Page'), $url, 'left', 'small')?>
                    <form method="post" action="" style="display: inline">
                        <input type="hidden" name="qsID" value="<?= intval($qsid) ?>" />
                        <input type="hidden" name="action" value="deleteFormAnswers" />
                        <?php $valt->output('deleteFormAnswers') ?>
                        <?= $ih->submit(t('Delete Submissions'), false, 'left', 'small error delete-form-answers') ?>
                    </form>
                    <?php
                    if (!$in_use) {
                        ?><form method="post" action="" style="display: inline">
                            <input type="hidden" name="bID" value="<?= intval($survey['bID']) ?>" />
                            <input type="hidden" name="qsID" value="<?= intval($qsid) ?>" />
                            <input type="hidden" name="action" value="deleteForm" />
                            <?php $valt->output('deleteForm') ?>
                            <?= $ih->submit(t('Delete'), false, 'left', 'small error delete-form') ?>
                            </form><?php
                    }
                    ?>
                    </td>
                    </tr><?php
            }
            ?></tbody>
        </table><?php
    } else {
        ?><p><?=t('There are no available forms in your site.')?></p><?php
    }
    echo $h->getDashboardPaneFooterWrapper();
} else {
    echo $h->getDashboardPaneHeaderWrapper(t('Responses to %s', $surveys[$questionSet]['surveyName']), false, false, false);
    if (count($answerSets) == 0) {
        ?>
        <div class="ccm-pane-body ccm-pane-body-footer">
            <div><?=t('No one has yet submitted this form.')?></div>
        </div>
        <?php
    } else {
        $showPaginator = $paginator && (strlen($paginator->getPages()) > 0);
        ?>
        <div class="ccm-pane-body <?php if (!$showPaginator) {
?> ccm-pane-body-footer <?php
} ?>">
            <div class="ccm-list-action-row">
                <a id="ccm-export-results" href="<?=$this->action('excel', '?qsid=' . $questionSet)?>"><span></span><?=t('Export to Excel')?></a>
            </div>
            <div class="form-results-container">
                <script>
                $(document).ready(function(){
                    if ($('.form-results-container')[0].scrollWidth > $('.ccm-pane-body').width()) {
                        $('#wide-content-notification').show();
                    }
                });
                </script>
                <p id="wide-content-notification"><?= t('* Scroll right to view full results') ?></p>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <?php
                            if ($_REQUEST['sortBy'] == 'chrono') {
                                ?><th class="header headerSortDown"><a href="<?=h($urlhelper->unsetVariable('sortBy'))?>"><?php
                            } else {
                                ?><th class="header headerSortUp"><a href="<?=h($urlhelper->setVariable('sortBy', 'chrono'))?>"><?php
                            }
                            ?><?= t('Date') ?></a></th>
                            <th><?= t('User') ?></th>
                            <?php
                            foreach ($questions as $question) {
                                ?><th><?=$question['question']?></th><?php
                            }
                            ?>
                            <th><?= t('Actions') ?></th>
                        </tr>
                    </thead>
                    <tbody><?php
                    foreach ($answerSets as $answerSetId => $answerSet) {
                        ?><tr>
                        <td><?=$dh->getSystemDateTime($answerSet['created'])?></td>
                        <td><?php
                        if ($answerSet['uID'] > 0) {
                            $ui = UserInfo::getByID($answerSet['uID']);
                            if (is_object($ui)) {
                                print $ui->getUserName() . ' ';
                            }
                            print t('(User ID: %s)', $answerSet['uID']);
                        }
                            ?></td>
                            <?php
                            foreach ($questions as $questionId => $question) {
                                switch ($question['inputType']) {
                                    case 'fileupload':
                                        $fID = (int) $answerSet['answers'][$questionId]['answer'];
                                        $file = File::getByID($fID);
                                        if ($fID && $file) {
                                            $fileVersion = $file->getApprovedVersion();
                                            echo '<td><a href="' . $fileVersion->getRelativePath() . '">' . h($fileVersion->getFileName()) . '</a></td>';
                                        } else {
                                            echo '<td>' . t('File not found') . '</td>';
                                        }
                                        break;
                                    case 'text':
                                        echo '<td>' . h($answerSet['answers'][$questionId]['answerLong']) . '</td>';
                                        break;
                                    default:
                                        echo '<td>' . h($answerSet['answers'][$questionId]['answer']) . '</td>';
                                        break;
                                }
                            }
                            ?>
                            <td><form method="post" action="" style="display: inline">
                                <input type="hidden" name="qsid" value="<?= intval($answerSet['questionSetId']) ?>" />
                                <input type="hidden" name="asid" value="<?= intval($answerSet['asID']) ?>" />
                                <input type="hidden" name="action" value="deleteResponse" />
                                <?php $valt->output('deleteResponse') ?>
                                <?= $ih->submit(t('Delete'), false, 'left', 'danger delete-response small') ?>
                                </form></td>
                            </tr><?php
                    }
                    ?></tbody>
                </table>
            </div>
        </div>
        <?php
        if ($showPaginator) {
            ?><div class="ccm-pane-footer">
                <div class="pagination">
                    <ul>
                        <li class="prev"><?=$paginator->getPrevious()?></li>
                        <?php
                        // Call to pagination helper's 'getPages' method with new $wrapper var
                        echo $paginator->getPages('li');
                        ?>
                        <li class="next"><?=$paginator->getNext()?></li>
                    </ul>
                </div>
            </div><?php
        }
    }
    echo $h->getDashboardPaneFooterWrapper(false);
}
