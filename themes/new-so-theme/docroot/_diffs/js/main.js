AUI().ready(

	/*
	This function gets loaded when all the HTML, not including the portlets, is
	loaded.
	*/

	function(A) {
		var body = A.one('body');
		var mobNav = A.one('.mobile #navigation');
		var navigation = A.one('#navigation');
		var toggle = A.one('#toggle');

		var menuTrigger = function (event) {
			event.target.preventDefault();
			event.currentTarget.preventDefault();
			console.log(event.currentTarget);
		};

		navigation.all('li.has-children').each(
			function (x){
				console.log(x.one('a'));
				var childMenu = x.one('.parent-menu');
				var middle = Math.floor((x.get('clientWidth') / 2));
				var negMargin = (middle - 100) + "px";
				var anchor = x.one('a');

				anchor.delegate(
					'click',
					function (e) {
						menuTrigger(e);
					}
				);

				// childMenu.setStyle('left', negMargin);
			}
		);

		toggle.on(
			'click',
			function (e) {
				body.toggleClass('sidebar-collapsed');
			}
		);

		mobNav.all('li.has-children').each(
			function (node) {
			}
			// triangle.on(
			// 	'click',
			// 	function (f) {
			// 		f.preventDefault();
			// 		ul.toggleClass('nav-expand');
					
			// 		if (triangle.hasClass('nav-expand')) {
			// 			triangle.replace('&#9656;' ,'&#9662;');
			// 		} else {
			// 			triangle.replace('&#9662;', '&#9656;');
			// 		}
			// 	}
			// )
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