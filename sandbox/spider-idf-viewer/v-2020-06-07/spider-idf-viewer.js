
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

	target.location.hash = target.location.hash ? target.location.hash : path + files[ 1 ];

	FO.onHashChange();

	
	HRT.init();
	
};


const IDF = {};


IDF.callback = function ( text ) {

	console.log( 'text',  text);

	//FO.string = text;

	THR.group = THR.setSceneNew( THR.group );

	

	FO.onProgress( text.length, "Load complete" );

	//lines = FO.string.split( /[\r?\n]/g );


	IDF.parseType( "Walls", "red");

	IDF.parseType();

};


IDF.parseType = function( type = "WINDOWS & DOORS", color = "blue" ) {

	const regex = new RegExp( "\\*\\*\\*" + type  + "\\*\\*\\*[^]*?\\*\\*\\*", "gim" );

	typeTxt = FO.string.match( regex );

	typeLines = typeTxt[ 0 ].split( /[\r?\n]/g ).slice( 1, -1);

	//console.log( "typeLines", typeLines);

	surfaceTxts = typeTxt[ 0 ].match( /BuildingSurface:Detailed[^]*?\r\n\r\n/gim );

	//console.log( "surface", surfaceTxts );

	vertexTxts = typeTxt[ 0 ].match( /[3|4],(.*?)Number of Vertices[^]*?\r\n\r\n/gim );

	//console.log( "vertexTxts", vertexTxts );

	vertexLines = vertexTxts.map( txt => txt.trim().split( /[\r?\n]/g ).filter( txt => txt.endsWith( "{m}" ) ) );

	//console.log( "vertexLines", vertexLines);

	vertices = vertexLines.map( lines => lines.map( 
		line => {
			points = line.match( /\d(.*?)[,|;] /)[ 0 ].replace( /[[,|;] /, "" ).split( "," ).map( itm => parseFloat( itm )); 
			
			return new THREE.Vector3().fromArray( points );	
		} ) 
	);

	//console.log( "", vertices );

	lines = vertices.map( vertices => IDF.drawLine( vertices, color ) );

	THR.group.add( ... lines );


}



IDF.drawLine = function( vertices, color = "blue" ) {

	const geometry = new THREE.Geometry();
	geometry.vertices = vertices || [ v( -10, 0, 0 ),  v( 0, 10, -10 ), v( 10, 0, 0 ) ];
	const material = new THREE.LineBasicMaterial( { color: color } );
	line = new THREE.LineLoop( geometry, material );

	return line;

};

