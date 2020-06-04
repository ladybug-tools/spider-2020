
const version = "v-2020-06-04";


aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-pollination-viewer/";

description = document.head.querySelector( "[ name=description ]" ).content;


const path = "https://cdn.jsdelivr.net/gh/ladybug-tools/honeybee-viewer@master/sample-files/2020-04-17/";

const files = [
    "My_Mother_In_Laws_House.json",
    "Lab_Complex.json",
    "Urban_Model_Dragonfly.json",
    "Urban_Model_Honeybee.json"
];




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

    FO.init();
	FO.extension = "json";
	FO.responseType = "json";
	FO.callback = PP.onLoadJson; 
	
	window.addEventListener( "onloadFRT", () => PP.onLoadJson( FO.string ) );
    
	//FOZ.init();

	const target = window.self === window.top ? window : window.parent;

	target.location.hash = path + files[ 1 ];
	
};