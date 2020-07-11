
const version = "v-2020-06-09";

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-template-viewer/";

const description = document.head.querySelector( "[ name=description ]" ).content;



function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	FRdivMenuFileReader.innerHTML = FR.getMenuFileReader(); // also adds event listener

	GFFdivGithubFoldersFiles.innerHTML = GFF.getMenuGithubFoldersFiles();

	THR.init();
	THR.animate();

	FO.init();
	
	FO.extension = ".md";
	FO.responseType = "text";

	const target = window.self === window.top ? window : window.parent;

	target.location.hash = target.location.hash ? target.location.hash : "README.md";

	FO.onHashChange();


	
};


THR.onLoad = function ( event ) {  // replaces default THR.onLoad

	console.log( 'event thr', event );

	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	//THR.addMeshes()

	//THR.updateGroup( THR.group );


};


FO.onLoad = function ( text ) { // replaces default FO.onload

	console.log( 'text',  text);

	FO.onProgress( text.length, "Load complete" );

};
