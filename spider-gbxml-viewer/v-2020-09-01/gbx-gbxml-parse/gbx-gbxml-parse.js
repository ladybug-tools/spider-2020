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

	GBX.meshes = GBX.getSurfaceMeshes();
	//console.log( 'meshes', GBX.meshes );

	THR.group.add( ...GBX.meshes );

	console.log( '', performance.now() - FOO.timeStart );

	//showPaintTimings();

};


function showPaintTimings () {

	if ( window.performance ) {
		let performance = window.performance;
		let performanceEntries = performance.getEntriesByType( 'paint' );
		performanceEntries.forEach( ( performanceEntry, i, entries ) => {
			console.log( "The time to " + performanceEntry.name + " was " + performanceEntry.startTime + " milliseconds." );
		} );
	} else {
		console.log( 'Performance timing isn\'t supported.' );
	}
}

GBX.getSurfaceMeshes = function () {
	// console.log( 'surfaces', surfaces );

	GBX.materialType = THR.scene.getObjectByName( 'lightAmbient' ) ?
		THREE.MeshPhongMaterial : THREE.MeshBasicMaterial;
	//GBX.materialType = THREE.MeshBasicMaterial;

	const getCoordinates = text => text.match( /<Coordinate>(.*?)<\/Coordinate>/gi ).map( coordinate => + coordinate.replace( /<\/?coordinate>/gi, "" ) );

	const meshes = GBX.surfaces.map( ( surface, index ) => {

		const polyloops = surface.match( /<PlanarGeometry(.*?)<polyloop(.*?)<\/polyloop>/gi )
			.map( polyloop => polyloop.replace( /<\/?polyloop>/gi, "" ) );

		const coordinates = getCoordinates( polyloops[ 0 ] );

		const openings = polyloops.slice( 1 ).map( polyLoop => getCoordinates( polyLoop ) );

		const mesh = GBX.getSurfaceMesh( coordinates, index, openings );

		return mesh;

	} );

	return meshes;

};



GBX.getSurfaceMesh = function ( arr, index, holes ) {
	//console.log( 'array', arr, 'index', index );

	const surface = GBX.surfaces[ index ];


	const v = arr => new THREE.Vector3().fromArray( arr );
	let geometry;

	if ( arr.length < 10 ) {

		const points = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6 ) ) ];

		geometry = GBX.getBufferGeometry( points );

	} else if ( arr.length === 12 && holes.length === 0 ) {

		const points = [

			v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6, 9 ) ),
			v( arr.slice( 0, 3 ) ), v( arr.slice( 6, 9 ) ), v( arr.slice( 9, 12 ) )

		];

		geometry = GBX.getBufferGeometry( points );

	} else {

		const points = [];

		for ( let i = 0; i < ( arr.length / 3 ); i++ ) {

			points.push( v( arr.slice( 3 * i, 3 * i + 3 ) ) );

		}

		const pointsHoles = holes.map( hole => {

			const points = [];

			for ( let i = 0; i < ( hole.length / 3 ); i++ ) {

				points.push( v( hole.slice( 3 * i, 3 * i + 3 ) ) );

			}

			return points;

		} );

		geometry = GBX.getBufferGeometryShape( points, pointsHoles );

	}

	const surfaceType = surface.match( 'surfaceType="(.*?)"' )[ 1 ];
	const color = new THREE.Color( GBX.colors[ surfaceType ] );
	const material = new GBX.materialType( { color: color, opacity: GBX.opacity, side: 2, transparent: true } );

	const mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = mesh.receiveShadow = true;
	mesh.userData.index = index;
	mesh.userData.surfaceType = surfaceType;

	return mesh;

};



GBX.getBufferGeometry = function ( points ) {

	const geometry = new THREE.BufferGeometry().setFromPoints( points );
	geometry.computeVertexNormals();
	return geometry;

};



GBX.getBufferGeometryShape = function ( points, holes = [] ) {

	//assume points are coplanar but at an arbitrary rotation and position in space
	const normal = GBX.getNormal( points );

	// rotate points to lie on XY plane
	GBX.referenceObject.lookAt( normal ); // copy the rotation of the plane
	GBX.referenceObject.quaternion.conjugate(); // figure out the angle it takes to rotate the points so they lie on the XY plane
	GBX.referenceObject.updateMatrixWorld();

	const pointsFlat = points.map( point => GBX.referenceObject.localToWorld( point ) );
	const holesFlat = holes.map( pointsHoles => pointsHoles.map( point => GBX.referenceObject.localToWorld( point ) ) );

	// points must be coplanar with the XY plane for Earcut.js to triangulate a set of points
	const triangles = THREE.ShapeUtils.triangulateShape( pointsFlat, holesFlat );
	const pointsAll = points.slice( 0 ).concat( ...holesFlat );
	const pointsTriangles = [];

	for ( let triangle of triangles ) {

		for ( let i = 0; i < 3; i++ ) {

			const point = pointsAll[ triangle[ i ] ];

			pointsTriangles.push( point );

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




GBX.toggleSpaceTitles = function () {

	if ( !GBX.texts ) {

		const floors = GBX.meshes.filter( mesh => [ "InteriorFloor", "RaisedFloor", "SlabOnGrade" ].includes( mesh.userData.surfaceType ) );
		console.log( "floors", floors );

		const spaceIds = floors.map( floor => floor.userData.spaceId );
		console.log( "spaceIds", spaceIds );
		//.map( id => Array.isArray( id ) ? id[ 0 ][ "@attributes" ].spaceIdRef : id[ "@attributes" ].spaceIdRef );

		GBX.texts = floors.map( ( floor, i ) => floor.add( THRU.drawPlacard( spaceIds[ i ], THR.radius / 1000, 0xffffff,
			floor.geometry.boundingSphere.center.add( new THREE.Vector3( 0, 0, 2 ) ) ) ) );

		// texts = floors.map( ( floor, i ) => floor.add( ... THRU.addDoubleSidedText( { text: spaceIds[ i ],
		// 	size: 2,
		// 	position: floor.geometry.boundingSphere.center.add( new THREE.Vector3( 0, 0, 2 ) ) } ) ) );
		//THRU.group.add( ... texts )

	}

};