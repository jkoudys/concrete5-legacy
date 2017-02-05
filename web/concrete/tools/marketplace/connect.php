<?php
$tp = new TaskPermission();
$obj = new stdClass;
if (!$tp->canInstallPackages()) {
    $obj->isConnected = false; //keep this here just incase
    $obj->token = false;
    $obj->connectionError = t('Access Denied');
} else {
    Loader::library('marketplace');
    Loader::model('marketplace_remote_item');

    $mi = Marketplace::getInstance();
    $valt = Loader::helper('validation/token');

    $obj->isConnected = $mi->isConnected();
    $obj->token = $valt->generate('marketplace_token');
    $obj->connectionError = $mi->getConnectionError();
    if ($mi->isConnected() && isset($_REQUEST['mpID'])) {
    // we also perform the "does the user need to buy it?" query here to save some requests
        $mr = MarketplaceRemoteItem::getByID($_REQUEST['mpID']);
        if (is_object($mr)) {
            $obj->purchaseRequired = $mr->purchaseRequired();
            $obj->remoteURL = $mr->getRemoteURL();
        // if purchase is NOT required then we also try and add a license
        // don't worry - this is also verified on the server
            if (!$mr->purchaseRequired()) {
                $mr->enableFreeLicense();
            }
        }
    }
}
echo json_encode($obj);
exit;
