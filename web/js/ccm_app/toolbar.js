import $ from 'jquery';

// Pull in our globals
const { CCM_TOOLS_PATH } = window;

$(() => {
  if ($('#ccm-toolbar').length > 0) {
    ccm_intelligentSearchActivateResults();
    ccm_intelligentSearchDoRemoteCalls($('#ccm-nav-intelligent-search').val());
  }
});

// Assign functions to global namespace
const Toolbar = {
  ccm_togglePopover(e, link) {
    if ($('.popover').is(':visible')) {
      $(link).popover('hide');
    } else {
      $(link).popover('show');
      e.stopPropagation();
      $(window).bind('click.popover', () => {
        $(link).popover('hide');
        $(window).unbind('click.popover');
      });
    }
  },

  ccm_toggleQuickNav(cID, token) {
    const l = $('#ccm-add-to-quick-nav');
    if (l.hasClass('ccm-icon-favorite-selected')) {
      l.removeClass('ccm-icon-favorite-selected').addClass('ccm-icon-favorite');
    } else {
      l.removeClass('ccm-icon-favorite').addClass('ccm-icon-favorite-selected');
    }
    const accepter = $('#ccm-nav-dashboard');
    const title = l.parent().parent().parent().find('h3');
    title.css('display', 'inline');
    title.effect('transfer', { to: accepter }, 600);
    $.get(CCM_TOOLS_PATH + '/dashboard/add_to_quick_nav', {
      'cID': cID,
      'token': token,
    }, (r) => {
      const div = $('<div />').html(r);
      $('#ccm-intelligent-search-results').html(div.find('#ccm-intelligent-search-results').html());
      $('#ccm-dashboard-overlay').html(div.find('#ccm-dashboard-overlay').html());
      $('#ccm-nav-intelligent-search').data('liveUpdate').setupCache();
    });
  },

  ccm_hideToolbarMenusTimer: false,
  ccm_hideToolbarMenus() {
    $('.ccm-system-nav-selected').removeClass('ccm-system-nav-selected');
    $('.ccm-system-nav-selected').removeClass('ccm-system-nav-selected');
    $('#ccm-edit-overlay').fadeOut(90);
    $('#ccm-dashboard-overlay').fadeOut(90);
    clearTimeout(ccm_hideToolbarMenusTimer);
  },

  ccm_activateToolbar() {
    $('#ccm-dashboard-overlay').css('visibility', 'visible').hide();

    $('#ccm-nav-intelligent-search-wrapper').click(() => {
      $('#ccm-nav-intelligent-search').focus();
    });
    $('#ccm-nav-intelligent-search').focus(function () {
      $('.ccm-system-nav-selected').removeClass('ccm-system-nav-selected');
      $(this).parent().addClass('ccm-system-nav-selected');
      if ($('#ccm-dashboard-overlay').is(':visible')) {
        $('#ccm-dashboard-overlay').fadeOut(90);
        $(window).unbind('click.dashboard-nav');
      }
    });

    $('.ccm-nav-edit-mode-active').click(() => {
      void (0);
      return false;
    });

    $('#ccm-edit-overlay,#ccm-dashboard-overlay').mouseover(() => {
      clearTimeout(ccm_hideToolbarMenusTimer);
    });

    $('#ccm-nav-dashboard').hoverIntent(function () {
      clearTimeout(ccm_hideToolbarMenusTimer);
      $('.ccm-system-nav-selected').removeClass('ccm-system-nav-selected');
      $(this).parent().addClass('ccm-system-nav-selected');
      $('#ccm-nav-intelligent-search').val('');
      $('#ccm-intelligent-search-results').fadeOut(90);

      if ($('#ccm-edit-overlay').is(':visible')) {
        $('#ccm-edit-overlay').fadeOut(90);
        $(window).unbind('click.ccm-edit');
      }

      /* if ($('#ccm-dashboard-overlay').is(':visible')) {
        $(".ccm-system-nav-selected").removeClass('ccm-system-nav-selected');
        $('#ccm-dashboard-overlay').fadeOut(90);
        $(window).unbind('click.dashboard-nav');
        } else {*/
      $('#ccm-dashboard-overlay').fadeIn(160);
      $(window).bind('click.dashboard-nav', () => {
        $('.ccm-system-nav-selected').removeClass('ccm-system-nav-selected');
        $('#ccm-dashboard-overlay').fadeOut(90);
        $(window).unbind('click.dashboard-nav');
      });
      // }
      return false;
    }, () => {});

    $('#ccm-nav-dashboard,#ccm-dashboard-overlay,#ccm-nav-edit,#ccm-edit-overlay').mouseout(() => {
      ccm_hideToolbarMenusTimer = setTimeout(() => {
        ccm_hideToolbarMenus();
      }, 1500);
    });

    $('#ccm-nav-intelligent-search').bind('keydown.ccm-intelligent-search', (e) => {
      if (e.keyCode == 13 || e.keyCode == 40 || e.keyCode == 38) {
        e.preventDefault();
        e.stopPropagation();

        if (e.keyCode == 13 && $('a.ccm-intelligent-search-result-selected').length > 0) {
          const href = $('a.ccm-intelligent-search-result-selected').attr('href');
          if (!href || href == '#' || href == 'javascript:void(0)') {
            $('a.ccm-intelligent-search-result-selected').click();
          } else {
            window.location.href = href;
          }
        }
        const visibleitems = $('#ccm-intelligent-search-results li:visible');
        let sel;

        if (e.keyCode == 40 || e.keyCode == 38) {
          $.each(visibleitems, (i, item) => {
            if ($(item).children('a').hasClass('ccm-intelligent-search-result-selected')) {
              if (e.keyCode == 38) {
                io = visibleitems[i - 1];
              } else {
                io = visibleitems[i + 1];
              }
              sel = $(io).find('a');
            }
          });
          if (sel && sel.length > 0) {
            $('a.ccm-intelligent-search-result-selected').removeClass();
            $(sel).addClass('ccm-intelligent-search-result-selected');
          }
        }
      }
    });

    $('#ccm-nav-intelligent-search').bind('keyup.ccm-intelligent-search', function (e) {
      ccm_intelligentSearchDoRemoteCalls($(this).val());
    });

    $('#ccm-nav-intelligent-search').blur(function () {
      $(this).parent().removeClass('ccm-system-nav-selected');
    });


    $('#ccm-nav-intelligent-search').liveUpdate('ccm-intelligent-search-results', 'intelligent-search');
    $('#ccm-nav-intelligent-search').bind('click', function (e) { if (this.value == '') {
      $('#ccm-intelligent-search-results').hide();
    } });

    $('#ccm-toolbar-nav-properties').dialog();
    $('#ccm-toolbar-nav-preview-as-user').dialog();
    $('#ccm-toolbar-add-subpage').dialog();
    $('#ccm-toolbar-nav-versions').dialog();
    $('#ccm-toolbar-nav-design').dialog();
    $('#ccm-toolbar-nav-permissions').dialog();
    $('#ccm-toolbar-nav-speed-settings').dialog();
    $('#ccm-toolbar-nav-move-copy').dialog();
    $('#ccm-toolbar-nav-delete').dialog();

    $('#ccm-edit-overlay,#ccm-dashboard-overlay').click((e) => {
      e.stopPropagation();
    });


    $('#ccm-nav-edit').hoverIntent(function () {
      clearTimeout(ccm_hideToolbarMenusTimer);
      $('.ccm-system-nav-selected').removeClass('ccm-system-nav-selected');
      $(this).parent().addClass('ccm-system-nav-selected');
      $('#ccm-nav-intelligent-search').val('');
      $('#ccm-intelligent-search-results').fadeOut(90);

      if ($('#ccm-dashboard-overlay').is(':visible')) {
        $('#ccm-dashboard-overlay').fadeOut(90);
        $(window).unbind('click.dashboard-nav');
      }

      /* if ($('#ccm-edit-overlay').is(':visible')) {
        $(".ccm-system-nav-selected").removeClass('ccm-system-nav-selected');
        $('#ccm-edit-overlay').fadeOut(90);
        $(window).unbind('click.ccm-edit');
        } else {*/
      setTimeout("$('#ccm-check-in-comments').focus();", 300);
      $('#ccm-check-in-preview').click(() => {
        $('#ccm-approve-field').val('PREVIEW');
        $('#ccm-check-in').submit();
      });

      $('#ccm-check-in-discard').click(() => {
        $('#ccm-approve-field').val('DISCARD');
        $('#ccm-check-in').submit();
      });

      $('#ccm-check-in-publish').click(() => {
        $('#ccm-approve-field').val('APPROVE');
        $('#ccm-check-in').submit();
      });
      let posX = $(this).position().left;
      if (posX > 0) {
        posX = posX - 20; // BACK it up!
      }
      $('#ccm-edit-overlay').css('left', posX + 'px');
      $('#ccm-edit-overlay').fadeIn(160, function () {
        $(this).find('a').click(() => {
          ccm_toolbarCloseEditMenu();
        });
      });
      $(window).bind('click.ccm-edit', () => {
        ccm_toolbarCloseEditMenu();
      });
      // }
      return false;
    }, () => {});
  },
  ajaxtimer: null,

  ccm_toolbarCloseEditMenu() {
    $('.ccm-system-nav-selected').removeClass('ccm-system-nav-selected');
    $('#ccm-edit-overlay').fadeOut(90);
    $(window).unbind('click.ccm-edit');
  },

  ccm_intelligentSearchActivateResults() {
    if ($('#ccm-intelligent-search-results div:visible').length == 0) {
      $('#ccm-intelligent-search-results').hide();
    }
    $('#ccm-intelligent-search-results a').hover(function () {
      $('a.ccm-intelligent-search-result-selected').removeClass();
      $(this).addClass('ccm-intelligent-search-result-selected');
    }, function () {
      $(this).removeClass('ccm-intelligent-search-result-selected');
    });
  },

  ccm_intelligentSearchDoRemoteCalls(query) {
    query = jQuery.trim(query);
    if (!query) {
      return;
    }
    if (query.length > 2) {
      if (query == window.ajaxquery) {
        return;
      }

      if (ajaxtimer) {
        window.clearTimeout(ajaxtimer);
      }
      window.ajaxquery = query;
      ajaxtimer = window.setTimeout(() => {
        ajaxtimer = null;
        $('#ccm-intelligent-search-results-list-marketplace').parent().show();
        $('#ccm-intelligent-search-results-list-help').parent().show();
        $('#ccm-intelligent-search-results-list-your-site').parent().show();
        $('#ccm-intelligent-search-results-list-marketplace').parent().addClass('ccm-intelligent-search-results-module-loading');
        $('#ccm-intelligent-search-results-list-help').parent().addClass('ccm-intelligent-search-results-module-loading');
        $('#ccm-intelligent-search-results-list-your-site').parent().addClass('ccm-intelligent-search-results-module-loading');

        $.getJSON(CCM_TOOLS_PATH + '/marketplace/intelligent_search', {
          q: window.ajaxquery,
        },
        (r) => {
          $('#ccm-intelligent-search-results-list-marketplace').parent().removeClass('ccm-intelligent-search-results-module-loading');
          $('#ccm-intelligent-search-results-list-marketplace').html('');
          for (let i = 0; i < r.length; i++) {
            const rr = r[i];
            const _onclick = 'ccm_getMarketplaceItemDetails(' + rr.mpID + ')';
            $('#ccm-intelligent-search-results-list-marketplace').append('<li><a href="javascript:void(0)" onclick="' + _onclick + '"><img src="' + rr.img + '" />' + rr.name + '</a></li>');
          }
          if (r.length == 0) {
            $('#ccm-intelligent-search-results-list-marketplace').parent().hide();
          }
          if ($('.ccm-intelligent-search-result-selected').length == 0) {
            $('#ccm-intelligent-search-results').find('li a').removeClass('ccm-intelligent-search-result-selected');
            $('#ccm-intelligent-search-results li:visible a:first').addClass('ccm-intelligent-search-result-selected');
          }
          ccm_intelligentSearchActivateResults();
        }).error(() => {
          $('#ccm-intelligent-search-results-list-marketplace').parent().hide();
        });

        $.getJSON(CCM_TOOLS_PATH + '/get_remote_help', {
          q: window.ajaxquery,
        },
        (r) => {
          $('#ccm-intelligent-search-results-list-help').parent().removeClass('ccm-intelligent-search-results-module-loading');
          $('#ccm-intelligent-search-results-list-help').html('');
          for (let i = 0; i < r.length; i++) {
            const rr = r[i];
            $('#ccm-intelligent-search-results-list-help').append('<li><a href="' + rr.href + '">' + rr.name + '</a></li>');
          }
          if (r.length == 0) {
            $('#ccm-intelligent-search-results-list-help').parent().hide();
          }
          if ($('.ccm-intelligent-search-result-selected').length == 0) {
            $('#ccm-intelligent-search-results').find('li a').removeClass('ccm-intelligent-search-result-selected');
            $('#ccm-intelligent-search-results li:visible a:first').addClass('ccm-intelligent-search-result-selected');
          }
          ccm_intelligentSearchActivateResults();
        }).error(() => {
          $('#ccm-intelligent-search-results-list-help').parent().hide();
        });

        $.getJSON(CCM_TOOLS_PATH + '/pages/intelligent_search', {
          q: window.ajaxquery,
        },
        (r) => {
          $('#ccm-intelligent-search-results-list-your-site').parent().removeClass('ccm-intelligent-search-results-module-loading');
          $('#ccm-intelligent-search-results-list-your-site').html('');
          for (let i = 0; i < r.length; i++) {
            const rr = r[i];
            $('#ccm-intelligent-search-results-list-your-site').append('<li><a href="' + rr.href + '">' + rr.name + '</a></li>');
          }
          if (r.length == 0) {
            $('#ccm-intelligent-search-results-list-your-site').parent().hide();
          }
          if ($('.ccm-intelligent-search-result-selected').length == 0) {
            $('#ccm-intelligent-search-results').find('li a').removeClass('ccm-intelligent-search-result-selected');
            $('#ccm-intelligent-search-results li:visible a:first').addClass('ccm-intelligent-search-result-selected');
          }
          ccm_intelligentSearchActivateResults();
        }).error(() => {
          $('#ccm-intelligent-search-results-list-your-site').parent().hide();
        });
      }, 500);
    }
  },
};

export default Toolbar;
