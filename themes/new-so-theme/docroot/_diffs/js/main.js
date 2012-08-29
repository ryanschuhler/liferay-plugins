AUI().use('transition').ready(

	/*
	This function gets loaded when all the HTML, not including the portlets, is
	loaded.
	*/

	function (A) {
		var html = A.one('html');
		var head = html.one('head');
		var body = html.one('body');
		var mobNav = A.one('.mobile #navigation');
		var navigation = A.one('#navigation');
		var rmMobile = html.one('#remove-mobile');
		var toggle = A.one('#toggle');

		var menuTrigger = function (event) {
			event.preventDefault();
			var ul = event.target.ancestor('li').one('ul');
			var triangle = event.target;

			ul.toggleClass('aui-helper-hidden');

			if (ul.hasClass('aui-helper-hidden')) {
				triangle.set('text', '\u25B8');
			} else {
				triangle.set('text', '\u25BE');
			}
		};

		navigation.all('li.parent-menu').each(
			function (item, index, collection) {
				var childMenu = item.one('.child-menu');
				var middle = Math.floor((item.get('clientWidth') / 2));
				var negMargin = (middle - 100) + "px";

				childMenu.setStyle('left', negMargin);
			}
		);

		if (html.hasClass('mobile') && body.hasClass('mobile-enabled')) {
			mobNav.all('ul ul').each(
				function (e) {
					e.addClass('aui-helper-hidden');
					e.ancestor('li').all('.triangle').set('text', '\u25B8');
				
					e.all('li').each (
						function (f) {
								if (f.hasClass('selected')) {
								e.removeClass('aui-helper-hidden');
								e.ancestor('li').one('.triangle').set('text', '\u25BE');
							}
						}
					);

					e.all('.grandchild-menu li').each (
						function (f) {
							if (f.hasClass('selected')) {
								f.ancestor('.selected').removeClass('selected');
							}
						}
					);
				}
			);
		
			mobNav.all('.triangle').each(
				function (e) {
					e.on(
						'click',
						function (event) {
							menuTrigger(event);
						}
					);
				}
			);
		}

		if (toggle) {
			toggle.on(
				'click',
				function (e) {
					if (body.hasClass('navigation-collapsed')) {
						var leftVal = "0px";
						var wrapL = "225px";
						var wrapR = "-225px";
					} else {
						var leftVal = "-225px";
						var wrapL = "0px";
						var wrapR = "0px";
					}

					mobNav.transition({
						easing: 'ease-out',
						duration: 0.75, // seconds
						left: leftVal
					}, function () {
						body.toggleClass('navigation-collapsed');

						A.io.request(
							themeDisplay.getPathMain() + '/portal/session_click',
							{
								data: {
									'navigation-collapsed': body.hasClass('navigation-collapsed')
								}
							}
						);
					});

					body.all('#wrapper, #toggle, #heading').transition({
						easing: 'ease-out',
						duration: 0.75, // seconds
						left: wrapL,
						right: wrapR
					});

					if (body.hasClass('signed-out')) {
							body.one('#sign-in').transition({
							easing: 'ease-out',
							duration: 0.75, // seconds
							right: wrapL
						});
					}
				}
			);
		}

		var meta_viewport = html.one('head').one('meta\[name=\"viewport\"\]');
		var meta_viewport_node = A.Node.create('<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, width=device-width">');

		rmMobile.on(
			'click',
			function (e) {

				if (meta_viewport) {
					meta_viewport.remove();
				} else {
					head.insert(meta_viewport_node);
				}

				body.toggleClass('mobile-enabled');

				A.io.request(
					themeDisplay.getPathMain() + '/portal/session_click',
					{
						data: {
							'mobile-enabled': body.hasClass('mobile-enabled')
						}
					}
				);


				if (html.hasClass('mobile')) {
					window.location.reload(true);		
				} else if (!body.hasClass('mobile-enabled') && !html.hasClass('mobile')) {
					body.toggleClass('mobile-enabled');
					html.addClass('mobile');
				} else {
					html.addClass('mobile');
				}
			}
		);
		
		if (html.hasClass('mobile') && body.hasClass('mobile-enabled')) {
			body.one('#word').insert('desktop', 'replace');
		} else {
			body.one('#word').insert('mobile', 'replace');
		}
	}
);

Liferay.Portlet.ready(

	/*
	This function gets loaded after each and every portlet on the page.

	portletId: the current portlet's id
	node: the Alloy Node object of the current portlet
	*/

	function (portletId, node) {
	}
);

Liferay.on(
	'allPortletsReady',

	/*
	This function gets loaded when everything, including the portlets, is on
	the page.
	*/

	function () {
	}
);