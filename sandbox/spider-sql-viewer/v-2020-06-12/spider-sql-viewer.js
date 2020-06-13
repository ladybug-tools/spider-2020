
const version = "v-2020-06-05";

const description = document.head.querySelector( "[ name=description ]" ).content;

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/sandbox/sqllite-threejs/";


GFF.extension = ".sql";

GFF.items = [
	{
		"user": "ladybug-tools",
		"repo": "/honeybee-energy",
		"pathRepo": "tests/result/",
		"title": "Honeybee Energy example files",
		"subTitle":
			`Files from the
		<a href="https://github.com/ladybug-tools/honeybee-energy/tree/master/tests/result" target="_blank"> Example Files</a>
		repository on GitHub.`
	}
];

function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	GFFdivGithubFoldersFiles.innerHTML = GFF.getMenuGithubFoldersFiles();

	THR.init();
	THR.animate();
	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	THR.addMeshes();


    THR.updateGroup( THR.group );
    
}

THR.onLoad = function ( event ) {

	//console.log( 'event thr', event );

	FO.init();
	
	FO.extension = ".sql";
	FO.responseType = "arraybuffer";
	FO.callback = SSQL.onLoad;

	const target = window.self === window.top ? window : window.parent;

	path = "https://cdn.jsdelivr.net/gh/ladybug-tools/honeybee-energy@master/tests/result/";
	
	file = "eplusout_hourly.sql";

	target.location.hash = target.location.hash ? target.location.hash : path + file;

	FO.onHashChange();

	window.addEventListener( "onloadFRT", FO.callback, false );
	
	//HRT.init();
	
};


FO.callback = function ( text ) {

	console.log( 'text',  text);

	FO.onProgress( text.length, "Load complete" );

};

const SSQL = {};


SSQL.onLoad = function( response ) {

	//console.log( "response", response );

	SSQL.database = new SQL.Database(new Uint8Array(response));

	SSQL.tables = SSQL.database.prepare("SELECT * FROM sqlite_master WHERE type='table' ORDER BY name");
	
	let options = "";

	while ( SSQL.tables.step()) {

		const rowObj = SSQL.tables.getAsObject();
		//console.log( "", rowObj );

		const name = rowObj.name;
		const count = SSQL.getCount( name );

		options += `<option value="${ name }"> ${ name } - ${ count }</option>`;

	}
				
	selTable.innerHTML = options;

	h3FileName.innerHTML = FO.fileName;

	console.log( "tables", SSQL.tables );

	SSQL.getDictionary();

};

SSQL.getCount = function( name ) {

	//console.log( "name", name );

	const sel = SSQL.database.prepare("SELECT COUNT(*) AS count FROM '" + name + "'");

	const count = sel.step() ? sel.getAsObject().count : -1;
	//console.log( "", count );

	return count;

}

SSQL.getDictionary = function() {

	let sel = SSQL.database.prepare( "SELECT * FROM ReportDataDictionary" );

	// console.log( "sel", sel );

	SSQL.dict = [];
	let count = 0;

	while (sel.step()) {

		const rowObj = sel.getAsObject();
		//console.log( "rowObj", rowObj );
		const Name = rowObj.Name;
		ReportDataDictionaryIndex = rowObj.ReportDataDictionaryIndex;
		const KeyValue = rowObj.KeyValue;

		SSQL.dict.push( { ReportDataDictionaryIndex, KeyValue,  Name } );

	}

	console.log( "", SSQL.dict );
}

SSQL.getSelect = function( name = "Surfaces" ) {

	let sel = SSQL.database.prepare( "SELECT * FROM " + name );

	// console.log( "sel", sel );

	let htm = "";
	let count = 0;

	while (sel.step()) {

		var rowObj = sel.getAsObject();
		//console.log( "rowObj", rowObj );
		//var name = rowObj.name;

		htm += `<p>${ ( count ++ ) + 1 } ${ JSON.stringify( rowObj, null, "\t" ) }</p>`;

	}
	
	divPopUp.style.maxHeight = "90vh";
	divPopUp.style.resize = "both";
	divPopUp.style.top = "5ch";
	divPopUp.style.left = "40ch";
	divPopUp.innerHTML = htm;
	divPopUp.hidden = false;
	
	if ( name === "Surfaces" ) { SSQL.drawSurfaces(); }
	if ( name === "Zones" ) { SSQL.drawZones(); }
	if ( name === "ReportData" ) { SSQL.drawReportData();}



}

SSQL.drawReportData = function() {

	THR.group = THR.setSceneNew( THR.group );

	THR.scene.fog.far = 5000;

	THR.camera.position.set( 500, 500, 500 )

	const sel = SSQL.database.prepare( "SELECT * FROM ReportData");

	console.log( "sel", sel );

	let htm = "";

	SSQL.reportObjs = [];

	while (sel.step()) {

		const rowObj = sel.getAsObject();
		//var name = rowObj.name;

		SSQL.reportObjs.push( rowObj );

	}				
	console.log( "reportObjs", SSQL.reportObjs );

	let reports = [];

	for ( let index = 0; index < 56; index ++ ) {

		const report = [];

		for( let timeIndex = 0; timeIndex < 168; timeIndex ++ ) {

			report.push( SSQL.reportObjs[ 56 * timeIndex + index].Value )

		}

		drawItems( report, index  );

		reports.push( report);

	}

	//console.log( "reports", reports );

	
	reportNamesIndexes = SSQL.reportObjs.slice( 0, 56 ).map( obj => obj.ReportDataDictionaryIndex );

	SSQL.reportTitles = reportNamesIndexes.map( index => SSQL.dict.find( item => index === item.ReportDataDictionaryIndex ))

	console.log( "reportTitles", SSQL.reportTitles);

	for ( let i = 0; i < SSQL.reportTitles.length; i++ ) {
		addText( SSQL.reportTitles[ i ].Name , new THREE.Vector3( 80, i * 15 - 200, 20 ) );
	}

};


function addText( text = "Hello world!\n123", position = new THREE.Vector3() ) {

	textMesh = new troika_3d_text.TextMesh();

	THR.scene.add(textMesh);

	// set properties to configure:
	textMesh.text = text;
	textMesh.fontSize = 20;
	textMesh.rotation.x = 0.5 * Math.PI;
	textMesh.position.copy( position )
	textMesh.color = 0xffffff * Math.random()

	// be sure to call sync() after all properties are set to update the rendering:
	//textMesh.sync();

  }


function drawItems( items, index  ) {

	//console.log( "items", items );
	const min = Math.min( ... items );

	const max = Math.max( ... items );

	//console.log( "", min );

	const scale = 1; // index % 2 === 0 ? 2: 0.5;

	const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), specular: 0xffffff });

	count = 0;

	meshes = items.slice( 1 ).map( (item, x ) => {

		const geometry = new THREE.BoxGeometry( 1, 10, scale * 40 *  ( item - min ) / ( max - min ));

		//const material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh(geometry, material);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.userData.index = count ++;

		mesh.position.set( x - 100, index * 15 - 200, scale * 20 * ( item - min ) / ( max - min ));
 
		return mesh;
		
	} );

	THR.group.add( ... meshes );
	
} 

SSQL.drawSurfaces = function() {

	THR.group = THR.setSceneNew( THR.group );

	const sel = SSQL.database.prepare( "SELECT * FROM Surfaces");

	console.log( "sel", sel );

	let htm = "";

	SSQL.surfaceObjs = [];

	while (sel.step()) {

		const rowObj = sel.getAsObject();
		//var name = rowObj.name;

		SSQL.surfaceObjs.push( rowObj );

	}				
	//console.log( "surfaceObjs", SSQL.surfaceObjs );

	SSQL.surfaceObjs.forEach( ( obj, index ) => {

		const geometry = new THREE.PlaneGeometry( 1, 1 );
		geometry.applyMatrix4( new THREE.Matrix4().makeScale( obj.Width, obj.Height, 1 ) );
		geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( obj.Tilt * Math.PI / 180 ) );
		geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( obj.Azimuth * Math.PI / 180 ) );
		const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), side: 2, specular: 0xffffff });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.z = index - 50;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.userData.index = index;
		mesh.userData.name = "Surfaces";

		THR.group.add( mesh );
		console.log( "obj",obj );

	});

	THR.updateGroup( THR.group );

};

SSQL.drawZones = function() {

	THR.group = THR.setSceneNew( THR.group );

	const sel = SSQL.database.prepare( "SELECT * FROM Zones");

	console.log( "sel", sel );

	let htm = "";

	SSQL.zoneObjs = [];

	while (sel.step()) {

		const rowObj = sel.getAsObject();
		//var name = rowObj.name;

		SSQL.zoneObjs.push( rowObj );

	}				
	//console.log( "surfaceObjs", surfaceObjs );

	SSQL.zoneObjs.forEach( ( obj, index ) => {

		const x = obj.MaximumX - obj.MinimumX;
		const y = obj.MaximumY - obj.MinimumY;
		const z = obj.MaximumZ - obj.MinimumZ;

		const geometry = new THREE.BoxGeometry( x, y, z);
		//geometry.applyMatrix4( new THREE.Matrix4().makeScale( obj.Width, obj.Height, 1 ) );
		//geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( obj.Tilt * Math.PI / 180 ) );
		//geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( obj.Azimuth * Math.PI / 180 ) );
		const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), side: 2, specular: 0xffffff });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set( obj.CentroidX, obj.CentroidY, obj.CentroidZ )
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.userData.index = index;
		mesh.userData.name = "Zones";

		THR.group.add( mesh );
		console.log( "obj",obj );

	});

	THR.updateGroup( THR.group );

};


RAY.getHtm = function (intersected) {
	console.log("intersected", RAY.intersected);
	const index = RAY.intersected.object.userData.index;
	const name = RAY.intersected.object.userData.name || "mesh";

	if ( name === "mesh" ) { 
		
		const htm = `
		<div>
			id: ${index}<br>
			uuid: ${mesh.uuid}<br>
			<button onclick=RAY.getMeshData("${name}",${index}); >view mesh data</button>

		</div>`;
	
		return htm;
	}

	if ( name === "Surfaces" ) {
		const surface = SSQL.surfaceObjs[ index ];

		const htm = `
		<div>
			SurfaceIndex: ${surface.SurfaceIndex }<br>
			SurfaceName: ${ surface.SurfaceName}<br>
			<button onclick=RAY.getMeshData("${name}",${index}); >view surface data</button>

		</div>`;
	
		return htm;

	}

	if ( name === "Zones" ) {
		const zone = SSQL.zoneObjs[ index ];

		const htm = `
		<div>
			ZoneIndex: ${zone.ZoneIndex }<br>
			ZoneName: ${ zone.ZoneName}<br>
			<button onclick=RAY.getMeshData("${name}",${index}); >view zone data</button>
		</div>`;
	
		return htm;

	}


};

RAY.getMeshData = function (name, index) {
	console.log( "name",name, index );
	detNavMenu.open = true;
	detData.open = true;
	let htm;

	if ( name === "mesh") {

		const mesh = THR.group.children[index];

		htm = JSON.stringify(mesh, null, "\t").replace(/[",]/g, "");

	}
	if ( name === "Surfaces") {

		const surface = SSQL.surfaceObjs[ index ];

		htm = JSON.stringify(surface, null, "\t").replace(/[",]/g, "");

	}
	if ( name === "Zones") {

		const zone = SSQL.zoneObjs[ index ];

		htm = JSON.stringify(zone, null, "\t").replace(/[",]/g, "");

	}

	RAYdivMeshData.innerText = htm;
};
