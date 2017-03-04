import $ from 'jquery';
import FileManager from './filemanager';

Object.assign(window, {
  $,
  jQuery: $,
  // Export CCM methods to global
  FileManager,
});
