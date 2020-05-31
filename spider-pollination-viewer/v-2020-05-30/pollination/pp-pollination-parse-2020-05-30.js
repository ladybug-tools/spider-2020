
const PP = {};



PP.onLoadJson = function ( json ) {

	//json = xhr.target.response
	console.log( 'json', json);

	scene.remove(PHJ.group, PDJ.group);

	PHJ.group = new THREE.Group();

	PDJ.group = new THREE.Group();

	scene.add( PHJ.group, PDJ.group );

	// grp2 = new THREE.Group();
	// grp2.position.x = 500;
	// grp3 = new THREE.Group();
	// grp3.position.y = -500;
	// scene.add( grp2, grp3 );

	PHJ.vertices = [];

	PHJ.geometryShade = new THREE.Geometry();

	PHJ.geometryFaces = new THREE.Geometry();

	if ( ["Model", "Building", "Story", "Room2D", "ContextShade"].includes(json.type)) {

		PDJ.processJson(json);

	} else {

		alert( "no dragonfly 3D data");  

	}

	PHJ.processJson(json);

	// geometryLine = new THREE.Geometry();
	// geometryLine.vertices = PHJ.vertices.flatMap(vertex => vertex);
	// const materialLine = new THREE.LineBasicMaterial({ color: 0x000000 });
	// const line = new THREE.Line(geometryLine, materialLine);
	// PDJ.group.add(line);
	
	//console.log( "PHJ.vertices;", PHJ.vertices );

	const geometryLine = new THREE.BufferGeometry();

	const positions = PHJ.vertices.flatMap( vertices =>

		vertices.slice( 0, - 1 ).flatMap( ( v0, i ) => {

			const v1 = vertices[ i + 1 ];
			return [ v0.x, v0.y, v0.z, v1.x, v1.y, v1.z ];

		} )

	);

	geometryLine.setAttribute( "position", new THREE.Float32BufferAttribute( positions, 3 ) );

	const materialLine = new THREE.LineBasicMaterial( { color: 0x000ff } );

	const line = new THREE.LineSegments( geometryLine, materialLine );

	PDJ.group.add(line);
	//grp2.add( line.clone() );
	//grp3.add( line.clone() );




	const materialShades = new THREE.MeshPhongMaterial({ color: "darkgray", opacity: 0.9, side: THREE.DoubleSide, transparent: true, wireframe: false });
	meshShades = new THREE.Mesh( PHJ.bufferGeometry, materialShades);

	meshShades.castShadow = true;
	meshShades.receiveShadow = true;

	meshShades.geometry.computeVertexNormals();
	meshShades.geometry.computeFaceNormals();
	meshShades.geometry.computeBoundingBox();

	PHJ.group.add( meshShades );
	//grp2.add( meshShades.clone() );
	//grp3.add( meshShades.clone() );




	//const material = new THREE.MeshNormalMaterial( { opacity: 0.7, side: THREE.DoubleSide, transparent: true, wireframe: false } );
	//const material = new THREE.MeshPhongMaterial( { color: color, opacity: 0.9, side: THREE.DoubleSide, transparent: true, wireframe: false } );

	//PHJ.geometryFaces.vertices = PHJ.vertices;

	PHJ.addMesh( PHJ.Wall, "beige" );
	PHJ.addMesh( PHJ.Floor, "brown" );
	PHJ.addMesh( PHJ.RoofCeiling, "red" );
	PHJ.addMesh( PHJ.AirBoundary, "blue" );

	if ( PDJ.group.children.length > 1 ) {

		THR.zoomObjectBoundingSphere(PDJ.group);

	} else {

		THR.zoomObjectBoundingSphere(PHJ.group);

	}

	//console.log( "phj", PHJ.group.children );
	RAY.intersectObjects = PHJ.group.children;

	//divLog.innerHTML = `time to load: ${ ( ( performance.now() - timeStart ) / 1000).toLocaleString() } seconds`;

};




RAY.getHtm = function ( intersected ) {

	//scene.updateMatrixWorld();

	console.log( "intersected", intersected );

	faceA = intersected.face.a;
	faceB = intersected.face.b;
	faceC = intersected.face.c;

	//objGeo = intersected.object.geometry;
	objGeo = new THREE.Geometry().fromBufferGeometry( intersected.object.geometry );
	let vertexA = objGeo.vertices[ faceA ];

	tellTale.position.copy( vertexA );

	const vertices = [ vertexA, objGeo.vertices[ faceB ], objGeo.vertices[ faceC ], vertexA ];
	addLine( vertices );

	let thisRoom;

	for ( let room of json.rooms ) {

		for ( let face of room.faces ) {

			for ( let point of face.geometry.boundary ) {

				const checkNearest =

				Math.abs( vertexA.x - point[ 0 ] ) < 0.00001
				&& Math.abs( vertexA.y - point[ 1 ] ) < 0.00001
				&& Math.abs( vertexA.z - point[ 2 ] ) < 0.00001;

				thisRoom = checkNearest ? room : thisRoom;

			}
		 }
	}

	//console.log( "thisRoom", thisRoom );

	// faceIndex: ${ intersected.faceIndex }<br>
	if ( thisRoom ) {

		htm = `
			name: ${ thisRoom.display_name }<br>
			type: ${ thisRoom.type }<br>
			construction set: ${ thisRoom.properties.energy.construction_set }<br>
			hvac: ${ thisRoom.properties.energy.hvac }<br>
			program type: ${ thisRoom.properties.energy.program_type }<br>
		`;
		return htm;

	} else {

		return "";

	}



};



function addLine( vertices ) { // ray-caster only

	scene.remove( line );
	const geometry = new THREE.Geometry();
	geometry.vertices = vertices;
	const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
	line = new THREE.Line( geometry, material );
	scene.add( line );

}



function addTellTale( siz = 0.5 / size) { 

	const geometry = new THREE.BoxBufferGeometry( siz, siz, siz );
	const material = new THREE.MeshNormalMaterial();
	tellTale = new THREE.Mesh( geometry, material );
	scene.add( tellTale );

}