// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-02-13
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const FO = {};



FO.init = function () {

	FOdivFileOpen.innerHTML = FO.getMenu();

	FO.reset();

};

FO.reset = function () {


	FO.fileName = undefined;
	FO.url = undefined;
	FO.text = undefined;
	FO.data = undefined;
	FO.string = undefined;
	FO.timeStart = undefined;
	FO.objects = undefined;
	FO.xhr = new XMLHttpRequest();
	FO.responseType = 'text';

};




FO.getMenu = function () {

	const htm = `
<details id=FOdet open >

	<summary class=sumMenuTertiary >
		File open details

		<span class="couponcode">??<span class="coupontooltip">file opened details</span></span>

	</summary>

	<div id=FOdivInfo ></div>

	<div id=FOdivXhr ></div>

</details>`;

	return htm;

};




FO.requestFile = function ( url, callback = FO.callback ) {

	console.log( 'url', url );
	if ( !url ) { return; }

	FO.timeStart = performance.now();

	FO.xhr.open( 'GET', url, true );
	FO.xhr.responseType = FO.responseType;
	FO.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	FO.xhr.onprogress = function( xhr ) { FO.onProgress( xhr.loaded, FO.note ); };
	FO.xhr.onload = callback; //function( xhr ) { callback( xhr ); };
	FO.xhr.send( null );

	FO.url = url;

	FO.fileName = FO.url.split( "/" ).pop();
	//console.log( 'FOO.fileName', FOO.fileName  );

	//const path = location.hash.slice( 1 ).split( "/" )

	const a = document.createElement( 'a' );
	a.href = url;
	FO.hostName = a.hostname;

	FO.fileInfo =`
<p>
	<span class=attributeTitle >Name: <span class=attributeValue >${ FO.fileName }</span></br>
	<span class=attributeTitle >Host: <span class=attributeValue >${ FO.hostName }</span></br>
</p>
`;

	FOdivInfo.innerHTML = FO.fileInfo;

};


FO.callback = function ( xhr ) {

	console.log( 'xhr', xhr );

	FO.onProgress( xhr.loaded, "Load complete" );

};



FO.onProgress = function( size = 0, note = '' ) {

	const timeToLoad = ( performance.now() - FO.timeStart ).toLocaleString();

	FO.size = size;

	FO.fileInfo =
	`
		<p>
 			<span class=attributeTitle >Bytes loaded: </span>: <span class=attributeValue >${ size.toLocaleString() }</span></br>
			<span class=attributeTitle >Time to load: </span>: <span class=attributeValue>${ timeToLoad } ms</span></br>
			${ note }
		</p>
	`;

	FOdivXhr.innerHTML = FO.fileInfo;

};



FO.getOpenNew = function () {

	if ( FOradOpenNew.checked === true ) {

		THR.scene.remove( THR.group, THR.lines );

		THR.group = new THREE.Group();

		THR.lines = new THREE.Group();

		THR.scene.add( THR.group, THR.lines );

		OM.reset();

	}

};



