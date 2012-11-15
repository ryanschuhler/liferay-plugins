AUI().ready(
	'aui-io',

	/*
	This function gets loaded when all the HTML, not including the portlets, is
	loaded.
	*/

	function(A) {
		var body = A.one('body')
		var navigation = A.one('#navigation');
		var li = navigation.all('li').get('clientWidth');
		var ul = navigation.one('ul');
		var width  = 0;

		for (x in li) {
			width = width + li[x];
		}

		ul.setStyle('width', width);

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