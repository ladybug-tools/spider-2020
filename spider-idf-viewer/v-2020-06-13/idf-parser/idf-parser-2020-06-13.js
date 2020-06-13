// copyright 2020 Theo Armour. MIT license.


const IDF = {};

IDF.colors = {
	ceiling: 0xff8080,
	door: 0x00f0000,
	floor: 0x40b4ff,
	glassdoor: 0x8888ff,
	wall: 0xffb400,
	roof: 0x800000,
	window: 0x444444,
	undefined: 0x88888888,
};

IDF.callback = function () {
	//console.log( "string", FOO.string);

	detView.open = false;
	detData.open = false;

	THR.group = THR.setSceneNew(THR.group);

	FOO.onProgress(FOO.string.length, "Load complete");

	const surfaces = IDF.parseType();

	if (!surfaces) {
		console.log("no surfaces");
		return;
	}

	THR.group.add(...surfaces.lines, ...surfaces.meshes);

	THR.updateScene(THR.group);

	RAY.intersectObjects = surfaces.meshes;
};

IDF.parseType = function () {
	// IDF.surfaceTexts = FOO.string.match(/:Detailed[^]*?\r\n\r\n/gim);

	// if (!IDF.surfaceTexts) {
	// 	IDF.surfaceTexts = FOO.string.match(/:Detailed,[^]*?\n\n/gim);

	// 	//console.log( "xxxx typeTxt", typeTxt );
	// }
	// //console.log( "IDF.surfaceTexts", IDF.surfaceTexts );

	// if (!IDF.surfaceTexts) {
	// 	alert("Do not see any ':Detailed' so nothing to draw");
	// 	return;
	// }

    // surfaceLines = IDF.surfaceTexts.map(txt => txt.trim().split(/[\r?\n]/g));
    
    IDF.lines = FOO.string.split(/[\r?\n]/g);

	const types = IDF.lines.filter(line => line.endsWith("Surface Type") );
    const arr  = [ ...new Set( types ) ];
	IDF.surfaceTypes = arr.map(line => line.trim().split(",").shift());
    console.log( "surfaceTypes", IDF.surfaceTypes );
    
    surfaces = FOO.string.match( /Number of Vertices[^]*?\r\n\r\n/gim);

    if (!surfaces) {
	    surfaces = FOO.string.match(/Number of Vertice[^]*?\n\n/gim);

	// 	//console.log( "xxxx typeTxt", typeTxt );
	}

    console.log( "surfaces", surfaces );

    vertices = surfaces.map( surface => surface
        .split(/\n/g).slice( 1, -2 )
        .map( line => line.replace( /;/, "," )
            .split( ",")
            .slice( 0, 3 )
            .map( item => parseFloat( item ) )
            
           
        ).map( point => new THREE.Vector3().fromArray( point ) )
    );

    
    //vertices = points.map( point => new THREE.Vector3().fromArray( point ) );


	//vertexLines = IDF.lines.filter(txt => txt.includes("X,Y,Z ==> Vertex") || txt.includes("X,Y,Z Vertex") );
	console.log( "vertices", vertices);

	// // if ( !vertexLines.length ) {
	// // 	alert("No surfaces data available in this file");
	// // 	return;
	// // }

	// vertices = vertexLines.map(lines =>
	// 	lines.map(line => {
	// 		points = line.match(/\d(.*?)[,|;] /);
	// 		if (points) {
	// 			points = points[0]
	// 				.replace(/[[,|;] /, "")
	// 				.split(",")
	// 				.map(itm => parseFloat(itm));

	// 			if ( points.length === 3 ) {

	// 				return new THREE.Vector3().fromArray(points);

	// 			} else {
	// 				//alert("Ooops. Surfaces data is not readable\n" + line);

	// 				return new THREE.Vector3();
					
	// 			}
	// 		} else {
	// 			alert("Surfaces data is not readable\n" + line);
	// 			return new THREE.Vector3();
	// 		}
	// 	})
	// );
	// vertices = vertices.filter( vertex => vertex.length > 0 );
	// //console.log( "vertices", vertices );
	
	const lines = vertices.map((vertices, index) => IDF.drawLine(vertices, 0x000000));

	const meshes = vertices.map((vertices, index) => IDF.addShape3d(vertices, index));
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
	//type = IDF.surfaceTypes[index].toLowerCase();

	// if (!IDF.colors[type]) {
	// 	console.log("index", IDF.surfaceTypes[index]);
	// }

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
	shapeGeometry.vertices = vertices;
	//console.log( 'shapeGeometry', shapeGeometry );

	const material = new THREE.MeshPhongMaterial({ color: 0x888888, side: 2 });
	mesh = new THREE.Mesh(shapeGeometry, material);
	data = mesh.userData;
	data.fileName = FOO.fileName;
	data.index = index;
	//data.text = IDF.surfaceTexts[index];
	//data.type = type;
	data.url = FOO.url;

	//THR.ground.position.copy(position);
	return mesh;
};

IDF.getTempVertices = function (vertices) {
	const triangle = new THREE.Triangle(vertices[2], vertices[1], vertices[0]);
	const normal = triangle.getNormal(new THREE.Vector3());
	const baseNormal = new THREE.Vector3(0, 0, 1);
	const quaternion = new THREE.Quaternion().setFromUnitVectors(normal, baseNormal);

	const tempVertices = vertices.map(vertex => vertex.clone().applyQuaternion(quaternion));
	//console.log( 'tempVertices', tempVertices );

	return tempVertices;
};
