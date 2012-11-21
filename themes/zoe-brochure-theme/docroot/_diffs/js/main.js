AUI().ready(
	'aui-io',
	function(A) {
		var body = A.one('body'),
			navContent = A.one('.nav-content'),
			navMenuButton = A.one('#nav-menu-button');

		if (body.hasClass('mobile')) {
			body.one('#desktop-link').on(
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

			if (body.hasClass('mobile-enabled')) {
				navMenuButton.on(
					'click',
					function () {
						navContent.toggleClass('show-nav');
					}
				);
			}
		}
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