// copyright 2020 Theo Armour. MIT license.
/* global */
// jshint esversion: 6
// jshint loopfunc: true


const FRX = {};

FRX.openFile = function ( files ) {

	FRX.timeStart = performance.now();

	const reader = new FileReader();
	reader.onload = ( event ) => {

		FRX.files = files;

		FO.data = reader.result;

		FRX.event = new Event( "onloadFRX", {"bubbles": true, "cancelable": false, detail: true } );

		window.addEventListener( "onloadFRX", FRX.onLoad, false )

		window.dispatchEvent( FRX.event );

	};

	reader.readAsText( files.files[ 0 ] );

};


FRX.onLoad = function () {

	const files = FRX.files;

	divLog.innerHTML = `
	<p>
		name: ${ files.files[ 0 ].name }<br>
		size: ${ files.files[ 0 ].size.toLocaleString() } bytes<br>
		type: ${ files.files[ 0 ].type }<br>
		modified: ${files.files[ 0 ].lastModifiedDate.toLocaleDateString() }<br>
		time to load: ${ ( performance.now() - FRX.timeStart ).toLocaleString() } ms
	</p>
	`;
	
	//Raw XML data
	//<textarea id=FRXtxtArea style=height:100px;overflow:auto;width:100%; ></textarea>
	//FRXtxtArea.innerHTML = FRX.result;

	console.log( '', files.files );
	console.log( '', event );
	
};
