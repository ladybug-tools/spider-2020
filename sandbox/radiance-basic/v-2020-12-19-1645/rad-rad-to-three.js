const RAD = {};


RAD.init = function () {

	//const urlRadDefault = "https://www.ladybug.tools/spider-2020/spider-radiance-viewer/DaylightingJSONTestBuilding.rad";

	const urlRadDefault = "https://www.ladybug.tools/spider-2020/spider-radiance-viewer/radiance-animation-test-case.rad";

	//const urlRadDefault = "https://www.ladybug.tools/spider-rad-resources/rad-sample-files/mostapha-sample-files/honeybee_005.opq.rad";


	RAD.requestFile( urlRadDefault )
};


RAD.requestFile = function ( url = "https://example.com", callback = RAD.onLoad ) {

	//const urlCORS = "https://cors-anywhere.herokuapp.com/";

	xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "text";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

}



RAD.onLoad = function  ( response ) {

	//console.log( "response", response );

	text = response.replace( /\t/g, " " );
	lines = text.split( /\r\n|\n/ );

	lines = lines.filter( line => line && !line.startsWith( "#" ) ).map( line => line.trim().replace( /\s\s+/g, " " ) )

	//console.log( "lines", lines );

	items = [];
	count = -1;

	lines.forEach( line => {

		if ( line.search( /[a-z]/ ) >= 0 ) { // there is a word

			items[ ++count ] = [ line ];

		} else {

			items[ count ].push( line );

		}
	} )

	//console.log( "items", items );

	points = items.filter( line => !line[ 0 ].startsWith( "void" ) ).slice( 1 ).map( item => item.slice( 4 ).map( item => item.split( " " ).map( item => + item ) ) );

	//console.log( "points", points );

	vertices = points.map( p => p.map( s => new THREE.Vector3().fromArray( s ) ) )

	//console.log( "vertices", vertices );

	meshes = vertices.map( verts => {

		mesh = VMX.getShape3d( verts );

		THR.group.add( mesh )

	})

}

//RAD.parseRadFile( )


const VMX = {};

VMX.getShape3d = function ( vertices = [], holes = [], color = 0xff0000 ) {
	// if (vertices.length < 3) {
	// 	console.log("vs", vertices);
	// }

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

	//bufferGeometry = new THREE.BufferGeometry().fromGeometry( shapeGeometry )

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

	//console.log( "mgeo", mesh.geometry);
	mesh.updateMatrixWorld();

	return mesh;
};

VMX.getTempVertices = function ( vertices, type ) {
	// try using geometry??
	// let triangle = new THREE.Triangle(vertices[2], vertices[1], vertices[0]);

	// if (triangle.getArea() === 0) {
	// 	//console.log( "", area, vertices );
	// 	triangle = new THREE.Triangle( vertices[ 3 ], vertices[ 1 ], vertices[ 0 ] );
	// }

	const normal = VMX.getNormal( vertices );
	//const normal = triangle.getNormal(new THREE.Vector3());
	const baseNormal = new THREE.Vector3( 0, 0, 1 );
	const quaternion = new THREE.Quaternion().setFromUnitVectors( normal, baseNormal );

	const tempVertices = vertices.map( vertex => vertex.clone().applyQuaternion( quaternion ) );
	//console.log( 'tempVertices', tempVertices );


	// const cw = THREE.ShapeUtils.isClockWise(tempVertices);

	// if ( type === "hole" && cw === false ) { tempVertices.reverse(); }

	// if ( type === "shape" && cw === true ) { tempVertices.reverse(); }

	//console.log( "isCW tmpV", type, THREE.ShapeUtils.isClockWise( tempVertices) );

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