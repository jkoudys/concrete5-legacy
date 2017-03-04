import $ from 'jquery';
import FileManager from './filemanager';
import Newsflow from './newsflow';
import PageReindexing from './page_reindexing';
import RemoteMarketplace from './remote_marketplace';
import Search from './search';

Object.assign(window, {
  $,
  jQuery: $,
  // Export CCM methods to global
  ...FileManager,
  ...Newsflow,
  ...PageReindexing,
  ...RemoteMarketplace,
  ...Search,
});
