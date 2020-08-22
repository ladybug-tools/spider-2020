let size = 1;
let line = new THREE.Line();
let tellTale;

function addTellTale( siz = 0.5 / size) { 

	const geometry = new THREE.BoxBufferGeometry( siz, siz, siz );
	const material = new THREE.MeshNormalMaterial();
	tellTale = new THREE.Mesh( geometry, material );
	scene.add( tellTale );

}

const PP = {};




PP.onLoadJson = function () {

	json = FOO.string;

	addTellTale();

	//json = xhr.target.response
	//console.log( 'json', json);

	THR.group = THR.setSceneNew( THR.group );

	THRU.group = THRU.setSceneNew();

	scene.remove(PDJ.group);

	PDJ.group = new THREE.Group();

	scene.add( PDJ.group );

	JTV.init();

	VT.init();

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

		console.log( "No Dragonfly 3D data");  


	}

	PHJ.processJson(json);
	
	//console.log( "PHJ.vertices;", PHJ.vertices );

	const geometryLine = new THREE.BufferGeometry();

	// const positions = PHJ.vertices.flatMap( vertices =>

	// 	vertices.slice( 0, - 1 ).flatMap( ( v0, i ) => {

	// 		const v1 = vertices[ i + 1 ];
	// 		return [ v0.x, v0.y, v0.z, v1.x, v1.y, v1.z ];

	// 	} )

	// );

	// geometryLine.setAttribute( "position", new THREE.Float32BufferAttribute( positions, 3 ) );

	// const materialLine = new THREE.LineBasicMaterial( { color: 0x000ff } );

	// const line = new THREE.LineSegments( geometryLine, materialLine );

	//PDJ.group.add(line);
	//grp2.add( line.clone() );
	//grp3.add( line.clone() );

	const materialShades = new THREE.MeshPhongMaterial({ color: "darkgray", opacity: 0.9, side: THREE.DoubleSide, transparent: true, wireframe: false });
	meshShades = new THREE.Mesh( PHJ.bufferGeometry, materialShades);

	meshShades.castShadow = true;
	meshShades.receiveShadow = true;

	meshShades.geometry.computeVertexNormals();
	meshShades.geometry.computeFaceNormals();
	meshShades.geometry.computeBoundingBox();
	meshShades.name = meshShades.userData.type = "Shades";

	THR.group.add( meshShades );
	//grp2.add( meshShades.clone() );
	//grp3.add( meshShades.clone() );

	//const material = new THREE.MeshNormalMaterial( { opacity: 0.7, side: THREE.DoubleSide, transparent: true, wireframe: false } );
	//const material = new THREE.MeshPhongMaterial( { color: color, opacity: 0.9, side: THREE.DoubleSide, transparent: true, wireframe: false } );

	//PHJ.geometryFaces.vertices = PHJ.vertices;

	PHJ.addMesh( PHJ.Wall, "Wall" );
	PHJ.addMesh( PHJ.Floor, "Floor" );
	PHJ.addMesh( PHJ.RoofCeiling, "RoofCeiling" );
	PHJ.addMesh( PHJ.AirBoundary, "AirBoundary" );

	if ( PDJ.group.children.length > 1 ) {

		THR.zoomObjectBoundingSphere(PDJ.group);

	} else {

		THR.zoomObjectBoundingSphere(THR.group);

	}

	//console.log( "phj", THR.group.children );
	//THRR.intersectObjects = THR.group.children;

	//THRR.addMouseMove();

	THRR.updateScene();

	//divLog.innerHTML = `time to load: ${ ( ( performance.now() - timeStart ) / 1000).toLocaleString() } seconds`;

};




THRR.getHtm = function ( intersected ) {

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

	json = FOO.string;

	json.rooms.forEach( ( room, index ) => {

		room.userData = { index };

		for ( let face of room.faces ) {

			for ( let point of face.geometry.boundary ) {

				const checkNearest =

				Math.abs( vertexA.x - point[ 0 ] ) < 0.00001
				&& Math.abs( vertexA.y - point[ 1 ] ) < 0.00001
				&& Math.abs( vertexA.z - point[ 2 ] ) < 0.00001;

				thisRoom = checkNearest ? room : thisRoom;

			}
		 }
	} );

console.log( "thisRoom", thisRoom );

	// faceIndex: ${ intersected.faceIndex }<br>
	if ( thisRoom ) {

		htm = `
			name: ${ thisRoom.display_name }<br>
			type: ${ thisRoom.type }<br>
			construction set: ${ thisRoom.properties.energy.construction_set }<br>
			hvac: ${ thisRoom.properties.energy.hvac }<br>
			program type: ${ thisRoom.properties.energy.program_type }<br>
			<button onclick="THRR.showFind(${ thisRoom.userData.index })" >get room parameters</button>
		`;
		return htm;

	} else {

		return "";

	}

};


THRR.showFind = function (index) {
	detNavMenu.open = true;
	detData.open = true;

	JTH.toggleAll();

	const details = JTVdivJsonTree.querySelectorAll("details");

	details[0].open = true;

	details[1].open = true;

	panelsHtml = Array.from( details[ 1 ].children).slice(1);

	panelsHtml.forEach( item => item.className = item.className.replace(" active", "") );

	panelsHtml[index].open = true;

	panelsHtml[index].scrollIntoView();

	panelsHtml[index].className += " active";

};


function addLine( vertices ) { // THRR-caster only

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