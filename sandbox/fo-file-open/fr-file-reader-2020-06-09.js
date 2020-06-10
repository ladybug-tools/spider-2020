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

	FOO.timeStart = performance.now();

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
	type: ${ FOO.responseType }<br>
	modified: ${file.lastModifiedDate.toLocaleDateString() }<br>
	time to load: ${ ( performance.now() - FOO.timeStart ).toLocaleString() } ms
</p>
`;


	console.log( '', FR.files.files );
	console.log( '', event );

	FOO.url = FR.files.files[ 0 ].name;
	FOO.data = FR.files.files[ 0 ];

	if ( file.name.toLowerCase().endsWith( ".zip") ) {

		//FOZ.onLoadFile();

	} else {

		divContent.innerText = FR.reader.result.slice( 0, 2000 );

	}


	event = new Event( "onloadFile", {"bubbles": true, "cancelable": false, detail: true } );

	window.dispatchEvent( event );
	
	//Raw data
	//<textarea id=FRTtxtArea style=height:100px;overflow:auto;width:100%; ></textarea>
	//FRTtxtArea.innerHTML = FOO.string;

};
