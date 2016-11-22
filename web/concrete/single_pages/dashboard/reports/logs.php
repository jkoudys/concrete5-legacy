<?php
defined('C5_EXECUTE') or die("Access Denied.");

// HELPERS
$valt = Loader::helper('validation/token');
$th = Loader::helper('text');
$dh = Loader::helper('date');


// VARIABLES

// Check if entries to show, assign to boolean var.
$areEntries = count($entries) > 0 ? true : false;

?>

	<?=Loader::helper('concrete/dashboard')->getDashboardPaneHeaderWrapper(t('Logs'), false, false, false);?>

    <?php if(!$areEntries) { ?>

    <div class="ccm-pane-body ccm-pane-body-footer">

    	<p><?=t('There are no log entries to show at the moment.')?></p>

    </div>

    <?=Loader::helper('concrete/dashboard')->getDashboardPaneFooterWrapper(false);?>

    <?php } else { ?>

    <div class="ccm-pane-options ccm-pane-options-permanent-search">
    	<form method="post" id="ccm-log-search"  action="<?=$pageBase?>">
        	<div class="row">
                <div class="span5">
                    <label for="keywords"><?=t('Keywords')?></label>
                    <div class="input">
                        <?=$form->text('keywords', $keywords, array('style'=>'width:180px;'))?>
                    </div>
                </div>
                <div class="span6">
                    <label for="logType"><?=t('Type')?></label>
                    <div class="input">
                        <?=$form->select('logType', $logTypes, array('style'=>'width:180px;'))?>
                    <?=$form->submit('search', t('Search'))?>
                    </div>
                </div>
            </div>
        </form>
    </div>

	<div class="ccm-pane-body <?php if(!$paginator || !strlen($paginator->getPages())>0) { ?>ccm-pane-body-footer <?php } ?>">

        <table class="table table-bordered">
        	<thead>
                <tr>
                    <th class="subheaderActive"><?=t('Date/Time')?></th>
                    <th class="subheader"><?=t('Type')?></th>
                    <th class="subheader"><?=t('User')?></th>
                    <th class="subheader"><input style="float: right" class="btn error btn-mini" type="button" onclick="if (confirm('<?=t("Are you sure you want to clear this log?")?>')) { location.href='<?=$this->url('/dashboard/reports/logs', 'clear', $valt->generate(), $_POST['logType'])?>'}" value="<?=t('Clear Log')?>" /><?=t('Text')?></th>
                </tr>
			</thead>
            <tbody>
				<?php foreach($entries as $ent) { ?>
                <tr>
                    <td valign="top" style="white-space: nowrap" class="active"><?php
                        echo $dh->formatPrettyDateTime($ent->getTimestamp(), false, true);
                    ?></td>
                    <td valign="top"><strong><?=$ent->getType()?></strong></td>
                    <td valign="top"><strong><?php
                    $uID = $ent->getUserID();
                    if (empty($uID)) {
                        echo t("Guest");
                    } else {
                        $u = User::getByUserID($uID);
                        if (is_object($u)) {
                            echo $u->getUserName();
                        } else {
                            echo tc('Deleted user', 'Deleted (id: %s)', $uID);
                        }
                    }
                    ?></strong></td>
                    <td style="width: 100%"><?=$th->makenice($ent->getText())?></td>
                </tr>
                <?php } ?>
            </tbody>
        </table>

    </div>
    <!-- END Body Pane -->

    <?php if($paginator && strlen($paginator->getPages())>0){ ?>
    <div class="ccm-pane-footer">

            <div class="pagination">
              <ul>
                  <li class="prev"><?=$paginator->getPrevious()?></li>

                  <?php // Call to pagination helper's 'getPages' method with new $wrapper var ?>
                    <?=$paginator->getPages('li')?>

                  <li class="next"><?=$paginator->getNext()?></li>
              </ul>
            </div>


    </div>
        <?php } // PAGINATOR ?>

    <?=Loader::helper('concrete/dashboard')->getDashboardPaneFooterWrapper(false);?>

    <?php } ?>
