
const version = "v-2020-06-07";

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
		"title": "ancient sample files",
		"subTitle":
			`Files from the
		<a href="" target="_blank">??? Sample Files</a>
		repository on GitHub.`
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

	target.location.hash = target.location.hash ? target.location.hash : path + files[ 2 ];

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


	const walls = IDF.parseType( "Walls", "red");
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

		openFile( count ++ )
	}

}

function openFile( index = 0 ) {

	FO.requestFile( path + files[ index ], FO.callback2  );

}

const IDF = {};


IDF.colors = {
	Ceiling: 0xff8080,
	Door: 0x00f0000,
	Floor: 0x40b4ff,
	Wall: 0xffb400,
	Roof: 0x800000,
	Window: 0x444444,
	Undefined: 0x88888888,
};

IDF.callback = function ( text ) {

	//console.log( "string", FO.string);

	//console.log( 'text',  text);

	THR.group = THR.setSceneNew( THR.group );

	FO.onProgress( text.length, "Load complete" );

	const walls = IDF.parseType( "Walls", "red");

	//console.log( "walls", walls );

	//const windows = IDF.parseType();

	THR.group.add( ... walls.lines, ... walls.meshes );

	//THR.updateGroup( THR.group );

};


IDF.parseType = function( type = "WINDOWS & DOORS", color = "blue" ) {

	//console.log( "string", FO.string);

	//const regex = new RegExp( "\\*\\*\\*" + type  + "\\*\\*\\*[^]*?\\*\\*\\*", "gim" );

	//const typeTxt = FO.string.match( regex );

	//if ( ! typeTxt ){ return; }

	//console.log( "typeTxt", typeTxt );

	//typeLines = typeTxt[ 0 ].split( /[\r?\n]/g ).slice( 1, -1);

	//console.log( "typeLines", typeLines);
	//vertexTxts = typeTxt[ 0 ].match( /[3|4],(.*?)Number of Vertices[^]*?\r\n\r\n/gim );


	//console.log( "vertexTxts", vertexTxts );

	//vertexLines = vertexTxts.map( txt => txt.trim().split( /[\r?\n]/g ).filter( txt => txt.endsWith( "{m}" ) ) );

	
	//IDF.surfaceTxts = typeTxt[ 0 ].match( /Surface:Detailed[^]*?\r\n\r\n/gim );

	IDF.surfaceTxts = FO.string.match( /Surface:Detailed[^]*?\r\n\r\n/gim );

	if ( ! IDF.surfaceTxts ) { 
		
		IDF.surfaceTxts = FO.string.match( /Surface:Detailed,[^]*?\n\n/gim );

		//console.log( "xxxx typeTxt", typeTxt );
	}

	//console.log( "IDF.surfaceTxts", IDF.surfaceTxts );

	surfaceLines = IDF.surfaceTxts.map( txt => txt.trim().split( /[\r?\n]/g ) );

	surfaceTypes = surfaceLines.map( lines => lines.find( line => line.endsWith( "Surface Type" ) ) );

	IDF.surfaceTypes = surfaceTypes.map( line => line.trim().split( ",").shift() );

	//console.log( "surfaceTypes", surfaceTypes );
	
	// vertexLines = surfaceTxts.map( txt => 
	// 	txt.trim().split( /[\r?\n]/g ).filter( txt => txt.endsWith( "{m}" ) ) );
	
	vertexLines = surfaceLines.map( lines => lines.filter( txt => txt.endsWith( "{m}" ) ) );
	//console.log( "vertexLines", vertexLines);



	vertices = vertexLines.map( lines => lines.map( 
		line => {
			points = line.match( /\d(.*?)[,|;] /)[ 0 ].replace( /[[,|;] /, "" ).split( "," ).map( itm => parseFloat( itm )); 
			
			return new THREE.Vector3().fromArray( points );	
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
	geometry.vertices = vertices || [ v( -10, 0, 0 ),  v( 0, 10, -10 ), v( 10, 0, 0 ) ];
	const material = new THREE.LineBasicMaterial( { color: color } );
	line = new THREE.LineLoop( geometry, material );

	return line;

};


IDF.addShape3d = function ( vertices, index = 0, holes = []) {

	type = IDF.surfaceTypes[ index ];

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

	// if window then move
	// https://stackoverflow.com/questions/23139442/how-to-get-correct-values-for-normals-in-threejs

	mesh.userData.type = type;
	mesh.userData.index = index;

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


RAY.getMeshData = function (index) {
	detNavMenu.open = true;
	detData.open = true;

	const mesh = THR.group.children[index];

	//const htm = JSON.stringify(mesh, null, "\t").replace(/[",]/g, "");

	htm = IDF.surfaceTxts[ index ]

	RAYdivMeshData.innerText = htm;
};
