AUI().use('transition').ready(

	/*
	This function gets loaded when all the HTML, not including the portlets, is
	loaded.
	*/

	function(A) {
		var content = A.one('#content');
		var navContent = A.one('#nav-container');
		var selected = A.one('.selected ul');
		var toggle = A.one('#toggle');

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
										f.ancestor('.selected').one('.triangle').set('text', '\u25BC');
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