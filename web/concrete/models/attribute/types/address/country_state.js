let ccm_attributeTypeAddressStates;

$(() => {
	                    ccm_attributeTypeAddressStates = ccm_attributeTypeAddressStatesTextList.split('|');
});

ccm_attributeTypeAddressSelectCountry = function (cls, country) {
	                const ss = $('.' + cls + ' .ccm-attribute-address-state-province select');
	                const si = $('.' + cls + ' .ccm-attribute-address-state-province input[type=text]');

	                  let foundStateList = false;
	                    ss.html('');
	                    for (j = 0; j < ccm_attributeTypeAddressStates.length; j++) {
		                const sa = ccm_attributeTypeAddressStates[j].split(':');
		                    if (jQuery.trim(sa[0]) == country) {
			                    if (!foundStateList) {
				                    foundStateList = true;
				                    si.attr('name', 'inactive_' + si.attr('ccm-attribute-address-field-name'));
				                    si.hide();
				                    ss.append('<option value="">Choose State/Province</option>');
			}
			                    ss.show();
			                    ss.attr('name', si.attr('ccm-attribute-address-field-name'));
			                    ss.append('<option value="' + jQuery.trim(sa[1]) + '">' + jQuery.trim(sa[2]) + '</option>');
		}
	}

	                    if (!foundStateList) {
		                    ss.attr('name', 'inactive_' + si.attr('ccm-attribute-address-field-name'));
		                    ss.hide();
		                    si.show();
		                    si.attr('name', si.attr('ccm-attribute-address-field-name'));
	}
};

ccm_setupAttributeTypeAddressSetupStateProvinceSelector = function (cls) {
	                const cs = $('.' + cls + ' .ccm-attribute-address-country select');
	                    cs.change(function () {
		                const v = $(this).val();
		                    ccm_attributeTypeAddressSelectCountry(cls, v);
	});

	                    if (cs.attr('ccm-passed-value') != '') {
		                    $(() => {
			                    cs.find('option[value="' + cs.attr('ccm-passed-value') + '"]').attr('selected', true);
			                    ccm_attributeTypeAddressSelectCountry(cls, cs.attr('ccm-passed-value'));
			                const ss = $('.' + cls + ' .ccm-attribute-address-state-province select');
			                    if (ss.attr('ccm-passed-value') != '') {
				                    ss.find('option[value="' + ss.attr('ccm-passed-value') + '"]').attr('selected', true);
			}
		});
	}
};
