// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-02-13
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const FOJ = {};



FOJ.init = function () {

	FOJdivFileOpenJson.innerHTML = FOJ.getMenu();

	window.addEventListener( 'hashchange', FOJ.checkForJson, false );

};



FOJ.getMenu = function () {

	const htm = `
<details id=FOJdet >

	<summary>
		File open JSON

		<span class="couponcode">??<span class="coupontooltip">aaa bbb ccc 123 456</span></span>

	</summary>

	<p>ccc</p>

	<p>vvvvv</p>

	<div id=FOJdivMessage ></div>

</details>`;

	return htm;

};





FOJ.checkForJson = function () {

	if ( location.hash.toLowerCase().endsWith( ".json" ) === false ) { return; }
	//console.log( 'hash', location.hash );

	const url = location.hash.slice( 1 );

	FO.requestFile( url, FOJ.onLoadJson );

};



FOJ.onLoadJson = function ( xhr ) {

	console.log( "xhr", xhr );

	FO.onProgress( xhr.loaded, "Load complete" );

	FO.data = xhr.target.response;

	FOJ.event = new Event( "onloadFileJson", {"bubbles": true, "cancelable": false, detail: true } );

	//window.addEventListener( 'onloadFileJson', () => { console.log( "FO.data", FO.data.slice( 0, 1000 ) ) }, false );

	window.dispatchEvent( FOJ.event );

};



FOJ.init();