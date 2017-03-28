import $ from 'jquery';

import FileManager from './filemanager';
import Newsflow from './newsflow';
import PageReindexing from './page_reindexing';
import RemoteMarketplace from './remote_marketplace';
import Search from './search';
import Sitemap from './sitemap';
import StatusBar from './status_bar';
import Tabs from './tabs';
import TinymceIntegration from './tinymce_integration';
import UI from './ui';
import Toolbar from './toolbar';
import Themes from './themes';
import Composer from './composer';
import Dashboard from './dashboard';

Object.assign(window, {
  $,
  jQuery: $,
  // Export CCM methods to global
  ...FileManager,
  ...Newsflow,
  ...PageReindexing,
  ...RemoteMarketplace,
  ...Search,
  ...Sitemap,
  ...StatusBar,
  ...Tabs,
  ...TinymceIntegration,
  ...UI,
  ...Toolbar,
  ...Themes,
  ...Composer,
  ...Dashboard,
});

// msie checks are too ingrained.
// FIXME get rid of the checks
$.browser = Object.assign($.browser || {}, { msie: false });

// require leaves us in the global scope, so we can include only the jqueryui widgets we need.
require('jquery-ui/ui/widgets/dialog');
require('jquery-ui/ui/widgets/droppable');
require('jquery-ui/ui/widgets/datepicker');
require('./jquery.rating');
require('./jquery.hoverIntent');
require('chosen-js');
require('../jquery.form');
require('../bootstrap');
require('./legacy_dialog');

require('../../css/ccm_app/build/ccm.app.less');
