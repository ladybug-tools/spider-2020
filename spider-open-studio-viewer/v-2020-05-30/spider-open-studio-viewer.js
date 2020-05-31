
const version = "v-2020-05-30";


aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-template-viewer/";

description = document.head.querySelector( "[ name=description ]" ).content;


const path = "https://cdn.jsdelivr.net/gh/ladybug-tools/honeybee-viewer@master/sample-files/2020-04-17/";
let intersected;

function v3( x, y, z ){ return new THREE.Vector3( x, y, z ); }
function f3( x, y, z ){ return new THREE.Face3( x, y, z ); }


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
	
	FO.extension = ".osm";
	FO.callback = onLoadRAD;

	const urlOsmDefault = "../DaylightingJSONTestBuilding.osm";

	//FO.requestFile(urlOsmDefault, onLoadRAD );


	const target = window.self === window.top ? window : window.parent;

	target.location.hash = urlOsmDefault;

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	renderer.domElement.addEventListener( 'click', onDocumentMouseClick, false );
	//HRT.init();
	
};

