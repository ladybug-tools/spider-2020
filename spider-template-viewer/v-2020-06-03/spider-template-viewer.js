
const version = "v-2020-06-03";
const description = document.head.querySelector( "[ name=description ]" ).content;

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-template-viewer/";




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
	
	FO.extension = ".md";
	FO.responseType = "text";

	window.addEventListener( "onloadFRT", FO.callback, false );
	
	const target = window.self === window.top ? window : window.parent;

	target.location.hash = target.location.hash ? target.location.hash : "README.md";

	FO.onHashChange();


	HRT.init();
	
};


FO.callback = function ( text ) {

	console.log( 'text',  text);

	FO.onProgress( text.length, "Load complete" );

};
