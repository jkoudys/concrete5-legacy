import $ from 'jquery';

const { CCM_TOOLS_PATH, CCM_CID } = window;

// use as an object:
// var myLayout = new ccmLayout();

function ccmLayout(areaNameNumber, cvalID, layout_id, area, locked) {
  this.layout_id = layout_id;
  this.cvalID = cvalID;
  this.locked = locked;
  this.area = area;
  this.areaNameNumber = areaNameNumber;

  this.init = function () {
    // ccmAlert.hud( 'test3', 2000, 'add', 'test2');

    const layoutObj = this;
    this.layoutWrapper = $('#ccm-layout-wrapper-' + this.cvalID);
    this.ccmControls = this.layoutWrapper.find('#ccm-layout-controls-' + this.cvalID);
    this.ccmControls.get(0).layoutObj = this;

    this.ccmControls.mouseover(() => { layoutObj.dontUpdateTwins = 0; layoutObj.highlightAreas(1); });

    this.ccmControls.mouseout(() => { if (!layoutObj.moving) layoutObj.highlightAreas(0); });

    this.ccmControls.find('.ccm-layout-menu-button').click((e) => {
      layoutObj.optionsMenu(e);
    });

    this.gridSizing();
  };

  this.highlightAreas = function (show) {
    const els = this.layoutWrapper.find('.ccm-add-block');
    if (show) els.addClass('ccm-layout-area-highlight');
    else els.removeClass('ccm-layout-area-highlight');
  };

  this.optionsMenu = function (e) {
    ccm_hideMenus();
    e.stopPropagation();
    ccm_menuActivated = true;

    // now, check to see if this menu has been made
    let aobj = document.getElementById('ccm-layout-options-menu-' + this.cvalID);

    if (!aobj) {
      // create the 1st instance of the menu
      el = document.createElement('DIV');
      el.id = 'ccm-layout-options-menu-' + this.cvalID;
      el.className = 'ccm-menu ccm-ui';
      el.style.display = 'none';
      document.body.appendChild(el);

      aobj = $(el);
      aobj.css('position', 'absolute');

      // contents  of menu
      let html = '<div class="popover"><div class="arrow"></div><div class="inner"><div class="content">';
      html += '<ul>';

      // the arHandle here should be encoded with encodeURIComponent(), but it leads to a double encoding issue in ccm.dialog.js
      html += '<li><a onclick="ccm_hideMenus()" class="ccm-menu-icon ccm-icon-edit-menu" dialog-title="' + ccmi18n.editAreaLayout + '" dialog-modal="false" dialog-width="550" dialog-height="280" dialog-append-buttons="true" id="menuEditLayout' + this.cvalID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(this.area) + '&layoutID=' + this.layout_id + '&cvalID=' + this.cvalID + '&atask=layout">' + ccmi18n.editAreaLayout + '</a></li>';

      html += '<li><a onclick="ccm_hideMenus()" href="javascript:void(0)" class="ccm-menu-icon ccm-icon-move-up" id="menuAreaLayoutMoveUp' + this.cvalID + '">' + ccmi18n.moveLayoutUp + '</a></li>';

      html += '<li><a onclick="ccm_hideMenus()" href="javascript:void(0)" class="ccm-menu-icon ccm-icon-move-down" id="menuAreaLayoutMoveDown' + this.cvalID + '">' + ccmi18n.moveLayoutDown + '</a></li>';

      const lockText = (this.locked) ? ccmi18n.unlockAreaLayout : ccmi18n.lockAreaLayout;
      html += '<li><a onclick="ccm_hideMenus()" href="javascript:void(0)" class="ccm-menu-icon ccm-icon-lock-menu" id="menuAreaLayoutLock' + this.cvalID + '">' + lockText + '</a></li>';

      html += '<li><a onclick="ccm_hideMenus()" href="javascript:void(0)" class="ccm-menu-icon ccm-icon-delete-menu" dialog-append-buttons="true" id="menuAreaLayoutDelete' + this.cvalID + '">' + ccmi18n.deleteLayout + '</a></li>';

      html += '</ul>';
      html += '</div></div></div>';
      aobj.append(html);

      const aJQobj = $(aobj);
      const layoutObj = this;

      aJQobj.find('#menuEditLayout' + this.cvalID).dialog();

      aJQobj.find('#menuAreaLayoutMoveUp' + this.cvalID).click(() => { layoutObj.moveLayout('up'); });

      aJQobj.find('#menuAreaLayoutMoveDown' + this.cvalID).click(() => { layoutObj.moveLayout('down'); });

      // lock click
      aJQobj.find('#menuAreaLayoutLock' + this.cvalID).click(() => { layoutObj.lock(); });

      // delete click
      aJQobj.find('#menuAreaLayoutDelete' + this.cvalID).click(() => { layoutObj.deleteLayoutOptions(); });
    } else {
      aobj = $('#ccm-layout-options-menu-' + this.cvalID);
    }

    ccm_fadeInMenu(aobj, e);
  };

  this.moveLayout = function (direction) {
    this.moving = 1;
    ccm_hideHighlighter();
    // $.fn.dialog.showLoader();
    this.highlightAreas(1);
    this.servicesAjax = $.ajax({
      url: CCM_TOOLS_PATH + '/layout_services/?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(this.area) + '&layoutID=' + this.layout_id + '&cvalID=' + this.cvalID + '&task=move&direction=' + direction + '&areaNameNumber=' + this.areaNameNumber,
      success(response) {
        eval('var jObj=' + response);
        if (parseInt(jObj.success) != 1) {
          alert(jObj.msg);
        } else {
          // success
          ccm_mainNavDisableDirectExit();
          // location.reload();
        }
      },
    });

    const el = $('#ccm-layout-wrapper-' + this.cvalID);
    const layoutObj = this;
    if (direction == 'down') {
      const nextLayout = el.next();
      if (nextLayout.hasClass('ccm-layout-wrapper')) {
        el.slideUp(600, () => {
          el.insertAfter(nextLayout);
          el.slideDown(600, () => { layoutObj.highlightAreas(0); layoutObj.moving = 0; });
        });
        return;
      }
      // at boundry
      ccmAlert.hud(ccmi18n.moveLayoutAtBoundary, 4000, 'icon_move_down', ccmi18n.moveLayoutDown);
    } else if (direction == 'up') {
      const previousLayout = el.prev();
      if (previousLayout.hasClass('ccm-layout-wrapper')) {
        el.slideUp(600, () => {
          el.insertBefore(previousLayout);
          el.slideDown(600, () => { layoutObj.highlightAreas(0); layoutObj.moving = 0; });
        });
        return;
      }
      // at boundry
      ccmAlert.hud(ccmi18n.moveLayoutAtBoundary, 4000, 'icon_move_up', ccmi18n.moveLayoutUp);
    }
  };

  this.lock = function (lock, twinLock) {
    const a = $('#menuAreaLayoutLock' + this.cvalID);
    this.locked = !this.locked;
    if (this.locked) {
      a.html(ccmi18n.unlockAreaLayout);
      if (this.s) this.s.slider('disable');
    } else {
      a.find('span').html(ccmi18n.lockAreaLayout);
      if (this.s) this.s.slider('enable');
    }

    var lock = (this.locked) ? 1 : 0;
    if (!twinLock) {
      this.servicesAjax = $.ajax({
        url: CCM_TOOLS_PATH + '/layout_services/?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(this.area) + '&layoutID=' + this.layout_id + '&task=lock&lock=' + lock,
        success(response) {
          eval('var jObj=' + response);
          if (parseInt(jObj.success) != 1) {
            alert(jObj.msg);
          } else {
            // success
          }
        },
      });

      this.getTwins();
      for (let i = 0; i < this.layoutTwinObjs.length; i++)
      this.layoutTwinObjs[i].lock(lock, 1);
    }
  };

  this.hasBeenQuickSaved = 0;
  this.quickSaveLayoutId = 0;
  this.quickSave = function () {
    const breakPoints = this.ccmControls.find('#layout_col_break_points_' + this.cvalID).val().replace(/%/g, '');
    clearTimeout(this.secondSavePauseTmr);
    if (!this.hasBeenQuickSaved && this.quickSaveInProgress) {
      quickSaveLayoutObj = this;
      this.secondSavePauseTmr = setTimeout('quickSaveLayoutObj.quickSave()', 100);
      return;
    }
    this.quickSaveInProgress = 1;
    const layoutObj = this;
    const modifyLayoutId = (this.quickSaveLayoutId) ? this.quickSaveLayoutId : this.layout_id;
    this.quickSaveAjax = $.ajax({
      url: CCM_TOOLS_PATH + '/layout_services/?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(this.area) + '&layoutID=' + modifyLayoutId + '&task=quicksave&breakpoints=' + encodeURIComponent(breakPoints),
      success(response) {
        eval('var jObj=' + response);
        if (parseInt(jObj.success) != 1) {
          alert(jObj.msg);
        } else {
          // success
          layoutObj.hasBeenQuickSaved = 1;
          layoutObj.quickSaveInProgress = 0;
          if (jObj.layoutID) {
            layoutObj.quickSaveLayoutId = jObj.layoutID;
          }
          ccm_mainNavDisableDirectExit();
        }
      },
    });
  };

  this.deleteLayoutOptions = function () {
    let hasBlocks = 0;
    deleteLayoutObj = this;
    this.layoutWrapper.find('.ccm-block').each((i, el) => {
      if (el.style.display != 'none') hasBlocks = 1;
    });
    const dialogHeight = (hasBlocks) ? '135px' : '70px';

    $.fn.dialog.open({
      title: ccmi18n.deleteLayoutOptsTitle,
      href: CCM_TOOLS_PATH + '/layout_services/?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(this.area) + '&layoutID=' + this.layout_id + '&task=deleteOpts&hasBlocks=' + hasBlocks,
      width: '340px',
      modal: false,
      appendButtons: true,
      height: dialogHeight,
    });
  };

  this.deleteLayout = function (deleteBlocks) {
    ccm_hideMenus();

    $.fn.dialog.closeTop();

    this.layoutWrapper.slideUp(300);

    $.fn.dialog.showLoader();

    const cvalID = this.cvalID;
    this.servicesAjax = $.ajax({
      url: CCM_TOOLS_PATH + '/layout_services/?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(this.area) + '&layoutID=' + this.layout_id + '&task=delete&deleteBlocks=' + parseInt(deleteBlocks) + '&areaNameNumber=' + this.areaNameNumber,
      success(response) {
        eval('var jObj=' + response);
        if (parseInt(jObj.success) != 1) {
          alert(jObj.msg);
          $.fn.dialog.hideLoader();
        } else {
          // success
          $('#ccm-layout-wrapper-' + cvalID).remove();
          ccm_hideHighlighter();
          ccm_mainNavDisableDirectExit();

          if (jObj.refreshPage) window.location = window.location;
          else $.fn.dialog.hideLoader();
        }
      },
    });
  };


  this.gridSizing = function () {
    this.ccmGrid = $('#ccm-layout-' + this.layout_id);

    // append layout id to start of all selectors
    const cols = parseInt(this.ccmControls.find('.layout_column_count').val());

    if (cols > 1) {
      const startPoints = this.ccmControls.find('#layout_col_break_points_' + this.cvalID).val().replace(/%/g, '').split('|');

      this.s = this.ccmControls.find('.ccm-layout-controls-slider');

      this.s.get(0).layoutObj = this;
      this.s.get(0).ccmGrid = this.ccmGrid;

      this.s.slider({
        step: 1,
        values: startPoints,
        change() {
          if (this.layoutObj.dontUpdateTwins) return;
          this.layoutObj.resizeGrid(this.childNodes);
          const breakPoints = [];
          for (let z = 0; z < this.childNodes.length; z++)
          breakPoints.push(parseFloat(this.childNodes[z].style.left.replace('%', '')));

          breakPoints.sort((a, b) => { return (a - b); });

          this.layoutObj.ccmControls.find('.layout_col_break_points').val(breakPoints.join('%|') + '%');
          this.layoutObj.quickSave();
          ccm_arrangeMode = 0;
          this.layoutObj.moving = 0;
          this.layoutObj.highlightAreas(0);
        },
        slide() {
          ccm_arrangeMode = 1;
          this.layoutObj.moving = 1;
          if (this.layoutObj.dontUpdateTwins) return;
          this.layoutObj.resizeGrid(this.childNodes);
        },
      });

      if (parseInt(this.ccmControls.find('.layout_locked').val())) this.s.slider('disable');
    }
  };

  this.getTwins = function () {
    if (!this.layoutTwins) {
      this.layoutTwins = $('.ccm-layout-controls-layoutID-' + this.layout_id).not(this.ccmControls);
      this.layoutTwinObjs = [];
      for (let q = 0; q < this.layoutTwins.length; q++) {
        this.layoutTwinObjs.push(this.layoutTwins[q].layoutObj);
        this.layoutTwins[q].handles = $(this.layoutTwins[q]).find('.ui-slider-handle');
      }
    }
    return this.layoutTwins;
  };

  this.resizeGrid = function (childNodes) {
    const positions = [];

    this.getTwins();

    for (let y = 0; y < childNodes.length; y++) {
      var pos = parseFloat(childNodes[y].style.left.replace('%', ''));
      positions.push(pos);
      if (!this.dontUpdateTwins) for (var w = 0; w < this.layoutTwinObjs.length; w++) {
        this.layoutTwinObjs[w].dontUpdateTwins = 1;
        this.layoutTwinObjs[w].s.slider('values', y, pos);
      }
    }
    positions.sort((a, b) => { return (a - b); });

    let prevW = 0;
    let i;
    for (i = 0; i < positions.length; i++) {
      var pos = positions[i];
      var w = pos - prevW;
      prevW += w;
      $('.ccm-layout-' + this.layout_id + '-col-' + (i + 1)).css('width', w + '%');

      if (!this.dontUpdateTwins) for (j = 0; j < this.layoutTwins.length; j++)
      this.layoutTwins[j].handles[i].style.left = pos + '%';
    }
    $('.ccm-layout-' + this.layout_id + '-col-' + (i + 1)).css('width', (100 - prevW) + '%');
  };
}

let quickSaveLayoutObj;
let deleteLayoutObj;


const ccmLayoutEdit = {

  init() {
    this.showPresetDeleteIcon();

    // change preset selector
    $('#ccmLayoutPresentIdSelector').change(function () {
      // ccmLayoutEdit.showPresetDeleteIcon();

      const lpID = parseInt($(this).val());
      const layoutID = $('#ccmAreaLayoutForm_layoutID').val();

      $.fn.dialog.showLoader();
      if (lpID > 0) {
        var action = $('#ccm-layout-refresh-action').val() + '&lpID=' + lpID;
      } else {
        var action = $('#ccm-layout-refresh-action').val() + '&layoutID=' + layoutID;
      }

      $.get(action, (r) => {
        $('#ccm-layout-edit-wrapper').html(r);
        $.fn.dialog.hideLoader();
        ccmLayoutEdit.showPresetDeleteIcon();
      });
    });

    $('#layoutPresetActionNew input[name=layoutPresetAction]').click(function () {
      if ($(this).val() == 'create_new_preset' && $(this).prop('checked')) {
        $('input[name=layoutPresetName]').attr('disabled', false).focus();
      } else {
        $('input[name=layoutPresetName]').val('').attr('disabled', true);
      }
    });

    $('#layoutPresetActions input[name=layoutPresetAction]').click(function () {
      if ($(this).val() == 'create_new_preset' && $(this).prop('checked')) {
        $('input[name=layoutPresetNameAlt]').attr('disabled', false).focus();
      } else {
        $('input[name=layoutPresetNameAlt]').val('').attr('disabled', true);
      }
    });

    if ($('#layoutPresetActions').length > 0) {
      $('#ccmLayoutConfigOptions input, #ccmLayoutConfigOptions select').bind('change click', () => {
        // if( $('#ccmLayoutPresentIdSelector').val() > 0 ){
        $('#layoutPresetActions').show();
        $('#layoutPresetActionNew').hide();
        $('#ccmLayoutConfigOptions input, #ccmLayoutConfigOptions select').unbind('change click');
        // }
      });
    }
  },

  showPresetDeleteIcon() {
    if ($('#ccmLayoutPresentIdSelector').val() > 0) {
      $('#ccm-layout-delete-preset').show();
    } else {
      $('#ccm-layout-delete-preset').hide();
    }
  },

  deletePreset() {
    const lpID = parseInt($('#ccmLayoutPresentIdSelector').val());
    if (lpID > 0) {
      if (!confirm(ccmi18n.confirmLayoutPresetDelete)) return false;

      $.fn.dialog.showLoader();
      const area = $('#ccmAreaLayoutForm_arHandle').val();
      const url = CCM_TOOLS_PATH + '/layout_services/?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(area) + '&task=deletePreset&lpID=' + lpID;
      $.get(url, (r) => {
        eval('var jObj=' + r);
        if (parseInt(jObj.success) != 1) {
          alert(jObj.msg);
        } else {
          // success
          $("#ccmLayoutPresentIdSelector option[value='" + lpID + "']").remove();
        }
        $.fn.dialog.hideLoader();
      });
    }
  },
};
