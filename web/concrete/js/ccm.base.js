/* global jQuery $ */
// cannot rely on jQuery being loaded here

const ccm_uiLoaded = false;
let ccm_siteActivated = true;
const ccm_animEffects = false;

function ccm_parseJSON(resp, onNoError) {
  if (resp.error) {
    return alert(resp.message);
  }
  onNoError();
}

function ccm_deactivateSite(onDone) {
  if (!ccm_siteActivated) return false;

  if ($('#ccm-overlay').length < 1) {
    $(document.body).append('<div id="ccm-overlay"></div>');
  }

  $('embed,object').each(function () {
    $(this).attr('ccm-style-old-visibility', $(this).css('visibility'));
    $(this).css('visibility', 'hidden');
  });

  if (ccm_animEffects) {
    $('#ccm-overlay').fadeIn(100);
  } else {
    $('#ccm-overlay').show();
  }

  ccm_siteActivated = false;
  if (typeof onDone === 'function') {
    onDone();
  }
}

function ccm_activateSite() {
  if (ccm_animEffects) {
    $('#ccm-overlay').fadeOut(100);
  } else {
    $('#ccm-overlay').hide();
  }

  $('embed,object').each(function () {
    $(this).css('visibility', $(this).attr('ccm-style-old-visibility'));
  });

  ccm_siteActivated = true;
  ccm_topPaneDeactivated = false;
}

function ccm_addHeaderItem(item, type) {
  // "item" might already have a "?v=", so avoid invalid query string.
  const qschar = (item.indexOf('?') > -1 ? '&ts' : '?ts=');
  if (type === 'CSS') {
    if (navigator.userAgent.indexOf('MSIE') > -1) {
      // Most reliable way found to force IE to apply dynamically inserted stylesheet across jQuery versions
      const ss = document.createElement('link');
      const hd = document.getElementsByTagName('head')[0];
      ss.type = 'text/css'; ss.rel = 'stylesheet'; ss.href = item; ss.media = 'screen';
      hd.appendChild(ss);
    } else if (!($('head').children('link[href*="' + item + '"]').length)) {
      $('head')
      .append('<link rel="stylesheet" media="screen" type="text/css" href="' + item + qschar + new Date().getTime() + '" />');
    }
  } else if (type === 'JAVASCRIPT' && !($('script[src*="' + item + '"]').length)) {
    $('head').append('<script type="text/javascript" src="' + item + qschar + new Date().getTime() + '"></script>');
  } else if (!($('head').children(item).length)) {
    $('head').append(item);
  }
}

// called in versions popup
function ccm_disableLinks() {
  const td = document.createElement('DIV');
  td.style.position = 'absolute';
  td.style.top = '0px';
  td.style.left = '0px';
  td.style.width = '100%';
  td.style.height = '100%';
  td.style.zIndex = '1000';
  document.body.appendChild(td);
}
