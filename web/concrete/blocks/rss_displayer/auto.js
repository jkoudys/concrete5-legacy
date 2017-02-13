// JavaScript Document

const rssDisplayer = {

	                    validate() {
		                const urlF = $('#ccm_rss_displayer_url');
		                const urlV = urlF.val();
		                    if (!urlV || urlV.length == 0 || urlV.indexOf('://') == -1) {
			                    ccm_addError(ccm_t('feed-address'));
			                    urlF.focus();
		}

		                const itemsF = $('#ccm_rss_displayer_itemsToDisplay');
		                const itemsV = itemsF.val();
		                    if (!itemsV || itemsV.length == 0 || parseInt(itemsV) < 1) {
			                    ccm_addError(ccm_t('feed-num-items'));
			                    itemsF.focus();
		}
	},
};

ccmValidateBlockForm = function () { return rssDisplayer.validate(); };
