
const version = "v-2020-05-29";


aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-template-viewer/";
//imgIcon.src = "assets/github-mark-32.png";

//sTitle.innerHTML = document.title; // ? document.title : location.href.split( '/' ).pop().slice( 0, - 5 ).replace( /-/g, ' ' );
//const version = document.head.querySelector( "[ name=version ]" );
///sVersion.innerHTML = version ? version.content : "";

description = document.head.querySelector( "[ name=description ]" ).content;


const path = "https://cdn.jsdelivr.net/gh/ladybug-tools/honeybee-viewer@master/sample-files/2020-04-17/";




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

	THR.addMeshes()

    THR.updateGroup( THR.group );
    
    FO.init();

	FOZ.init();

	const target = window.self === window.top ? window : window.parent;

	target.location.hash = "";

	HRT.init();
	
};