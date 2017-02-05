<?php  defined('C5_EXECUTE') or die("Access Denied.");?>
<div class="ccm-ui">
<?php
$valt = Loader::helper('validation/token');
Loader::library('marketplace');
$mi = Marketplace::getInstance();
$tp = new TaskPermission();
if (!$tp->canInstallPackages()) { ?>
    <p><?=t('You do not have permission to download packages from the marketplace.')?></p>
    <?php exit;
} elseif (!$mi->isConnected()) { ?>
    <div class="ccm-pane-body-inner">
        <?php Loader::element('dashboard/marketplace_connect_failed')?>
    </div>
<?php } else {
    $ch = Loader::helper('concrete/interface');
    Loader::library('marketplace');
    Loader::model('marketplace_remote_item');

    $mpID = $_REQUEST['mpID'];
    if (!empty($mpID)) {
        $mri = MarketplaceRemoteItem::getByID($mpID);
    }
    if (is_object($mri)) { ?>

        <?php $screenshots = $mri->getScreenshots(); ?>


        <table class="ccm-marketplace-details-table">
        <tr>
            <td valign="top">
                <div id="ccm-marketplace-item-screenshots-wrapper">
                <div id="ccm-marketplace-item-screenshots">
                <?php
                $i = 0;

                if (count($screenshots) > 0) {
                    foreach ($screenshots as $si) { ?>
                        <img src="<?=$si->src?>" width="<?=$si->width?>" height="<?=$si->height?>" <?php if ($i != 0) {
?>style="display: none" <?php
} ?> />
                    <?php
                    $i++;
                    }
                } else { ?>
                    <div class="ccm-marketplace-item-screenshots-none">
                        <?=t('No screenshots')?>
                    </div>
                <?php                                                                                                                                                                                                                                                                                                                                                                                                                                 } ?>
                </div>
                </div>

                <?php if (!$mri->getMarketplaceItemVersionForThisSite()) { ?>
                    <Div class="clearfix" style="clear: both">
                    <div class="block-message alert-message error">
                        <p><?=t('This add-on is marked as incompatible with this version of concrete5. Please contact the author of the add-on for assistance.')?></p>
                    </div>
                    </div>
                <?php } ?>
            </td>
            <td valign="top">

        <div class="ccm-marketplace-item-information">
        <div class="ccm-marketplace-item-information-inner">
        <h1><?=$mri->getName()?></h1>
        </div>

        <?php if ($mri->getReviewBody() != '') { ?>
            <div class="ccm-marketplace-item-review-quote">
            <?=$mri->getReviewBody()?>
            </div>
        <?php } ?>
        <div class="ccm-marketplace-item-rating">
            <?=Loader::helper('rating')->outputDisplay($mri->getAverageRating())?>
            <?=t2('%d review', '%d reviews', $mri->getTotalRatings(), $mri->getTotalRatings())?>
            <?php if ($mri->getTotalRatings() > 0) { ?>
                <a href="<?=$mri->getRemoteReviewsURL()?>" target="_blank" class="ccm-marketplace-item-reviews-link"><?=t('Read Reviews')?></a>
            <?php } ?>
        </div>

        <div>
        <h2><?=t('Details')?></h2>
        <p><?=$mri->getBody()?></p>
        </div>
        </div>
    <?php
    if ($mri->purchaseRequired()) {
        $buttonText = t('Purchase - %s', '$' . $mri->getPrice());
        $buttonAction = 'javascript:ccm_getMarketplaceItem({mpID: \'' . $mri->getMarketplaceItemID() . '\', token: \''.$valt->generate('marketpalce_token').'\'})';
    } else {
        $buttonText = t('Download & Install');
        if ($type == 'themes') {
            $buttonAction = 'javascript:ccm_getMarketplaceItem({mpID: \'' . $mri->getMarketplaceItemID() . '\', token: \''.$valt->generate('marketpalce_token').'\', onComplete: function() {window.location.href=\'' . View::url('/dashboard/pages/themes') . '\'}})';
        } else {
            $buttonAction = 'javascript:ccm_getMarketplaceItem({mpID: \'' . $mri->getMarketplaceItemID() . '\', token: \''.$valt->generate('marketpalce_token').'\', onComplete: function() {window.location.href=\'' . View::url('/dashboard/extend/install') . '\'}})';
        }
    }

    if (!$mri->getMarketplaceItemVersionForThisSite()) {
        $buttonAction = 'javascript:void(0)';
    }

    ?>

        <div class="dialog-buttons">
            <input type="button" class="btn primary <?php if (!$mri->getMarketplaceItemVersionForThisSite()) {
?> disabled<?php
} ?> ccm-button-right" value="<?=$buttonText?>" onclick="<?=$buttonAction?>" />
            <input type="button" class="btn" value="<?=t('View in Marketplace')?>" onclick="window.open('<?=$mri->getRemoteURL()?>')" />
            <?php if ($mri->getMarketplaceItemType() == 'theme') { ?>
                <a title="<?php echo t('Preview')?>" onclick="ccm_previewMarketplaceTheme(1, <?php echo intval($mri->getRemoteCollectionID())?>,'<?php echo addslashes($mri->getName()) ?>','<?php echo addslashes($mri->getHandle()) ?>')"
                href="javascript:void(0)" class="btn"><?=t('Preview')?></a>
            <?php } ?>
        </div>
        <br/>


    </td>
    </tr>
    </table>

    <?php                                                                                                         } else { ?>
        <div class="block-message alert-message error"><p><?=t('Invalid marketplace item.')?></p></div>
    <?php } ?>

<?php } ?>

</div>
<script type="text/javascript">
var marketplaceImages;
$(function() {
    clearInterval(marketplaceImages);
    var currentImage = 0;
    var totalImages = $('#ccm-marketplace-item-screenshots img').length;
    if (totalImages > 1) {
        var im = $('#ccm-marketplace-item-screenshots img').eq(0);
        im.css('z-index', 10001);
        $('#ccm-marketplace-item-screenshots img').not(im).css('z-index', 10000);
        marketplaceImages = setInterval(function() {
            var oim = $('#ccm-marketplace-item-screenshots img').eq(currentImage);
            currentImage++;
            if (currentImage == totalImages) {
                currentImage = 0;
            }
            var nim = $('#ccm-marketplace-item-screenshots img').eq(currentImage);
            nim.show();
            oim.fadeOut(500, function() {
                oim.css('z-index', 10000);
                nim.css('z-index', 10001);
            });
        }, 5000);
    }
});
</script>
