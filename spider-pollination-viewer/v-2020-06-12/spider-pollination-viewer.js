
const version = "v-2020-06-12";


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

	THR.init();
	THR.animate();

	THR.addLights();
	THR.addGround();

    FOO.init();
	FOO.extension = "json";
	FOO.responseType = "json";
	FOO.doNext = PP.onLoadJson; 

	FOO.requestFile( path + files[ 1 ]);
	
};

JTV.onLoad = function () {

	JTV.root = "Honeybee userData";
	JTV.json = FOO.string;
	
	//JTV.init()
	JTH.init();
	JTF.init();
	JTE.init();

	JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, JTV.json, 0 );

	const details = JTVdivJsonTree.querySelectorAll( "details" );

	details[ 0 ].open = true;

	details[ 1 ].open = true;

	JTE.onLoad();

};