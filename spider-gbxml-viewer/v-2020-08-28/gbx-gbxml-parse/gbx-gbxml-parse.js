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
GBX.opacity = 0.85;

GBX.triangle = new THREE.Triangle(); // used by GBX.getPlane
GBX.referenceObject = new THREE.Object3D();





GBX.init = function () {


	const timeStart = performance.now();

	GBX.string = FOO.string.replace( /[\t\n\r]/gm, "" );

	GBX.surfaces = GBX.string.match( /<Surface(.*?)<\/surface>/gi );

	const meshes = GBX.getSurfaceMeshes();
	//console.log( 'meshes', meshes );

	THR.group.add( ...meshes );

	console.log( '',  performance.now() - timeStart );


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


GBX.getSurfaceMeshes = function () {
	// console.log( 'surfaces', surfaces );

	GBX.materialType = THR.scene.getObjectByName( 'lightAmbient' ) ? THREE.MeshPhongMaterial : THREE.MeshBasicMaterial;
	//GBX.materialType = THREE.MeshBasicMaterial;

	const meshes = GBX.surfaces.map( ( surface, index ) => {

		const polyloopText = surface.match( /<PlanarGeometry(.*?)<polyloop(.*?)<\/polyloop>/gi );
		const polyloops = polyloopText.map( polyloop => polyloop.replace( /<\/?polyloop>/gi, "" ) );

		const coordinates = GBX.getCoordinates( polyloops[ 0 ] );

		const openings = polyloops.slice( 1 ).map( polyLoop => GBX.getCoordinates( polyLoop ) );

		const mesh = GBX.getSurfaceMesh( coordinates, index, openings );

		return mesh;

	} );


	return meshes;

};



GBX.getCoordinates = ( text ) => text.match( /<Coordinate>(.*?)<\/Coordinate>/gi ).map( coordinate => + coordinate.replace( /<\/?coordinate>/gi, "" ) );


GBX.parseOpenings = function ( verticesArray ) {

	const holes = verticesArray.reverse().map( vertices => {

		const tempVerticesHoles = GBX.getTempVertices( vertices );
		const path = new THREE.Path( tempVerticesHoles );

		return { path, vertices };

	} );

	return holes;

};



GBX.getSurfaceMesh = function ( arr, index, holes ) {
	//console.log( 'array', arr, 'index', index );

	const surface = GBX.surfaces[ index ];
	const surfaceType = surface.match( 'surfaceType="(.*?)"' )[ 1 ];
	const color = new THREE.Color( GBX.colors[ surfaceType ] );

	const v = arr => new THREE.Vector3().fromArray( arr );

	let geometry;

	if ( arr.length < 10 ) {

		const points = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6 ) ) ];

		geometry = GBX.getBufferGeometry( points, color );

	} else if ( arr.length === 12 && holes.length === 0 ) {

		const points = [

			v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6, 9 ) ),
			v( arr.slice( 0, 3 ) ), v( arr.slice( 6, 9 ) ), v( arr.slice( 9, 12 ) )

		];

		geometry = GBX.getBufferGeometry( points, color );

	} else {

		const points = [];

		for ( let i = 0; i < ( arr.length / 3 ); i++ ) {

			points.push( v( arr.slice( 3 * i, 3 * i + 3 ) ) );

		}
		//console.log( 'points', points );

		const pointsHoles = [];

		for ( let i = 0; i < holes.length; i++ ) {

			const hole = holes[ i ];
			const points = [];

			for ( let j = 0; j < ( hole.length / 3 ); j++ ) {

				points.push( v( hole.slice( 3 * j, 3 * j + 3 ) ) );

			}

			pointsHoles.push( points );
			//console.log( '', points, pointsHoles );

		}

		geometry = GBX.setPolygon( points, color, pointsHoles );

	}

	const material = new GBX.materialType( { color: color, opacity: GBX.opacity, side: 2, transparent: true } );

	const mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = mesh.receiveShadow = true;
	mesh.userData.index = index;
	mesh.userData.surfaceType = surfaceType;

	//GBX.meshAddGbJson( surface, mesh );

	return mesh;

};


GBX.getBufferGeometry = function ( points ) {
	//console.log( 'points', points, color );

	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints( points );
	geometry.computeVertexNormals();
	return geometry;

};



GBX.setPolygon = function ( points, color, holes = [] ) {
	//console.log( { holes } );

	//assume points are coplanar but at an arbitrary rotation and position in space
	const normal = GBX.getNormal( points );

	// rotate points to lie on XY plane
	GBX.referenceObject.lookAt( normal ); // copy the rotation of the plane
	GBX.referenceObject.quaternion.conjugate(); // figure out the angle it takes to rotate the points so they lie on the XY plane
	GBX.referenceObject.updateMatrixWorld();

	const pointsFlat = points.map( vertex => GBX.referenceObject.localToWorld( vertex ) );
	//console.log( { pointsFlat } );

	const holesFlat = holes.map( pointsHoles => pointsHoles.map( vertex => GBX.referenceObject.localToWorld( vertex ) ) );

	// points must be coplanar with the XY plane for Earcut.js to triangulate a set of points
	const triangles = THREE.ShapeUtils.triangulateShape( pointsFlat, holesFlat );
	//console.log( { triangles } );

	const pointsAll = points.slice( 0 ).concat( ...holesFlat );
	//console.log( 'pointsAll', pointsAll );

	const pointsTriangles = [];

	for ( let triangle of triangles ) {

		for ( let j = 0; j < 3; j++ ) {

			const vertex = pointsAll[ triangle[ j ] ];

			pointsTriangles.push( vertex );

		}

	}
	//console.log( { pointsTriangles } );

	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints( pointsTriangles );
	geometry.lookAt( normal );
	geometry.computeVertexNormals();

	return geometry;

};



GBX.getNormal = function ( points, start = 0 ) {
	//console.log( 'points', points, start );

	GBX.triangle.set( points[ start ], points[ start + 1 ], points[ start + 2 ] );

	if ( GBX.triangle.getArea() === 0 && ( ++start < points.length - 2 ) ) { // looks like points are colinear and do not form a plane therefore try next set of points

		GBX.getNormal( points, start );

	}

	return GBX.triangle.getNormal( new THREE.Vector3() );

};







