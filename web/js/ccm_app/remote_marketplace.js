/**
 * Remote Marketplace
 */
import $ from 'jquery';

const { CCM_TOOLS_PATH } = window;

function ccm_openThemeLauncher() {
  $.fn.dialog.closeTop();
  $.fn.dialog.showLoader();
  ccm_testMarketplaceConnection(() => {
    $.fn.dialog.open({
      title: ccmi18n.community,
      href: CCM_TOOLS_PATH + '/marketplace/themes',
      width: '905',
      modal: false,
      height: '410',
    });
  }, 'open_theme_launcher');
}

function ccm_testMarketplaceConnection(onComplete, task, mpID) {
  if (mpID) {
    mpIDStr = '&mpID=' + mpID;
  } else {
    mpIDStr = '';
  }

  if (!task) {
    task = '';
  }

  params = { 'mpID': mpID };


  $.getJSON(CCM_TOOLS_PATH + '/marketplace/connect', params, (resp) => {
    if (resp.isConnected) {
      onComplete();
    } else {
      $.fn.dialog.open({
        title: ccmi18n.community,
        href: CCM_TOOLS_PATH + '/marketplace/frame?task=' + task + mpIDStr + '&ccm_token=' + resp.token,
        width: '90%',
        modal: false,
        height: '70%',
      });
      return false;
    }
  });
}

function ccm_openAddonLauncher() {
  $.fn.dialog.closeTop();
  $.fn.dialog.showLoader();
  ccm_testMarketplaceConnection(() => {
    $.fn.dialog.open({
      title: ccmi18n.community,
      href: CCM_TOOLS_PATH + '/marketplace/add-ons',
      width: '905',
      modal: false,
      height: '410',
    });
  }, 'open_addon_launcher');
}

function ccm_setupMarketplaceDialogForm() {
  $('.ccm-pane-dialog-pagination').each(function () {
    $(this).closest('.ui-dialog-content').dialog('option', 'buttons', [{}]);
    $(this).closest('.ui-dialog').find('.ui-dialog-buttonpane .ccm-pane-dialog-pagination').remove();
    $(this).appendTo($(this).closest('.ui-dialog').find('.ui-dialog-buttonpane').addClass('ccm-ui'));
  });
  $('.ccm-pane-dialog-pagination a').click(function () {
    $.fn.dialog.showLoader();
    $('#ccm-marketplace-browser-form').closest('.ui-dialog-content').load($(this).attr('href'), () => {
      $.fn.dialog.hideLoader();
    });
    return false;
  });
  ccm_marketplaceBrowserInit();
  $('#ccm-marketplace-browser-form').ajaxForm({
    beforeSubmit() {
      $.fn.dialog.showLoader();
    },
    success(resp) {
      $.fn.dialog.hideLoader();
      $('#ccm-marketplace-browser-form').closest('.ui-dialog-content').html(resp);
    },
  });
}

function ccm_marketplaceBrowserInit() {
  $('.ccm-marketplace-item').click(function () {
    ccm_getMarketplaceItemDetails($(this).attr('mpID'));
  });

  $('.ccm-marketplace-item-thumbnail').mouseover(function () {
    const img = $(this).parent().find('div.ccm-marketplace-results-image-hover').clone().addClass('ccm-marketplace-results-image-hover-displayed').appendTo(document.body);
    const t = $(this).offset().top;
    let l = $(this).offset().left;
    l = l + 60;
    img.css('top', t).css('left', l);
    img.show();
  });

  $('.ccm-marketplace-item-thumbnail').mouseout(() => {
    $('.ccm-marketplace-results-image-hover-displayed').hide().remove();
  });
}

function ccm_getMarketplaceItemDetails(mpID) {
  $.fn.dialog.showLoader();
  $('#ccm-intelligent-search-results').hide();
  ccm_testMarketplaceConnection(() => {
    $.fn.dialog.open({
      title: ccmi18n.community,
      href: CCM_TOOLS_PATH + '/marketplace/details?mpID=' + mpID,
      width: 820,
      appendButtons: true,
      modal: false,
      height: 640,
    });
  }, 'get_item_details', mpID);
}

function ccm_getMarketplaceItem(args) {
  const mpID = args.mpID;
  const closeTop = args.closeTop;
  const token = args.token;

  this.onComplete = function () { };

  if (args.onComplete) {
    ccm_getMarketplaceItem.onComplete = args.onComplete;
  }

  if (closeTop) {
    $.fn.dialog.closeTop(); // this is here due to a weird safari behavior
  }
  $.fn.dialog.showLoader();
  // first, we check our local install to ensure that we're connected to the
  // marketplace, etc..
  params = { 'mpID': mpID };
  $.getJSON(CCM_TOOLS_PATH + '/marketplace/connect', params, (resp) => {
    $.fn.dialog.hideLoader();
    if (resp.isConnected) {
      if (!resp.purchaseRequired) {
        $.fn.dialog.open({
          title: ccmi18n.community,
          href: CCM_TOOLS_PATH + '/marketplace/download?install=1&mpID=' + mpID + '&ccm_token=' + resp.token,
          width: 500,
          appendButtons: true,
          modal: false,
          height: 400,
        });
      } else {
        $.fn.dialog.open({
          title: ccmi18n.communityCheckout,
          iframe: true,
          href: CCM_TOOLS_PATH + '/marketplace/checkout?mpID=' + mpID,
          width: '560px',
          modal: false,
          height: '400px',
        });
      }
    } else {
      $.fn.dialog.open({
        title: ccmi18n.community,
        href: CCM_TOOLS_PATH + '/marketplace/frame?task=get&mpID=' + mpID + '&ccm_token=' + token,
        width: '90%',
        modal: false,
        height: '70%',
      });
    }
  });
}

const RemoteMarketplace = {
  ccm_openThemeLauncher,
  ccm_testMarketplaceConnection,
  ccm_openAddonLauncher,
  ccm_setupMarketplaceDialogForm,
  ccm_marketplaceBrowserInit,
  ccm_getMarketplaceItemDetails,
  ccm_getMarketplaceItem,
};

export default RemoteMarketplace;
