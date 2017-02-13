const dateNav = {
	                    servicesDir: $('input[name=dateNavToolsDir]').val(),
	                    init() {
		                    this.blockForm = document.forms['ccm-block-form'];

		                    this.showDescriptionsRadios = this.blockForm.showDescriptions;
		                    for (let i = 0; i < this.showDescriptionsRadios.length; i++) {
			                    this.showDescriptionsRadios[i].onclick = function () { dateNav.showDescriptionOpts(); };
			                    this.showDescriptionsRadios[i].onchange = function () { dateNav.showDescriptionOpts(); };
		}
		                    this.truncateSwitch = $('#ccm-pagelist-truncateSummariesOn');
		                    this.truncateSwitch.click(function () { dateNav.truncationShown(this); });
		                    this.truncateSwitch.change(function () { dateNav.truncationShown(this); });

		                    this.truncateTitlesSwitch = $('#ccm-pagelist-truncateTitlesOn');
		                    this.truncateTitlesSwitch.click(function () { dateNav.titleTruncationShown(this); });
		                    this.truncateTitlesSwitch.change(function () { dateNav.titleTruncationShown(this); });
	},
	                    showDescriptionOpts() {
		                    for (let i = 0; i < this.showDescriptionsRadios.length; i++) {
			                    if (this.showDescriptionsRadios[i].checked && this.showDescriptionsRadios[i].value === '1') {
				                    $('div#ccm-pagelist-summariesOptsWrap').css('display', 'block');
				                    return;
			}
		}
		                    $('div#ccm-pagelist-summariesOptsWrap').css('display', 'none');
	},
	                    truncationShown(cb) {
		                const truncateTxt = $('#ccm-pagelist-truncateTxt');
		                const f = $('#ccm-pagelist-truncateChars');
		                    if (cb.checked) {
			                    truncateTxt.removeClass('faintText');
			                    f.attr('disabled', false);
		} else {
			                    truncateTxt.addClass('faintText');
			                    f.attr('disabled', true);
		}
	},
	                    titleTruncationShown(cb) {
		                const truncateTxt = $('#ccm-pagelist-truncateTitleTxt');
		                const f = $('#ccm-pagelist-truncateTitleChars');
		                    if (cb.checked) {
			                    truncateTxt.removeClass('faintText');
			                    f.attr('disabled', false);
		} else {
			                    truncateTxt.addClass('faintText');
			                    f.attr('disabled', true);
		}
	},
	                    locationOtherShown() {
		                    for (let i = 0; i < this.cParentIDRadios.length; i++) {
			                    if (this.cParentIDRadios[i].checked && this.cParentIDRadios[i].value === 'OTHER') {
				                    $('div.ccm-page-list-page-other').css('display', 'block');
				                    return;
			}
		}
		                    $('div.ccm-page-list-page-other').css('display', 'none');
	},
	                    validate() {
		                const failed = 0;

		                    if (failed === 1) {
			                    ccm_isBlockError = 1;
			                    return false;
		}

		                    return true;
	},
};
$(() => { dateNav.init(); });
ccmValidateBlockForm = function () { return dateNav.validate(); };
