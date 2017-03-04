/**
 * Page Reindexing
 */

import $ from 'jquery';

const { CCM_TOOLS_PATH, CCM_SECURITY_TOKEN } = window;

function ccm_doPageReindexing() {
  $.get(`${CCM_TOOLS_PATH}/reindex_pending_pages?ccm_token=${CCM_SECURITY_TOKEN}`);
}

export default { ccm_doPageReindexing };
