
const version = "v-2020-05-29";


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

	RAD.json = { 'surfaces': [], 'materials': [], 'other': [] };

	const urlRadDefault = "../DaylightingJSONTestBuilding.rad";

	FO.requestFile(urlRadDefault, onLoadRAD );

	HRT.init();
	
};

function onLoadRAD( xhr ) {

	text = xhr.target.response;

	//console.log( "text", text );

	


	const json = RAD.addDataFile( text );
	console.log( 'json', json );
	js = json



}