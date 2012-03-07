var ie = AUI().UA.ie;

if (!ie || ie >= 8) {
	AUI().use('aui-viewport');
}