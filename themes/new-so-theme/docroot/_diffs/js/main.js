AUI().use('transition').ready(

	/*
	This function gets loaded when all the HTML, not including the portlets, is
	loaded.
	*/

	function(A) {
		var body = A.one('body');
		var mobNav = A.one('.mobile #navigation');
		var wrapper = body.one('#wrapper');
		var navigation = A.one('#navigation');
		var toggle = A.one('#toggle');

		var menuTrigger = function (event) {
			event.target.preventDefault();
			event.currentTarget.preventDefault();
			console.log(event.currentTarget);
		};

		navigation.all('li.parent-menu').each(
			function (item, index, collection) {
				var childMenu = item.one('.child-menu');
				var middle = Math.floor((item.get('clientWidth') / 2));
				var negMargin = (middle - 100) + "px";

				childMenu.setStyle('left', negMargin);
			}
		);

		if (toggle) {
			toggle.on(
				'click',
				function (e) {
					if (body.hasClass('navigation-collapsed')) {
						var leftVal = "0px";
					} else {
						var leftVal = "-225px";
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

					wrapper.transition({
						easing: 'ease-out',
						duration: 0.75, // seconds
						marginLeft: leftVal
					});
				}
			);
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