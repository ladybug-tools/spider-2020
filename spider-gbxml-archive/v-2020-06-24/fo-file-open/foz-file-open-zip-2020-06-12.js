// copyright 2020 Theo Armour. MIT license.
// jshint esversion: 6
// jshint loopfunc: true


const FOZ = {};


FOZ.onLoadFile = function () {

	FOZ.timeStart = performance.now();

	const response = FOO.dataZip;
	//console.log( 'response', response );

	const zip = new JSZip();
	FOZ.files = [];

	zip.loadAsync( response )

	.then( function( zip ) {
		//console.log( 'zip', zip );

		zip.forEach( ( relativePath, zipEntry ) => FOZ.files.push( zipEntry ) );

		// Read first file from the zip file
		const uint8array = zip.file( FOZ.files[ 0 ].name ).async( "uint8array" );
		//console.log( 'names[ 0 ]', FOZ.files[ 0 ].name );

		FOZ.file = FOZ.files[ 0 ];

		return uint8array;

	} )

	.then( function( uint8array ) {
		//console.log( 'uint8array', uint8array[ 0 ] );

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

			FOO.string = FOO.responseType === "json" ? JSON.parse( text ) : text;

			FOO.doNext();

			FOZdivFileOpenZip.innerHTML = `
<p>
	bytes loaded: ${ text.length.toLocaleString() }<br>
	time elapsed ${ ( performance.now() - FOZ.timeStart ).toLocaleString() } ms
</p>`;
			
		},

		function error( e ) { FOZdivFileOpenZip.append( `error ${ e } ` ); }

	);

};
