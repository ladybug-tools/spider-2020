// copyright 2020 Theo Armour. MIT license.
/* global  */
// jshint esversion: 6
// jshint loopfunc: true


const FOO = {};



FOO.init = function () {
    
    window.addEventListener("hashchange", FOO.onHashChange);

    FOO.reset();

};

FOO.onHashChange = function() {
	//console.log( 'hash', location.hash );

	FOO.url = location.hash.slice(1);

	FOO.requestFile(FOO.url, FOO.onLoadXhr);

};


FOO.reset = function () {

    FOOdivLog.innerHTML = "";
    
	FOO.extension = ".md";
	
	FOO.fileName = undefined;
	FOO.hostName = undefined;
	//FOO.objects = undefined;
	//FOO.text = undefined;
	FOO.onLoad = FOO.onLoadXhr; 
	//FOO.doNext = () => {};
	FOO.responseType = "text";
	FOO.string = undefined;
	FOO.timeStart = undefined;
	FOO.url = undefined;
	FOO.xhr = new XMLHttpRequest();

};



FOO.onLoadFile = function() {

	console.log( "FOO.string", FOO.string.slice( 0, 50 ) );

};

FOO.requestFile = function ( url = urlGbxmlDefault, onLoad = FOO.onLoadXhr ) {

	//console.log( 'url', url );

	FOO.timeStart = performance.now();

	FOO.url = url;
	FOO.fileName = FOO.url.split( "/" ).pop();
	FOO.extension = FOO.fileName.split( "." ).pop().toLowerCase();
	//console.log( "FOO.extension ",  FOO.extension );
	FOO.responseType = "text";

	FOO.responseType = FOO.extension === "zip" ? "blob" : FOO.responseType;
	//console.log( "FOO.responseType",  FOO.responseType );

	FOO.xhr.open( 'GET', url, true );
	FOO.xhr.responseType = FOO.responseType;
	FOO.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	FOO.xhr.onprogress = function( xhr ) { FOO.onProgress( xhr.loaded, FOO.note ); };
	FOO.xhr.onload = onLoad;
	FOO.xhr.send( null );
	
	//const path = location.hash.slice( 1 ).split( "/" )

	const a = document.createElement( 'a' );
	a.href = url;
	FOO.hostName = a.hostname;

};



FOO.onProgress = function( size = 0, note = "" ) {

	FOO.timeToLoad = ( performance.now() - FOO.timeStart ).toLocaleString();
	FOO.size = size;

	FOO.fileInfo =
	`
		<p>
			<span class=attributeTitle >File name</span>: <span class=attributeValue >${ FOO.fileName }</span></br>
			<span class=attributeTitle >Host</span>: <span class=attributeValue >${ FOO.hostName }</span></br>
 			<span class=attributeTitle >Bytes loaded</span>: <span class=attributeValue >${ size.toLocaleString() }</span></br>
			<span class=attributeTitle >Time to load</span>: <span class=attributeValue>${ FOO.timeToLoad } ms</span></br>
			${ note }
		</p>
	`;

	FOOdivLog.innerHTML = FOO.fileInfo;

};



FOO.onLoadXhr = function ( xhr ) {
	console.log( 'xhr', xhr );

	FOO.onProgress( xhr.loaded, "Load complete" );

	FOO.string = xhr.target.response;

	if ( FOO.extension === "zip" ) {

		FOO.dataZip = FOO.string;
		FOZ.onLoadFile();

	} else {

		FOO.onLoadFile();

	}

};
