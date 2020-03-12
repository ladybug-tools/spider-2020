// copyright 2020 Theo Armour. MIT license.
// 2020-03-11
/* globals FO, FOXdivFileOpenXml */
// jshint esversion: 6
// jshint loopfunc: true


const FOX = {};

FOX.urlDefaultFileXml = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/bristol-clifton-downs-broken.xml";
FOX.elevationDelta = -19.25;


FOX.init = function () {

	//FOXdivFileOpenXml.innerHTML = FOX.getMenu();

	window.addEventListener( 'hashchange', FOX.checkForXml, false );

};



FOX.getMenu = function () {

	const htm = `
<details id=FOXdet >

	<summary class="sumMenuTertiary" >
		File open XML

		<span class="couponcode">??<span class="coupontooltip">aaa bbb ccc 123 456</span></span>

	</summary>

	<div id=FOXdivMessage ></div>

</details>`;

	return htm;

};


FOX.checkForXml = function () {

	if ( location.hash.toLowerCase().endsWith( ".xml" ) === false ) { return; }
	//console.log( 'hash', location.hash );

	const url = location.hash.slice( 1 );

	FO.requestFile( url, FOX.onLoadXml );

};



FOX.onLoadXml = function ( xhr ) {

	//console.log( "xhr", xhr );

	FO.onProgress( xhr.loaded, "Load complete" );

	FO.data = xhr.target.response;

	FOX.event = new Event( "onloadFileXml", { "bubbles": true, "cancelable": false, detail: true } );

	//window.addEventListener( 'onloadFileXml', () => { console.log( "FO.data", FO.data.slice( 0, 1000 ) ) }, false );

	window.dispatchEvent( FOX.event );

};



FOX.init();