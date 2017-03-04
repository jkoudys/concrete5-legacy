import $ from 'jquery';

const { CCM_TOOLS_PATH, CCM_DISPATCHER_FILENAME, CCM_STAR_STATES, CCM_STAR_ACTION } = window;

const ccm_alDebug = false;
const ccm_alLaunchType = [];
const ccm_totalAdvancedSearchFields = 0;
let ccm_alActiveAssetField = '';
let ccm_alProcessorTarget = '';
let ccm_uploadedFiles = [];
let checkboxStatus = false;

function cm_triggerSelectFile(fID, af = ccm_alActiveAssetField) {
  const obj = $(`#${af}-fm-selected`);
  const dobj = $(`#${af}-fm-display`);
  dobj.hide();
  obj.show();
  obj.load(`${CCM_TOOLS_PATH}/files/selector_data?fID=${fID}&ccm_file_selected_field=${af}`, () => {
    obj.attr('fID', fID);
    obj.attr('ccm-file-manager-can-view', obj.children('div').attr('ccm-file-manager-can-view'));
    obj.attr('ccm-file-manager-can-edit', obj.children('div').attr('ccm-file-manager-can-edit'));
    obj.attr('ccm-file-manager-can-admin', obj.children('div').attr('ccm-file-manager-can-admin'));
    obj.attr('ccm-file-manager-can-replace', obj.children('div').attr('ccm-file-manager-can-replace'));
    obj.attr('ccm-file-manager-instance', af);

    obj.unbind('click.concrete');
    obj.on('click.concrete', function (e) {
      e.stopPropagation();
      ccm_alActivateMenu($(this), e);
    });

    if (typeof (ccm_triggerSelectFileComplete) == 'function') {
      ccm_triggerSelectFileComplete(fID, af);
    }
  });
  const vobj = $('#' + af + '-fm-value');
  vobj.attr('value', fID);
  ccm_alSetupFileProcessor();
}

function cm_alGetFileData(fID, onComplete) {
  $.getJSON(CCM_TOOLS_PATH + '/files/get_data.php?fID=' + fID, (resp) => {
    onComplete(resp);
  });
}

function cm_clearFile(e, af) {
  e.stopPropagation();
  const obj = $('#' + af + '-fm-selected');
  const dobj = $('#' + af + '-fm-display');
  const vobj = $('#' + af + '-fm-value');
  vobj.attr('value', 0);
  obj.hide();
  dobj.show();
}

function cm_activateFileManager(altype, searchInstance) {
  // delegate event handling to table container so clicks
  // to our star don't interfer with clicks to our rows
  ccm_alLaunchType[searchInstance] = altype;
  ccm_alSetupSelectFiles(searchInstance);

  $(document).click((e) => {
    e.stopPropagation();
    ccm_alSelectNone();
  });

  ccm_setupAdvancedSearch(searchInstance);

  if (altype == 'DASHBOARD') {
    $('.dialog-launch').dialog();
  }


  ccm_alSetupCheckboxes(searchInstance);
  ccm_alSetupFileProcessor();
  ccm_alSetupSingleUploadForm();

  $(`form#ccm-${searchInstance}-advanced-search select[name=fssID]`).change(function () {
    if (altype == 'DASHBOARD') {
      window.location.href = CCM_DISPATCHER_FILENAME + '/dashboard/files/search?fssID=' + $(this).val();
    } else {
      $.fn.dialog.showLoader();
      const url = $('div#ccm-' + searchInstance + '-overlay-wrapper input[name=dialogAction]').val() + '&refreshDialog=1&fssID=' + $(this).val();
      $.get(url, (resp) => {
        $.fn.dialog.hideLoader();
        $('div#ccm-' + searchInstance + '-overlay-wrapper').html(resp);
        $('div#ccm-' + searchInstance + '-overlay-wrapper a.dialog-launch').dialog();
      });
    }
  });

  ccm_searchActivatePostFunction[searchInstance] = () => {
    ccm_alSetupCheckboxes(searchInstance);
    ccm_alSetupSelectFiles(searchInstance);
    ccm_alSetupSingleUploadForm();
  };
  // setup upload form
}

function cm_alSetupSingleUploadForm() {
  $('.ccm-file-manager-submit-single').submit(function () {
    $(this).attr('target', ccm_alProcessorTarget);
    ccm_alSubmitSingle($(this).get(0));
  });
}

function cm_activateFileSelectors() {
  $('.ccm-file-manager-launch').unbind();
  $('.ccm-file-manager-launch').click(function () {
    ccm_alLaunchSelectorFileManager($(this).parent().attr('ccm-file-manager-field'));
  });
}

function cm_alLaunchSelectorFileManager(selector) {
  ccm_alActiveAssetField = selector;
  let filterStr = '';

  const types = $('#' + selector + '-fm-display input.ccm-file-manager-filter');
  if (types.length) {
    let fields = {}, name;
    for (let i = 0; i < types.length; i++) {
      name = $(types[i]).attr('name');
      if (!(name in fields)) {
        fields[name] = [];
      }
      fields[name].push($(types[i]).attr('value'));
    }
    for (name in fields) {
      if (fields[name].length == 1) {
        filterStr += '&' + name + '=' + encodeURIComponent(fields[name][0]);
      }
      else {
        $.each(fields[name], (i, value) => {
          filterStr += '&' + name + '[]=' + encodeURIComponent(value);
        });
      }
    }
  }

  ccm_launchFileManager(filterStr);
}

// public method - do not remove or rename
function cm_launchFileManager(filters) {
  $.fn.dialog.open({
    width: '90%',
    height: '70%',
    appendButtons: true,
    modal: false,
    href: CCM_TOOLS_PATH + '/files/search_dialog?ocID=' + CCM_CID + '&search=1' + filters,
    title: ccmi18n_filemanager.title,
  });
}

function cm_launchFileSetPicker(fsID) {
  $.fn.dialog.open({
    width: 500,
    height: 160,
    modal: false,
    href: CCM_TOOLS_PATH + '/files/pick_set?oldFSID=' + fsID,
    title: ccmi18n_filemanager.sets,
  });
}

function cm_alSubmitSetsForm(searchInstance) {
  ccm_deactivateSearchResults(searchInstance);
  $.fn.dialog.showLoader();
  $('#ccm-' + searchInstance + '-add-to-set-form').ajaxSubmit((resp) => {
    $.fn.dialog.closeTop();
    $.fn.dialog.hideLoader();
    $('#ccm-' + searchInstance + '-advanced-search').ajaxSubmit((resp) => {
      $('#ccm-' + searchInstance + '-sets-search-wrapper').load(CCM_TOOLS_PATH + '/files/search_sets_reload', { 'searchInstance': searchInstance }, () => {
        $('.chosen-select').chosen(ccmi18n_chosen);
        ccm_parseAdvancedSearchResponse(resp, searchInstance);
      });
    });
  });
}

function cm_alSubmitPasswordForm(searchInstance) {
  ccm_deactivateSearchResults(searchInstance);
  $('#ccm-' + searchInstance + '-password-form').ajaxSubmit((resp) => {
    $.fn.dialog.closeTop();
    $('#ccm-' + searchInstance + '-advanced-search').ajaxSubmit((resp) => {
      ccm_parseAdvancedSearchResponse(resp, searchInstance);
    });
  });
}

function cm_alSubmitStorageForm(searchInstance) {
  ccm_deactivateSearchResults(searchInstance);
  $('#ccm-' + searchInstance + '-storage-form').ajaxSubmit((resp) => {
    $.fn.dialog.closeTop();
    $('#ccm-' + searchInstance + '-advanced-search').ajaxSubmit((resp) => {
      ccm_parseAdvancedSearchResponse(resp, searchInstance);
    });
  });
}

function cm_alSubmitPermissionsForm(searchInstance) {
  ccm_deactivateSearchResults(searchInstance);
  $('#ccm-' + searchInstance + '-permissions-form').ajaxSubmit((resp) => {
    $.fn.dialog.closeTop();
    $('#ccm-' + searchInstance + '-advanced-search').ajaxSubmit((resp) => {
      ccm_parseAdvancedSearchResponse(resp, searchInstance);
    });
  });
}


function cm_alSetupSetsForm(searchInstance) {
  // activate file set search
  $('#fsAddToSearchName').liveUpdate('ccm-file-search-add-to-sets-list', 'fileset');

  // Setup the tri-state checkboxes
  $('.ccm-file-set-add-cb a').each(function () {
    const cb = $(this);
    const startingState = cb.attr('ccm-tri-state-startup');
    $(this).click(function () {
      const selectedState = $(this).attr('ccm-tri-state-selected');
      let toSetState = 0;
      switch (selectedState) {
              case '0':
                      if (startingState == '1') {
                        toSetState = '1';
                      } else {
                        toSetState = '2';
                      }
                      break;
              case '1':
                      toSetState = '2';
                      break;
              case '2':
                      toSetState = '0';
                      break;
      }

      $(this).attr('ccm-tri-state-selected', toSetState);
      $(this).parent().find('input').val(toSetState);
      $(this).find('img').attr('src', CCM_IMAGE_PATH + '/checkbox_state_' + toSetState + '.png');
    });
  });
  $('#ccm-' + searchInstance + '-add-to-set-form input[name=fsNew]').click(function () {
    if (!$(this).prop('checked')) {
      $('#ccm-' + searchInstance + '-add-to-set-form input[name=fsNewText]').val('');
    }
  });
  $('#ccm-' + searchInstance + '-add-to-set-form').submit(() => {
    ccm_alSubmitSetsForm(searchInstance);
    return false;
  });
}

function cm_alSetupPasswordForm() {
  $('#ccm-file-password-form').submit(() => {
    ccm_alSubmitPasswordForm();
    return false;
  });
}
function cm_alRescanFiles() {
  let turl = CCM_TOOLS_PATH + '/files/rescan?';
  const files = arguments;
  for (let i = 0; i < files.length; i++) {
    turl += 'fID[]=' + files[i] + '&';
  }
  $.fn.dialog.open({
    title: ccmi18n_filemanager.rescan,
    href: turl,
    width: 350,
    modal: false,
    height: 200,
    onClose() {
      if (files.length == 1) {
        $('#ccm-file-properties-wrapper').html('');
        $.fn.dialog.showLoader();

        // open the properties window for this bad boy.
        $('#ccm-file-properties-wrapper').load(CCM_TOOLS_PATH + '/files/properties?fID=' + files[0] + '&reload=1', false, function () {
          $.fn.dialog.hideLoader();
          $(this).find('.dialog-launch').dialog();
        });
      }
    },
  });
}


function cm_alSelectPermissionsEntity(selector, id, name) {
  const html = $('#ccm-file-permissions-entity-base').html();
  $('#ccm-file-permissions-entities-wrapper').append('<div class="ccm-file-permissions-entity">' + html + '<\/div>');
  const p = $('.ccm-file-permissions-entity');
  const ap = p[p.length - 1];
  $(ap).find('h3 span').html(name);
  $(ap).find('input[type=hidden]').val(selector + '_' + id);
  $(ap).find('select').each(function () {
    $(this).attr('name', $(this).attr('name') + '_' + selector + '_' + id);
  });
  $(ap).find('div.ccm-file-access-extensions input[type=checkbox]').each(function () {
    $(this).attr('name', $(this).attr('name') + '_' + selector + '_' + id + '[]');
  });

  ccm_alActivateFilePermissionsSelector();
}

function cm_alActivateFilePermissionsSelector() {
  $('.ccm-file-access-add select').unbind();
  $('.ccm-file-access-add select').change(function () {
    const p = $(this).parents('div.ccm-file-permissions-entity')[0];
    if ($(this).val() == ccmi18n_filemanager.PTYPE_CUSTOM) {
      $(p).find('div.ccm-file-access-add-extensions').show();
    } else {
      $(p).find('div.ccm-file-access-add-extensions').hide();
    }
  });
  $('.ccm-file-access-file-manager select').change(function () {
    const p = $(this).parents('div.ccm-file-permissions-entity')[0];
    if ($(this).val() != ccmi18n_filemanager.PTYPE_NONE) {
      $(p).find('.ccm-file-access-add').show();
      $(p).find('.ccm-file-access-edit').show();
      $(p).find('.ccm-file-access-admin').show();
    } else {
      $(p).find('.ccm-file-access-add').hide();
      $(p).find('.ccm-file-access-edit').hide();
      $(p).find('.ccm-file-access-admin').hide();
      $(p).find('div.ccm-file-access-add-extensions').hide();
    }
  });


  $('a.ccm-file-permissions-remove').click(function () {
    $(this).parent().parent().fadeOut(100, function () {
      $(this).remove();
    });
  });
  $('input[name=toggleCanAddExtension]').unbind();
  $('input[name=toggleCanAddExtension]').click(function () {
    const ext = $(this).parent().parent().find('div.ccm-file-access-extensions');

    if ($(this).prop('checked') == 1) {
      ext.find('input').attr('checked', true);
    } else {
      ext.find('input').attr('checked', false);
    }
  });
}

function cm_alSetupVersionSelector() {
  $('#ccm-file-versions-grid input[type=radio]').click(function () {
    $('#ccm-file-versions-grid tr').removeClass('ccm-file-versions-grid-active');

    const trow = $(this).parent().parent();
    const fID = trow.attr('fID');
    const fvID = trow.attr('fvID');
    const postStr = 'task=approve_version&fID=' + fID + '&fvID=' + fvID;
    $.post(CCM_TOOLS_PATH + '/files/properties', postStr, (resp) => {
      trow.addClass('ccm-file-versions-grid-active');
      trow.find('td').show('highlight', {
        color: '#FFF9BB',
      });
    });
  });

  $('.ccm-file-versions-remove').click(function () {
    const trow = $(this).parent().parent();
    const fID = trow.attr('fID');
    const fvID = trow.attr('fvID');
    const postStr = 'task=delete_version&fID=' + fID + '&fvID=' + fvID;
    $.post(CCM_TOOLS_PATH + '/files/properties', postStr, (resp) => {
      trow.fadeOut(200, () => {
        trow.remove();
      });
    });
    return false;
  });
}

function cm_alDeleteFiles(searchInstance) {
  $(`#ccm-${searchInstance}-delete-form`).ajaxSubmit((resp) => {
    ccm_parseJSON(resp, () => {
      $.fn.dialog.closeTop();
      ccm_deactivateSearchResults(searchInstance);
      $('#ccm-' + searchInstance + '-advanced-search').ajaxSubmit((resp) => {
        ccm_parseAdvancedSearchResponse(resp, searchInstance);
      });
    });
  });
}

function cm_alDuplicateFiles(searchInstance) {
  $(`#ccm-${searchInstance}-duplicate-form`).ajaxSubmit((resp) => {
    ccm_parseJSON(resp, () => {
      $.fn.dialog.closeTop();
      ccm_deactivateSearchResults(searchInstance);
      const r = eval('(' + resp + ')');

      $('#ccm-' + searchInstance + '-advanced-search').ajaxSubmit((resp) => {
        ccm_parseAdvancedSearchResponse(resp, searchInstance);
        const highlight = [];
        for (let i = 0; i < r.fID.length; i++) {
          fID = r.fID[i];
          ccm_uploadedFiles.push(fID);
          highlight.push(fID);
        }
        ccm_alRefresh(highlight, searchInstance);
        ccm_filesUploadedDialog(searchInstance);
      });
    });
  });
}

function cm_alSetupSelectFiles(searchInstance) {
  $('.ccm-file-list').unbind();
  $('.ccm-file-list tr.ccm-list-record').click(function (e) {
    e.stopPropagation();
    ccm_alActivateMenu($(this), e);
  });
  $('.ccm-file-list img.ccm-star').click((e) => {
    e.stopPropagation();
    let fID = $(e.target).parents('tr.ccm-list-record')[0].id;
    fID = fID.substring(3);
    ccm_starFile(e.target, fID);
  });
  if (ccm_alLaunchType[searchInstance] == 'DASHBOARD') {
    $('.ccm-file-list-thumbnail').hover(function (e) {
      const fID = $(this).attr('fID');
      const obj = $('#fID' + fID + 'hoverThumbnail');
      if (obj.length > 0) {
        const tdiv = obj.find('div');
        const pos = obj.position();
        tdiv.css('top', pos.top);
        tdiv.css('left', pos.left);
        tdiv.show();
      }
    }, function () {
      const fID = $(this).attr('fID');
      const obj = $('#fID' + fID + 'hoverThumbnail');
      const tdiv = obj.find('div');
      tdiv.hide();
    });
  }
}

function cm_alSetupCheckboxes(searchInstance) {
  $('#ccm-' + searchInstance + '-list-cb-all').unbind();
  $('#ccm-' + searchInstance + '-list-cb-all').click(function () {
    ccm_hideMenus();
    if ($(this).prop('checked') == true) {
      $('#ccm-' + searchInstance + '-search-results td.ccm-file-list-cb input[type=checkbox]').attr('checked', true);
      $('#ccm-' + searchInstance + '-list-multiple-operations').attr('disabled', false);
    } else {
      $('#ccm-' + searchInstance + '-search-results td.ccm-file-list-cb input[type=checkbox]').attr('checked', false);
      $('#ccm-' + searchInstance + '-list-multiple-operations').attr('disabled', true);
    }
  });
  $('#ccm-' + searchInstance + '-search-results td.ccm-file-list-cb input[type=checkbox]').click((e) => {
    e.stopPropagation();
    ccm_hideMenus();
    ccm_alRescanMultiFileMenu(searchInstance);
  });
  $('#ccm-' + searchInstance + '-search-results td.ccm-file-list-cb').click(function (e) {
    e.stopPropagation();
    ccm_hideMenus();
    $(this).find('input[type=checkbox]').click();
    ccm_alRescanMultiFileMenu(searchInstance);
  });

  // if we're not in the dashboard, add to the multiple operations select menu
  if (ccm_alLaunchType[searchInstance] != 'DASHBOARD' && ccm_alLaunchType[searchInstance] != 'BROWSE') {
    const chooseText = ccmi18n_filemanager.select;
    $('#ccm-' + searchInstance + '-list-multiple-operations option:eq(0)').after('<option value="choose">' + chooseText + '</option>');
  }
  $('#ccm-' + searchInstance + '-list-multiple-operations').change(function () {
    const action = $(this).val();
    const fIDstring = ccm_alGetSelectedFileIDs(searchInstance);
    switch (action) {
            case 'choose':
                    var fIDs = [];
                    $('#ccm-' + searchInstance + '-search-results td.ccm-file-list-cb input[type=checkbox]:checked').each(function () {
                      fIDs.push($(this).val());
                    });
                    ccm_alSelectFile(fIDs, true);
                    break;
            case 'delete':
                    $.fn.dialog.open({
                      width: 500,
                      height: 400,
                      modal: false,
                      appendButtons: true,
                      href: CCM_TOOLS_PATH + '/files/delete?' + fIDstring + '&searchInstance=' + searchInstance,
                      title: ccmi18n_filemanager.deleteFile,
                    });
                    break;
            case 'duplicate':
                    $.fn.dialog.open({
                      width: 500,
                      height: 400,
                      modal: false,
                      href: CCM_TOOLS_PATH + '/files/duplicate?' + fIDstring + '&searchInstance=' + searchInstance,
                      title: ccmi18n_filemanager.duplicateFile,
                    });
                    break;
            case 'sets':
                    $.fn.dialog.open({
                      width: 500,
                      height: 400,
                      modal: false,
                      href: CCM_TOOLS_PATH + '/files/add_to?' + fIDstring + '&searchInstance=' + searchInstance,
                      title: ccmi18n_filemanager.sets,
                    });
                    break;
            case 'properties':
                    $.fn.dialog.open({
                      width: 690,
                      height: 440,
                      modal: false,
                      href: CCM_TOOLS_PATH + '/files/bulk_properties?' + fIDstring + '&searchInstance=' + searchInstance,
                      title: ccmi18n.properties,
                    });
                    break;
            case 'rescan':
                    $.fn.dialog.open({
                      width: 350,
                      height: 200,
                      modal: false,
                      href: CCM_TOOLS_PATH + '/files/rescan?' + fIDstring + '&searchInstance=' + searchInstance,
                      title: ccmi18n_filemanager.rescan,
                      onClose() {
                        $('#ccm-' + searchInstance + '-advanced-search').submit();
                      },
                    });
                    break;
            case 'download':
                    window.frames[ccm_alProcessorTarget].location = CCM_TOOLS_PATH + '/files/download?' + fIDstring;
                    break;
    }

    $(this).get(0).selectedIndex = 0;
  });

  // activate the file sets checkboxes
  ccm_alSetupFileSetSearch(searchInstance);
}

function cm_alSetupFileSetSearch(searchInstance) {
  $('#ccm-' + searchInstance + '-sets-search-wrapper select').chosen(ccmi18n_chosen).unbind();
  $('#ccm-' + searchInstance + '-sets-search-wrapper select').chosen(ccmi18n_chosen).change(() => {
    const sel = $('#ccm-' + searchInstance + '-sets-search-wrapper option:selected');
    $('#ccm-' + searchInstance + '-advanced-search').submit();
  });
}


function cm_alGetSelectedFileIDs(searchInstance) {
  let fidstr = '';
  $('#ccm-' + searchInstance + '-search-results td.ccm-file-list-cb input[type=checkbox]:checked').each(function () {
    fidstr += 'fID[]=' + $(this).val() + '&';
  });
  return fidstr;
}

function cm_alRescanMultiFileMenu(searchInstance) {
  if ($('#ccm-' + searchInstance + '-search-results td.ccm-file-list-cb input[type=checkbox]:checked').length > 0) {
    $('#ccm-' + searchInstance + '-list-multiple-operations').attr('disabled', false);
  } else {
    $('#ccm-' + searchInstance + '-list-multiple-operations').attr('disabled', true);
  }
}

function cm_alSetupFileProcessor() {
  if (ccm_alProcessorTarget != '') {
    return false;
  }

  const ts = parseInt(new Date().getTime().toString().substring(0, 10));
  let ifr;
  try { // IE7 hack
    ifr = document.createElement('<iframe name="ccm-al-upload-processor' + ts + '">');
  } catch (ex) {
    ifr = document.createElement('iframe');
  }
  ifr.id = 'ccm-al-upload-processor' + ts;
  ifr.name = 'ccm-al-upload-processor' + ts;
  ifr.style.border = '0px';
  ifr.style.width = '0px';
  ifr.style.height = '0px';
  ifr.style.display = 'none';
  document.body.appendChild(ifr);

  if (ccm_alDebug) {
    ccm_alProcessorTarget = '_blank';
  } else {
    ccm_alProcessorTarget = 'ccm-al-upload-processor' + ts;
  }
}

function cm_alSubmitSingle(form) {
  if ($(form).find('.ccm-al-upload-single-file').val() == '') {
    return false;
  } else {
    $(form).find('.ccm-al-upload-single-submit').hide();
    $(form).find('.ccm-al-upload-single-loader').show();
  }
}

function cm_alResetSingle() {
  $('.ccm-al-upload-single-file').val('');
  $('.ccm-al-upload-single-loader').hide();
  $('.ccm-al-upload-single-submit').show();
}

function cm_filesUploadedDialog(searchInstance) {
  if (document.getElementById('ccm-file-upload-multiple-tab')) $.fn.dialog.closeTop();
  let fIDstring = '';
  for (let i = 0; i < ccm_uploadedFiles.length; i++)
  fIDstring = fIDstring + '&fID[]=' + ccm_uploadedFiles[i];
  $.fn.dialog.open({
    width: 690,
    height: 440,
    modal: false,
    href: CCM_TOOLS_PATH + '/files/bulk_properties/?' + fIDstring + '&uploaded=true&searchInstance=' + searchInstance,
    onClose() {
      ccm_deactivateSearchResults(searchInstance);
      $('#ccm-' + searchInstance + '-advanced-search').ajaxSubmit((resp) => {
        ccm_parseAdvancedSearchResponse(resp, searchInstance);
      });
    },
    title: ccmi18n_filemanager.uploadComplete,
  });
  ccm_uploadedFiles = [];
}

function cm_alSetupUploadDetailsForm(searchInstance) {
  $('#ccm-' + searchInstance + '-update-uploaded-details-form').submit(() => {
    ccm_alSubmitUploadDetailsForm(searchInstance);
    return false;
  });
}

function cm_alSubmitUploadDetailsForm(searchInstance) {
  $.fn.dialog.showLoader();
  $('#ccm-' + searchInstance + '-update-uploaded-details-form').ajaxSubmit((r1) => {
    const r1a = eval('(' + r1 + ')');
    const form = $('#ccm-' + searchInstance + '-advanced-search');
    if (form.length > 0) {
      form.ajaxSubmit((resp) => {
        $('#ccm-' + searchInstance + '-sets-search-wrapper').load(CCM_TOOLS_PATH + '/files/search_sets_reload', { 'searchInstance': searchInstance }, () => {
          $.fn.dialog.hideLoader();
          $.fn.dialog.closeTop();
          ccm_parseAdvancedSearchResponse(resp, searchInstance);
          ccm_alHighlightFileIDArray(r1a);
        });
      });
    } else {
      $.fn.dialog.hideLoader();
      $.fn.dialog.closeTop();
    }
  });
}

function cm_alRefresh(highlightFIDs, searchInstance, fileSelector) {
  const ids = highlightFIDs;
  ccm_deactivateSearchResults(searchInstance);
  $('#ccm-' + searchInstance + '-search-results').load(CCM_TOOLS_PATH + '/files/search_results', {
    'ccm_order_by': 'fvDateAdded',
    'ccm_order_dir': 'desc',
    'fileSelector': fileSelector,
    'searchType': ccm_alLaunchType[searchInstance],
    'searchInstance': searchInstance,
  }, () => {
    ccm_activateSearchResults(searchInstance);
    if (ids != false) {
      ccm_alHighlightFileIDArray(ids);
    }
    ccm_alSetupSelectFiles(searchInstance);
  });
}

function cm_alHighlightFileIDArray(ids) {
  for (let i = 0; i < ids.length; i++) {
    const td = $('tr[fID=' + ids[i] + '] td');
    const oldBG = td.css('backgroundColor');
    td.animate({ backgroundColor: '#FFF9BB' }, { queue: true, duration: 1000 }).animate({ backgroundColor: oldBG }, 500);
  }
}

function cm_alSelectFile(fID) {
  if (typeof (ccm_chooseAsset) == 'function') {
    let qstring = '';
    if (typeof (fID) == 'object') {
      for (let i = 0; i < fID.length; i++) {
        qstring += 'fID[]=' + fID[i] + '&';
      }
    } else {
      qstring += 'fID=' + fID;
    }

    $.getJSON(CCM_TOOLS_PATH + '/files/get_data.php?' + qstring, (resp) => {
      ccm_parseJSON(resp, () => {
        for (let i = 0; i < resp.length; i++) {
          ccm_chooseAsset(resp[i]);
        }
        $.fn.dialog.closeTop();
      });
    });
  } else {
    if (typeof (fID) == 'object') {
      for (let i = 0; i < fID.length; i++) {
        ccm_triggerSelectFile(fID[i]);
      }
    } else {
      ccm_triggerSelectFile(fID);
    }
    $.fn.dialog.closeTop();
  }
}

function cm_alActivateMenu(obj, e) {
  // Is this a file that's already been chosen that we're selecting?
  // If so, we need to offer the reset switch
  const selectedFile = $(obj).find('div[ccm-file-manager-field]');
  let selector = '';
  if (selectedFile.length > 0) {
    selector = selectedFile.attr('ccm-file-manager-field');
  }
  if (!selector) {
    selector = 	ccm_alActiveAssetField;
  }
  ccm_hideMenus();

  const fID = $(obj).attr('fID');
  const searchInstance = $(obj).attr('ccm-file-manager-instance');

  // now, check to see if this menu has been made
  let bobj = document.getElementById('ccm-al-menu' + fID + searchInstance + selector);

  // This immediate click mode has promise, but it's annoying more than it's helpful
  /*
     if (ccm_alLaunchType != 'DASHBOARD' && selector == '') {
  // then we are in file list mode in the site, which means we
  // we don't give out all the options in the list
  ccm_alSelectFile(fID);
  return;
  }
  */

  if (!bobj) {
    // create the 1st instance of the menu
    el = document.createElement('DIV');
    el.id = 'ccm-al-menu' + fID + searchInstance + selector;
    el.className = 'ccm-menu ccm-ui';
    el.style.display = 'block';
    el.style.visibility = 'hidden';
    document.body.appendChild(el);

    const passedFilters = $('div[ccm-file-manager-field=' + selector + '] input.ccm-file-manager-filter');
    let filterStr = '';
    if (passedFilters.length > 0) {
      passedFilters.each(function () {
        filterStr += '&' + $(this).attr('name') + '=' + $(this).attr('value');
      });
    }
    const filepath = $(obj).attr('al-filepath');
    bobj = $('#ccm-al-menu' + fID + searchInstance + selector);
    bobj.css('position', 'absolute');

    // contents  of menu
    let html = '<div class="popover"><div class="arrow"></div><div class="inner"><div class="content">';
    html += '<ul>';
    if (ccm_alLaunchType[searchInstance] != 'DASHBOARD' && ccm_alLaunchType[searchInstance] != 'BROWSE') {
      // if we're launching this at the selector level, that means we've already chosen a file, and this should instead launch the library
      const onclick = (selectedFile.length > 0) ? 'ccm_alLaunchSelectorFileManager(\'' + selector + '\')' : 'ccm_alSelectFile(' + fID + ')';
      const chooseText = (selectedFile.length > 0) ? ccmi18n_filemanager.chooseNew : ccmi18n_filemanager.select;
      html += `
      <li>
      <a class="ccm-menu-icon ccm-icon-choose-file-menu" dialog-modal="false" dialog-width="90%" dialog-height="70%" dialog-title="${ccmi18n_filemanager.select}" id="menuSelectFile${fID}" onclick="${onclick}">
      ${chooseText}
      </a>
      </li>`;
    }
    if (selectedFile.length > 0) {
      html += `
      <li>
      <a class="ccm-menu-icon ccm-icon-clear-file-menu" id="menuClearFile${fID + searchInstance + selector}">
      ${ccmi18n_filemanager.clear}
      </a>
      </li>`;
    }

    if (ccm_alLaunchType[searchInstance] != 'DASHBOARD' && ccm_alLaunchType[searchInstance] != 'BROWSE' && selectedFile.length > 0) {
      html += '<li class="ccm-menu-separator"></li>';
    }
    if ($(obj).attr('ccm-file-manager-can-view') == '1') {
      html += `
      <li>
      <a class="ccm-menu-icon ccm-icon-view dialog-launch" dialog-modal="false" dialog-append-buttons="true" dialog-width="90%" dialog-height="75%" dialog-title="${ccmi18n_filemanager.view}" id="menuView${fID}" href="${CCM_TOOLS_PATH}/files/view?fID=${fID}">
      ${ccmi18n_filemanager.view}
      </a>
      </li>`;
    } else {
      html += `
      <li>
      <a class="ccm-menu-icon ccm-icon-download-menu" id="menuDownload${fID}" onclick="window.frames['${ccm_alProcessorTarget}'].location='${CCM_TOOLS_PATH}/files/download?fID=${fID}'">
      ${ccmi18n_filemanager.download}
      </a>
      </li>`;
    }
    if ($(obj).attr('ccm-file-manager-can-edit') == '1') {
      html += `
      <li>
      <a class="ccm-menu-icon ccm-icon-edit-menu dialog-launch" dialog-modal="false" dialog-width="90%" dialog-height="75%" dialog-title="${ccmi18n_filemanager.edit}" id="menuEdit${fID}" href="${CCM_TOOLS_PATH}/files/edit?searchInstance=${searchInstance}&fID=${fID + filterStr}">
      ${ccmi18n_filemanager.edit}
      </a>
      </li>`;
    }
    html += `
    <li>
    <a class="ccm-menu-icon ccm-icon-properties-menu dialog-launch" dialog-modal="false" dialog-width="680" dialog-height="450" dialog-title="${ccmi18n_filemanager.properties}" id="menuProperties${fID}" href="${CCM_TOOLS_PATH}/files/properties?searchInstance=${searchInstance}&fID=${fID}">
    ${ccmi18n_filemanager.properties}
    </a>
    </li>`;
    if ($(obj).attr('ccm-file-manager-can-replace') == '1') {
      html += `
      <li>
      <a class="ccm-menu-icon ccm-icon-replace dialog-launch" dialog-modal="false" dialog-width="300" dialog-height="260" dialog-title="${ccmi18n_filemanager.replace}" id="menuFileReplace${fID}" href="${CCM_TOOLS_PATH}/files/replace?searchInstance=${searchInstance}&fID=${fID}">
      ${ccmi18n_filemanager.replace}
      </a>
      </li>`;
    }
    if ($(obj).attr('ccm-file-manager-can-duplicate') == '1') {
      html += `
      <li>
      <a class="ccm-menu-icon ccm-icon-copy-menu" id="menuFileDuplicate${fID}" onclick="ccm_alDuplicateFile(${fID},\'${searchInstance}\')">
      ${ccmi18n_filemanager.duplicate}
      </a>
      </li>`;
    }
    html += `
    <li>
    <a class="ccm-menu-icon ccm-icon-sets dialog-launch" dialog-modal="false" dialog-width="500" dialog-height="400" dialog-title="${ccmi18n_filemanager.sets}" id="menuFileSets${fID}" href="${CCM_TOOLS_PATH}/files/add_to?searchInstance=${searchInstance}&fID=${fID}">
    ${ccmi18n_filemanager.sets}
    </a>
    </li>`;
    if ($(obj).attr('ccm-file-manager-can-admin') == '1' || $(obj).attr('ccm-file-manager-can-delete') == '1') {
      html += '<li class="ccm-menu-separator"></li>';
    }
    if ($(obj).attr('ccm-file-manager-can-admin') == '1') {
      html += `
      <li>
      <a class="ccm-menu-icon ccm-icon-access-permissions dialog-launch" dialog-modal="false" dialog-width="400" dialog-height="450" dialog-title="${ccmi18n_filemanager.permissions}" id="menuFilePermissions${fID}" href="${CCM_TOOLS_PATH}/files/permissions?searchInstance=${searchInstance}&fID=${fID}">
      ${ccmi18n_filemanager.permissions}
      </a>
      </li>`;
    }
    if ($(obj).attr('ccm-file-manager-can-delete') == '1') {
      html += `
      <li>
      <a class="ccm-icon-delete-menu ccm-menu-icon dialog-launch" dialog-append-buttons="true" dialog-modal="false" dialog-width="500" dialog-height="200" dialog-title="${ccmi18n_filemanager.deleteFile}" id="menuDeleteFile${fID}" href="${CCM_TOOLS_PATH}/files/delete?searchInstance=${searchInstance}&fID=${fID}">
      ${ccmi18n_filemanager.deleteFile}
      </a>
      </li>`;
    }
    html += '</ul>';
    html += '</div></div></div>';
    bobj.append(html);

    $(bobj).find('a').bind('click.hide-menu', (e) => {
      ccm_hideMenus();
      return false;
    });

    $('#ccm-al-menu' + fID + searchInstance + selector + ' a.dialog-launch').dialog();

    $('a#menuClearFile' + fID + searchInstance + selector).click((e) => {
      ccm_clearFile(e, selector);
      ccm_hideMenus();
    });
  } else {
    bobj = $('#ccm-al-menu' + fID + searchInstance + selector);
  }

  ccm_fadeInMenu(bobj, e);
}

function cm_alSelectNone() {
  ccm_hideMenus();
}

function toggleCheckboxStatus(form) {
  if (checkboxStatus) {
    for (let i = 0; i < form.elements.length; i++) {
      if (form.elements[i].type == 'checkbox') {
        form.elements[i].checked = false;
      }
    }
    checkboxStatus = false;
  } else {
    for (let i = 0; i < form.elements.length; i++) {
      if (form.elements[i].type == 'checkbox') {
        form.elements[i].checked = true;
      }
    }
    checkboxStatus = true;
  }
}

function cm_alDuplicateFile(fID, searchInstance) {
  const postStr = 'fID=' + fID + '&searchInstance=' + searchInstance;

  $.post(CCM_TOOLS_PATH + '/files/duplicate', postStr, (resp) => {
    const r = eval('(' + resp + ')');

    if (r.error == 1) {
      ccmAlert.notice(ccmi18n.error, r.message);
      return false;
    }


    const highlight = [];
    if (r.fID) {
      highlight.push(r.fID);
      ccm_alRefresh(highlight, searchInstance);
      ccm_uploadedFiles.push(r.fID);
      ccm_filesUploadedDialog(searchInstance);
    }
  });
}

function cm_alSelectMultipleIncomingFiles(obj) {
  if ($(obj).prop('checked')) {
    $('input.ccm-file-select-incoming').attr('checked', true);
  } else {
    $('input.ccm-file-select-incoming').attr('checked', false);
  }
}

function cm_starFile(img, fID) {
  let action = '';
  if ($(img).attr('src').indexOf(CCM_STAR_STATES.unstarred) != -1) {
    $(img).attr('src', $(img).attr('src').replace(CCM_STAR_STATES.unstarred, CCM_STAR_STATES.starred));
    action = 'star';
  } else {
    $(img).attr('src', $(img).attr('src').replace(CCM_STAR_STATES.starred, CCM_STAR_STATES.unstarred));
    action = 'unstar';
  }

  $.post(`${CCM_TOOLS_PATH}/${CCM_STAR_ACTION}`, { action, 'file-id': fID }, (data, textStatus) => {
    // callback, in case we want to do some post processing
  });
}

const FileManager = {
  cm_triggerSelectFile,
  cm_alGetFileData,
  cm_clearFile,
  cm_activateFileManager,
  cm_alSetupSingleUploadForm,
  cm_activateFileSelectors,
  cm_alLaunchSelectorFileManager,
  cm_launchFileManager,
  cm_launchFileSetPicker,
  cm_alSubmitSetsForm,
  cm_alSubmitPasswordForm,
  cm_alSubmitStorageForm,
  cm_alSubmitPermissionsForm,
  cm_alSetupSetsForm,
  cm_alSetupPasswordForm,
  cm_alRescanFiles,
  cm_alSelectPermissionsEntity,
  cm_alActivateFilePermissionsSelector,
  cm_alSetupVersionSelector,
  cm_alDeleteFiles,
  cm_alDuplicateFiles,
  cm_alSetupSelectFiles,
  cm_alSetupCheckboxes,
  cm_alSetupFileSetSearch,
  cm_alGetSelectedFileIDs,
  cm_alRescanMultiFileMenu,
  cm_alSetupFileProcessor,
  cm_alSubmitSingle,
  cm_alResetSingle,
  cm_filesUploadedDialog,
  cm_alSetupUploadDetailsForm,
  cm_alSubmitUploadDetailsForm,
  cm_alRefresh,
  cm_alHighlightFileIDArray,
  cm_alSelectFile,
  cm_alActivateMenu,
  cm_alSelectNone,
  toggleCheckboxStatus,
  cm_alDuplicateFile,
  cm_alSelectMultipleIncomingFiles,
  cm_starFile,
};

export default FileManager;

