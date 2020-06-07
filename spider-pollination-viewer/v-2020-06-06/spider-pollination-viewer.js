
const version = "v-2020-06-06";


aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-pollination-viewer/";

description = document.head.querySelector( "[ name=description ]" ).content;


const path = "https://cdn.jsdelivr.net/gh/ladybug-tools/3d-models@master/pollination/2020-05-05-sample-files/";

const files = [
    "My_Mother_In_Laws_House.json",
    "Lab_Complex.json",
    "Urban_Model_Dragonfly.json",
    "Urban_Model_Honeybee.json"
];


GFF.extension = ".json";

GFF.items = [
	{
		"user": "ladybug-tools",
		"repo": "/honeybee-schema",
		"pathRepo": "samples/model/",
		"title": "Honeybee sample files",
		"subTitle":
			`Files from the
		<a href="https://github.com/ladybug-tools/honeybee-schema" target="_blank">Honeybee sample files</a>
		repository on GitHub.`
	},
	{
		"user": "ladybug-tools",
		"repo": "/dragonfly-schema",
		"pathRepo": "samples/",
		"title": "Dragonfly sample files",
		"subTitle":
			`Files from the
		<a href="https://github.com/ladybug-tools/dragonfly-schema" target="_blank">Dragonfly sample files</a>
		repository on GitHub.`
	},
	{
		"user": "ladybug-tools",
		"repo": "/3d-models",
		"pathRepo": "pollination/2020-05-05-sample-files//",
		"title": "3D Models sample files",
		"subTitle":
			`Files from the
		<a href="https://github.com/ladybug-tools/3d-models/" target="_blank">3D models</a>
		sample files repository on GitHub.`
	}
];



function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;
	
	FRdivMenuFileReader.innerHTML = FR.getMenuFileReader(); // also adds event listener

	GFFdivGithubFoldersFiles.innerHTML = GFF.getMenuGithubFoldersFiles();

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

	FR.onLoad = PP.onLoadJson; 
    
	//FOZ.init();


	const target = window.self === window.top ? window : window.parent;

	//target.location.hash = path + files[ 1 ];

	target.location.hash = target.location.hash ? target.location.hash : path + files[ 1 ];

	FO.onHashChange();
	
};