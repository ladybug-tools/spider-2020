// copyright 2020 Theo Armour. MIT license.
/* global */
// jshint esversion: 6
// jshint loopfunc: true


const FR = {};



FR.getMenuFileReader = function() {

	window.addEventListener( "onloadFR", FR.onLoad, false );

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

	const reader = new FileReader();
	reader.onload = ( event ) => {

		FO.string = FO.responseType === "text" ? reader.result : JSON.parse( reader.result );
		
		FR.files = files;

		FR.event = new Event( "onloadFR", {"bubbles": true, "cancelable": false, detail: true } );

		window.addEventListener( "onloadFR", FR.onLoad, false )

		window.dispatchEvent( FR.event );

	};

	reader.readAsText( files.files[ 0 ] );

};


FR.onLoad = function () {

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
