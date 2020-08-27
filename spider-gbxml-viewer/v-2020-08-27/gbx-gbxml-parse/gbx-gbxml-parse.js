const GBX = {};

GBX.colorsDefault = {
	Air: 0xffff00,
	Ceiling: 0xff8080,
	ExposedFloor: 0x40b4ff,
	ExteriorWall: 0xffb400,
	EmbeddedColumn: 0x80806e,
	FreestandingColumn: 0x808080,
	InteriorFloor: 0x80ffff,
	InteriorWall: 0x008000,
	RaisedFloor: 0x4b417d,
	Roof: 0x800000,
	Shade: 0xffce9d,
	SlabOnGrade: 0x804000,
	UndergroundWall: 0xa55200,
	UndergroundSlab: 0x804000,
	UndergroundCeiling: 0x408080,
	Undefined: 0x88888888,
};

GBX.colors = Object.assign( {}, GBX.colorsDefault ); // create working copy of default colors
GBX.surfaceTypes = Object.keys( GBX.colors );

GBX.triangle = new THREE.Triangle(); // used by GBX.getPlane

GBX.init = function () {

	GBX.string = FOO.string.replace( /[\t\n\r]/gm, "" );

	GBX.surfaces = GBX.string.match( /<Surface(.*?)<\/surface>/gi );

	const meshes = GBX.getSurfaceMeshes( GBX.surfaces );
	//console.log( 'meshes', meshes );

	THR.group.add( ...meshes );

};



// GBX.getSurfaceMeshes = function () {
// 	//console.log( 'GBX.surfaces', surfaces );

// 	const meshes = GBX.surfaces.map( ( surface, index ) => {

// 		const polyloopText = surface.match( /<PlanarGeometry(.*?)<polyloop(.*?)<\/polyloop>/gi );
// 		const polyloops = polyloopText.map( polyloop => polyloop.replace( /<\/?polyloop>/gi, "" ) );
// 		const coordinates = GBX.getCoordinates( polyloops[ 0 ] );
// 		//console.log( "coordinates", coordinates );
// 		const verticesSurfaces = [];

// 		for ( let i = 0; i < coordinates.length; ) {

// 			verticesSurfaces.push( new THREE.Vector3( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] ) );
// 		}
// 		//console.log( 'verticesSurfaces', verticesSurfaces );

// 		const coordinatesArray = polyloops.slice( 1 ).map( polyLoop => GBX.getCoordinates( polyLoop ) );

// 		const openings = coordinatesArray.map( coordinates => {

// 			const opening = [];

// 			for ( let i = 0; i < coordinates.length; ) {
// 				opening.push(
// 					new THREE.Vector3( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] )
// 				);
// 			}

// 			return opening;

// 		} );

// 		//console.log( 'openings', openings );

// 		const verticesOpenings = GBX.parseOpenings( openings );
// 		//console.log( 'verticesOpenings', verticesOpenings );

// 		const surfaceType = surface.match( 'surfaceType="(.*?)"' )[ 1 ];
// 		const color = new THREE.Color( GBX.colors[ surfaceType ] );
// 		//console.log( 'color', color );

// 		const mesh = GBX.getShape3d( verticesSurfaces, verticesOpenings, color );

// 		mesh.userData.index = index;
// 		mesh.userData.type = surfaceType;

// 		return mesh;

// 	} );

// 	return meshes;

// };




GBX.getCoordinates = ( text ) => text.match( /<Coordinate>(.*?)<\/Coordinate>/gi ).map( coordinate => + coordinate.replace( /<\/?coordinate>/gi, "" ) );


GBX.parseOpenings = function ( verticesArray ) {

	const holes = verticesArray.reverse().map( vertices => {

		const tempVerticesHoles = GBX.getTempVertices( vertices );
		const path = new THREE.Path( tempVerticesHoles );

		return { path, vertices };

	} );

	return holes;

};

GBX.getShape3d = function ( vertices = [], holes = [], color = 0xff0000 ) {

	//if ( THREE.ShapeUtils.isClockWise( vertices) === false ) { vertices.reverse() };

	const tempVertices = GBX.getTempVertices( vertices );
	const shape = new THREE.Shape( tempVertices );

	// let geometryLine = new THREE.Geometry();
	// geometryLine.vertices = vertices;
	// let materialLine = new THREE.LineBasicMaterial( { color: 0x000000 } );
	// let line = new THREE.Line( geometryLine, materialLine );
	// THR.scene.add( line);

	holes.forEach( hole => {

		shape.holes.push( hole.path );

		//if ( THREE.ShapeUtils.isClockWise( hole.vertices ) === false) { hole.vertices.reverse(); };

		vertices = vertices.concat( hole.vertices.reverse() );

		geometryLine = new THREE.Geometry();
		geometryLine.vertices = vertices;
		materialLine = new THREE.LineBasicMaterial( { color: 0x000000 } );
		line = new THREE.Line( geometryLine, materialLine );
		THR.scene.add( line );
		//console.log( 'vertices', vertices );
	} );


	const shapeGeometry = new THREE.ShapeGeometry( shape );
	shapeGeometry.vertices = vertices;  // THE trick!!

	const bufferGeometry = new THREE.BufferGeometry().fromGeometry( shapeGeometry);

	//const material = new THREE.MeshNormalMaterial( { opacity: 0.7, side: THREE.DoubleSide, transparent: false, wireframe: true } );
	const material = new THREE.MeshPhongMaterial( {
		color: color,
		opacity: 0.9,
		side: THREE.DoubleSide,
		transparent: true,
		wireframe: false,
	} );

	//const mesh = new THREE.Mesh( shapeGeometry, material );
	const mesh = new THREE.Mesh( bufferGeometry, material );

	// mesh.geometry.computeVertexNormals();
	// mesh.geometry.computeFaceNormals();
	// mesh.geometry.computeBoundingBox();
	// mesh.geometry.computeBoundingSphere();

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	//mesh.updateMatrixWorld();

	return mesh;

};

GBX.getTempVertices = function ( vertices ) {
	// try using geometry??
	//triangle = new THREE.Triangle( vertices[ 2 ], vertices[ 1 ], vertices[ 0 ] );

	triangle = GBX.getPlane( vertices );

	//console.log( "triangle", triangle.getPlane( THREE.Plane() ) );

	//if ( triangle.getArea() < 0.01 ) { console.log( "small", triangle );}

	const normal = triangle.getNormal( new THREE.Vector3() );
	const baseNormal = new THREE.Vector3( 0, 0, 1 );
	const quaternion = new THREE.Quaternion().setFromUnitVectors( normal, baseNormal );

	const tempVertices = vertices.map( vertex => vertex.clone().applyQuaternion( quaternion ) );
	//console.log( 'tempVertices', tempVertices );

	return tempVertices;
};



GBX.getPlane = function ( points, start = 0 ) {
	//console.log( 'points', points, start );

	GBX.triangle.set( points[ start ], points[ start + 1 ], points[ start + 2 ] );

	if ( GBX.triangle.getArea() === 0 && ( ++start < points.length - 2 ) ) { // looks like points are colinear and do not form a plane therefore try next set of points

		GBX.getPlane( points, start );

	}

	return GBX.triangle; //.getPlane( new THREE.Plane() );

};