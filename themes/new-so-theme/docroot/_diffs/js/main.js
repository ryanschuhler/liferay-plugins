AUI().ready(

	/*
	This function gets loaded when all the HTML, not including the portlets, is
	loaded.
	*/

	function(A) {
		var navigation = A.one('#navigation');

		navigation.all('li.has-children').each(
			function (x){
				var middle = Math.floor((this.get('clientWidth') / 2));
				
				var negMargin = (middle - 100) + "px";

				this.one('.child-menu').setStyle('left', negMargin);
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