const version = "v-2020-06-13";

const description = document.head.querySelector("[ name=description ]").content;

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-idf-viewer/";

const path = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider-2020@master/spider-idf-viewer/idf-sample-files/";

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
	"test",
	"test-case-2020-06-08.zip",
	"test-case-2020-06-13.zip"

];

GFF.extension = ".idf";

GFF.items = [
	{
		user: "ladybug-tools",
		repo: "/spider-2020",
		pathRepo: "spider-idf-viewer/idf-sample-files/",
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

	THR.group = THR.setSceneNew(new THREE.Group());

	FOO.init();
	FOO.doNext = IDF.callback;

	//FOO.requestFile(path + "test-case-2020-06-08.zip");
	//FOO.requestFile(path + "test-case-2020-06-13.zip");


	//FOO.requestFile(path + files[ 10 ]);

	const target = window.self === window.top ? window : window.parent;

	if ( target.location.hash === "#README.md" ) { // we are in iframe and no 3D file called for
		
	 	FOO.requestFile( "https://www.ladybug.tools/spider-2020/spider-idf-viewer/idf-sample-files/test-case-2020-06-13.zip" ); 
	
	} else {

		 target.location.hash = target.location.hash ? target.location.hash : "https://www.ladybug.tools/spider-2020/spider-idf-viewer/idf-sample-files/test-case-2020-06-13.zip";
		 
		 FOO.onHashChange();

	}
}

function openAll() {

	THR.group = THR.setSceneNew(new THREE.Group());

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
	RAYdivMeshData.scrollIntoView();
};
