
const version = "v-2020-06-08";

const description = document.head.querySelector( "[ name=description ]" ).content;

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/sandbox/spider-idf-viewer/";

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
		"user": "ladybug-tools",
		"repo": "/spider-2020",
		"pathRepo": "sandbox/spider-idf-viewer/idf-sample-files/",
		"title": "DOE 2012 sample files",
		"subTitle":
			`Files from the
		<a href="https://www.energy.gov/eere/buildings/commercial-reference-buildings" target="_blank">DOE Sample Files</a>.`
	},
	{
		"user": "nrel",
		"repo": "/EnergyPlus",
		"pathRepo": "testfiles/",
		"branch": "develop",
		"title": "EnergyPlus sample files",
		"subTitle":
			`Files from the
		<a href="" target="_blank">NREL</a>
		repository on GitHub.`
	}


];

function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	FRdivMenuFileReader.innerHTML = FR.getMenuFileReader(); // also adds event listener

	GFFdivGithubFoldersFiles.innerHTML = GFF.getMenuGithubFoldersFiles();

	THR.init();
	THR.animate();
	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	//THR.addMeshes();

	FO.callback = IDF.callback;
	
	FR.onLoad = IDF.callback;

}

THR.onLoad = function ( event ) {

	//console.log( 'event thr', event );

	FO.init();
	
	FO.extension = ".idf";
	FO.responseType = "text";

	const target = window.self === window.top ? window : window.parent;

	//console.log( "hash", target.location.hash );

	if ( target.location.hash === "#README.md" ) { 
		
		FO.requestFile( path + files[ 2 ], IDF.callback ); 
	
	} else {

		target.location.hash = target.location.hash ? target.location.hash : path + files[ 2 ];

	}

	FO.onHashChange();

	//HRT.init();
	
};


function openAll() {

	THR.group = THR.setSceneNew( THR.group );

	count = 0;
	deltaX = -180;
	deltaY = 180;
	openFile( 0 );

}

FO.callback2 = () => {

	//const windows = IDF.parseType();
	//console.log( "windows", windows );
	THR.campus = new THREE.Group();

	THR.group.add( THR.campus );

	const walls = IDF.parseType();
	//console.log( "walls", walls );
	THR.campus.add( ... walls.lines, ... walls.meshes );

	THR.campus.position.x = count * 50 - 100;

	if ( count % 4 === 0 ) {
		deltaY -= 60;
		deltaX = -180;
	} else {
		deltaX +=80;

	}
	
	THR.campus.position.set( deltaX, deltaY, 0 );

	if ( count < files.length ) {

		openFile( count ++ );

	} else {

		RAY.intersectObjects = THR.group.children.flatMap( group => group.children.filter( child => child.type === "Mesh") );

	}

}

function openFile( index = 0 ) {

	FO.requestFile( path + files[ index ], FO.callback2  );

}

const IDF = {};


IDF.colors = {
	ceiling: 0xff8080,
	door: 0x00f0000,
	floor: 0x40b4ff,
	glassdoor: 0x8888ff,
	wall: 0xffb400,
	roof: 0x800000,
	window: 0x444444,
	undefined: 0x88888888
};

IDF.callback = function ( text ) {

	//console.log( "string", FO.string);
	//console.log( 'text',  text);

	THR.group = THR.setSceneNew( THR.group );

	FO.onProgress( text.length, "Load complete" );

	const surfaces = IDF.parseType();

	//const windows = IDF.parseType();
	if( ! surfaces ) { console.log( "no surfaces" );return; }
	THR.group.add( ... surfaces.lines, ... surfaces.meshes );

	THR.updateGroup( THR.group );

	RAY.intersectObjects = surfaces.meshes;
	
};


IDF.parseType = function() {

	IDF.surfaceTexts = FO.string.match( /Surface:Detailed[^]*?\r\n\r\n/gim );

	if ( ! IDF.surfaceTexts ) { 
		
		IDF.surfaceTexts = FO.string.match( /Surface:Detailed,[^]*?\n\n/gim );

		//console.log( "xxxx typeTxt", typeTxt );
	}
	//console.log( "IDF.surfaceTexts", IDF.surfaceTexts );

	if ( ! IDF.surfaceTexts ) {

		alert( "Do not see any 'Surface:Detailed' so nothing to draw" );
		return;

	}

	surfaceLines = IDF.surfaceTexts.map( txt => txt.trim().split( /[\r?\n]/g ) );

	const surfaceTypes = surfaceLines.map( lines => lines.find( line => line.endsWith( "Surface Type" ) ) );

	IDF.surfaceTypes = surfaceTypes.map( line => line.trim().split( ",").shift() );
	//console.log( "surfaceTypes", IDF.surfaceTypes );
	
	vertexLines = surfaceLines.map( lines => lines.filter( txt => txt.endsWith( "{m}" ) ) );
	//console.log( "vertexLines", vertexLines);

	// if ( !vertexLines.length ) {
	// 	alert("No surfaces data available in this file");
	// 	return;
	// }

	vertices = vertexLines.map( lines => lines.map( 
		line => {
			points = line.match( /\d(.*?)[,|;] /)
			if ( points ) {

				points = points[ 0 ]
				.replace( /[[,|;] /, "" ).split( "," ).map( itm => parseFloat( itm )); 
				
				return new THREE.Vector3().fromArray( points );	

			} else {

				alert("Surfaces data is not readable\n" + line);
				return new THREE.Vector3();
			}
		} ) 
	);
	//console.log( "vertices", vertices );

	const lines = vertices.map( ( vertices, index ) => IDF.drawLine( vertices, 0x000000  ) );

	const meshes = vertices.map( ( vertices, index ) => IDF.addShape3d( vertices, index )  );
	//console.log( "mesh", meshes );

	return { meshes, lines }


}



IDF.drawLine = function( vertices, color = "blue" ) {

	const geometry = new THREE.Geometry();
	geometry.vertices = vertices;
	const material = new THREE.LineBasicMaterial( { color: color } );
	const line = new THREE.LineLoop( geometry, material );

	return line;

};


IDF.addShape3d = function ( vertices, index = 0, holes = []) {

	type = IDF.surfaceTypes[ index ].toLowerCase();

	if ( !IDF.colors[ type ]) {

		console.log( "index", IDF.surfaceTypes[ index ] );
	}

	const tempVertices = IDF.getTempVertices( vertices );
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

	const material = new THREE.MeshPhongMaterial({ color: IDF.colors[ type ], side: 2 });
	mesh = new THREE.Mesh(shapeGeometry, material);
	data = mesh.userData;

	// if window then move
	// https://stackoverflow.com/questions/23139442/how-to-get-correct-values-for-normals-in-threejs

	data.fileName = FO.fileName;
	data.index = index;
	data.text = IDF.surfaceTexts[ index ];
	data.type = type;
	data.url = FO.url;
	
	//THR.ground.position.copy(position);
	return mesh;


};



IDF.getTempVertices = function ( vertices ) {

	const triangle = new THREE.Triangle( vertices[ 2 ], vertices[ 1 ], vertices[ 0 ] );
	const normal = triangle.getNormal( new THREE.Vector3() );
	const baseNormal = new THREE.Vector3( 0, 0, 1 );
	const quaternion = new THREE.Quaternion().setFromUnitVectors( normal, baseNormal );

	const tempVertices = vertices.map( vertex => vertex.clone().applyQuaternion( quaternion ) );
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
		file: ${ obj.userData.fileName }<br>
		type: ${ obj.userData.type }<br>
		id: ${index}<br>
		uuid: ${ obj.uuid}<br>
		<button onclick=RAY.getMeshData(); >view surface data</button>
	</div>`;

	return htm;
};


RAY.getMeshData = function () {
	detNavMenu.open = true;
	detData.open = true;

	obj = RAY.intersected.object;

	//const htm = JSON.stringify(mesh, null, "\t").replace(/[",]/g, "");
	data = obj.userData;
	htm = `
	File name: <p>${ data.fileName }</p>
	Parameters: <p>${ data.text }</p>
	`;

	RAYdivMeshData.innerHTML = htm;
};
