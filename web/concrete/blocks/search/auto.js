// JavaScript Document

const searchBlock = {

	                    init() {
		                    $('#ccm-searchBlock-externalTarget').click(function () { searchBlock.showResultsURL(this); });
	},

	                    showResultsURL(cb) {
		                    if (cb.checked) $('#ccm-searchBlock-resultsURL-wrap').css('display', 'block');
		                    else $('#ccm-searchBlock-resultsURL-wrap').css('display', 'none');
	},

	                    pathSelector(el) {
		                const f = $('#ccm-block-form').get(0);
		                  let isOther = 0;
		                    for (let i = 0; i < f.baseSearchPath.length; i++) {
			                    if (f.baseSearchPath[i].id == 'baseSearchPathOther' && f.baseSearchPath[i].checked) {
				                    isOther = 1;
				                    break;
			}
		}
		                    if (isOther)
			                     $('#basePathSelector').css('display', 'block');
		                    else $('#basePathSelector').css('display', 'none');
	},
};
$(() => { searchBlock.init(); });

ccm_selectSitemapNode = function (cID, cName) {
	                    $('#searchUnderCID').val(cID);
};
