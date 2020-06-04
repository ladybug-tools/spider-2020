/* global scene, response */


const PDJ = {};


PDJ.processJson = function ( json ) {

	PDJ.parseBuildings( json.buildings || [] );

	PDJ.parseStories( json.unique_stories || [] );

	PDJ.parseRoom2ds ( json.room_2ds || [] );

	PDJ.parseContextShades( json.context_shades || [] );

	PDJ.parseGeometry( json.geometry || [] );

	if ( json.type === "Room2D" ) PDJ.parseFloorBoundary( json || [] );

};



PDJ.parseBuildings = function ( buildings = [] ) {

	for ( let building of buildings ) {

		PDJ.parseStories( building.unique_stories )

	}

};



PDJ.parseStories = function ( unique_stories ) {

	for ( let story of unique_stories ) {

		PDJ.parseRoom2ds( story.room_2ds )

	}

};



PDJ.parseRoom2ds = function ( room_2ds ) {

	for ( let room of room_2ds ) {

		PDJ.parseFloorBoundary( room );

	}

};



PDJ.parseFloorBoundary = function ( floor ) {

	const vertices = floor.floor_boundary.map( pt => new THREE.Vector2( pt[ 0 ], pt[ 1 ] ) );
	//console.log( "verts", vertices );

	const shape = new THREE.Shape( vertices );

	const geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: floor.floor_to_ceiling_height } );
	geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0, floor.floor_height ) );

	const material = new THREE.MeshNormalMaterial( { opacity: 0.7, side: THREE.DoubleSide, transparent: true, wireframe: false } );
	//const material = new THREE.MeshPhongMaterial( { color: color, opacity: 0.9, side: THREE.DoubleSide, transparent: true, wireframe: false } );

	const mesh = new THREE.Mesh( geometry, material );

	PDJ.group.add( mesh );

};



PDJ.parseContextShades = function ( context_shades ) {

	PHJ.parseShades( context_shades );

};



PDJ.parseGeometry = function ( geometries ) {

	for ( let geometry of geometries ) {

		const vertices = geometry.boundary.map( point => new THREE.Vector3().fromArray( point ) );

		const tempVertices = PHJ.getTempVertices( vertices );
		const shape = new THREE.Shape( tempVertices );
		const shapeGeometry = new THREE.ShapeGeometry( shape );

		shapeGeometry.vertices = vertices;
		PHJ.geometryShade.merge( shapeGeometry );

		PHJ.vertices.push( vertices );

	}

	//console.log( "vertices", PHJ.vertices );

};
