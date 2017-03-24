<?php

// figure out where we need to go
$req = Request::get();
if ($req->getRequestCollectionPath() !== '') {
    $c = $req->getRequestedPage();
} else {
    $c = Page::getByID($req->getRequestCollectionID(), 'ACTIVE');
}

$req = Request::get();
$req->setCurrentPage($c);

if ($c->isError()) {
    // if we've gotten an error getting information about this particular collection
    // than we load up the Content class, and get prepared to fire away
    switch ($c->getError()) {
    case COLLECTION_NOT_FOUND:
        $v = View::getInstance();
        $v->render('/page_not_found');
        break;
    }
}

## Check maintenance mode
require __DIR__ . '/startup/maintenance_mode_check.php';

## Check to see whether this is an external alias or a header 301 redirect. If so we go there.
include __DIR__ . '/startup/external_link.php';

## Get a permissions object for this particular collection.
$cp = new Permissions($c);

## Now that we have a collections and permissions object, we check to make sure
## everything is okay with collections and permissions

if ($cp->isError()) {
    // if we've gotten an error getting information about this particular collection
    // than we load up the Content class, and get prepared to fire away

    switch ($cp->getError()) {
    case COLLECTION_FORBIDDEN:
        $v = View::getInstance();
        $v->setCollectionObject($c);
        $v->render('/page_forbidden');
        break;
    }
}

if (!$c->isActive() && (!$cp->canViewPageVersions())) {
    $v = View::getInstance();
    $v->render('/page_not_found');
}

## If there's no error, then we build the collection, but first we load it with the appropriate
## version. We pass the function the collection object, as well as the collection permissions
## object, which the function will use to determine what version we get to see

if ($cp->canEditPageContents() || $cp->canEditPageProperties() || $cp->canViewPageVersions()) {
    $cvID = ($_REQUEST['cvID']) ? $_REQUEST['cvID'] : "RECENT";
    $c->loadVersionObject($cvID);
}

$vp = new Permissions($c->getVersionObject());

if (isset($_REQUEST['ccm-disable-controls']) && ($_REQUEST['ccm-disable-controls'] == true || $cvID > 0)) {
    $v = View::getInstance();
    $v->disableEditing();
    $v->disableLinks();
}

// returns the $vp object, which we then check
if (is_object($vp) && $vp->isError()) {
    // if we've gotten an error getting information about this particular collection
    // than we load up the Content class, and get prepared to fire away
    switch ($vp->getError()) {
    case COLLECTION_NOT_FOUND:
        $v = View::getInstance();
        $v->render('/page_not_found');
        break;
    case COLLECTION_FORBIDDEN:
        $v = View::getInstance();
        $v->setCollectionObject($c);
        $v->render('/page_forbidden');
        break;
    }
}

## Fire the on_page_view Eventclass
Events::fire('on_page_view', $c, $u);

## Any custom site-related process
if (file_exists(DIR_BASE . '/config/site_process.php')) {
    require DIR_BASE . '/config/site_process.php';
}

## Make sure that any submitted forms, etc... are handled correctly
## This is legacy cms specific stuff, like adding pages
require __DIR__ . '/startup/process.php';

## Record the view
$u = new User();
if (STATISTICS_TRACK_PAGE_VIEWS == 1) {
    $u->recordView($c);
}

## now we display (provided we've gotten this far)

$v = View::getInstance();
$v->render($c);
