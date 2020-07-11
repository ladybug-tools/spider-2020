

const PHJ = {


};

PHJ.colors = {

	Wall: "beige",
	Floor: "brown",
	RoofCeiling: "red",
	AirBoundary: "blue"

};


PHJ.processJson = function ( json ) {

	//console.log( "json", json );

	PHJ.Wall = new THREE.Geometry();
	PHJ.Floor = new THREE.Geometry();
	PHJ.RoofCeiling = new THREE.Geometry();
	PHJ.AirBoundary = new THREE.Geometry();


	const rooms = json.rooms || [];

	rooms.forEach( ( room, index ) => {

		const faces = room.faces;

		for ( let face of faces ) {

			//console.log( 'type', face.face_type );

			const boundary = face.geometry.boundary;

			const vertices = boundary.map( point => new THREE.Vector3().fromArray( point ) );

			const openings = [];

			openings.push( ... face.apertures || [] );

			openings.push( ... face.doors || [] );

			const holes = PHJ.parseApertures( openings, vertices );

			const geometries = PHJ[ face.face_type ];

			PHJ.addShape3d( vertices, holes, geometries, index );

			PHJ.parseShades( face.indoor_shades || [] );

			PHJ.parseShades( face.outdoor_shades || [] );

			PHJ.parseApertureShades( face.apertures || [] );

		}

	} );

	PHJ.parseShades( json.orphaned_shades || [] );

	//PHJ.geometryShade = THREE.BufferGeometryUtils.mergeBufferGeometries( geometries );

	//console.log( rooms.length, PHJ.vertices.length );

	if ( rooms.length === 0 && PHJ.vertices.length === 0 ) {

		console.log( "No Honeybee 3D data" );
	}

};



PHJ.parseApertureShades = function ( apertures ) {

	for ( let aperture of apertures ) {

		PHJ.parseShades( aperture.outdoor_shades || [] );

	}

};




PHJ.parseApertures = function ( apertures, verticesFace ) {

	const holes = [];

	for ( let aperture of apertures ) {

		const boundary = aperture.geometry.boundary;

		const vertices = boundary.map( point => new THREE.Vector3().fromArray( point ) );

		//console.log( "cw v", THREE.ShapeUtils.isClockWise( verticesFace ) );

		if ( THREE.ShapeUtils.isClockWise( vertices ) === true ) { vertices.reverse(); }

		const tempVerticesHoles = PHJ.getTempVertices( vertices );
		//console.log( 'tempVerticesHoles', tempVerticesHoles );

		const path = new THREE.Path( tempVerticesHoles );
		//path.setFromPoints( vertices2d );

		//console.log( 'path', path, vertices );
		holes.push( { path, vertices } );

	}

	return holes;

};



PHJ.parseShades = function ( shades ) {

	//PHJ.geometriesShade = [];

	for ( let shade of shades ) {

		const geometriesJson = Array.isArray( shade.geometry ) ? shade.geometry : [ shade.geometry ];

		for ( let geometry of geometriesJson ) {

			const boundary = geometry.boundary;

			const vertices = boundary.map( point => new THREE.Vector3().fromArray( point ) );

			const tempVertices = PHJ.getTempVertices( vertices );
			const shape = new THREE.Shape( tempVertices );
			const shapeGeometry = new THREE.ShapeGeometry( shape );
			shapeGeometry.vertices = vertices;

			//console.log( "shapeGeometry", shapeGeometry );

			//const geo = new THREE.BufferGeometry();
			//const shapeBufferGeometry = geo.fromGeometry( shapeGeometry );
			//PHJ.geometriesShade.push( shapeBufferGeometry );

			PHJ.geometryShade.merge( shapeGeometry );

			PHJ.vertices.push( vertices );

		}

	}

	PHJ.bufferGeometry = new THREE.BufferGeometry().fromGeometry( PHJ.geometryShade);

	//PHJ.geometryShade = THREE.BufferGeometryUtils.mergeBufferGeometries( PHJ.geometriesShade );

};



PHJ.addShape3d = function ( vertices, holes, geometries ) {

	const tempVertices = PHJ.getTempVertices( vertices );
	const shape = new THREE.Shape( tempVertices );

	if ( holes.length ) {

		holes.forEach( hole => {

			shape.holes.push( hole.path );
			vertices = vertices.concat( hole.vertices.reverse() );
			//console.log( 'vertices', vertices );

		} );

	}

	const shapeGeometry = new THREE.ShapeGeometry( shape );
	shapeGeometry.vertices = vertices;
	//console.log( 'shapeGeometry', shapeGeometry );

	geometries.merge( shapeGeometry );

	PHJ.vertices.push( vertices );

};



PHJ.getTempVertices = function ( vertices ) {

	const triangle = new THREE.Triangle( vertices[ 2 ], vertices[ 1 ], vertices[ 0 ] );
	const normal = triangle.getNormal( new THREE.Vector3() );
	const baseNormal = new THREE.Vector3( 0, 0, 1 );
	const quaternion = new THREE.Quaternion().setFromUnitVectors( normal, baseNormal );

	const tempVertices = vertices.map( vertex => vertex.clone().applyQuaternion( quaternion ) );
	//console.log( 'tempVertices', tempVertices );

	return tempVertices;

};



PHJ.addMesh = function ( geometry, type = "Wall" ) {

	const material = new THREE.MeshPhongMaterial({ color: PHJ.colors[ type ], opacity: 0.9, side: THREE.DoubleSide, transparent: true, wireframe: false });

	bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry);
	const mesh = new THREE.Mesh( bufferGeometry, material);
	mesh.userData.type = type;
	mesh.name = type;

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	mesh.geometry.computeVertexNormals();
	mesh.geometry.computeFaceNormals();
	// mesh.geometry.computeBoundingBox();

	//mesh.updateMatrixWorld();

	THR.group.add(mesh);
	//grp2.add( mesh.clone() );
	//grp3.add( mesh.clone() );

};

