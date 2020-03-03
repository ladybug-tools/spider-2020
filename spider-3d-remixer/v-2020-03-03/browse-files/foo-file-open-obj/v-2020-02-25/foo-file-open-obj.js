// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-02-13
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const FOO = {};


FOO.path = "https://cdn.jsdelivr.net/gh/ladybug-tools/3d-models@gh-pages/";

//FOO.path = "https://raw.githack.com/ladybug-tools/3d-models/gh-pages/quaternius/";

FOO.fileName = "CommonTree_5";

FOO.urlDefaultFile = FOO.path +"ultimate-nature-pack/CactusFlowers_5.obj";

FOO.scripts = [
	"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r113/examples/js/loaders/DDSLoader.js",
	"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r113/examples/js/loaders/MTLLoader.js",
	"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r113/examples/js/loaders/OBJLoader.js",
	"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r113/examples/js/controls/DragControls.js"
];

FOO.objects = [];

FOO.init = function () {

	FOOdivFileOpenObj.innerHTML = FOO.getMenu();

	//GFFdet8.ontoggle = FOO.loadScripts;

	FOO.loadScripts();

	window.addEventListener( 'hashchange', FOO.testForObj, false );

};



FOO.getMenu = function () {

	const htm = `
<details id=FOOdet >

	<summary class="sumMenuSecondary" >

		File Open OBJ

		<span class="couponcode">??<span class="coupontooltip">aaa bbb ccc 123 456</span></span>

	</summary>

	<p><select id=FOOselObjects size=10 ></select></p>

	<p><button onclick=FOO.getObjectsData() >get objects data</button></p>

	<div id=FOOdivMessage ></div>

	<p><button onclick=FOO.saveFile() >save file</button></p>

	<p><button onclick=FOO.requestFile("composition-3d-01.json") >open composition-3d.json</button></p>

	<p><button onclick=FOO.addForest(); >add forest</button></p>
</details>`;

	return htm;

};




FOO.loadScripts = function () {

	if ( !FOO.scr0 ) {

		FOO.scr0 = document.body.appendChild( document.createElement( 'script' ) );
		FOO.scr0.onload = FOO.loadScripts;
		FOO.scr0.src = FOO.scripts[ 0 ];

	} else if ( !FOO.scr1 ) {

		FOO.scr1 = document.body.appendChild( document.createElement( 'script' ) );
		FOO.scr1.onload = FOO.loadScripts;
		FOO.scr1.src = FOO.scripts[ 1 ];

	} else if ( !FOO.scr2 ) {

		FOO.scr2 = document.body.appendChild( document.createElement( 'script' ) );
		FOO.scr2.onload = FOO.loadScripts;
		FOO.scr2.src = FOO.scripts[ 2 ];

	} else if ( !FOO.scr3 ) {

		FOO.scr3 = document.body.appendChild( document.createElement( 'script' ) );
		FOO.scr3.onload = FOO.loadScripts;
		FOO.scr3.src = FOO.scripts[ 3 ];

	} else {

		FOO.manager = new THREE.LoadingManager();

		FOO.manager.addHandler( /\.dds$/i, new THREE.DDSLoader() );

		var dragControls = new THREE.DragControls( FOO.objects, THR.camera, THR.renderer.domElement );
		dragControls.addEventListener( 'dragstart', function ( event ) { THR.controls.enabled = false; } );
		dragControls.addEventListener( 'dragend', function ( event ) { THR.controls.enabled = true; } );

		console.log( 'FOO scripts loaded' );

	}

};



FOO.testForObj = function () {

	if ( location.hash.endsWith( ".obj" ) === false ) { return; }

	//console.log( 'hash', location.hash );

	FOO.fileName = location.hash.split( "/" ).pop().slice( 0, -4 );
	//console.log( 'FOO.fileName', FOO.fileName  );

	const folder = location.hash.split( "/" )[ 7 ];

	path = location.hash.slice( 1 ).split( "/" )
	path.pop();
	path = path.join( "/" ) + "/";
	//console.log( 'path', path );

	FOO.loadObj( FOO.fileName, path );

};



FOO.loadObj = function ( fName, path, params = {} ) {
	//console.log( 'fName', fName );

	THR.scene.add( THR.group );

	//console.log( 'path', path );
	//console.log( 'params', params );

	new THREE.MTLLoader( FOO.manager )
		.setPath( path )
		.load( fName + ".mtl", function ( materials ) {

			materials.preload();

			new THREE.OBJLoader( FOO.manager )
				.setMaterials( materials )
				.setPath( path )
				.load( fName + '.obj', function ( obj ) {


					object = obj;
					object.name = fName + ".obj";
					object.folder =
					object.position.set( + params.px || 0, +params.py || 0, +params.pz || 0 );
					object.rotation.set( + params.rx || 0, +params.ry || 0, +params.rz || 0 );
					object.scale.set( +params.sx || 1, +params.sy || 1, +params.sz || 1 );

					object.rotation.x = Math.PI / 2;
					//object.rotation.y = 7 * Math.random();

					//object.scale.set( 3, 3, 3 );
					object.children[ 0 ].receiveShadow = true;
					object.children[ 0 ].castShadow = true;

					THR.group.add( object );

					FOO.objects.push( object );

					FOOselObjects.innerHTML += `<option>${ fName }</option>`;

				} );

		} );

};



FOO.getObjectsData = function () {

	const gbx = THR.group.getObjectByName( "gbx" );

	const objText = FOO.objects.map( obj =>
		`{ "url": "${ obj.name }", "folder": "{ obj.folder }", "px": "${ obj.position.x }", "py": "${ obj.position.y }", "pz": "${ obj.position.z }", "rx": "${ obj.rotation.x }", "ry": "${ obj.rotation.y }", "rz": "${ obj.rotation.z }", "sx": "${ obj.scale.x }", "sy": "${ obj.scale.y }", "sz": "${ obj.scale.z }" }\n` ) .join( "" );

		//
	const txt = `
{ "url": "${ gbx.userData.url }" }
${ objText }
`;

	FOOdivMessage.innerText = txt;

};



FOO.saveFile = function () {

	let blob = new Blob( [ FOOdivMessage.innerText ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = 'composition-3d.json';
	a.click();
	//delete a;
	a = null;

};


FOO.requestFile = function ( url ) {

	xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.onerror = xhr => console.log( 'error:', xhr  );
	xhr.onprogress = xhr => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = xhr => FOO.callback( xhr.target.response );
	xhr.send( null );


}


FOO.callback = function ( text ) {

	FOO.jsonLines = text.split( /\r\n|\n/ )
		.filter( line => line.startsWith( "{" ) )
		.map( line => JSON.parse( line ) );

	//console.log( '', FOO.jsonLines );

	FOO.getObjects();

};



FOO.setSelectOptions = function () {

	options = group.children.map( ( child, i ) => `<option>${ child.name } ${ i + 1 }</option>` );

	FOOselObjects.innerHTML = options;

};




FOO.getObjects = function () {


	for ( line of FOO.jsonLines ) {

		folder = line.folder || "quaternius/ultimate-nature-pack/";

		if ( line.url.startsWith( "http" ) ) {

			//console.log( 'line', line );

			FO.url = line.url;

			THR.elevationDelta = line.elevationDelta;

			FOH.requestFileText( line.url );

		} else if ( line.url.endsWith( ".obj" ) ) {

			FOO.fileName = line.url.slice( 0, -4 );

			//console.log( 'FOO.fileName ', FOO.fileName  );

			FOO.loadObj( FOO.fileName, FOO.path + folder, line );

		}

	}

	//const gbx = THR.group.getObjectByName( "gbx" );
;
};



FOO.summer = [

	"BirchTree_1",
	"BirchTree_2",
	"BirchTree_3",
	"BirchTree_4",
	"BirchTree_5",
	"CommonTree_1",
	"CommonTree_2",
	"CommonTree_3",
	"CommonTree_4",
	"CommonTree_5",
	"Willow_1",
	"Willow_2",
	"Willow_3",
	"Willow_4",
	"Willow_5",

];



FOO.addForest = function ( count = 100 ) {

	bbox = new THREE.Box3().setFromObject( THR.group.getObjectByName( "gbx" ) )

	//THRbbox = new THREE.Box3().setFromObject( THR.gbx );

	//console.log( 'bbox', bbox );

	let x = 0;
	let y = -30;

	for ( let i = 0; i < count; i++ ) {

		tree = FOO.summer[ Math.floor( Math.random() * FOO.summer.length ) ];

		if ( i % 10 === 0 ) {

			x = -20;
			y += 10;

		} else {

			x += 10 + Math.random();

			y += Math.random();

		}

		//console.log( 'gg', bbox.containsPoint( new THREE.Vector3( x, y, 1 ) ) );

		if ( bbox.containsPoint( new THREE.Vector3( x, y, 1 ) ) ) {

			continue;

		}

		const line = { px: x, py: y, ry: 7 * Math.random(), "sx": 3 + Math.random(),  "sy": 3 + Math.random(), "sz": 3 + Math.random() };

		FOO.loadObj( tree, FOO.path + "quaternius/ultimate-nature-pack/", line );

	}

};



FOO.init();
