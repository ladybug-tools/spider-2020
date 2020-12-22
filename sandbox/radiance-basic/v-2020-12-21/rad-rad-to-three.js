const RAD = {};

// https://github.com/ladybug-tools/3d-models

RAD.urlDefault = "https://www.ladybug.tools/3d-models/rad-sample-files/various-sources/DaylightingJSONTestBuilding.rad";
//RAD.urlDefault = "https://www.ladybug.tools/spider-2020/spider-radiance-viewer/radiance-animation-test-case.rad";
//RAD.urlDefault = "https://www.ladybug.tools/3d-models/rad-sample-files/mostapha-sample-files/honeybee_005.opq.rad";


RAD.colors = {

	InteriorWall: 0x008000,
	ExteriorWall: 0xFFB400,
	Roof: 0x800000,
	InteriorFloor: 0x80FFFF,
	ExposedFloor: 0x40B4FF,
	Shade: 0xFFCE9D,
	UndergroundWall: 0xA55200,
	UndergroundSlab: 0x804000,
	Ceiling: 0xFF8080,
	Air: 0xFFFF00,
	UndergroundCeiling: 0x408080,
	RaisedFloor: 0x4B417D,
	SlabOnGrade: 0x804000,
	FreestandingColumn: 0x808080,
	EmbeddedColumn: 0x80806E,

	generic_glass: 'black',
	generic_wall: 'gray',
	generic_floor: 'brown',
	generic_roof: 'maroon',

	Exterior_Window: 'black',
	Exterior_Wall: 'gray',
	Exterior_Floor: 'brown',
	Exterior_Roof: 'maroon',

	Dark_Wood: 'brown',
	Ceiling: 'azure',
	Ext_wall: 'gray',
	Ext_glaz: 'black',
	Floor: 'brown',
	Int_wall: 'navajowhite',
	Int_glaz: 'darkgray',
	Light_Wood: 'burlywood'

};

RAD.init = function () {

	url = location.hash ? location.hash.slice( 1 ) : RAD.urlDefault;

	RAD.requestFile( url );

};



RAD.requestFile = function ( url = RAD.urlDefault, callback = RAD.onLoad ) {

	//const urlCORS = "https://cors-anywhere.herokuapp.com/";

	xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "text";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

};



RAD.onLoad = function ( response ) {
	//console.log( "response", response );

	THR.scene.remove( THR.group );

	THR.group = THR.setSceneNew();

	RAD.text = response.replace( /\t/g, " " );
	lines = RAD.text.split( /\r\n|\n/ );

	lines = lines.filter( line => line && !line.startsWith( "#" ) ).map( line => line.trim().replace( /\s\s+/g, " " ) );
	//console.log( "lines", lines );

	items = [];
	count = -1;

	lines.forEach( line => {

		if ( line.search( /[a-z]/ ) >= 0 ) { // there is a word

			items[ ++count ] = [ line ];

		} else {

			items[ count ].push( line );

		}
	} );
	//console.log( "items", items );

	geometries = items.filter( line => !line[ 0 ].startsWith( "void" ) )

	pointLines = geometries.map( item => item.slice( 3 ) ); //.flatMap( item => item) );
	//console.log( "pointLines", pointLines );

	strings = pointLines.map( lines => lines.join ( " ") );
	//console.log( "strings", strings );

	coordinates = strings.map( string => string.split( " " ).slice( 1 ).map( item => + item ) );

	arr = coordinates.map( coordinate => coordinate.map( ( e, i ) => {
		return i % 3 === 0 ? coordinate.slice( i, i + 3 ) : null;
	} ).filter( e => { return e; } ) );
	//console.log( "arr", arr );

	vertices = arr.map( p => p.map( s => new THREE.Vector3().fromArray( s ) ) );
	//console.log( "vertices", vertices );

	meshes = vertices.map( ( verts, i ) => {

		rad = geometries[ i ][ 0 ];

		color = RAD.colors[ rad.split( " " ).shift() ];

		mesh = VMX.getShape3d( verts, [], color );

		mesh.userData.radiance = rad

		THR.group.add( mesh );

	} );

	THRR.updateScene();

};


//////////

const VMX = {};

VMX.getShape3d = function ( vertices = [], holes = [], color = 0x777777 ) {

	const tempVertices = VMX.getTempVertices( vertices, "shape" );

	const shape = new THREE.Shape( tempVertices );
	//console.log( "shape", shape );

	if ( holes.length ) {

		holes.forEach( hole => {
			shape.holes.push( hole.path );

			vertices = vertices.concat( hole.vertices.reverse() );
			//console.log( 'vertices', vertices );
		} );
	}

	const shapeGeometry = new THREE.ShapeGeometry( shape );

	shapeGeometry.vertices = vertices;  // THE trick!!

	//const material = new THREE.MeshNormalMaterial( { opacity: 0.7, side: THREE.DoubleSide, transparent: true, wireframe: false } );
	const material = new THREE.MeshPhongMaterial( {
		color: color,
		opacity: 0.9,
		side: THREE.DoubleSide,
		transparent: true,
		wireframe: false,
	} );

	const mesh = new THREE.Mesh( shapeGeometry, material );

	mesh.geometry.computeVertexNormals();
	mesh.geometry.computeFaceNormals();
	mesh.geometry.computeBoundingBox();
	mesh.geometry.computeBoundingSphere();

	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.updateMatrixWorld();

	return mesh;
};



VMX.getTempVertices = function ( vertices, type ) {


	const normal = VMX.getNormal( vertices );
	//const normal = triangle.getNormal(new THREE.Vector3());
	const baseNormal = new THREE.Vector3( 0, 0, 1 );
	const quaternion = new THREE.Quaternion().setFromUnitVectors( normal, baseNormal );

	const tempVertices = vertices.map( vertex => vertex.clone().applyQuaternion( quaternion ) );
	//console.log( 'tempVertices', tempVertices );

	return tempVertices;
};



VMX.getNormal = function ( points, start = 0 ) {
	//console.log( 'points', points, start );

	VMX.triangle = ( new THREE.Triangle() ).set( points[ start ], points[ start + 1 ], points[ start + 2 ] );

	if ( VMX.triangle.getArea() === 0 && ( ++start < points.length - 2 ) ) { // looks like points are colinear and do not form a plane therefore try next set of points

		VMX.getNormal( points, start );

	}

	return VMX.triangle.getNormal( new THREE.Vector3() );

};



//////////



//////////

THRR.getHtm = function () {

	console.log( "intersected", THRR.intersected );
	const mesh = THRR.intersected.object;

	rad = mesh.userData.radiance

	const htm = `
	<div>
		radiance: ${ rad }<br>
		id: ${ THR.group.children.indexOf( mesh ) }<br>
		geometry: ${ mesh.geometry.type }<br>
		name: ${ mesh.name }</br>
		uuid: ${ mesh.uuid }<br>
	</div>`;

	return htm;
};
