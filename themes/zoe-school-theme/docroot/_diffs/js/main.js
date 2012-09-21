AUI().use('transition').ready(

	/*
	This function gets loaded when all the HTML, not including the portlets, is
	loaded.
	*/

	function(A) {
		var columnTwo = A.one('#column-2');
		var navContent = A.one('#nav-container');
		var selected = A.one('.selected ul');
		var toggle = A.one('#toggle');

		var childMenuHeight = selected.get('clientHeight');
		var childMenu = function (e) {
			A.all('ul').each(
				function (f) {
					if (f.hasClass('child-menu') || f.hasClass('grandchild-menu')) {
						f.toggleClass('aui-helper-hidden');
					}
				}
			);
		};

		var menuTrigger = function (event) {
			event.preventDefault();
			var ul = event.target.ancestor('li').one('ul');
			var triangle = event.target;

			ul.toggleClass('aui-helper-hidden');

			if (ul.hasClass('aui-helper-hidden')) {
				triangle.set('text', '\u25B6');
			} else {
				triangle.set('text', '\u25BC');
			}
		};

		if(toggle) {
			toggle.on(
				'click',
				function (e) {
					navContent.toggleClass('nav-show');
					if(navContent.hasClass('nav-show')) {
						childMenu()
						toggle.transition({
							easing: 'ease',
							duration: 0.75, // seconds
							left: '252px'
						});

						navContent.transition({
							easing: 'ease',
							duration: 0.75, // seconds
							left: '0px'
						});
					} else {
						toggle.transition({
							easing: 'ease',
							duration: 0.75, // seconds
							left: '0px'
						});

						navContent.transition({
							easing: 'ease',
							duration: 0.75, // seconds
							left: '-260px'
						}); 

						childMenu();
					}					

					navContent.all('ul ul').each(
						function (e) {
							e.all('li').each (
								function (f) {
									if (f.hasClass('selected')) {
										e.removeClass('aui-helper-hidden');
									}
								}
							);
						}
					);
				}
			);
		}

		navContent.all('.triangle').each(
			function (e) {
				e.on(
					'click',
					function (event) {
						menuTrigger(event);
					}
				);
			}
		);

		columnTwo.setStyle('padding-top', childMenuHeight + 20 + 'px')
	}
);

Liferay.Portlet.ready(

	/*
	This function gets loaded after each and every portlet on the page.

	portletId: the current portlet's id
	node: the Alloy Node object of the current portlet
	*/

	function(portletId, node) {
	}
);

Liferay.on(
	'allPortletsReady',

	/*
	This function gets loaded when everything, including the portlets, is on
	the page.
	*/

	function() {
	}
);