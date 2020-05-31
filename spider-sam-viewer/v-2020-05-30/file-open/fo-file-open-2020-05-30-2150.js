// copyright 2020 Theo Armour. MIT license.
/* global  */
// jshint esversion: 6
// jshint loopfunc: true


const FO = {};

FO.extension = "xml";

FO.init = function () {

	FO.reset();

	window.addEventListener("hashchange", FO.onHashChange);

	if (!window.divLog) {
		divLog = detFile.body.appendChild(document.createElement("div"));
	}

};

FO.reset = function () {

	divLog.innerHTML = "";
	FO.fileName = undefined;
	FO.hostName = undefined;
	//FO.objects = undefined;
	//FO.text = undefined;
	FO.string = undefined;
	FO.timeStart = undefined;
	FO.url = undefined;
	FO.xhr = new XMLHttpRequest();
	FO.responseType = 'text';

};


FO.onHashChange = function() {

	if ( location.hash.toLowerCase().endsWith( FO.extension ) === false ) { return; }
	console.log( 'hash', location.hash );
	
	//FO.reset();
    
	FO.timeStart = performance.now();

	FO.url = parent.location.hash.slice(1);

	FO.requestFile(FO.url, FO.callback);
}


FO.requestFile = function ( url, callback = FO.callback ) {

	//console.log( 'url', url );
	if ( !url ) { return; }

	FO.timeStart = performance.now();

	FO.xhr.open( 'GET', url, true );
	FO.xhr.responseType = FO.responseType;
	FO.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	FO.xhr.onprogress = function( xhr ) { FO.onProgress( xhr.loaded, FO.note ); };
	FO.xhr.onload = function( xhr ) { FO.string = xhr.target.response; callback( xhr.target.response ); };
	FO.xhr.send( null );

	FO.url = url;

	FO.fileName = FO.url.split( "/" ).pop();
	//const path = location.hash.slice( 1 ).split( "/" )

	const a = document.createElement( 'a' );
	a.href = url;
	FO.hostName = a.hostname;

};



FO.onProgress = function( size = 0, note = "" ) {

	FO.timeToLoad = ( performance.now() - FO.timeStart ).toLocaleString();

	FO.size = size;

	FO.fileInfo =
	`
		<p>
			<span class=attributeTitle >File name</span>: <span class=attributeValue >${ FO.fileName }</span></br>
			<span class=attributeTitle >Host</span>: <span class=attributeValue >${ FO.hostName }</span></br>
 			<span class=attributeTitle >Bytes loaded</span>: <span class=attributeValue >${ size.toLocaleString() }</span></br>
			<span class=attributeTitle >Time to load</span>: <span class=attributeValue>${ FO.timeToLoad } ms</span></br>
			${ note }
		</p>
	`;

	divLog.innerHTML = FO.fileInfo;

};



FO.callback = function ( xhr ) {

	console.log( 'xhr', xhr );

	FO.onProgress( xhr.loaded, "Load complete" );

};
