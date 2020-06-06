
const version = "v-2020-06-03";
const description = document.head.querySelector( "[ name=description ]" ).content;

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/sandbox/csv-threejs/";


count = 0;

function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	GFFdivGithubFoldersFiles.innerHTML = GFF.getMenuGithubFoldersFiles();

	THR.init();
	THR.animate();
	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	//THR.addMeshes();

    //THR.updateGroup( THR.group );
    
}

THR.onLoad = function ( event ) {

	//console.log( 'event thr', event );

	FO.init();
	
	FO.extension = ".csv";
	FO.responseType = "text";

	const target = window.self === window.top ? window : window.parent;

	url = "https://raw.githubusercontent.com/ladybug-tools/honeybee-energy/master/tests/result/epluszsz.csv"

	target.location.hash = target.location.hash ? target.location.hash : url;
	FO.onHashChange();

	window.addEventListener( "onloadFRT", FO.callback, false );
	
	HRT.init();
	
};


FO.callback = function ( text ) {

	lines = text.split(/\r?\n/).map( txt => txt.split( "," ));

	//console.log( 'lines',  lines);

	parseLines ();

	FO.onProgress( text.length, "Load complete" );

	lineText = lines[ 0 ];

	for ( let i = 0; i < lineText.length; i++ ) {
		addText( lineText[ i ], new THREE.Vector3( 50, i * 15 - 200, 100 ) );
	}


	

};

function parseLines () {

	for ( let j = 1; j < 29; j++ ) {

		items = [];

		for ( let i = 1; i < 146; i++ ) {

			const item = lines[ i ][ j ];

			items.push( Number( item ) );
			
		}
		
		//console.log( "items", items );

		drawItems( items, j );

	}

	//THR.updateGroup( THR.group );

	RAY.intersectObjects = THR.group.children;

	RAY.addMouseMove();
}


function drawItems( items, index  ) {

	//console.log( "items", items );
	const min = Math.min( ... items );

	const max = Math.max( ... items );

	//console.log( "", min );

	const scale = index % 2 === 0 ? 2: 0.5;

	const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), specular: 0xffffff });

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

function addText( text = "Hello world!\n123", position = new THREE.Vector3() ) {

	textMesh = new troika_3d_text.TextMesh();

	THR.scene.add(textMesh);

	// set properties to configure:
	textMesh.text = text;
	textMesh.fontSize = 50;
	textMesh.rotation.x = 0.5 * Math.PI;
	textMesh.position.copy( position )
	textMesh.color = 0xffffff * Math.random()

	// be sure to call sync() after all properties are set to update the rendering:
	//textMesh.sync();

  }

  RAY.getMeshData = function (index) {
	detNavMenu.open = true;
	detData.open = true;

	const mesh = THR.group.children[index];

	const htm = JSON.stringify(mesh, null, "\t").replace(/[",]/g, "");

	RAYdivMeshData.innerText = htm;
};