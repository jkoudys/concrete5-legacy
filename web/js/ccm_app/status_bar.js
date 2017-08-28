import $ from 'jquery';

const items = [];

function addItem(item) {
  items.push(item);
}

function activate(containerID) {
  if (!containerID) {
    containerID = 'ccm-page-controls-wrapper';
  }

  if (items.length > 0) {
    let d = '<div id="ccm-page-status-bar" class="ccm-ui">';
    let i = 0;
    for (const it of items) {
      let buttonStr = '';
      const buttons = it.getButtons();
      for (const button of buttons) {
        let innerButtonLeft = '';
        let innerButtonRight = '';
        if (button.getInnerButtonLeftHTML()) {
          innerButtonLeft = button.getInnerButtonLeftHTML() + ' ';
        }
        if (button.getInnerButtonRightHTML()) {
          innerButtonRight = ' ' + button.getInnerButtonRightHTML();
        }
        const attribs = Object.values(button.getAttributes()).reduce((a, { key, value }) => `${key}='${value}'`, '');
        if (button.getURL()) {
          buttonStr += `
          <a href="${button.getURL()}" ${attribs} class="btn btn-small ${button.getCSSClass()}">
          ${innerButtonLeft}${button.getLabel()}${innerButtonRight}
          </a>`;
        } else {
          buttonStr += `
          <button type="submit" ${attribs} name="action_${button.getAction()}" class="btn-small btn ${button.getCSSClass()}">
          ${innerButtonLeft}${button.getLabel()}${innerButtonRight}
          </button>`;
        }
      }
      d += `
      <form method="post" action="${it.getAction()}" id="ccm-status-bar-form-${i}" ${(it.useAjaxForm ? 'class="ccm-status-bar-ajax-form"' : '')}>
      <div class="alert-message alert ${it.getCSSClass()}">
      <button type="button" class="close" data-dismiss="alert">×</button>
      <span>${it.getDescription()}</span>
      <div class="ccm-page-status-bar-buttons"> ${buttonStr}</div>
      </div>
      </form>`;
      i++;
    }
    d += '</div>';

    $(`#${containerID}`).append(d);
    $('#ccm-page-status-bar .dialog-launch').dialog();
    $('#ccm-page-status-bar .alert').bind('closed', function () {
      $(this).remove();
      const visi = $('#ccm-page-status-bar .alert:visible').length;
      if (visi == 0) {
        $('#ccm-page-status-bar').remove();
      }
    });
    $('#ccm-page-status-bar .ccm-status-bar-ajax-form').ajaxForm({
      dataType: 'json',
      beforeSubmit() {
        $.fn.dialog.showLoader();
      },
      success(r) {
        if (r.redirect) {
          window.location.href = r.redirect;
        }
      },
    });
  }
}

const StatusBar = {
  ccm_statusBar: { addItem, activate },

  ccm_statusBarItem() {
    let css = '';
    let description = '';
    let action = '';
    let useAjaxForm = false;
    const buttons = [];

    Object.assign(this, {
      addButton: (btn) => buttons.push(btn),
      enableAjaxForm: () => { useAjaxForm = true; },
      getAction: () => action,
      getButtons: () => buttons,
      getCSSClass: () => css,
      getDescription: () => description,
      setAction: (val) => { action = val; },
      setCSSClass: (val) => { css = val; },
      setDescription: (val) => { description = val; },
    });
  },

  ccm_statusBarItemButton() {
    let css = '';
    let innerbuttonleft = '';
    let innerbuttonright = '';
    let label = '';
    let action = '';
    let url = '';
    const attribs = [];

    Object.assign(this, {
      addAttribute: (key, value) => attribs.push({ key, value }),
      getAction: () => action,
      getAttributes: () => attribs,
      getCSSClass: () => css,
      getInnerButtonLeftHTML: () => innerbuttonleft,
      getInnerButtonRightHTML: () => innerbuttonright,
      getLabel: () => label,
      getURL: () => url,
      setAction(val) { action = val; },
      setCSSClass(val) { css = val; },
      setInnerButtonLeftHTML(html) { innerbuttonleft = html; },
      setInnerButtonRightHTML(html) { innerbuttonright = html; },
      setLabel(val) { label = val; },
      setURL(val) { url = val; },
    });
  },
};

export default StatusBar;
