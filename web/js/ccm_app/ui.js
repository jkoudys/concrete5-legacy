/**
 * UI
 */

import $ from 'jquery';

const {
  CCM_EDIT_MODE,
  CCM_ARRANGE_MODE,
  CCM_DISPATCHER_FILENAME,
  CCM_CID,
  CCM_SECURITY_TOKEN,
} = window;

let ccm_arrangeMode = false;
let ccm_selectedDomID = false;
let ccm_isBlockError = false;
let ccm_activeMenu = false;
let ccm_blockError = false;

/* Block Styles Customization Popup */
const ccmCustomStyle = {
  tabs(aLink, tab) {
    $('.ccm-styleEditPane').hide();
    $('#ccm-styleEditPane-' + tab).show();
    $(aLink.parentNode.parentNode).find('li').removeClass('ccm-nav-active');
    $(aLink.parentNode).addClass('ccm-nav-active');
    return false;
  },
  resetAll() {
    if (!confirm(ccmi18n.confirmCssReset)) {
      return false;
    }
    $.fn.dialog.showLoader();

    $('#ccm-reset-style').val(1);
    $('#ccmCustomCssForm').get(0).submit();
    return true;
  },
  showPresetDeleteIcon() {
    if ($('select[name=cspID]').val() > 0) {
      $('#ccm-style-delete-preset').show();
    } else {
      $('#ccm-style-delete-preset').hide();
    }
  },
  deletePreset() {
    const cspID = $('select[name=cspID]').val();
    if (cspID > 0) {
      if (!confirm(ccmi18n.confirmCssPresetDelete)) return false;

      const action = $('#ccm-custom-style-refresh-action').val() + '&deleteCspID=' + cspID + '&subtask=delete_custom_style_preset';
      $.fn.dialog.showLoader();

      $.get(action, (r) => {
        $('#ccm-custom-style-wrapper').html(r);
        $.fn.dialog.hideLoader();
      });
    }
  },
  initForm() {
    if ($('#cspFooterPreset').length > 0) {
      $('#ccmCustomCssFormTabs input, #ccmCustomCssFormTabs select, #ccmCustomCssFormTabs textarea').bind('change click', () => {
        $('#cspFooterPreset').show();
        $('#cspFooterNoPreset').remove();
        $('#ccmCustomCssFormTabs input, #ccmCustomCssFormTabs select').unbind('change click');
      });
    }
    $('input[name=cspPresetAction]').click(function () {
      if ($(this).val() == 'create_new_preset' && $(this).prop('checked')) {
        $('input[name=cspName]').attr('disabled', false).focus();
      } else {
        $('input[name=cspName]').val('').attr('disabled', true);
      }
    });
    ccmCustomStyle.showPresetDeleteIcon();

    ccmCustomStyle.lastPresetID = parseInt($('select[name=cspID]').val());

    $('select[name=cspID]').change(function () {
      const cspID = parseInt($(this).val());
      const selectedCsrID = parseInt($('input[name=selectedCsrID]').val());

      if (ccmCustomStyle.lastPresetID == cspID) return false;
      ccmCustomStyle.lastPresetID = cspID;

      $.fn.dialog.showLoader();
      let action;
      if (cspID > 0) {
        action = $('#ccm-custom-style-refresh-action').val() + '&cspID=' + cspID;
      } else {
        action = $('#ccm-custom-style-refresh-action').val() + '&csrID=' + selectedCsrID;
      }

      $.get(action, (r) => {
        $('#ccm-custom-style-wrapper').html(r);
        $.fn.dialog.hideLoader();
      });
    });

    $('#ccmCustomCssForm').submit(() => {
      if ($('input[name=cspCreateNew]').prop('checked') == true) {
        if ($('input[name=cspName]').val() == '') {
          $('input[name=cspName]').focus();
          alert(ccmi18n.errorCustomStylePresetNoName);
          return false;
        }
      }

      $.fn.dialog.showLoader();
      return true;
    });

    // IE bug fix 0 can't focus on txt fields if new block just added
    if (!parseInt(ccmCustomStyle.lastPresetID))
      setTimeout(() => {
        $('#ccmCustomCssFormTabs input').attr('disabled', false).get(0).focus();
      }, 500);
  },
  validIdCheck(el, prevID) {
    const selEl = $('#' + el.value);
    if (selEl && selEl.get(0) && selEl.get(0).id != prevID) {
      $('#ccm-styles-invalid-id').css('display', 'block');
    } else {
      $('#ccm-styles-invalid-id').css('display', 'none');
    }
  },
};

const UI = {
  ccm_menuInit(obj) {
    if (CCM_EDIT_MODE && (!CCM_ARRANGE_MODE)) {
      switch (obj.type) {
      case 'BLOCK':
        $('#b' + obj.bID + '-' + obj.aID).mouseover((e) => {
          ccm_activate(obj, '#b' + obj.bID + '-' + obj.aID);
        });
        break;
      case 'AREA':
        $('#a' + obj.aID + 'controls').mouseover((e) => {
          ccm_activate(obj, '#a' + obj.aID + 'controls');
        });
        break;
      }
    }
  },

  ccm_showBlockMenu(obj, e) {
    ccm_hideMenus();
    e.stopPropagation();
    ccm_activeMenu = true;

    // now, check to see if this menu has been made
    let bobj = document.getElementById('ccm-block-menu' + obj.bID + '-' + obj.aID);

    if (!bobj) {
      // create the 1st instance of the menu
      const el = Object.assign(document.createElement('DIV'), {
        id: `ccm-block-menu${obj.bID}-${obj.aID}`,
        className: 'ccm-menu ccm-ui',
      });
      Object.assign(el.style, { display: 'block', visibility: 'hidden' });

      document.body.appendChild(el);

      bobj = $(`#ccm-block-menu${obj.bID}-${obj.aID}`);
      bobj.css('position', 'absolute');

      // contents of menu
      let html = '<div class="popover"><div class="arrow"></div><div class="inner"><div class="content">';
      html += '<ul>';
      // html += '<li class="header"></li>';
      if (obj.canWrite && obj.hasEditDialog) {
        html += (obj.editInline) ? '<li><a class="ccm-menu-icon ccm-icon-edit-menu" onclick="ccm_hideMenus()" id="menuEdit' + obj.bID + '-' + obj.aID + '" href="' + CCM_DISPATCHER_FILENAME + '?cID=' + obj.cID + '&bID=' + obj.bID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&btask=edit#_edit' + obj.bID + '">' + ccmi18n.editBlock + '</a></li>'
          : '<li><a class="ccm-menu-icon ccm-icon-edit-menu" onclick="ccm_hideMenus()" dialog-title="' + ccmi18n.editBlockWithName.replace(/%s/g, obj.btName) + '" dialog-append-buttons="true" dialog-modal="false" dialog-on-close="ccm_blockWindowAfterClose()" dialog-width="' + obj.width + '" dialog-height="' + obj.height + '" id="menuEdit' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + obj.cID + '&bID=' + obj.bID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&btask=edit">' + ccmi18n.editBlock + '</a></li>';
      }
      if (obj.canWriteStack) {
        html += '<li><a class="ccm-menu-icon ccm-icon-edit-menu" id="menuEdit' + obj.bID + '-' + obj.aID + '" href="' + CCM_DISPATCHER_FILENAME + '/dashboard/blocks/stacks/-/view_details/' + obj.stID + '">' + ccmi18n.editStackContents + '</a></li>';
        html += '<li class="header"></li>';
      }
      if (obj.canCopyToScrapbook) {
        html += '<li><a class="ccm-menu-icon ccm-icon-clipboard-menu" id="menuAddToScrapbook' + obj.bID + '-' + obj.aID + '" href="#" onclick="javascript:ccm_addToScrapbook(' + obj.cID + ',' + obj.bID + ',\'' + encodeURIComponent(obj.arHandle) + '\');return false;">' + ccmi18n.copyBlockToScrapbook + '</a></li>';
      }

      if (obj.canArrange) {
        html += '<li><a class="ccm-menu-icon ccm-icon-move-menu" id="menuArrange' + obj.bID + '-' + obj.aID + '" href="javascript:ccm_arrangeInit()">' + ccmi18n.arrangeBlock + '</a></li>';
      }
      if (obj.canDelete) {
        html += '<li><a class="ccm-menu-icon ccm-icon-delete-menu" id="menuDelete' + obj.bID + '-' + obj.aID + '" href="#" onclick="javascript:ccm_deleteBlock(' + obj.cID + ',' + obj.bID + ',' + obj.aID + ', \'' + encodeURIComponent(obj.arHandle) + '\', \'' + obj.deleteMessage + '\');return false;">' + ccmi18n.deleteBlock + '</a></li>';
      }
      if (obj.canDesign || obj.canEditBlockCustomTemplate) {
        html += '<li class="ccm-menu-separator"></li>';
      }
      if (obj.canDesign) {
        html += '<li><a class="ccm-menu-icon ccm-icon-design-menu" onclick="ccm_hideMenus()" dialog-modal="false" dialog-title="' + ccmi18n.changeBlockBaseStyle + '" dialog-width="475" dialog-height="500" dialog-append-buttons="true" id="menuChangeCSS' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + obj.cID + '&bID=' + obj.bID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&btask=block_css&modal=true&width=300&height=100" title="' + ccmi18n.changeBlockCSS + '">' + ccmi18n.changeBlockCSS + '</a></li>';
      }
      if (obj.canEditBlockCustomTemplate) {
        html += '<li><a class="ccm-menu-icon ccm-icon-custom-template-menu" onclick="ccm_hideMenus()" dialog-append-buttons="true" dialog-modal="false" dialog-title="' + ccmi18n.changeBlockTemplate + '" dialog-width="300" dialog-height="275" id="menuChangeTemplate' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + obj.cID + '&bID=' + obj.bID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&btask=template&modal=true&width=300&height=275" title="' + ccmi18n.changeBlockTemplate + '">' + ccmi18n.changeBlockTemplate + '</a></li>';
      }

      if (obj.canModifyGroups || obj.canScheduleGuestAccess || obj.canAliasBlockOut || obj.canSetupComposer) {
        html += '<li class="ccm-menu-separator"></li>';
      }

      if (obj.canModifyGroups) {
        html += '<li><a title="' + ccmi18n.setBlockPermissions + '" onclick="ccm_hideMenus()" class="ccm-menu-icon ccm-icon-permissions-menu" dialog-width="420" dialog-height="350" id="menuBlockGroups' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + obj.cID + '&bID=' + obj.bID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&btask=groups" dialog-append-buttons="true" dialog-title="' + ccmi18n.setBlockPermissions + '">' + ccmi18n.setBlockPermissions + '</a></li>';
      }
      if (obj.canScheduleGuestAccess) {
        html += '<li><a title="' + ccmi18n.scheduleGuestAccess + '" onclick="ccm_hideMenus()" class="ccm-menu-icon ccm-icon-clock-menu" dialog-width="500" dialog-height="220" id="menuBlockViewClock' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + obj.cID + '&bID=' + obj.bID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&btask=guest_timed_access" dialog-append-buttons="true" dialog-title="' + ccmi18n.scheduleGuestAccess + '">' + ccmi18n.scheduleGuestAccess + '</a></li>';
      }
      if (obj.canAliasBlockOut) {
        html += '<li><a class="ccm-menu-icon ccm-icon-setup-child-pages-menu" dialog-append-buttons="true" onclick="ccm_hideMenus()" dialog-width="550" dialog-height="450" id="menuBlockAliasOut' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + obj.cID + '&bID=' + obj.bID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&btask=child_pages" dialog-title="' + ccmi18n.setBlockAlias + '">' + ccmi18n.setBlockAlias + '</a></li>';
      }
      if (obj.canSetupComposer) {
        html += '<li><a class="ccm-menu-icon ccm-icon-setup-composer-menu" dialog-append-buttons="true" onclick="ccm_hideMenus()" dialog-width="450" dialog-modal="false" dialog-height="130" id="menuBlockSetupComposer' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + obj.cID + '&bID=' + obj.bID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&btask=composer" dialog-title="' + ccmi18n.setBlockComposerSettings + '">' + ccmi18n.setBlockComposerSettings + '</a></li>';
      }


      html += '</ul>';
      html += '</div></div></div>';
      bobj.append(html);

      // add dialog elements where necessary
      if (obj.canWrite && (!obj.editInline)) {
        $('a#menuEdit' + obj.bID + '-' + obj.aID).dialog();
      }
      if (obj.canEditBlockCustomTemplate) {
        $('a#menuChangeTemplate' + obj.bID + '-' + obj.aID).dialog();
      }
      if (obj.canDesign) {
        $('a#menuChangeCSS' + obj.bID + '-' + obj.aID).dialog();
      }
      if (obj.canAliasBlockOut) {
        $('a#menuBlockAliasOut' + obj.bID + '-' + obj.aID).dialog();
      }
      if (obj.canSetupComposer) {
        $('a#menuBlockSetupComposer' + obj.bID + '-' + obj.aID).dialog();
      }
      if (obj.canModifyGroups) {
        $('#menuBlockGroups' + obj.bID + '-' + obj.aID).dialog();
      }
      if (obj.canScheduleGuestAccess) {
        $('#menuBlockViewClock' + obj.bID + '-' + obj.aID).dialog();
      }
    } else {
      bobj = $('#ccm-block-menu' + obj.bID + '-' + obj.aID);
    }

    ccm_fadeInMenu(bobj, e);
  },

  ccm_reloadAreaMenuPermissions(aID, cID) {
    const config = window['ccm_areaMenuObj' + aID];
    if (config) {
      const action = CCM_TOOLS_PATH + '/reload_area_permissions_js.php' +
        '?arHandle=' + config.arHandle +
          '&cID=' + cID +
            '&maximumBlocks=' + config.maximumBlocks;
            $.getScript(action);
    }
  },

  ccm_openAreaAddBlock(arHandle, addOnly, cID) {
    if (!addOnly) {
      addOnly = 0;
    }

    if (!cID) {
      cID = CCM_CID;
    }

    $.fn.dialog.open({
      title: ccmi18n.blockAreaMenu,
      href: CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + cID + '&atask=add&arHandle=' + arHandle + '&addOnly=' + addOnly,
      width: 550,
      modal: false,
      height: 380,
    });
  },

  ccm_showAreaMenu(obj, e) {
    const addOnly = (obj.addOnly) ? 1 : 0;
    ccm_activeMenu = true;
    if (e.shiftKey) {
      ccm_openAreaAddBlock(obj.arHandle, addOnly);
    } else {
      e.stopPropagation();

      // now, check to see if this menu has been made
      let aobj = document.getElementById('ccm-area-menu' + obj.aID);

      if (!aobj) {
        // create the 1st instance of the menu
        const el = Object.assign(document.createElement('DIV'), {
          id: `ccm-area-menu${obj.aID}`,
          className: `ccm-menu ccm-ui`,
        });
        Object.assign(el.style, {
          display: 'block',
          visibility: 'hidden',
        });

        document.body.appendChild(el);

        aobj = $('#ccm-area-menu' + obj.aID);
        aobj.css('position', 'absolute');

        // contents of menu
        let html = '<div class="popover"><div class="arrow"></div><div class="inner"><div class="content">';
        html += '<ul>';
        // html += '<li class="header"></li>';
        if (obj.canAddBlocks) {
          html += '<li><a onclick="ccm_hideMenus()" class="ccm-menu-icon ccm-icon-add-block-menu" dialog-title="' + ccmi18n.addBlockNew + '" dialog-modal="false" dialog-width="550" dialog-height="380" id="menuAddNewBlock' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&atask=add&addOnly=' + addOnly + '">' + ccmi18n.addBlockNew + '</a></li>';
          html += '<li><a onclick="ccm_hideMenus()" class="ccm-menu-icon ccm-icon-clipboard-menu" dialog-title="' + ccmi18n.addBlockPaste + '" dialog-modal="false" dialog-width="550" dialog-height="380" id="menuAddPaste' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&atask=paste&addOnly=' + addOnly + '">' + ccmi18n.addBlockPaste + '</a></li>';
        }
        if (obj.canAddStacks) {
          html += '<li><a onclick="ccm_hideMenus()" class="ccm-menu-icon ccm-icon-add-stack-menu" dialog-title="' + ccmi18n.addBlockStack + '" dialog-modal="false" dialog-width="550" dialog-height="380" id="menuAddNewStack' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&atask=add_from_stack&addOnly=' + addOnly + '">' + ccmi18n.addBlockStack + '</a></li>';
        }
        if (obj.canAddBlocks && (obj.canDesign || obj.canLayout)) {
          html += '<li class="ccm-menu-separator"></li>';
        }
        if (obj.canLayout) {
          html += '<li><a onclick="ccm_hideMenus()" class="ccm-menu-icon ccm-icon-add-layout-menu" dialog-title="' + ccmi18n.addAreaLayout + '" dialog-modal="false" dialog-width="400" dialog-height="300" dialog-append-buttons="true" id="menuAreaLayout' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&atask=layout">' + ccmi18n.addAreaLayout + '</a></li>';
        }
        if (obj.canDesign) {
          html += '<li><a onclick="ccm_hideMenus()" class="ccm-menu-icon ccm-icon-design-menu" dialog-title="' + ccmi18n.changeAreaCSS + '" dialog-modal="false" dialog-append-buttons="true" dialog-width="475" dialog-height="500" id="menuAreaStyle' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&atask=design">' + ccmi18n.changeAreaCSS + '</a></li>';
        }
        if (obj.canWrite && obj.canModifyGroups) {
          html += '<li class="ccm-menu-separator"></li>';
        }
        if (obj.canModifyGroups) {
          html += '<li><a onclick="ccm_hideMenus()" title="' + ccmi18n.setAreaPermissions + '" dialog-append-buttons="true" dialog-modal="false" class="ccm-menu-icon ccm-icon-permissions-menu" dialog-width="420" dialog-height="425" id="menuAreaGroups' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + encodeURIComponent(obj.arHandle) + '&atask=groups" dialog-title="' + ccmi18n.setAreaPermissions + '">' + ccmi18n.setAreaPermissions + '</a></li>';
        }

        html += '</ul>';
        html += '</div></div></div>';
        aobj.append(html);

        // add dialog elements where necessary
        if (obj.canAddBlocks) {
          $('a#menuAddNewBlock' + obj.aID).dialog();
          $('a#menuAddPaste' + obj.aID).dialog();
        }
        if (obj.canAddStacks) {
          $('a#menuAddNewStack' + obj.aID).dialog();
        }
        if (obj.canLayout) {
          $('a#menuAreaLayout' + obj.aID).dialog();
        }
        if (obj.canDesign) {
          $('a#menuAreaStyle' + obj.aID).dialog();
        }
        if (obj.canModifyGroups) {
          $('a#menuAreaGroups' + obj.aID).dialog();
        }
      } else {
        aobj = $('#ccm-area-menu' + obj.aID);
      }

      ccm_fadeInMenu(aobj, e);
    }
  },

  ccm_hideHighlighter() {
    $('#ccm-highlighter').css('display', 'none');
    $('div.ccm-menu-hotspot-active').removeClass('ccm-menu-hotspot-active');
  },

  ccm_addError(err) {
    if (!ccm_isBlockError) {
      ccm_blockError = '';
      ccm_blockError += '<ul>';
    }

    ccm_isBlockError = true;
    ccm_blockError += '<li>' + err + '</li>';
  },

  ccm_resetBlockErrors() {
    ccm_isBlockError = false;
    ccm_blockError = '';
  },

  ccm_addToScrapbook(cID, bID, arHandle) {
    ccm_mainNavDisableDirectExit();
    // got to grab the message too, eventually
    ccm_hideHighlighter();
    $.ajax({
      type: 'POST',
      url: CCM_TOOLS_PATH + '/pile_manager.php',
      data: 'cID=' + cID + '&bID=' + bID + '&arHandle=' + arHandle + '&btask=add&scrapbookName=userScrapbook',
      success(resp) {
        ccm_hideHighlighter();
        window.ccmAlert.hud(ccmi18n.copyBlockToScrapbookMsg, 2000, 'add', ccmi18n.copyBlockToScrapbook);
      } });
  },

  ccm_deleteBlock(cID, bID, aID, arHandle, msg) {
    if (confirm(msg)) {
      ccm_mainNavDisableDirectExit();
      // got to grab the message too, eventually
      ccm_hideHighlighter();
      $d = $('#b' + bID + '-' + aID);
      $d.hide();
      window.ccmAlert.hud(ccmi18n.deleteBlockMsg, 2000, 'delete_small', ccmi18n.deleteBlock);
      $.ajax({
        type: 'POST',
        url: CCM_DISPATCHER_FILENAME,
        data: 'cID=' + cID + '&ccm_token=' + CCM_SECURITY_TOKEN + '&isAjax=true&btask=remove&bID=' + bID + '&arHandle=' + arHandle,
      });
      ccm_reloadAreaMenuPermissions(aID, cID);
      if (typeof window.ccm_parseBlockResponsePost == 'function') {
        ccm_parseBlockResponsePost({});
      }
    }
  },

  ccm_hideMenus() {
    /* 1st, hide all items w/the css menu class */
    ccm_activeMenu = false;
    $('div.ccm-menu').hide();
    $('div.ccm-menu').css('visibility', 'hidden');
    $('div.ccm-menu').show();
  },

  ccm_parseBlockResponse(r, currentBlockID, task) {
    try {
      r = r.replace(/(<([^>]+)>)/ig, ''); // because some plugins add bogus HTML after our JSON requests and screw everything up
      resp = eval('(' + r + ')');
      if (resp.error == true) {
        let message = '<ul>';
        for (i = 0; i < resp.response.length; i++) {
          message += '<li>' + resp.response[i] + '<\/li>';
        }
        message += '<\/ul>';
        window.ccmAlert.notice(ccmi18n.error, message);
      } else {
        ccm_blockWindowClose();
        if (resp.cID) {
          cID = resp.cID;
        } else {
          cID = CCM_CID;
        }
        const action = `${CCM_TOOLS_PATH}/edit_block_popup?cID=${cID}&bID=${resp.bID}&arHandle=${encodeURIComponent(resp.arHandle)}&btask=view_edit_mode`;
        $.get(action,
              (r) => {
                if (task == 'add') {
                  if ($('#a' + resp.aID + ' div.ccm-area-styles-a' + resp.aID).length > 0) {
                    $('#a' + resp.aID + ' div.ccm-area-styles-a' + resp.aID).append(r);
                  } else {
                    $('#a' + resp.aID).append(r);
                  }
                } else {
                  $('#b' + currentBlockID + '-' + resp.aID).before(r).remove();
                }
                $.fn.dialog.hideLoader();
                ccm_mainNavDisableDirectExit();
                if (task == 'add') {
                  window.ccmAlert.hud(ccmi18n.addBlockMsg, 2000, 'add', ccmi18n.addBlock);
                  $.fn.dialog.closeAll();
                } else {
                  window.ccmAlert.hud(ccmi18n.updateBlockMsg, 2000, 'success', ccmi18n.updateBlock);
                }
                if (typeof window.ccm_parseBlockResponsePost == 'function') {
                  ccm_parseBlockResponsePost(resp);
                }
              }
             );
             ccm_reloadAreaMenuPermissions(resp.aID, cID);
      }
    } catch (e) {
      window.ccmAlert.notice(ccmi18n.error, r);
    }
  },

  ccm_mainNavDisableDirectExit(disableShow) {
    // make sure that exit edit mode is enabled
    $('#ccm-exit-edit-mode-direct').hide();
    if (!disableShow) {
      $('#ccm-exit-edit-mode-comment').show();
    }
  },

  ccm_setupBlockForm(form, currentBlockID, task) {
    form.ajaxForm({
      type: 'POST',
      iframe: true,
      beforeSubmit() {
        ccm_hideHighlighter();
        $('input[name=ccm-block-form-method]').val('AJAX');
        $.fn.dialog.showLoader();
        return ccm_blockFormSubmit();
      },
      success(r) {
        ccm_parseBlockResponse(r, currentBlockID, task);
      },
    });
  },


  ccm_activate(obj, domID) {
    if (ccm_arrangeMode || ccm_activeMenu) {
      return false;
    }

    if (ccm_selectedDomID) {
      $(ccm_selectedDomID).removeClass('ccm-menu-hotspot-active');
    }

    const aobj = $(domID);
    aobj.addClass('ccm-menu-hotspot-active');
    ccm_selectedDomID = domID;

    const { top, left } = aobj.offset();

    /*
       $("#ccmMenuHighlighter").mouseover(
       function() {clearTimeout(ccm_deactivateTimer)}
       );
       */

    $('#ccm-highlighter')
    .hide()
    .css({ top, left, width: aobj.outerWidth(), height: aobj.outerHeight() })
    .fadeIn(120)
    .mouseout((e) => {
      if (!ccm_activeMenu) {
        if (!e.target) {
          ccm_hideHighlighter();
        } else if ($(e.toElement).parents('div.ccm-menu').length == 0) {
          ccm_hideHighlighter();
        }
      }
    })
    .unbind('click')
    .click(
      (e) => {
        switch (obj.type) {
        case 'BLOCK':
          ccm_showBlockMenu(obj, e);
          break;
        case 'AREA':
          ccm_showAreaMenu(obj, e);
          break;
        }
      }
    );
  },

  ccm_editInit() {
    document.write = () => void(0);

    $(document.body).append('<div style="position: absolute; display:none" id="ccm-highlighter">&nbsp;</div>');
    $(document).click(() => { ccm_hideMenus(); });

    $('div.ccm-menu a').bind('click.hide-menu', (e) => {
      ccm_hideMenus();
      return false;
    });
  },

  ccm_triggerSelectUser(uID, uName, uEmail) {
    alert(uID);
    alert(uName);
    alert(uEmail);
  },

  ccm_setupUserSearch(searchInstance) {
    $('.chosen-select').chosen(ccmi18n_chosen);
    $('#ccm-user-list-cb-all').click(function () {
      if ($(this).prop('checked') == true) {
        $('.ccm-list-record td.ccm-user-list-cb input[type=checkbox]').attr('checked', true);
        $('#ccm-user-list-multiple-operations').attr('disabled', false);
      } else {
        $('.ccm-list-record td.ccm-user-list-cb input[type=checkbox]').attr('checked', false);
        $('#ccm-user-list-multiple-operations').attr('disabled', true);
      }
    });
    $('td.ccm-user-list-cb input[type=checkbox]').click((e) => {
      if ($('td.ccm-user-list-cb input[type=checkbox]:checked').length > 0) {
        $('#ccm-user-list-multiple-operations').attr('disabled', false);
      } else {
        $('#ccm-user-list-multiple-operations').attr('disabled', true);
      }
    });

    // if we're not in the dashboard, add to the multiple operations select menu

    $('#ccm-user-list-multiple-operations').change(function () {
      const action = $(this).val();
      switch (action) {
      case 'choose':
        var idstr = '';
        $('td.ccm-user-list-cb input[type=checkbox]:checked').each(function () {
          ccm_triggerSelectUser($(this).val(), $(this).attr('user-name'), $(this).attr('user-email'));
        });
        $.fn.dialog.closeTop();
        break;
      case 'properties':
        uIDstring = '';
        $('td.ccm-user-list-cb input[type=checkbox]:checked').each(function () {
          uIDstring = uIDstring + '&uID[]=' + $(this).val();
        });
        $.fn.dialog.open({
          width: 630,
          height: 450,
          modal: false,
          href: CCM_TOOLS_PATH + '/users/bulk_properties?' + uIDstring,
          title: ccmi18n.properties,
        });
        break;
      case 'activate':
        uIDstring = '';
        $('td.ccm-user-list-cb input[type=checkbox]:checked').each(function () {
          uIDstring = uIDstring + '&uID[]=' + $(this).val();
        });
        $.fn.dialog.open({
          width: 630,
          height: 450,
          modal: false,
          href: CCM_TOOLS_PATH + '/users/bulk_activate?searchInstance=' + searchInstance + '&' + uIDstring,
          title: ccmi18n.user_activate,
        });
        break;
      case 'deactivate':
        uIDstring = '';
        $('td.ccm-user-list-cb input[type=checkbox]:checked').each(function () {
          uIDstring = uIDstring + '&uID[]=' + $(this).val();
        });
        $.fn.dialog.open({
          width: 630,
          height: 450,
          modal: false,
          href: CCM_TOOLS_PATH + '/users/bulk_deactivate?searchInstance=' + searchInstance + '&' + uIDstring,
          title: ccmi18n.user_deactivate,
        });
        break;
      case 'group_add':
        uIDstring = '';
        $('td.ccm-user-list-cb input[type=checkbox]:checked').each(function () {
          uIDstring = uIDstring + '&uID[]=' + $(this).val();
        });
        $.fn.dialog.open({
          width: 630,
          height: 450,
          modal: false,
          href: CCM_TOOLS_PATH + '/users/bulk_group_add?searchInstance=' + searchInstance + '&' + uIDstring,
          title: ccmi18n.user_group_add,
        });
        break;
      case 'group_remove':
        uIDstring = '';
        $('td.ccm-user-list-cb input[type=checkbox]:checked').each(function () {
          uIDstring = uIDstring + '&uID[]=' + $(this).val();
        });
        $.fn.dialog.open({
          width: 630,
          height: 450,
          modal: false,
          href: CCM_TOOLS_PATH + '/users/bulk_group_remove?searchInstance=' + searchInstance + '&' + uIDstring,
          title: ccmi18n.user_group_remove,
        });
        break;
      case 'delete':
        uIDstring = '';
        $('td.ccm-user-list-cb input[type=checkbox]:checked').each(function () {
          uIDstring = uIDstring + '&uID[]=' + $(this).val();
        });
        $.fn.dialog.open({
          width: 630,
          height: 450,
          modal: false,
          href: CCM_TOOLS_PATH + '/users/bulk_delete?searchInstance=' + searchInstance + '&' + uIDstring,
          title: ccmi18n.user_delete,
        });
        break;
      }

      $(this).get(0).selectedIndex = 0;
    });
  },

  ccm_triggerSelectGroup(gID, gName) {
    alert(gID);
    alert(gName);
  },

  ccm_setupGroupSearchPaging() {
    $('div#ccm-group-paging').each(function () {
      $(this).closest('.ui-dialog-content').dialog('option', 'buttons', [{}]);
      $(this).closest('.ui-dialog').find('.ui-dialog-buttonpane .ccm-pane-dialog-pagination').remove();
      $(this).appendTo($(this).closest('.ui-dialog').find('.ui-dialog-buttonpane').addClass('ccm-ui'));
    });
  },

  ccm_setupGroupSearch(callback) {
    const func = callback ? window[callback] : ccm_triggerSelectGroup;
    $('div.ccm-group a').unbind();

    $('div.ccm-group a').each(function (i) {
      const gla = $(this);
      $(this).click(() => {
        func(gla.attr('group-id'), gla.attr('group-name'));
        $.fn.dialog.closeTop();
        return false;
      });
    });
    $('#ccm-group-search').ajaxForm({
      beforeSubmit() {
        $('#ccm-group-search-wrapper').html('');
      },
      success(resp) {
        $('#ccm-group-search-wrapper').html(resp);
      },
    });

    /* setup paging */
    ccm_setupGroupSearchPaging();
    $('div#ccm-group-paging a').click(function () {
      $('#ccm-group-search-wrapper').html('');
      $.ajax({
        type: 'GET',
        url: $(this).attr('href'),
        success(resp) {
          $('#ccm-group-search-wrapper').html(resp);
        },
      });
      return false;
    });
  },

  ccm_saveArrangement(cID, block, source, destination) {
    if (!cID) {
      cID = CCM_CID;
    }

    const bID = block.attr('id').substring(1, block.attr('id').indexOf('-'));
    const sourceBlockAreaID = source.attr('id').substring(1);
    const destinationBlockAreaID = destination.attr('id').substring(1);

    ccm_mainNavDisableDirectExit();
    let serial = `&sourceBlockID=${bID}&sourceBlockAreaID=${sourceBlockAreaID}&destinationBlockAreaID=${destinationBlockAreaID}`;
    const areaArray = [source];
    if (sourceBlockAreaID != destinationBlockAreaID) {
      areaArray.push(destination);
    }
    $.each(areaArray, (idx, area) => {
      areaStr = '&area[' + area.attr('id').substring(1) + '][]=';

      bArray = area.sortable('toArray');

      for (i = 0; i < bArray.length; i++) {
        if (bArray[i] != '' && bArray[i].substring(0, 1) == 'b') {
          const bObj = $('#' + bArray[i]);
          if (bObj.closest('div.ccm-area')[0] == area[0]) {
            // make sure to only go from b to -, meaning b28-9 becomes "28"
            let bID = bArray[i].substring(1, bArray[i].indexOf('-'));
            if (bObj.attr('custom-style')) {
              bID += '-' + bObj.attr('custom-style');
            }
            serial += areaStr + bID;
          }
        }
      }
    });

    $.ajax({
      type: 'POST',
      url: CCM_DISPATCHER_FILENAME,
      dataType: 'json',
      data: `cID=${cID}&ccm_token=${CCM_SECURITY_TOKEN}&btask=ajax_do_arrange${serial}`,
      success(r) {
        ccm_parseJSON(r, () => {
          $('div.ccm-area').removeClass('ccm-move-mode');
          $('div.ccm-block-arrange').each(function () {
            $(this).addClass('ccm-block');
            $(this).removeClass('ccm-block-arrange');
          });
          ccm_arrangeMode = false;
          $('.ccm-main-nav-edit-option').fadeIn(300);
          window.ccmAlert.hud(ccmi18n.arrangeBlockMsg, 2000, 'up_down', ccmi18n.arrangeBlock);
        });
      } });
  },

  ccm_arrangeInit() {
    // $(document.body).append('<img src="' + CCM_IMAGE_PATH + '/topbar_throbber.gif" width="16" height="16" id="ccm-topbar-loader" />');

    ccm_arrangeMode = true;

    ccm_hideHighlighter();

    $('div.ccm-block').each(function () {
      $(this).addClass('ccm-block-arrange');
      $(this).removeClass('ccm-block');
    });

    $('.ccm-main-nav-edit-option').fadeOut(300, () => {
      $('.ccm-main-nav-arrange-option').fadeIn(300);
    });

    $('div.ccm-area').each(function () {
      const area = $(this);
      const cID = area.attr('cID');
      area.addClass('ccm-move-mode');
      area.sortable({
        items: 'div.ccm-block-arrange',
        connectWith: $('div.ccm-area-move-enabled'),
        accept: 'div.ccm-block-arrange',
        opacity: 0.5,
        stop(e, ui) {
          // two possibilities here.
          // 1, we could be dropping a block into a different area
          // or are we could be rearranging an existing area. Very
          // different use cases.
          const source = area;
          const destination = ui.item.closest('.ccm-area');
          ccm_saveArrangement(cID, ui.item, source, destination);
        },
      });
    });
  },

  ccm_selectSitemapNode(cID, cName) {
  },

  ccm_goToSitemapNode(cID) {
    window.location.href = `${CCM_DISPATCHER_FILENAME}?cID=${cID}`;
  },

  ccm_fadeInMenu(bobj, e) {
    const mwidth = bobj.find('div.popover div.inner').width();
    const mheight = bobj.find('div.popover').height();
    bobj.hide();
    bobj.css('visibility', 'visible');

    let posX = e.pageX + 2;
    let posY = e.pageY + 2;

    if ($(window).height() < e.clientY + mheight) {
      posY -= mheight - 10;
      posX -= mwidth / 2;
      bobj.find('div.popover').removeClass('below');
      bobj.find('div.popover').addClass('above');
    } else {
      posX -= mwidth / 2;
      posY += 10;
      bobj.find('div.popover').removeClass('above');
      bobj.find('div.popover').addClass('below');
    }

    bobj.css('top', `${posY}px`);
    bobj.css('left', `${posX}px`);
    bobj.fadeIn(60);
  },

  ccm_blockWindowClose() {
    $.fn.dialog.closeTop();
    window.ccm_blockWindowAfterClose();
  },

  ccm_blockWindowAfterClose() {
    window.ccmValidateBlockForm = () => true;
  },

  ccm_blockFormSubmit() {
    if (typeof window.ccmValidateBlockForm === 'function') {
      window.ccmValidateBlockForm();
      if (ccm_isBlockError) {
        $.fn.dialog.hideLoader();
        if (ccm_blockError) {
          window.ccmAlert.notice(ccmi18n.error, ccm_blockError + '</ul>');
        }
        window.ccm_resetBlockErrors();
        return false;
      }
    }
    return true;
  },

  ccm_paneToggleOptions(obj) {
    const pane = $(obj).parent().find('div.ccm-pane-options-content');
    if ($(obj).hasClass('ccm-icon-option-closed')) {
      $(obj).removeClass('ccm-icon-option-closed').addClass('ccm-icon-option-open');
      pane.slideDown();
    } else {
      $(obj).removeClass('ccm-icon-option-open').addClass('ccm-icon-option-closed');
      pane.slideUp();
    }
  },


  ccm_setupGridStriping(tbl) {
    $(`#${tbl} tr`).removeClass();
    let j = 0;
    $(`#${tbl} tr`).each(function () {
      if ($(this).css('display') !== 'none') {
        if (j % 2 === 0) {
          $(this).addClass('ccm-row-alt');
        }
        j++;
      }
    });
  },

  /**
   * JavaScript localization. Provide a key and then reference that key in PHP somewhere (where it will be translated)
   */
  ccm_t(key) {
    return $(`input[name=ccm-string-${key}]`).val();
  },
};

export default UI;
