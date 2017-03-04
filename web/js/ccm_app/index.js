import $ from 'jquery';

import FileManager from './filemanager';
import Newsflow from './newsflow';
import PageReindexing from './page_reindexing';
import RemoteMarketplace from './remote_marketplace';
import Search from './search';
import Sitemap from './sitemap';
import StatusBar from './status_bar';
import Tabs from './tabs';
import TinymceIntegration from './tinymce_integration.js';

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
});
