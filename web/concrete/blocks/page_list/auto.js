const pageList = {
	                    servicesDir: $('input[name=pageListToolsDir]').val(),
	                    init() {
		                    this.blockForm = document.forms['ccm-block-form'];
		                    this.cParentIDRadios = this.blockForm.cParentID;
		                    for (var i = 0; i < this.cParentIDRadios.length; i++) {
			                    this.cParentIDRadios[i].onclick = function () { pageList.locationOtherShown(); pageList.includeAllDescendentsShown(); };
			                    this.cParentIDRadios[i].onchange = function () { pageList.locationOtherShown(); pageList.includeAllDescendentsShown(); };
		}

		                    this.rss = document.forms['ccm-block-form'].rss;
		                    for (var i = 0; i < this.rss.length; i++) {
			                    this.rss[i].onclick = function () { pageList.rssInfoShown(); };
			                    this.rss[i].onchange = function () { pageList.rssInfoShown(); };
		}

		                    this.truncateSwitch = $('#ccm-pagelist-truncateSummariesOn');
		                    this.truncateSwitch.click(function () { pageList.truncationShown(this); });
		                    this.truncateSwitch.change(function () { pageList.truncationShown(this); });

		                    this.tabSetup();
	},
	                    tabSetup() {
		                    $('ul#ccm-pagelist-tabs li a').each((num, el) => {
			                    el.onclick = function () {
				                const pane = this.id.replace('ccm-pagelist-tab-', '');
				                    pageList.showPane(pane);
			};
		});
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
	                    showPane(pane) {
		                    $('ul#ccm-pagelist-tabs li').each((num, el) => { $(el).removeClass('ccm-nav-active'); });
		                    $(document.getElementById('ccm-pagelist-tab-' + pane).parentNode).addClass('ccm-nav-active');
		                    $('div.ccm-pagelistPane').each((num, el) => { el.style.display = 'none'; });
		                    $('#ccm-pagelistPane-' + pane).css('display', 'block');
		                    if (pane == 'preview') this.loadPreview();
	},
	                    locationOtherShown() {
		                    for (let i = 0; i < this.cParentIDRadios.length; i++) {
			                    if (this.cParentIDRadios[i].checked && this.cParentIDRadios[i].value == 'OTHER') {
				                    $('div.ccm-page-list-page-other').css('display', 'block');
				                    return;
			}
		}
		                    $('div.ccm-page-list-page-other').css('display', 'none');
	},
	                    includeAllDescendentsShown() {
		                    for (let i = 0, len = this.cParentIDRadios.length; i < len; i++) {
			                const cParentID = this.cParentIDRadios[i].value;
			                    if (this.cParentIDRadios[i].checked && (cParentID == 'OTHER' || parseInt(cParentID) > 0)) {
				                    $('div.ccm-page-list-all-descendents').css('display', 'block');
				                    return;
			}
		}
		                    $('div.ccm-page-list-all-descendents').css('display', 'none');
	},
	                    rssInfoShown() {
		                    for (let i = 0; i < this.rss.length; i++) {
			                    if (this.rss[i].checked && this.rss[i].value == '1') {
				                    $('#ccm-pagelist-rssDetails').css('display', 'block');
				                    return;
			}
		}
		                    $('#ccm-pagelist-rssDetails').css('display', 'none');
	},
	                    loadPreview() {
		                const loaderHTML = '<div style="padding: 20px; text-align: center"><img src="' + CCM_IMAGE_PATH + '/throbber_white_32.gif"></div>';
		                    $('#ccm-pagelistPane-preview').html(loaderHTML);
		                const qStr = $(this.blockForm).formSerialize();
		                    $.ajax({
			                    url: this.servicesDir + 'preview_pane.php?' + qStr,
			                    success(msg) { $('#ccm-pagelistPane-preview').html(msg); },
		});
	},
	                    validate() {
			                  let failed = 0;

			                const rssOn = $('#ccm-pagelist-rssSelectorOn');
			                const rssTitle = $('#ccm-pagelist-rssTitle');
			                    if (rssOn && rssOn.prop('checked') && rssTitle && rssTitle.val().length == 0) {
				                    alert(ccm_t('feed-name'));
				                    rssTitle.focus();
				                    failed = 1;
			}

			                    if (failed) {
				                    ccm_isBlockError = 1;
				                    return false;
			}
			                    return true;
	},
};
$(() => { pageList.init(); });

ccmValidateBlockForm = function () { return pageList.validate(); };
