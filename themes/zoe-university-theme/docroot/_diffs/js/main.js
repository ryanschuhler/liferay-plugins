AUI().ready(
	'aui-base',
	'aui-io',
	'event-move',
	'node-base',
	'node-event-delegate',

	/*
	This function gets loaded when all the HTML, not including the portlets, is
	loaded.
	*/

	function(A) {
		var html = A.one('html');
		var body = A.one('body');
		var content = A.one('#content');
		var navContent = A.one('#nav-container');
		var selected = A.one('.selected ul');
		var toggle = A.one('#toggle');

		var menuTrigger = function (event) {
			event.preventDefault();
			var ul = event.target.ancestor('li').one('ul');
			var marker = event.target;

			ul.toggleClass('aui-helper-hidden');

			if (ul.hasClass('aui-helper-hidden') && marker.hasClass('child-show')) {
				marker.removeClass('child-show');
			} else {
				marker.addClass('child-show');
			}
		};

		var toggleAction = function (event) {
			body.toggleClass('nav-show');

			html.toggleClass('no-scroll');

			navContent.all('ul ul .selected').each(
				function (e) {
					e.ancestor('ul').removeClass('aui-helper-hidden');
					e.ancestor('.selected').one('.has-child-marker').addClass('child-show');
				}
			);
		};

		if (body.hasClass('mobile')) {
			if (body.hasClass('mobile-enabled')) {
				A.all('ul').each(
					function (f) {
						if (f.hasClass('child-menu') || f.hasClass('grandchild-menu') && !f.hasClass('aui-helper-hidden')) {
							f.addClass('aui-helper-hidden');
						}
					}
				);

				if(toggle) {
					toggle.on(
						'click',
						function (e) {
							toggleAction();
						}
					);
				}

				navContent.all('.has-child-marker').each(
					function (e) {
						e.on(
							'click',
							function (event) {
								menuTrigger(event);
							}
						);
					}
				);


				body.on(
					"gesturemovestart", 
					function (e) {
						var item = e.currentTarget;
						var MIN_SWIPE = 20;
						var target = e.target;

						item.setData("swipeStart", e.pageX);

						item.once(
							"gesturemoveend",
							function (e) {
								var swipeStart = item.getData("swipeStart");
								var swipeEnd = e.pageX;
								var isSwipeLeft = (swipeStart-swipeEnd) > MIN_SWIPE;
								var isSwipeRight = (swipeEnd-swipeStart) > MIN_SWIPE;
								var navOut = body.hasClass('nav-show');
								var swipeLeft = isSwipeLeft && navOut;
								var swipeRight = isSwipeRight && !navOut;

								if (swipeLeft || swipeRight) {
									toggleAction();
								}
							}
						)					
					}
				);
			}

			body.all('.desktop-link').on(
				'click',
				function (e) {
					body.toggleClass('mobile-enabled')
					
					A.io.request(
						themeDisplay.getPathMain() + '/portal/session_click',
						{
							data: {
								'mobile-enabled': body.hasClass('mobile-enabled')
							}
						}
					);
					window.location.reload(true);		
				}
			);
		}
		
		//two possibilities for the story highlight, first is make a special class called .story highlight and figure out how to get desired text in that class, second is let it grab a certain background color span and add it it (results in flicker)

		// content.all('.story-highlight').each(
		// 	function (f) {
		// 		var highlight = f.get('textContent')

		// 		f.ancestors('div', 'journal-content-article').all('ul').each(
		// 			function (g) {
		// 				if (g.hasClass('article-highlights')) {
		// 					g.append('<li>'+highlight+'</li>');
		// 				}
		// 			}
		// 		);
		// 	}
		// );

		content.all('span').each(
			function (f) {
				var style = f.getAttribute('style');
				if (style == "background-color:#ffff00;") {
					var highlight = f.get('textContent');

					f.setAttribute('style', 'background-color:transparent;');

					f.ancestors('div', 'journal-content-article').all('ul').each(
						function (g) {
							if (g.hasClass('article-highlights')) {
								g.append('<li>'+highlight+'</li>');
							}
						}
					);
				}
			}
		);
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