// copyright 2020 Theo Armour. MIT license.
/* global */
// jshint esversion: 6
// jshint loopfunc: true


const FRT = {};

FRT.readFile = function ( files ) {

	FO.timeStart = performance.now();

	const reader = new FileReader();
	reader.onload = ( event ) => {


		FO.string = FO.responseType === "text" ? reader.result : JSON.parse( reader.result );
		
		FRT.files = files;

		FRT.event = new Event( "onloadFRT", {"bubbles": true, "cancelable": false, detail: true } );

		window.addEventListener( "onloadFRT", FRT.onLoad, false )

		window.dispatchEvent( FRT.event );

	};

	reader.readAsText( files.files[ 0 ] );

};


FRT.onLoad = function () {

	const file = FRT.files.files[ 0 ]

	divLog.innerHTML = `
	<p>
		name: ${ file.name }<br>
		size: ${ file.size.toLocaleString() } bytes<br>
		type: ${ file.type }<br>
		modified: ${file.lastModifiedDate.toLocaleDateString() }<br>
		time to load: ${ ( performance.now() - FO.timeStart ).toLocaleString() } ms
	</p>
	`;
	
	//Raw data
	//<textarea id=FRTtxtArea style=height:100px;overflow:auto;width:100%; ></textarea>
	//FRTtxtArea.innerHTML = FO.string;

};
