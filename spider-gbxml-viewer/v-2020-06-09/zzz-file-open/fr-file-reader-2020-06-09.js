// copyright 2020 Theo Armour. MIT license.
/* global */
// jshint esversion: 6
// jshint loopfunc: true


const FR = {};



FR.getMenuFileReader = function() {

	window.addEventListener( "onloadFileReader", FR.onLoad, false );

	const htm = `
<p>
	<input type=file id=FRinpFile onchange=FR.readFile(this); accept = "*" >
</p>

<div id=divLog ></div>	
`;

	return htm;

};

FR.readFile = function ( files ) {

	FO.timeStart = performance.now();

	FR.reader = new FileReader();
	FR.reader.onload = ( event ) => {

		FR.files = files;

		FR.event = new Event( "onloadFileReader", {"bubbles": true, "cancelable": false, detail: true } );

		window.addEventListener( "onloadFileReader", FR.onLoad, false );

		window.dispatchEvent( FR.event );

	};

	FR.reader.readAsText( files.files[ 0 ] );

};


FR.onLoad = function () { // replace as needed

	const file = FR.files.files[ 0 ];

	divLog.innerHTML = `
<p>
	name: ${ file.name }<br>
	size: ${ file.size.toLocaleString() } bytes<br>
	type: ${ FO.responseType }<br>
	modified: ${file.lastModifiedDate.toLocaleDateString() }<br>
	time to load: ${ ( performance.now() - FO.timeStart ).toLocaleString() } ms
</p>
`;
	
	//Raw data
	//<textarea id=FRTtxtArea style=height:100px;overflow:auto;width:100%; ></textarea>
	//FRTtxtArea.innerHTML = FO.string;

};
