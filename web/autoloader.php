<?php
// Autoloader for concrete5 classes.
// A simple wrapper around many `Loader` etc. type methods, to prepare source for concrete5.7
// FIXME: remove after 5.7 upgrade
namespace Concrete\Core\Legacy;
use \Loader;

\spl_autoload_register(function ($class) {
    // c5.7 namespaces 5.6 classes as 'legacy', so we'll do that ahead of time
    if ('Concrete\\Core\\Legacy\\' === substr($class, 0, 21)) {
        $short = substr($class, 21);
        if ('PageList' === $short) {
            // Load the old way
            Loader::model('page_list');
            // Extend into the new namespace
            class PageList extends \PageList {};
        } elseif ('AvatarHelper' === $short) {
            Loader::helper('concrete/avatar');
            class AvatarHelper extends \ConcreteAvatarHelper {};
        } elseif ('DateHelper' === $short) {
            Loader::helper('date');
            class DateHelper extends \DateHelper {};
        } elseif ('FileHelper' === $short) {
            Loader::helper('file');
            class FileHelper extends \FileHelper {};
        } elseif ('FormHelper' === $short) {
            Loader::helper('form');
            class FormHelper extends \FormHelper {};
        } elseif ('FormDateTimeHelper' === $short) {
            Loader::helper('form/date_time');
            class FormDateTimeHelper extends \FormDateTimeHelper {};
        } elseif ('HtmlHelper' === $short) {
            Loader::helper('html');
            class HtmlHelper extends \HtmlHelper {};
        } elseif ('ImageHelper' === $short) {
            Loader::helper('image');
            class ImageHelper extends \ImageHelper {};
        } elseif ('NavigationHelper' === $short) {
            Loader::helper('navigation');
            class NavigationHelper extends \NavigationHelper {};
        } elseif ('FormPageSelectorHelper' === $short) {
            Loader::helper('form/page_selector');
            class FormPageSelectorHelper extends \FormPageSelectorHelper {};
        } elseif ('ThemeHelper' === $short) {
            Loader::helper('theme');
            class ThemeHelper extends \ThemeHelper {};
        } elseif ('TextHelper' === $short) {
            Loader::helper('text');
            class TextHelper extends \TextHelper {};
        } elseif ('UserHelper' === $short) {
            Loader::helper('concrete/user');
            class UserHelper extends \ConcreteUserHelper {};
        } elseif ('ValidationTokenHelper' === $short) {
            Loader::helper('validation/token');
            class ValidationTokenHelper extends \ValidationTokenHelper {};
        } elseif ('IndexedPageList' === $short) {
            Loader::library('database_indexed_search');
            class IndexedPageList extends \IndexedPageList {};
        } elseif ('CollectionAttributeKey' === $short) {
            Loader::model('attribute/categories/collection');
            class CollectionAttributeKey extends \CollectionAttributeKey {};
        } elseif ('UserList' === $short) {
            Loader::model('user_list');
            class UserList extends \UserList {};
        }
    }
});
