// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-02-13
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const GFOA = {};



GFOA.init = function () {

	GFOAdivGithubFilesOpenAll.innerHTML += GFOA.getMenu();

};



GFOA.getMenu = function () {

	const htm = `
<details>

	<summary class="sumMenuSecondary" >

		GFOA GitHub Files Open All

		<span class="couponcode">??<span class="coupontooltip">aaa bbb ccc 123 456</span></span>

	</summary>

	<p><button onclick=console.log('files',GFF.files);>list files</button></p>

	<p><button onclick=GFOA.addFiles(); >add files public transport</button></p>

	<p><button onclick=GFOA.addFiles(); >add files</button></p>

	<div id=GFOAdivMessage ></div>

</details>`;

	return htm;

};


GFOA.addFiles = function () {

	let x = 0;
	let y = 0;


	GFF.files.forEach( ( file, index ) => {

		//console.log( 'file', file );


		const folder = file.path.split( "/" )[ 1 ];

		path = FOO.path + folder + "/";

		if ( file.url.startsWith( "httpcccc" ) ) {

			//group.add( box );

			console.log( 'file', file );

			FO.url = file.download_url;

			FOH.requestFileText( file.download_url );

		} else if ( file.name.endsWith( ".obj" ) ) {

			FOO.fileName = file.name.slice( 0, -4 );

			//console.log( 'FOO.fileName ', FOO.fileName  );

			if ( index % 15 === 0 ) {

				x = 0;
				y += 6;

			} else {

				x += 6;

			}

			FOO.loadObj( FOO.fileName, path, { px: x -50, py: y -20 } );

		}

	} );

};


GFOA.init();