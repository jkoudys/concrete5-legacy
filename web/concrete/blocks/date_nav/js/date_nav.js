const ccmDateNav = {
	                    navs: [],
	                    currentPg: 0,
	                    currentPgNum: 0,
	                    loadCurrentPage: 1,
	                    init() {
		                    this.navs = $('.ccmDateNav');
		                    this.navs.each((i, nav) => {
			                    nav = $(nav);
			                    if (nav.prepared) return;
			                    nav.find('.trigger').each((i, trig) => {
				                    trig.onclick = function () {
					                    ccmDateNav.triggered(this);
				};
			});
			                    nav.prepared = 1;
		});

		                    this.setPg(this.loadPg, this.dateKey);
	},
	                    triggered(trig, mode) {
		                  let c = 'closed', ul = $(trig.parentNode).find('ul');
		                const trigEl = $(trig);
		                    ul = $(ul.get(0));
		                    if (mode != 'close' && (trigEl.hasClass(c) || mode == 'open')) {
			// $(trig.parentNode.parentNode).find('ul .trigger').addClass(c);
			                    $(trig.parentNode.parentNode).find('ul').each((i, sibling) => {
				                    if (sibling != ul.get(0)) {
					                    $(sibling).hide(500);
					                    $(sibling.parentNode).find('.trigger').addClass(c);
				}
			});
			                    trigEl.removeClass(c);
			// animateHelper.scrollOpen(ul);
			                    ul.show(500);// css('display','block');
		} else {
			                    trigEl.addClass(c);
			// animateHelper.scrollClosed(ul);
			                    ul.hide(500);// .css('display','none');
		}
	},
	                    setPg(id, dateKey) {
		                const y = dateKey.substr(dateKey.indexOf('_') + 1, dateKey.length);
		                    this.navs.each((i, nav) => {
			                    nav = $(nav);
			                    nav.find('.pageNode').removeClass('selected');
			                const p = nav.find('.pageId' + id);
			                    if (p) p.addClass('selected');
			                const trigs = nav.find('.trigger');
			                    trigs.each((i, t) => {
				                    trigEl = $(t);
				                    if (ccmDateNav.loadCurrentPage && trigEl.hasClass('closed') && (trigEl.hasClass('month' + dateKey) || trigEl.hasClass('year' + y))) {
					// alert(trigEl.html() + 'open')
					                    ccmDateNav.triggered(t, 'open');
				} else if (!ccmDateNav.loadCurrentPage || !trigEl.hasClass('closed') && (!trigEl.hasClass('month' + dateKey) && !trigEl.hasClass('year' + y))) {
					// alert(trigEl.html() + 'close')
					                    ccmDateNav.triggered(t, 'close');
				}
			});
		});
		                    this.loadPg = 0;
	},
	                    deselectAll() {
		                    this.navs.each((i, nav) => { nav.find('.pageNode').removeClass('thisPg'); });
	},
	                    closeAll() {
		                    this.navs.each((i, nav) => {
			                    nav.find('.trigger').each((i, trig) => { ccmDateNav.triggered(trig, 'close'); });
		});
	},
};
