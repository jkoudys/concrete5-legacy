const tags = {
	                    init() {
		                    this.tabSetup();
		                    this.showHideDisplayType();

		                    $('input[name="displayMode"]').change(() => {
			                    tags.showHideDisplayType();
		});
	},
	                    tabSetup() {
		                    $('ul#ccm-tags-tabs li a').each((num, el) => {
			                    el.onclick = function () {
				                const pane = this.id.replace('ccm-tags-tab-', '');
				                    tags.showPane(pane);
			};
		});
	},
	                    showPane(pane) {
		                    $('ul#ccm-tags-tabs li').each((num, el) => { $(el).removeClass('active'); });
		                    $(document.getElementById('ccm-tags-tab-' + pane).parentNode).addClass('active');
		                    $('div.ccm-tagsPane').each((num, el) => { el.style.display = 'none'; });
		                    $('#ccm-tagsPane-' + pane).css('display', 'block');
	},

	                    validate() {
		                    return true;
	},

	                    showHideDisplayType() {
		                    if ($('#displayMode1').prop('checked')) {
			                    $('#ccm-tags-display-cloud').hide();
			                    $('#ccm-tags-display-page').show();
		} else {
			                    $('#ccm-tags-display-page').hide();
			                    $('#ccm-tags-display-cloud').show();
		}
	},
};
$(() => { tags.init(); });

ccmValidateBlockForm = function () { return tags.validate(); };
