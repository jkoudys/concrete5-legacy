import $ from 'jquery';

const { CCM_DISPATCHER_FILENAME, CCM_TOOLS_PATH } = window;

function ccm_closeNewsflow(r) {
  const $ovl = ccm_getNewsflowOverlayWindow();
  $ovl.fadeOut(300, 'easeOutExpo');
  $('.ui-widget-overlay').fadeOut(300, 'easeOutExpo', function () {
    $(this).remove();
  });
}

function ccm_setNewsflowPagingArrowHeight() {
  let $ovl;

  if ($('#ccm-marketplace-detail').length > 0) {
    $ovl = $('#ccm-marketplace-detail');
  } else {
    $ovl = $('#newsflow-main');
  }

  const h = $ovl.height();
  $('.newsflow-paging-previous a, .newsflow-paging-next a').css('height', h + 'px');
  $('.newsflow-paging-previous, .newsflow-paging-next').css('height', h + 'px');
  $('.newsflow-paging-next').show();
  $('.newsflow-paging-previous').show();
}

function ccm_setNewsflowOverlayDimensions() {
  if ($('#newsflow-overlay').length > 0) {
    const w = $('#newsflow-overlay').width();
    const tw = $(window).width();
    const th = $(window).height();

    const optimalHeight = 650;
    const availableSpace = th - 80;

    // we use h strictly for the _top param below
    const h = Math.min(availableSpace, optimalHeight);

    $('#newsflow-overlay').css('height', optimalHeight);

    const _left = (tw - w) / 2;
    const _top = (th - h) / 2 + 29;

    $('#newsflow-overlay').css({
      left: `${_left}px`,
      top: `${_top}px`
    });
  }
}

function ccm_getNewsflowOverlayWindow() {
  if ($('#ccm-dashboard-content').length > 0 && $('#newsflow-main').length > 0 && $('#newsflow-overlay').length == 0) {
    return $('#newsflow-main').parent();
  }

  // Ok. we're going to use #newsflow-overlay but we don't know if it's been added to the page yet
  if ($('#newsflow-overlay').length > 0) {
    return $('#newsflow-overlay');
  }

  return $('<div />').attr('id', 'newsflow-overlay').attr('class', 'ccm-ui').css('display', 'none').appendTo(document.body);
}

/**
 * Newsflow
 */
function ccm_showNewsflowOverlayWindow(url, callback) {
  // if we're NOT showing newsflow on a dashboard page, we load an overlay
  if ($('#ccm-dashboard-content').length === 0 && $('#newsflow-main').length === 0) {
    if ($('.ui-widget-overlay').length < 1) {
      const $overlay = $('<div class="ui-widget-overlay"></div>').hide().appendTo('body');
    }

    $('.ui-widget-overlay').show();
  }

  // Make the overlay resize when a browser window is resized
  $(window).resize(() => {
    ccm_setNewsflowOverlayDimensions();
  });

  // load the content into it.
  // we get the div we're loading content into
  // if we're in the dashboard, it's going to be newsflow-main
  let $ovl = ccm_getNewsflowOverlayWindow();
  $ovl.load(url, function () {
    // if we're showing the overlay, we hide it
    $ovl.hide();

    // hide all the arrows too
    $('.newsflow-paging-next').hide();
    $('.newsflow-paging-previous').hide();

    $ovl.html($(this).html());

    if (callback) {
      callback();
    }

    ccm_setNewsflowOverlayDimensions();
    ccm_setupTrickleUpNewsflowStyles();

    $ovl.fadeIn('300', 'easeOutExpo', () => {
      ccm_setNewsflowPagingArrowHeight();
    });
  });
}

function ccm_setupTrickleUpNewsflowStyles() {
  ccm_getNewsflowOverlayWindow()
  .find('.newsflow-em1').each(function () {
    $(this).parent().addClass('newsflow-em1');
  });
}

function ccm_showDashboardNewsflowWelcome() {
  $.fn.dialog.showLoader(ccmi18n.newsflowLoading);
  ccm_showNewsflowOverlayWindow(`${CCM_DISPATCHER_FILENAME}/dashboard/home?_ccm_dashboard_external=1`, () => {
    $.fn.dialog.hideLoader();
  });
}

function ccm_showNewsflowOffsite(id) {
  $.fn.dialog.showLoader();
  ccm_showNewsflowOverlayWindow(CCM_TOOLS_PATH + '/newsflow?cID=' + id, () => {
    $.fn.dialog.hideLoader();
  });
}

function ccm_showAppIntroduction() {
  ccm_showNewsflowOverlayWindow(CCM_DISPATCHER_FILENAME + '/dashboard/welcome?_ccm_dashboard_external=1');
}

function ccm_getNewsflowByPath(path) {
  $.fn.dialog.showLoader();
  ccm_showNewsflowOverlayWindow(CCM_TOOLS_PATH + '/newsflow?cPath=' + path, () => {
    $.fn.dialog.hideLoader();
  });
}

const Newsflow = {
  ccm_closeNewsflow,
  ccm_setNewsflowPagingArrowHeight,
  ccm_setNewsflowOverlayDimensions,
  ccm_getNewsflowOverlayWindow,
  ccm_showNewsflowOverlayWindow,
  ccm_setupTrickleUpNewsflowStyles,
  ccm_showDashboardNewsflowWelcome,
  ccm_showNewsflowOffsite,
  ccm_showAppIntroduction,
  ccm_getNewsflowByPath,
};

export default Newsflow;
