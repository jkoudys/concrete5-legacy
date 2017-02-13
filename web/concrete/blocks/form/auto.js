const miniSurvey = {
	                    bid: 0,
	                    serviceURL: $('input[name=miniSurveyServices]').val() + '?block=form&',
	                    init() {
			                    this.tabSetup();

			/*
			for(var i=0;i<this.answerTypes.length;i++){
				this.answerTypes[i].onclick=function(){miniSurvey.optionsCheck(this);miniSurvey.settingsCheck(this);}
				this.answerTypes[i].onchange=function(){miniSurvey.optionsCheck(this);miniSurvey.settingsCheck(this);}
			}
			for(var i=0;i<this.answerTypesEdit.length;i++){
				this.answerTypesEdit[i].onclick=function(){miniSurvey.optionsCheck(this,'Edit');miniSurvey.settingsCheck(this,'Edit');}
				this.answerTypesEdit[i].onchange=function(){miniSurvey.optionsCheck(this,'Edit');miniSurvey.settingsCheck(this,'Edit');}
			}
			*/

			                    $('#answerType').change((r) => {
				                    miniSurvey.optionsCheck($('#answerType').get(0));
				                    miniSurvey.settingsCheck($('#answerType').get(0));
			});

			                    $('#answerTypeEdit').change((r) => {
				                    miniSurvey.optionsCheck($('#answerTypeEdit').get(0), 'Edit');
				                    miniSurvey.settingsCheck($('#answerTypeEdit').get(0), 'Edit');
			});

			                    $('#refreshButton').click(() => { miniSurvey.refreshSurvey(); return false; });
			                    $('#addQuestion').click(() => { miniSurvey.addQuestion(); return false; });
			                    $('#editQuestion').click(() => { miniSurvey.addQuestion('Edit'); return false; });
			                    $('#cancelEditQuestion').click(() => { $('#editQuestionForm').css('display', 'none'); });
			                    this.serviceURL += 'cID=' + this.cID + '&arHandle=' + this.arHandle + '&bID=' + this.bID + '&btID=' + this.btID + '&';
			                    miniSurvey.refreshSurvey();
			                    $('#emailSettings').hide();
		},
	                    tabSetup() {
		                    $('ul#ccm-formblock-tabs li a').each((num, el) => {
			                    el.onclick = function () {
				                const pane = this.id.replace('ccm-formblock-tab-', '');
				                    miniSurvey.showPane(pane);
			};
		});
	},
	                    showPane(pane) {
		                    $('ul#ccm-formblock-tabs li').each((num, el) => { $(el).removeClass('active'); });
		                    $(document.getElementById('ccm-formblock-tab-' + pane).parentNode).addClass('active');
		                    $('div.ccm-formBlockPane').each((num, el) => { el.style.display = 'none'; });
		                    $('#ccm-formBlockPane-' + pane).css('display', 'block');
	},
	                    refreshSurvey() {
			                    $.ajax({
					                    url: this.serviceURL + 'mode=refreshSurvey&qsID=' + parseInt(this.qsID) + '&hide=' + miniSurvey.hideQuestions.join(','),
					                    success(msg) { $('#miniSurveyPreviewWrap').html(msg); },
				});
			                    $.ajax({
					                    url: this.serviceURL + 'mode=refreshSurvey&qsID=' + parseInt(this.qsID) + '&showEdit=1&hide=' + miniSurvey.hideQuestions.join(','),
					                    success(msg) {	$('#miniSurveyWrap').html(msg); },
				});
		},
	                    optionsCheck(radioButton, mode) {
			                    if (mode != 'Edit') mode = '';
			                    if (radioButton.value == 'select' || radioButton.value == 'radios' || radioButton.value == 'checkboxlist') {
				                     $('#answerOptionsArea' + mode).css('display', 'block');
			} else $('#answerOptionsArea' + mode).css('display', 'none');

			                    if (radioButton.value == 'email') {
				                    $('#emailSettings' + mode).show();
			} else {
				                    $('#emailSettings' + mode).hide();
			}
		},
	                    settingsCheck(radioButton, mode) {
			                    if (mode != 'Edit') mode = '';
			                    if (radioButton.value == 'text') {
				                     $('#answerSettings' + mode).css('display', 'block');
			} else {
				                    $('#answerSettings' + mode).css('display', 'none');
			}
		},
	                    addQuestion(mode) {
			                  let msqID = 0;
			                    if (mode != 'Edit') {
				                    mode = '';
			} else {
				                    msqID = parseInt($('#msqID').val(), 10);
			}
			                const formID = '#answerType' + mode;
			                    answerType = $(formID).val();
			                const options = encodeURIComponent($('#answerOptions' + mode).val());
			                  let postStr = 'question=' + encodeURIComponent($('#question' + mode).val()) + '&options=' + options;
			                    postStr += '&width=' + escape($('#width' + mode).val());
			                    postStr += '&height=' + escape($('#height' + mode).val());
			                const req = $('#required' + mode + ' input[value=1]').prop('checked') ? 1 : 0;
			                    postStr += '&required=' + req;
			                    postStr += '&position=' + escape($('#position' + mode).val());
			                const form = document.getElementById('ccm-block-form');
			                    postStr += '&inputType=' + answerType;// $('input[name=answerType'+mode+']:checked').val()
			                    postStr += '&msqID=' + msqID + '&qsID=' + parseInt(this.qsID);
			                    if (answerType == 'email') {
				                    postStr += '&send_notification_from=';
  if (mode == 'Edit') {
    fieldID = '#send_notification_from_edit';
  }
  else {
    fieldID = '#send_notification_from';
  }
				                    postStr += $(fieldID).is(':checked') ? '1' : '0';
			}
			                    $.ajax({
					                    type: 'POST',
					                    data: postStr,
					                    url: this.serviceURL + 'mode=addQuestion&qsID=' + parseInt(this.qsID),
					                    success(msg) {
						                    eval('var jsonObj=' + msg);
						                    if (!jsonObj) {
						                       alert(ccm_t('ajax-error'));
						} else if (jsonObj.noRequired) {
						                       alert(ccm_t('complete-required'));
						} else {
						                       if (jsonObj.mode == 'Edit') {
							                       var questionMsg = $('#questionEditedMsg');
							                       questionMsg.fadeIn();
							                       setTimeout(() => {
								                       questionMsg.fadeOut();
							   }, 5000);
							                       if (jsonObj.hideQID) {
								                       miniSurvey.hideQuestions.push(miniSurvey.edit_qID); // jsonObj.hideQID);
								                       miniSurvey.edit_qID = 0;
							   }
						   } else {
							                       var questionMsg = $('#questionAddedMsg');
							                       questionMsg.fadeIn();
							                       setTimeout(() => {
								                       questionMsg.fadeOut();
							   }, 5000);
							   // miniSurvey.saveOrder();
						   }
						                       $('#editQuestionForm').css('display', 'none');
						                       miniSurvey.qsID = jsonObj.qsID;
						                       miniSurvey.ignoreQuestionId(jsonObj.msqID);
						                       $('#qsID').val(jsonObj.qsID);
						                       miniSurvey.resetQuestion();
						                       miniSurvey.refreshSurvey();
						   // miniSurvey.showPane('preview');
						}
					},
				});
	},
	// prevent duplication of these questions, for block question versioning
	                    ignoreQuestionId(msqID) {
		                    var msqID, ignoreEl = $('#ccm-ignoreQuestionIDs');
		                    if (ignoreEl.val()) msqIDs = ignoreEl.val().split(',');
		                    else msqIDs = [];
		                    msqIDs.push(parseInt(msqID, 10));
		                    ignoreEl.val(msqIDs.join(','));
	},
	                    reloadQuestion(qID) {
			                    $.ajax({
				                    url: this.serviceURL + 'mode=getQuestion&qsID=' + parseInt(this.qsID) + '&qID=' + parseInt(qID),
				                    success(msg) {
						                    eval('var jsonObj=' + msg);
						                    $('#editQuestionForm').css('display', 'block');
						                    $('#questionEdit').val(jsonObj.question);
						                    $('#answerOptionsEdit').val(jsonObj.optionVals.replace(/%%/g, '\r\n'));
						                    $('#widthEdit').val(jsonObj.width);
						                    $('#heightEdit').val(jsonObj.height);
						                    $('#positionEdit').val(jsonObj.position);
						                    if (parseInt(jsonObj.required, 10) == 1) {
							                    $('#requiredEdit input[value=1]').prop('checked', true);
							                    $('#requiredEdit input[value=0]').prop('checked', false);
						} else {
							                    $('#requiredEdit input[value=1]').prop('checked', false);
							                    $('#requiredEdit input[value=0]').prop('checked', true);
						}

						                    if (jsonObj.inputType == 'email') {
							                const options = jsonObj.optionVals.split(';');
							                    for (let i = 0; i < options.length; i++) {
								                    key_val = options[i].split('::');
								                    if (key_val.length == 2) {
									                    if (key_val[0] == 'send_notification_from') {
										                    if (key_val[1] == 1) {
											                    $('.send_notification_from input').prop('checked', true);
										} else {
											                    $('.send_notification_from input').prop('checked', false);
										}
									}
								}
							}
						}

						                    $('#msqID').val(jsonObj.msqID);
						                    $('#answerTypeEdit').val(jsonObj.inputType);
						                    miniSurvey.optionsCheck($('#answerTypeEdit').get(0), 'Edit');
						                    miniSurvey.settingsCheck($('#answerTypeEdit').get(0), 'Edit');

						                    if (parseInt(jsonObj.bID) > 0)
							                    miniSurvey.edit_qID = parseInt(qID);
						                    $('.miniSurveyOptions').first().closest('.ui-dialog-content').get(0).scrollTop = 0;
					},
			});
	},
	// prevent duplication of these questions, for block question versioning
	                    pendingDeleteQuestionId(msqID) {
		                    var msqID, el = $('#ccm-pendingDeleteIDs');
		                    if (el.val()) msqIDs = el.val().split(',');
		                    else msqIDs = [];
		                    msqIDs.push(parseInt(msqID, 10));
		                    el.val(msqIDs.join(','));
	},
	                    hideQuestions: [],
	                    deleteQuestion(el, msqID, qID) {
			                    if (confirm(ccm_t('delete-question'))) {
				                    $.ajax({
					                    url: this.serviceURL + 'mode=delQuestion&qsID=' + parseInt(this.qsID) + '&msqID=' + parseInt(msqID),
					                    success(msg) {	miniSurvey.resetQuestion(); miniSurvey.refreshSurvey(); },
				});

				                    miniSurvey.ignoreQuestionId(msqID);
				                    miniSurvey.hideQuestions.push(qID);
				                    miniSurvey.pendingDeleteQuestionId(msqID);
			}
	},
	                    resetQuestion() {
			                    $('#question').val('');
			                    $('#answerOptions').val('');
			                    $('#width').val('50');
			                    $('#height').val('3');
			                    $('#msqID').val('');
			                    $('#answerType').val('field').change();
			                    $('#answerOptionsArea').hide();
			                    $('#answerSettings').hide();
			                    $('#required input').prop('checked', false);
	},

	                    validate() {
			                  let failed = 0;

			                const n = $('#surveyName');
			                    if (!n || parseInt(n.val().length, 10) == 0) {
				                    alert(ccm_t('form-name'));
				                    this.showPane('options');
				                    n.focus();
				                    failed = 1;
			}

			                const Qs = $('.miniSurveyQuestionRow');
			                    if (!Qs || parseInt(Qs.length, 10) < 1) {
				                    alert(ccm_t('form-min-1'));
				                    failed = 1;
			}

			                    if (failed) {
				                    ccm_isBlockError = 1;
				                    return false;
			}
			                    return true;
	},

	                    moveUp(el, thisQID) {
		                const qIDs = this.serialize();
		                  let previousQID = 0;
		                    for (let i = 0; i < qIDs.length; i++) {
			                    if (qIDs[i] == thisQID) {
				                    if (previousQID == 0) break;
				                    $('#miniSurveyQuestionRow' + thisQID).after($('#miniSurveyQuestionRow' + previousQID));
				                    break;
			}
			                    previousQID = qIDs[i];
		}
		                    this.saveOrder();
	},
	                    moveDown(el, thisQID) {
		                const qIDs = this.serialize();
		                  let thisQIDfound = 0;
		                    for (let i = 0; i < qIDs.length; i++) {
			                    if (qIDs[i] == thisQID) {
				                    thisQIDfound = 1;
				                    continue;
			}
			                    if (thisQIDfound) {
				                    $('#miniSurveyQuestionRow' + qIDs[i]).after($('#miniSurveyQuestionRow' + thisQID));
				                    break;
			}
		}
		                    this.saveOrder();
	},
	                    serialize() {
		                const t = document.getElementById('miniSurveyPreviewTable');
		                const qIDs = [];
		                    for (let i = 0; i < t.childNodes.length; i++) {
			                    if (t.childNodes[i].className && t.childNodes[i].className.indexOf('miniSurveyQuestionRow') >= 0) {
				                const qID = t.childNodes[i].id.substr('miniSurveyQuestionRow'.length);
				                    qIDs.push(qID);
			}
		}
		                    return qIDs;
	},
	                    saveOrder() {
		                const postStr = 'qIDs=' + this.serialize().join(',') + '&qsID=' + parseInt(this.qsID);
		                    $.ajax({
			                    type: 'POST',
			                    data: postStr,
			                    url: this.serviceURL + 'mode=reorderQuestions',
			                    success(msg) {
				                    miniSurvey.refreshSurvey();
			},
		});
	},
};
ccmValidateBlockForm = function () { return miniSurvey.validate(); };
$(document).ready(() => {
	// miniSurvey.init();
	/* TODO hackzors, this shouldnt be necessary */
	                    $('#ccm-block-form').closest('div').addClass('ccm-ui');
});
