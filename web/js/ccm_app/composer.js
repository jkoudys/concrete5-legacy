import $ from 'jquery';

const { CCM_TOOLS_PATH } = window;

Object.assign(this, {
  ccm_previewComposerDraft(cID, draftTitle) {
    $.fn.dialog.open({
      title: draftTitle,
      href: `${CCM_TOOLS_PATH}/composer/preview_frame?previewCID=${cID}`,
      width: '85%',
      modal: false,
      height: '75%',
    });
  },
});
