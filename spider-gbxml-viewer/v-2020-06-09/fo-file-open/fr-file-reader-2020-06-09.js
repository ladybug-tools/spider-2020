// copyright 2020 Theo Armour. MIT license.
/* global */
// jshint esversion: 6
// jshint loopfunc: true


const FR = {};



FR.cccgetMenuFileReader = function() {

	window.addEventListener( "onloadFileReader", FR.onLoad, false );

	const htm = `


<div id=divLogcc ></div>	
`;

	return htm;

};

FR.readFile = function ( files ) {

	FOO.timeStart = performance.now();
	FR.files = files;

	FR.reader = new FileReader();
	FR.reader.onload = FR.onLoad;

	FR.reader.readAsText( files.files[ 0 ] );

};


FR.onLoad = function () {

	const file = FR.files.files[ 0 ];

	FOOdivLog.innerHTML = `
<p>
	name: ${ file.name }<br>
	size: ${ file.size.toLocaleString() } bytes<br>
	type: ${ FOO.responseType }<br>
	modified: ${file.lastModifiedDate.toLocaleDateString() }<br>
	time to load: ${ ( performance.now() - FOO.timeStart ).toLocaleString() } ms
</p>
`;
	
	FOO.string = FR.reader.result;

	if ( file.name.toLowerCase().endsWith( ".zip" ) ) {

		FOO.dataZip = FR.files.files[ 0 ];
		console.log( "name", file.name );
		
		FOZ.onLoadFile();

	} else {

		FOO.string = FR.reader.result;
		GBX.onLoad();

	}

};