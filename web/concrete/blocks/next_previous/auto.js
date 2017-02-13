const ccmNextPrevious = {

	                    init() {
		                    $('input[name=linkStyle]').each((i, el) => {
			                    el.onclick = function () { ccmNextPrevious.nextPrevLabelsShown(this); };
			                    el.onchange = function () { ccmNextPrevious.nextPrevLabelsShown(this); };
		});
	},

	                    nextPrevLabelsShown() {
		                const el = $('input[name="linkStyle"]:checked');
		                const displayed = (el.val() == 'next_previous') ? 'block' : 'none';
		                    $('#ccm_edit_pane_nextPreviousWrap').css('display', displayed);
	},

	                    validate() {
			                const failed = 0;

			                    if (failed) {
				                    ccm_isBlockError = 1;
				                    return false;
			}
			                    return true;
	},

};

$(() => { ccmNextPrevious.init(); });

ccmValidateBlockForm = function () { return ccmNextPrevious.validate(); };
