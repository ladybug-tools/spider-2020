// copyright 2020 Theo Armour. MIT license.
/* global */
// jshint esversion: 6
// jshint loopfunc: true


const FR = {};



FR.readFile = function ( files ) {

	FOO.timeStart = performance.now();
	FR.files = files;
	FR.file = FR.files.files[ 0 ];

	FR.reader = new FileReader();
	FR.reader.onload = FR.onLoad;

	FR.reader.readAsText( FR.file );

};


FR.onLoad = function () {

	
	console.log( "file", FR.file );
	
	FOO.fileName = FR.file.name;
	FOO.hostName = FR.file.type;
	FOO.onProgress( FR.file.size, "Load complete" ) 
	
	FOO.string = FR.reader.result;


	if ( FR.file.name.toLowerCase().endsWith( ".zip" ) ) {

		FOO.dataZip = FR.file;
		//console.log( "name", FR.file.name );
		
		FOZ.onLoadFile();

	} else {

		FOO.string = FOO.responseType === "json" ? JSON.parse( FR.reader.result ) : FR.reader.result;
		FOO.onLoadFile();

	}

};