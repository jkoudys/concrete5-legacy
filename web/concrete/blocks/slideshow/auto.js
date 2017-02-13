const SlideshowBlock = {

	                    init() {},

	                    chooseImg() {
		                    ccm_launchFileManager('&fType=' + ccmi18n_filemanager.FTYPE_IMAGE);
	},

	                    showImages() {
		                    $('#ccm-slideshowBlock-imgRows').show();
		                    $('#ccm-slideshowBlock-chooseImg').show();
		                    $('#ccm-slideshowBlock-fsRow').hide();
	},

	                    showFileSet() {
		                    $('#ccm-slideshowBlock-imgRows').hide();
		                    $('#ccm-slideshowBlock-chooseImg').hide();
		                    $('#ccm-slideshowBlock-fsRow').show();
	},

	                    selectObj(obj) {
		                    if (obj.fsID != undefined) {
			                    $('#ccm-slideshowBlock-fsRow input[name=fsID]').attr('value', obj.fsID);
			                    $('#ccm-slideshowBlock-fsRow input[name=fsName]').attr('value', obj.fsName);
			                    $('#ccm-slideshowBlock-fsRow .ccm-slideshowBlock-fsName').text(obj.fsName);
		} else {
			                    this.addNewImage(obj.fID, obj.thumbnailLevel1, obj.height, obj.title);
		}
	},

	                    addImages: 0,
	                    addNewImage(fID, thumbPath, imgHeight, title) {
		                    this.addImages--; // negative counter - so it doesn't compete with real slideshowImgIds
		                const slideshowImgId = this.addImages;
		                  let templateHTML = $('#imgRowTemplateWrap .ccm-slideshowBlock-imgRow').html().replace(/tempFID/g, fID);
		                    templateHTML = templateHTML.replace(/tempThumbPath/g, thumbPath);
		                    templateHTML = templateHTML.replace(/tempFilename/g, title);
		                    templateHTML = templateHTML.replace(/tempSlideshowImgId/g, slideshowImgId).replace(/tempHeight/g, imgHeight);
		                const imgRow = document.createElement('div');
		                    imgRow.innerHTML = templateHTML;
		                    imgRow.id = 'ccm-slideshowBlock-imgRow' + parseInt(slideshowImgId);
		                    imgRow.className = 'ccm-slideshowBlock-imgRow';
		                    document.getElementById('ccm-slideshowBlock-imgRows').appendChild(imgRow);
		                const bgRow = $('#ccm-slideshowBlock-imgRow' + parseInt(fID) + ' .backgroundRow');
		                    bgRow.css('background', 'url(' + escape(thumbPath) + ') no-repeat left top');
	},

	                    removeImage(fID) {
		                    $('#ccm-slideshowBlock-imgRow' + fID).remove();
	},

	                    moveUp(fID) {
		                const thisImg = $('#ccm-slideshowBlock-imgRow' + fID);
		                const qIDs = this.serialize();
		                  let previousQID = 0;
		                    for (let i = 0; i < qIDs.length; i++) {
			                    if (qIDs[i] == fID) {
				                    if (previousQID == 0) break;
				                    thisImg.after($('#ccm-slideshowBlock-imgRow' + previousQID));
				                    break;
			}
			                    previousQID = qIDs[i];
		}
	},
	                    moveDown(fID) {
		                const thisImg = $('#ccm-slideshowBlock-imgRow' + fID);
		                const qIDs = this.serialize();
		                  let thisQIDfound = 0;
		                    for (let i = 0; i < qIDs.length; i++) {
			                    if (qIDs[i] == fID) {
				                    thisQIDfound = 1;
				                    continue;
			}
			                    if (thisQIDfound) {
				                    $('#ccm-slideshowBlock-imgRow' + qIDs[i]).after(thisImg);
				                    break;
			}
		}
	},
	                    serialize() {
		                const t = document.getElementById('ccm-slideshowBlock-imgRows');
		                const qIDs = [];
		                    for (let i = 0; i < t.childNodes.length; i++) {
			                    if (t.childNodes[i].className && t.childNodes[i].className.indexOf('ccm-slideshowBlock-imgRow') >= 0) {
				                const qID = t.childNodes[i].id.replace('ccm-slideshowBlock-imgRow', '');
				                    qIDs.push(qID);
			}
		}
		                    return qIDs;
	},

	                    validate() {
		                  let failed = 0;

		                    if ($('#newImg select[name=type]').val() == 'FILESET')
		{
			                    if ($('#ccm-slideshowBlock-fsRow input[name=fsID]').val() <= 0) {
				                    alert(ccm_t('choose-fileset'));
				                    $('#ccm-slideshowBlock-AddImg').focus();
				                    failed = 1;
			}
		} else {
			                    qIDs = this.serialize();
			                    if (qIDs.length < 2) {
				                    alert(ccm_t('choose-min-2'));
				                    $('#ccm-slideshowBlock-AddImg').focus();
				                    failed = 1;
			}
		}

		                    if (failed) {
			                    ccm_isBlockError = 1;
			                    return false;
		}
		                    return true;
	},
};

ccmValidateBlockForm = function () { return SlideshowBlock.validate(); };
ccm_chooseAsset = function (obj) { SlideshowBlock.selectObj(obj); };

$(() => {
	                    if ($('#newImg select[name=type]').val() == 'FILESET') {
		                    $('#newImg select[name=type]').val('FILESET');
		                    SlideshowBlock.showFileSet();
	} else {
		                    $('#newImg select[name=type]').val('CUSTOM');
		                    SlideshowBlock.showImages();
	}

	                    $('#newImg select[name=type]').change(function () {
		                    if (this.value == 'FILESET') {
			                    SlideshowBlock.showFileSet();
		} else {
			                    SlideshowBlock.showImages();
		}
	});
});

