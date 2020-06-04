
const version = "v-2020-06-04";


aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-radiance-viewer/";

description = document.head.querySelector( "[ name=description ]" ).content;





function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	THR.init();

	THR.animate();

}

THR.onLoad = function ( event ) {

	//console.log( 'event thr', event );

	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	//THR.addMeshes()

    //THR.updateGroup( THR.group );
    
	FO.init();
	FO.extension = ".rad";
	FO.callback = onLoadRAD;


	RAD.json = { 'surfaces': [], 'materials': [], 'other': [] };

	const urlRadDefault = "../DaylightingJSONTestBuilding.rad";
	
	const target = window.self === window.top ? window : window.parent;

	target.location.hash = target.location.hash ? target.location.hash : urlRadDefault ;

	FO.onHashChange();

	HRT.init();
	
};

function onLoadRAD() {

	const json = RAD.addDataFile( FO.string );
	//console.log( 'json', json );
	//js = json

}