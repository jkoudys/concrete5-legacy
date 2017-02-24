<?php
$u = new User();
$ui = UserInfo::getByID($u->uID);
?>
<script type="text/javascript">
const thisbID = parseInt(<?= intval($_REQUEST['bID']) ?>);
const thisbtID = parseInt(<?= $bt->getBlockTypeID() ?>);
</script>
<?php
$bt->inc('styles_include.php');
$bt->inc('form_setup_html.php');
