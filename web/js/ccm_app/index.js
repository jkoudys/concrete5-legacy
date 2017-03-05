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
});

// require leaves us in the global scope, so we can include only the jqueryui widgets we need.
require('jquery-ui/ui/widgets/dialog');
require('./jquery.hoverIntent');
require('../bootstrap');
require('./legacy_dialog');
