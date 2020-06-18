// copyright 2020 Theo Armour. MIT license.


const IDF = {};

IDF.colors = {
	ceiling: 0xff8080,
	door: 0x00f0000,
	floor: 0x40b4ff,
	glassdoor: 0x8888ff,
	wall: 0xffb400,
	roof: 0x800000,
	roofceiling: 0xaa4444,
	shade: 0x888888,
	window: 0x444444,
	undefined: 0x00ff00,
};

IDF.callback = function () {
	//console.log( "string", FOO.string);

	ItoJ.init();

	detView.open = false;
	detData.open = false;

	THR.group = THR.setSceneNew();

	FOO.onProgress(FOO.string.length, "Load complete");

	const surfaces = IDF.parseType();

	if (!surfaces) {
		console.log("no surfaces");
		return;
	}

	THR.group.add(...surfaces.lines, ...surfaces.meshes);

	THR.updateScene(THR.group);

	RAY.intersectObjects = surfaces.meshes;

	IDF.addText( IDF.items[ 0 ], new THREE.Vector3( THR.axesHelper.position.x, THR.axesHelper.position.y + 5 * THR.radius, THR.axesHelper.position.z + 0.5 * THR.radius ) );
	VT.init();

};




IDF.addText = function( text = "Hello world!\n123", position = new THREE.Vector3() ) {

	textMesh = new troika_3d_text.TextMesh();
	//textMesh.font = "../../assets/Inconsolata-Regular.ttf";
	textMesh.text = text;
	textMesh.fontSize = 0.1 * THR.radius;
	textMesh.rotation.x = 0.5 * Math.PI;
	textMesh.position.copy( position );
	textMesh.castShadow = true;
	textMesh.color = "maroon";
	
	THR.group.add(textMesh);

	// be sure to call sync() after all properties are set to update the rendering:
	//textMesh.sync();

  }

IDF.parseType = function () {

	//console.log( "str", FOO.string );

	IDF.items = FOO.string.split(/\n\n/g);
	
	if ( IDF.items.length < 3 ) {
		
		IDF.items = FOO.string.split(/\r\n\r\n/g);

	}
	//console.log( "items", IDF.items );

	IDF.itemsSurfaces = IDF.items.filter( item => item.includes( "Number of Vertices" ) );

	let types = IDF.itemsSurfaces.map( item => item.match( /(.*?)!- Surface Type/ ) || [] ) 
	
	IDF.itemsTypes = types.map( typ => typ.length ? typ[ 1 ].split( "," ).shift().trim().toLowerCase() : "shade" ); 
	//console.log( "IDF.itemsTypes", IDF.itemsTypes);

	IDF.surfaceTypes = [ ...new Set( IDF.itemsTypes  ) ];
	//console.log( "surfaceTypes", IDF.surfaceTypes );

	const coordinates = IDF.itemsSurfaces.map( item => item
		.slice( item.indexOf( "Number of Vertices" ) + 18 ) )
		.map( item => item.replace( /!-(.*?)m}|;/gi, "") )
		.map( item => item.split( "," )
		.map( item => + item.trim() )
	);
	//console.log( "coordinates", coordinates[ 9 ] );

	vertices = coordinates.map( ( points, index ) => {

		const vectors = []

		for ( let i = 0; i < points.length; i++ ) {
			vectors.push( new THREE.Vector3( points[ i ++], points[ i ++], points[ i ] ) );
		}

		if ( vectors.length < 3) { console.log( "oops", index, points );}

		return vectors;

	} );
    
	const lines = vertices.map((vertices, index) => IDF.drawLine(vertices, ));

	const meshes = vertices.map((vertices, index) => 
		IDF.addShape3d(vertices, index ) );
	//console.log( "mesh", meshes );

	return { meshes, lines };
};

IDF.drawLine = function (vertices, color = "blue") {
	const geometry = new THREE.Geometry();
	geometry.vertices = vertices;
	const material = new THREE.LineBasicMaterial({ color: color });
	const line = new THREE.LineLoop(geometry, material);

	return line;
};

IDF.addShape3d = function (vertices, index = 0, holes = []) {

	const tempVertices = IDF.getTempVertices(vertices);
	const shape = new THREE.Shape(tempVertices);

	if (holes.length) {
		holes.forEach(hole => {
			shape.holes.push(hole.path);
			vertices = vertices.concat(hole.vertices.reverse());
			//console.log( 'vertices', vertices );
		});
	}

	const shapeGeometry = new THREE.ShapeGeometry(shape);
	shapeGeometry.vertices = vertices; // replace tempVertices with original vertices
	//console.log( 'shapeGeometry', shapeGeometry );

	const type = IDF.itemsTypes[ index ] ;
	//console.log( "type", type );
	const color = IDF.colors[ type ];
	//console.log( "color", color );
	const material = new THREE.MeshPhongMaterial({ color: color, side: 2, specular: 0xffffff  });
	mesh = new THREE.Mesh(shapeGeometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	data = mesh.userData;
	data.fileName = FOO.fileName;
	data.index = index;
	data.text = IDF.itemsSurfaces[index];
	data.type = IDF.itemsTypes[ index ]
	data.url = FOO.url;

	return mesh;
};

IDF.getTempVertices = function (vertices) {
	const triangle = new THREE.Triangle(vertices[2], vertices[1], vertices[0]);
	const normal = triangle.getNormal(new THREE.Vector3());
	const baseNormal = new THREE.Vector3(0, 0, 1);
	const quaternion = new THREE.Quaternion().setFromUnitVectors(normal, baseNormal);

	const tempVertices = vertices.map(vertex => vertex.clone().applyQuaternion(quaternion));

	return tempVertices;
};
