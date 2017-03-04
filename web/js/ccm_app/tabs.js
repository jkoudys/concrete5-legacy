/**
 * Tab Bar
 */
import $ from 'jquery';

const Tabs = {
  ccm_activateTabBar(selector) {
    $(`#ccm-tab-content-${selector.find('li[class=active] a').attr('data-tab')}`).show();
    selector.find('a').unbind().click(function () {
      selector.find('li').removeClass('active');
      $(this).parent().addClass('active');
      selector.find('a').each(function () {
        $('#ccm-tab-content-' + $(this).attr('data-tab')).hide();
      });
      const tab = $(this).attr('data-tab');
      $(`#ccm-tab-content-${tab}`).show();

      return false;
    });
  },
};

export default Tabs;
