ccm_closeDashboardPane = function (a) { $(a).closest('div.ccm-pane').fadeOut(120, 'easeOutExpo'); }, ccm_getDashboardBackgroundImageData = function (a, b) { $.getJSON(CCM_TOOLS_PATH + '/dashboard/get_image_data', { image: a }, (a) => { if (a && b) { let c = '<div>'; c += '<strong>' + a.title + '</strong> ' + ccmi18n.authoredBy + ' ', c += a.link ? '<a target="_blank" href="' + a.link + '">' + a.author + '</a>' : a.author, $('<div id="ccm-dashboard-image-caption" class="ccm-ui"/>').html(c).appendTo(document.body).show(), setTimeout(() => { $('#ccm-dashboard-image-caption').fadeOut(1e3, 'easeOutExpo'); }, 5e3); } }); }; let lastSizeCheck = 9999999; ccm_testFixForms = function () { $(window).width() <= 560 && lastSizeCheck > 560 ? ccm_fixForms() : $(window).width() > 560 && 560 >= lastSizeCheck && ccm_fixForms(!0), lastSizeCheck = $(window).width(); }, ccm_fixForms = function (a) { $('form').each(function () { const b = $(this); a ? 'form-horizontal' == b.attr('original-class') && b.attr('class', '').addClass('form-horizontal') : b.removeClass('form-horizontal'); }); }, ccm_dashboardEqualizeMenus = function () { if ($(window).width() < 560) return $('div.dashboard-icon-list div.well').css('visibility', 'visible'), !1; let a, b = -1, c = 0, d = new Array(); for ($('ul.nav-list').each(function () { $(this).position().top != c && (b++, d[b] = new Array()), d[b].push($(this)), c = $(this).position().top; }), a = 0; a < d.length; a++) { let e = 0; for (b = 0; b < d[a].length; b++) { var f = d[a][b]; f.height() > e && (e = f.height()); } for (b = 0; b < d[a].length; b++) { var f = d[a][b]; f.css('height', e); } }$('div.dashboard-icon-list div.well').css('visibility', 'visible'); }, $(() => { ccm_activateToolbar(); const a = $('#ccm-page-help').popover({ trigger: 'click', content() { const a = $(this).attr('id') + '-content'; return $('#' + a).html(); }, placement: 'bottom', html: !0 }).click((a) => { a.stopPropagation(); }); if (a.length && $(document).click(() => { a.data('popover').hide(); }), $('.launch-tooltip').tooltip({ placement: 'bottom' }), $('#ccm-dashboard-result-message').length > 0) { if ($('.ccm-pane').length > 0) { let b = $('.ccm-pane').parent().attr('class'), c = $('.ccm-pane').parent().parent().attr('class'), d = $('#ccm-dashboard-result-message').html(); $('#ccm-dashboard-result-message').html('<div class="' + c + '"><div class="' + b + '">' + d + '</div></div>').fadeIn(400); } } else $('#ccm-dashboard-result-message').fadeIn(200); });
