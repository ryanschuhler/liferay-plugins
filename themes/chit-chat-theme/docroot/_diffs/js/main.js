AUI().ready(
	'aui-base',
	function(A) {
		var toggleTask = A.debounce(
			function(event) {
				var currentTarget = event.currentTarget;
				
				var childMenu = this.one('.child-menu');

				if (childMenu) {
					childMenu.toggle(event.type == 'mouseenter');
				}
			},
			25
		);

		A.all('#navigation li').on(
			{
				mouseenter: function(event) {
					toggleTask.delay(0, event);
				},

				mouseleave: toggleTask
			}
		);
	}
);