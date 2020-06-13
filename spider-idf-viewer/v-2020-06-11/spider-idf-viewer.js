const version = "v-2020-06-12";

const description = document.head.querySelector("[ name=description ]").content;

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-idf-viewer/";

const path = "../idf-sample-files/";

const files = [
	"RefBldgFullServiceRestaurantNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgHospitalNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgLargeHotelNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgLargeOfficeNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgMediumOfficeNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgMidriseApartmentNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgOutPatientNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgPrimarySchoolNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgQuickServiceRestaurantNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgSecondarySchoolNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgSmallHotelNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgSmallOfficeNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgStand-aloneRetailNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgStripMallNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgSuperMarketNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgWarehouseNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
];

GFF.extension = ".idf";

GFF.items = [
	{
		user: "ladybug-tools",
		repo: "/spider-2020",
		pathRepo: "sandbox/spider-idf-viewer/idf-sample-files/",
		title: "DOE 2012 sample files",
		subTitle: `Files from the
		<a href="https://www.energy.gov/eere/buildings/commercial-reference-buildings" target="_blank">DOE Sample Files</a>.`,
	},
	{
		user: "nrel",
		repo: "/EnergyPlus",
		pathRepo: "testfiles/",
		branch: "develop",
		title: "EnergyPlus sample files",
		subTitle: `Files from the
		<a href="" target="_blank">NREL</a>
		repository on GitHub.`,
	},
];

function init() {
	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	THR.init();
	THR.animate();

	THR.addLights();
	THR.addGround();

	THR.group = THR.setSceneNew();

	//THR.addMeshes();

	FOO.init();

	FOO.doNext = IDF.callback;

	FOO.requestFile(path + files[2]);
}

function openAll() {
	THR.group = THR.setSceneNew(THR.group);

	FOO.doNext = FOO.callback2;

	count = 0;
	deltaX = -180;
	deltaY = 180;
	openFile(0);
}

FOO.callback2 = () => {
	//const windows = IDF.parseType();
	//console.log( "windows", windows );
	THR.campus = new THREE.Group();

	THR.group.add(THR.campus);

	const walls = IDF.parseType();
	//console.log( "walls", walls );
	THR.campus.add(...walls.lines, ...walls.meshes);

	THR.campus.position.x = count * 50 - 100;

	if (count % 4 === 0) {
		deltaY -= 60;
		deltaX = -180;
	} else {
		deltaX += 80;
	}

	THR.campus.position.set(deltaX, deltaY, 0);

	if (count < files.length) {
		openFile(count++);
	} else {
		RAY.intersectObjects = THR.group.children.flatMap(group =>
			group.children.filter(child => child.type === "Mesh")
		);
	}
};

function openFile(index = 0) {
	FOO.requestFile(path + files[index] );
}

//////////

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

	//const windows = IDF.parseType();
	if (!surfaces) {
		console.log("no surfaces");
		return;
	}

	THR.group.add(...surfaces.lines, ...surfaces.meshes);

	THR.updateScene(THR.group);

	RAY.intersectObjects = surfaces.meshes;
};

IDF.parseType = function () {
	IDF.surfaceTexts = FOO.string.match(/:Detailed[^]*?\r\n\r\n/gim);

	if (!IDF.surfaceTexts) {
		IDF.surfaceTexts = FOO.string.match(/:Detailed,[^]*?\n\n/gim);

		//console.log( "xxxx typeTxt", typeTxt );
	}
	//console.log( "IDF.surfaceTexts", IDF.surfaceTexts );

	if (!IDF.surfaceTexts) {
		alert("Do not see any ':Detailed' so nothing to draw");
		return;
	}

	surfaceLines = IDF.surfaceTexts.map(txt => txt.trim().split(/[\r?\n]/g));

	const surfaceTypes = surfaceLines.map(lines => {
		line = lines.find(line => line.endsWith("Surface Type"));

		return line || "undefined";
	});
	//console.log( "surfaceTypes", surfaceTypes );

	IDF.surfaceTypes = surfaceTypes.map(line => line.trim().split(",").shift());
	//console.log( "surfaceTypes", IDF.surfaceTypes );

	vertexLines = surfaceLines.map(lines => lines.filter(txt => txt.endsWith("{m}") && txt.includes( "AUTO" ) === false ));
	//console.log( "vertexLines", vertexLines);

	// if ( !vertexLines.length ) {
	// 	alert("No surfaces data available in this file");
	// 	return;
	// }

	vertices = vertexLines.map(lines =>
		lines.map(line => {
			points = line.match(/\d(.*?)[,|;] /);
			if (points) {
				points = points[0]
					.replace(/[[,|;] /, "")
					.split(",")
					.map(itm => parseFloat(itm));

				if ( points.length === 3 ) {

					return new THREE.Vector3().fromArray(points);

				} else {
					//alert("Ooops. Surfaces data is not readable\n" + line);

					return new THREE.Vector3();
					
				}
			} else {
				alert("Surfaces data is not readable\n" + line);
				return new THREE.Vector3();
			}
		})
	);
	vertices = vertices.filter( vertex => vertex.length > 0 );
	//console.log( "vertices", vertices );
	
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
	type = IDF.surfaceTypes[index].toLowerCase();

	if (!IDF.colors[type]) {
		console.log("index", IDF.surfaceTypes[index]);
	}

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

	const material = new THREE.MeshPhongMaterial({ color: IDF.colors[type], side: 2 });
	mesh = new THREE.Mesh(shapeGeometry, material);
	data = mesh.userData;
	data.fileName = FOO.fileName;
	data.index = index;
	data.text = IDF.surfaceTexts[index];
	data.type = type;
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

//////////

RAY.getHtm = function (intersected) {
	console.log("intersected", RAY.intersected);

	const obj = RAY.intersected.object;
	const index = obj.userData.index;
	const mesh = THR.group.children[index];

	const htm = `
	<div>
		file: ${obj.userData.fileName}<br>
		type: ${obj.userData.type}<br>
		id: ${index}<br>
		uuid: ${obj.uuid}<br>
		<button onclick=RAY.getMeshData(); >view surface data</button>
	</div>`;

	return htm;
};

RAY.getMeshData = function () {
	detNavMenu.open = true;
	detData.open = true;

	const obj = RAY.intersected.object;

	const data = obj.userData;

	const lines = data.text
		.split(/\n/g)
		.map(line => line.split(/!-/))
		.filter(arr => arr.length > 1)
		.map(arr => `<b><sub>${arr[1]}:</sup></b><br>${arr.slice(0, -1)}<br>`)
		.join("");
	// console.log( "lines", lines );

	const htm = `
	<p><b><sub>File name:</b></sub><br>${data.fileName}<br>
	${lines}</p>
	`;

	RAYdivMeshData.innerHTML = htm;
};
