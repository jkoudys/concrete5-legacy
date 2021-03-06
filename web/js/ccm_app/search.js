/*
 * Search
 */
/* global window */
import $ from 'jquery';

window.ccm_searchActivatePostFunction = window.ccm_searchActivatePostFunction || [];
let totalAdvancedSearchFields = 0;

function ccm_setupAdvancedSearchFields(searchType) {
  totalAdvancedSearchFields = $('.ccm-search-request-field-set').length;
  $('#ccm-' + searchType + '-search-add-option').unbind();
  $('#ccm-' + searchType + '-search-add-option').click(() => {
    totalAdvancedSearchFields++;
    if ($('#ccm-search-fields-wrapper').length > 0) {
      $('#ccm-search-fields-wrapper').append('<div class="ccm-search-field" id="ccm-' + searchType + '-search-field-set' + totalAdvancedSearchFields + '">' + $('#ccm-search-field-base').html() + '<\/div>');
    } else {
      $('#ccm-' + searchType + '-search-advanced-fields').append('<tr class="ccm-search-field" id="ccm-' + searchType + '-search-field-set' + totalAdvancedSearchFields + '">' + $('#ccm-search-field-base').html() + '<\/tr>');
    }
    ccm_activateAdvancedSearchFields(searchType, totalAdvancedSearchFields);
  });

  // we have to activate any of the fields that were here based on the request
  // these fields show up after a page is reloaded but we want to keep showing the request fields
  let i = 1;
  $('.ccm-search-request-field-set').each(() => {
    ccm_activateAdvancedSearchFields(searchType, i);
    i++;
  });
}

function ccm_setupAdvancedSearch(searchType) {
  ccm_setupAdvancedSearchFields(searchType);
  $('#ccm-' + searchType + '-advanced-search').ajaxForm({
    beforeSubmit() {
      ccm_deactivateSearchResults(searchType);
    },

    success(resp) {
      ccm_parseAdvancedSearchResponse(resp, searchType);
    },
  });
  ccm_setupInPagePaginationAndSorting(searchType);
  ccm_setupSortableColumnSelection(searchType);
}

function ccm_parseAdvancedSearchResponse(resp, searchType) {
  let obj = $('#ccm-' + searchType + '-search-results');
  if (obj.length == 0 || searchType == null) {
    obj = $('#ccm-search-results');
  }
  obj.html(resp);
  ccm_activateSearchResults(searchType);
}

function ccm_deactivateSearchResults(searchType) {
  var obj = $('#ccm-' + searchType + '-search-fields-submit');
  if (obj.length == 0 || searchType == null) {
    obj = $('#ccm-search-fields-submit');
  }
  obj.attr('disabled', true);
  var obj = $('#ccm-' + searchType + '-search-results table.ccm-results-list');
  if (obj.length == 0 || searchType == null) {
    obj = $('#ccm-search-results');
  }
  obj.css('opacity', 0.4);
  $.fn.dialog.showLoader();
}

function ccm_activateSearchResults(searchType) {
  /* if ($('a[name=ccm-' + searchType + '-list-wrapper-anchor]').length > 0) {
     window.location.hash = 'ccm-' + searchType + '-list-wrapper-anchor';
     }*/
  if ($('.ui-dialog-content').length == 0) {
    window.scrollTo(0, 0);
  } else {
    $('.ui-dialog-content').each(function (i) {
      $(this).get(0).scrollTop = 0;
    });
  }
  $('.dialog-launch').dialog();
  var obj = $('#ccm-' + searchType + '-search-results table.ccm-results-list');
  if (obj.length == 0 || searchType == null) {
    obj = $('#ccm-search-results');
  }
  obj.css('opacity', 1);
  $.fn.dialog.hideLoader();
  var obj = $('#ccm-' + searchType + '-search-fields-submit');
  if (obj.length == 0 || searchType == null) {
    obj = $('#ccm-search-fields-submit');
  }
  obj.attr('disabled', false);
  ccm_setupInPagePaginationAndSorting(searchType);
  ccm_setupSortableColumnSelection(searchType);
  if (typeof (window.ccm_searchActivatePostFunction[searchType]) == 'function') {
    window.ccm_searchActivatePostFunction[searchType]();
  }
}

function ccm_setupInPagePaginationAndSorting(searchType) {
  $('.ccm-results-list th a').click(function () {
    ccm_deactivateSearchResults(searchType);
    let obj = $('#ccm-' + searchType + '-search-results');
    if (obj.length == 0) {
      obj = $('#ccm-search-results');
    }
    obj.load($(this).attr('href'), false, () => {
      ccm_activateSearchResults(searchType);
    });
    return false;
  });
  $('div.ccm-pagination a').click(function () {
    if (!($(this).parent().hasClass('disabled'))) {
      ccm_deactivateSearchResults(searchType);
      let obj = $('#ccm-' + searchType + '-search-results');
      if (obj.length == 0) {
        obj = $('#ccm-search-results');
      }
      obj.load($(this).attr('href'), false, () => {
        ccm_activateSearchResults(searchType);
        $('div.ccm-dialog-content').attr('scrollTop', 0);
      });
    }
    return false;
  });
  $('.ccm-pane-dialog-pagination').each(function () {
    $(this).closest('.ui-dialog-content').dialog('option', 'buttons', [{}]);
    $(this).closest('.ui-dialog').find('.ui-dialog-buttonpane .ccm-pane-dialog-pagination').remove();
    $(this).appendTo($(this).closest('.ui-dialog').find('.ui-dialog-buttonpane').addClass('ccm-ui'));
  });
}

function ccm_setupSortableColumnSelection(searchType) {
  $('#ccm-list-view-customize').unbind();
  $('#ccm-list-view-customize').click(function () {
    $.fn.dialog.open({
      width: 550,
      height: 350,
      appendButtons: true,
      modal: false,
      href: $(this).attr('href'),
      title: ccmi18n.customizeSearch,
    });
    return false;
  });
}

function ccm_checkSelectedAdvancedSearchField(searchType, fieldset) {
  $('#ccm-' + searchType + '-search-field-set' + fieldset + ' .ccm-search-option-type-date_time input').each(function () {
    $(this).attr('id', $(this).attr('id') + fieldset);
  });
  $('#ccm-' + searchType + '-search-field-set' + fieldset + ' .ccm-search-option-type-date_time input').datepicker({
    showAnim: 'fadeIn',
  });
  $('#ccm-' + searchType + '-search-field-set' + fieldset + ' .ccm-search-option-type-rating input').rating();
}

function ccm_activateAdvancedSearchFields(searchType, fieldset) {
  const selTag = $('#ccm-' + searchType + '-search-field-set' + fieldset + ' select:first');
  selTag.unbind();
  selTag.change(function () {
    const selected = $(this).find(':selected').val();
    $(this).parent().parent().find('input.ccm-' + searchType + '-selected-field').val(selected);

    const itemToCopy = $('#ccm-' + searchType + '-search-field-base-elements span[search-field=' + selected + ']');
    $('#ccm-' + searchType + '-search-field-set' + fieldset + ' .ccm-selected-field-content').html('');
    itemToCopy.clone().appendTo('#ccm-' + searchType + '-search-field-set' + fieldset + ' .ccm-selected-field-content');

    $('#ccm-' + searchType + '-search-field-set' + fieldset + ' .ccm-selected-field-content .ccm-search-option').show();
    ccm_checkSelectedAdvancedSearchField(searchType, fieldset);
  });


  // add the initial state of the latest select menu
  /*
     var lastSelect = $("#ccm-" + searchType + "-search-field-set" + fieldset + " select[ccm-advanced-search-selector=1]").eq($(".ccm-" + searchType + "-search-field select[ccm-advanced-search-selector=1]").length-1);
     var selected = lastSelect.find(':selected').val();
     lastSelect.next('input.ccm-" + searchType + "-selected-field').val(selected);
     */

  $('#ccm-' + searchType + '-search-field-set' + fieldset + ' .ccm-search-remove-option').unbind();
  $('#ccm-' + searchType + '-search-field-set' + fieldset + ' .ccm-search-remove-option').click(function () {
    $(this).parents('div.ccm-search-field').remove();
    $(this).parents('tr.ccm-search-field').remove();
  });

  ccm_checkSelectedAdvancedSearchField(searchType, fieldset);
}


function ccm_activateEditablePropertiesGrid() {
  $('tr.ccm-attribute-editable-field').each(function () {
    const trow = $(this);
    $(this).find('a').click(() => {
      trow.find('.ccm-attribute-editable-field-text').hide();
      trow.find('.ccm-attribute-editable-field-clear-button').hide();
      trow.find('.ccm-attribute-editable-field-form').show();
      trow.find('.ccm-attribute-editable-field-save-button').show();
    });

    trow.find('form').submit(() => {
      return false;
    });

    trow.find('.ccm-attribute-editable-field-save-button').parent().click(() => {
      const task = trow.find('form input[name=task]');
      if (task.val() == 'clear_extended_attribute') {
        task.val(task.attr('data-original-task'));
        task.attr('data-original-task', '');
      }
      ccm_submitEditablePropertiesGrid(trow);
    });

    trow.find('.ccm-attribute-editable-field-clear-button').parent().unbind();
    trow.find('.ccm-attribute-editable-field-clear-button').parent().click(() => {
      const task = trow.find('form input[name=task]');
      task.attr('data-original-task', task.val());
      task.val('clear_extended_attribute');
      ccm_submitEditablePropertiesGrid(trow);
      return false;
    });
  });
}

function ccm_submitEditablePropertiesGrid(trow) {
  trow.find('.ccm-attribute-editable-field-save-button').hide();
  trow.find('.ccm-attribute-editable-field-clear-button').hide();
  trow.find('.ccm-attribute-editable-field-loading').show();
  try {
    tinyMCE.triggerSave(true, true);
  } catch (e) { }

  trow.find('form').ajaxSubmit((resp) => {
    // resp is new HTML to display in the div
    trow.find('.ccm-attribute-editable-field-loading').hide();
    trow.find('.ccm-attribute-editable-field-save-button').show();
    trow.find('.ccm-attribute-editable-field-text').html(resp);
    trow.find('.ccm-attribute-editable-field-form').hide();
    trow.find('.ccm-attribute-editable-field-save-button').hide();
    trow.find('.ccm-attribute-editable-field-text').show();
    trow.find('.ccm-attribute-editable-field-clear-button').show();
    trow.find('td').show('highlight', {
      color: '#FFF9BB',
    });
  });
}

const Search = {
  ccm_setupAdvancedSearchFields,
  ccm_setupAdvancedSearch,
  ccm_parseAdvancedSearchResponse,
  ccm_deactivateSearchResults,
  ccm_activateSearchResults,
  ccm_setupInPagePaginationAndSorting,
  ccm_setupSortableColumnSelection,
  ccm_checkSelectedAdvancedSearchField,
  ccm_activateAdvancedSearchFields,
  ccm_activateEditablePropertiesGrid,
  ccm_submitEditablePropertiesGrid,
};

export default Search;
