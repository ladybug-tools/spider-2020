
const version = "v-2020-06-08";
const description = document.head.querySelector( "[ name=description ]" ).content;

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-template-viewer/";


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

	TMP.drawEpw();

   THR.updateGroup( THR.group );
    
}

THR.onLoad = function ( event ) {

	//console.log( 'event thr', event );

	FO.init();
	
	FO.extension = ".md";
	FO.responseType = "text";

	const target = window.self === window.top ? window : window.parent;

	target.location.hash = target.location.hash ? target.location.hash : "README.md";

	FO.onHashChange();

	
	HRT.init();
	
};


FO.callback = function ( text ) {

	console.log( 'text',  text);

	FO.onProgress( text.length, "Load complete" );

};


const TMP = {}

TMP.drawEpw = function() {

	dx = 0
	dy = 0;
	i = 0;

	meshes = [];

	for ( let i = 0; i < 365; i++ ) {

			for ( let y = 0; y < 24; y++ ) {

				const mesh = THR.addMesh();



				mesh.position.set( 20 * i - 360, 20 * y - 120,  30 * Math.sin( i *  Math.PI / 30 ) + 20 * Math.sin( y *  Math.PI / 12 ) )

				meshes.push( mesh)
				 
			}

	}

	THR.group.add( ...meshes )

	//console.log( "meshes", ...meshes );
}
