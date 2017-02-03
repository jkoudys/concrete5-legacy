<?php
$miniSurvey=new MiniSurvey($b);
$miniSurveyInfo=$miniSurvey->getMiniSurveyBlockInfo( $b->getBlockID() );
MiniSurvey::questionCleanup( intval($miniSurveyInfo['questionSetId']), $b->getBlockID() );

$u = new User();
$ui = UserInfo::getByID($u->uID);
?>
<script>
<?php if (is_object($b->getProxyBlock())) { ?>
    const thisbID = parseInt(<?= $b->getProxyBlock()->getBlockID() ?>);
<?php } else { ?>
    const thisbID = parseInt(<?= $b->getBlockID() ?>);
<?php } ?>
const thisbtID = parseInt(<?= $b->getBlockTypeID() ?>);
</script>
<?php
$this->inc('styles_include.php', [
    'c' => $c,
    'b' => $b,
    'miniSurveyInfo' => $miniSurveyInfo,
    'miniSurvey' => $miniSurvey,
    'a' => $a,
    'bt' => $bt,
]);
$this->inc('form_setup_html.php', [
    'c' => $c,
    'b' => $b,
    'miniSurveyInfo' => $miniSurveyInfo,
    'miniSurvey' => $miniSurvey,
    'a' => $a,
    'bt' => $bt,
]);
