
const version = "v-2020-06-04";
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
]

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
	FO.callback = onLoad;

	const target = window.self === window.top ? window : window.parent;

	//url = https://github.com/ladybug-tools/honeybee-energy/blob/master/tests/result/eplusout_hourly.sql

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


function onLoad( response ) {

	console.log( "response", response );

	database = new SQL.Database(new Uint8Array(response));

	tables = database.prepare("SELECT * FROM sqlite_master WHERE type='table' ORDER BY name");
	
	options = "";

	while (tables.step()) {

		var rowObj = tables.getAsObject();
		var name = rowObj.name;
		options += '<option value="' + name + '">' + name + '</option>';

	}
				
	selTable.innerHTML = options;

	h3FileName.innerHTML = FO.fileName;

	console.log( "tables", tables );

}

function doQuery() {

	name = selTable.value;

	let sel = database.prepare( "SELECT * FROM " + name );

	console.log( "sel", sel );

	htm = "";

	while (sel.step()) {

		var rowObj = sel.getAsObject();
		//var name = rowObj.name;

		//console.log( "rowObj", rowObj );
		htm += `<p>${ JSON.stringify( rowObj, null, "\t" ) }</p>`;

	}
				

	divPopUp.innerHTML = htm;
	
	if ( name === "Surfaces" ) { getSurfaces(); }
	//sel = database.prepare("SELECT COUNT(*) AS count FROM '" + name + "'");

	//count = sel.step() ? sel.getAsObject().count : -1;

	//spnCount.innerHTML = count;

}


function getSurfaces() {

	THR.group = THR.setSceneNew( THR.group );

	sel = database.prepare( "SELECT * FROM Surfaces");

	console.log( "sel", sel );

	htm = "";

	surfaceObjs = [];

	while (sel.step()) {

		const rowObj = sel.getAsObject();
		//var name = rowObj.name;

		surfaceObjs.push( rowObj );

	}
				
	//console.log( "surfaceObjs", surfaceObjs );

	

	surfaceObjs.forEach( ( obj, index ) => {


		const geometry = new THREE.PlaneGeometry( 1, 1 );
		geometry.applyMatrix4( new THREE.Matrix4().makeScale( obj.Width, obj.Height, 1 ) );
		geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( obj.Tilt * Math.PI / 180 ) );
		geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( obj.Azimuth * Math.PI / 180 ) );
		const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), side: 2, specular: 0xffffff });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.z = index - 50;
		mesh.receiveShadow = true;
		mesh.castShadow = true;

		THR.group.add( mesh );
		console.log( "obj",obj );

	});

	THR.updateGroup( THR.group );


}
