// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-03-09
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const FOZ = {};



FOZ.init = function () {

	FOZdivFileOpenZip.innerHTML = FOZ.getMenu();

	window.addEventListener( 'hashchange', FOZ.checkForZip, false );

	window.addEventListener( "onloadFile", FOZ.onLoadFile, false );

};



FOZ.getMenu = function () {

	const htm = `
<details id=FOZdet hidden>

	<summary class="sumMenuTertiary" >
		File open ZIP

		<span class="couponcode"> ?? <span class="coupontooltip">Open and de-compress a ZIP file.<br><br>
		Extract the first file found and load as text.</span></span>

	</summary>

	<div id=FOZdivOnProgress ></div>

	<div id=FOZdivLog ></div>

	<div id=FOZdivContent ></div>

</details>`;

	return htm;

};


FOZ.checkForZip = function () {

	if ( location.hash.toLowerCase().endsWith( ".zip" ) === false ) { return; }
	//console.log( 'hash', location.hash );

	const url = location.hash.slice( 1 );

	FO.responseType = "blob";
	FO.requestFile( url, FOZ.onLoadFile );

	FOZdet.hidden = false;

	FOZdet.open = true;


};



FOZ.onLoadFile = function ( xhr ) {

	FOZ.timeStart = performance.now();

	FO.data = xhr.target.response;

	console.log( 'xhr', xhr )

	FO.onProgress( xhr.loaded, "Load complete" );

	FOZ.fileOpenZip();

};


FOZ.fileOpenZip = function () {

	const response = FO.data;
	//console.log( 'response', response );

	const zip = new JSZip();
	FOZ.files = [];

	zip.loadAsync( response )

	.then( function( zipp ) {
		//console.log( 'zip', zipp );

		zipp.forEach( ( relativePath, zipEntry ) => FOZ.files.push( zipEntry ) );

		// Read first file from the zip file!
		const uint8array = zipp.file( FOZ.files[ 0 ].name ).async( "uint8array" );
		console.log( 'names[ 0 ]', FOZ.files[ 0 ].name );

		FOZ.file = FOZ.files[ 0 ];

		return uint8array;

	} )

	.then( function( uint8array ) {
		console.log( 'uint8array', uint8array[ 0 ] );

		let text = '';

		if ( uint8array[ 0 ] !== 255 ||  uint8array[ 0 ] === 239 || uint8array[ 0 ] === 60 ) {

			text = new TextDecoder( "utf-8" ).decode( uint8array );
			//console.log( 'text', text );

		} else {

			const arr = new Uint8Array( uint8array.length / 2 );
			let index = 0;

			// console.log( 'uint8array', uint8array );

			for ( let i = 0; i < uint8array.length; i++ ) {

				if ( i % 2 === 0 ) {

					arr[ index++ ] = uint8array[ i ];

				}

			}
			//console.log( 'arr', arr );

			text = new TextDecoder( "utf-8" ).decode( arr );

		}
		//console.log( 'text', text );

		return text;

	} )

	.then(

		function success( text ) {

			FOZ.text = text;

			FO.data = text;

			//console.log( 'text', FOZ.text );

			FOZdivOnProgress.innerHTML = `
<p>
	bytes loaded: ${ FOZ.text.length.toLocaleString() }<br>
	time elapsed ${ ( performance.now() - FOZ.timeStart ).toLocaleString() } ms
</p>

`;

			FOZ.event = new Event( "onloadFileXml" );

			document.body.addEventListener( "onloadFileXml", FOZ.onZipDecompress, false );

			document.body.dispatchEvent( FOZ.event, {"bubbles": true, "cancelable": false, detail: true } );

			FOZdivOnProgress.append( " load completed" );

		},

		function error( e ) { FOZdivOnProgress.append( `error ${ e } ` ); }

	);

};



FOZ.onZipDecompress = function ( event ) {

	//console.log( 'event', event, FOZ.file );

	GBX.onLoad();

	FOZdivLog.innerHTML = `
<p>
	file name: ${FOZ.file.name }<br>
	file date: ${FOZ.file.date }<br>
	files in zip: ${ FOZ.files.length }
</p>

<details ontoggle=FOZ.displayFileContents(); >

<summary>Display compressed file contents</summary>

<p>First thousand characters only</p>

<textarea id=FOZtxtArea style=height:50rem;overflow:auto;width:100%; ></textarea>

</details>`;

};



FOZ.displayFileContents = function () {

	FOZtxtArea.value = FOZ.text.slice( 0, 1000 );

};

