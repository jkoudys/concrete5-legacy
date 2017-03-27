import $ from 'jquery';

const { CCM_TOOLS_PATH } = window;

ccm_closeDashboardPane = function (r) {
  $(r).closest('div.ccm-pane').fadeOut(120);
};

ccm_getDashboardBackgroundImageData = function (image, display) {
  $.getJSON(CCM_TOOLS_PATH + '/dashboard/get_image_data', {
    'image': image,
  }, (r) => {
    if (r && display) {
      let html = '<div>';
      html += `<strong>${r.title}</strong> ${ccmi18n.authoredBy} `;
      if (r.link) {
        html += `<a target="_blank" href="${r.link}">${r.author}</a>`;
      } else {
        html += r.author;
      }
      $('<div id="ccm-dashboard-image-caption" class="ccm-ui"/>')
      .html(html)
      .appendTo(document.body)
      .show();

      setTimeout(() => {
        $('#ccm-dashboard-image-caption').fadeOut(1000);
      }, 5000);
    }
  });
};

let lastSizeCheck = 9999999;
ccm_testFixForms = function () {
  if ($(window).width() <= 560 && lastSizeCheck > 560) {
    ccm_fixForms();
  } else if ($(window).width() > 560 && lastSizeCheck <= 560) {
    ccm_fixForms(true);
  }
  lastSizeCheck = $(window).width();
};
ccm_fixForms = function (horizontal) {
  $('form').each(function () {
    const f = $(this);
    if (horizontal) {
      if (f.attr('original-class') == 'form-horizontal') {
        f.attr('class', '').addClass('form-horizontal');
      }
    } else {
      f.removeClass('form-horizontal');
    }
  });
};

ccm_dashboardEqualizeMenus = function () {
  if ($(window).width() < 560) {
    $('div.dashboard-icon-list div.well').css('visibility', 'visible');
    return false;
  }
  let j = -1;
  let i;
  let pos = 0;
  const menus = [];

  $('ul.nav-list').each(function () {
    if ($(this).position().top != pos) {
      j++;
      menus[j] = new Array();
    }

    menus[j].push($(this));
    pos = $(this).position().top;
  });

  for (i = 0; i < menus.length; i++) {
    let h = 0;
    for (j = 0; j < menus[i].length; j++) {
      let mx = menus[i][j];
      if (mx.height() > h) {
        h = mx.height();
      }
    }
    for (j = 0; j < menus[i].length; j++) {
      let mx = menus[i][j];
      mx.css('height', h);
    }
  }
  $('div.dashboard-icon-list div.well').css('visibility', 'visible');
};

$(() => {
  ccm_activateToolbar();

  const $ccmPageHelp = $('#ccm-page-help').popover({
    trigger: 'click',
    content() {
      const id = $(this).attr('id') + '-content';
      return $('#' + id).html();
    }, placement: 'bottom', html: true })
    .click((e) => {
      e.stopPropagation();
    });
    if ($ccmPageHelp.length) {
      $(document).click(() => {
        $ccmPageHelp.data('popover').hide();
      });
    }
    $('.launch-tooltip').tooltip({ placement: 'bottom' });
    if ($('#ccm-dashboard-result-message').length > 0) {
      if ($('.ccm-pane').length > 0) {
        const pclass = $('.ccm-pane').parent().attr('class');
        const gpclass = $('.ccm-pane').parent().parent().attr('class');
        const html = $('#ccm-dashboard-result-message').html();
        $('#ccm-dashboard-result-message').html('<div class="' + gpclass + '"><div class="' + pclass + '">' + html + '</div></div>').fadeIn(400);
      }
    } else {
      $('#ccm-dashboard-result-message').fadeIn(200);
    }
});
