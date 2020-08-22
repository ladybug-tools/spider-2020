const source = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-pollination-viewer/";

const version = "v-2020-08-22";

const description = document.head.querySelector( "[ name=description ]" ).content;


const path = "https://cdn.jsdelivr.net/gh/ladybug-tools/3d-models@master/pollination/2020-05-05-sample-files/";

const files = [
    "My_Mother_In_Laws_House.json",
    "Lab_Complex.json",
    "Urban_Model_Dragonfly.json",
    "Urban_Model_Honeybee.json"
];


GFF.extension = ".json";

GFF.urlViewer = "../../spider-pollination-viewer/index.html";

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
		"pathRepo": "pollination/2020-05-05-sample-files/",
		"title": "3D Models sample files",
		"subTitle":
			`Files from the
		<a href="https://github.com/ladybug-tools/3d-models/" target="_blank">3D models</a>
		sample files repository on GitHub.`
	}
];



function init() {

	aGithub.href = source;

	spnVersion.innerHTML = version;

	divDescription.innerHTML = description;


	THR.init();

	THR.animate();

	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	THR.updateScene();

	THRR.updateScene();

	FOO.init();

	FOO.extension = "json";
	FOO.responseType = "json";
	FOO.onLoadFile = PP.onLoadJson;

	FOO.requestFile( path + files[ 1 ]);

	JTV.init();

};

JTV.onLoad = function () {

	THR.group = THR.setSceneNew();

	JTV.root = "Honeybee userData";


	if ( !JTV.JSON ) {

		JTV.json = FOO.string;

		//JTV.init()
		JTH.init();
		JTF.init();
		//JTE.init();

		JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, JTV.json, 0 );

	}

	const details = JTVdivJsonTree.querySelectorAll( "details" );

	details[ 0 ].open = true;

	details[ 1 ].open = true;

	//JTE.onLoad();


};



const MNU = {};

MNU.toggleDarkMode = function ( button ) {

	if ( butDark.innerHTML === "dark" ) {

		//root.style.backgroundColor = "#1e1f23";
		document.body.style.color = "#aaa";
		navMenu.style.backgroundColor = "#555";

		THR.scene.background = new THREE.Color( 0x222222 );
		THR.scene.fog.far = 999999;

		//const summaries = document.querySelectorAll(".summary-secondary");
		//console.log( "", summaries );

		Array.from( document.querySelectorAll( "a" ) )
			.forEach( a => a.style.color = "#ccc" );

		Array.from( document.querySelectorAll( "input,select,option" ) )
			.forEach( iso => iso.style.backgroundColor = "#bbb" );

		document.documentElement.style.setProperty( "--color-2-background", "#888" );
		Array.from( document.querySelectorAll( ".summary-primary" ) )
			.forEach( sum => sum.style.backgroundColor = "#888" );

		document.documentElement.style.setProperty( "--color-3-background", "#bbb" );
		Array.from( document.querySelectorAll( ".summary-secondary" ) )
			.forEach( sum => sum.style.backgroundColor = "#bbb" );


		divPopUp.style.backgroundColor = "#333";

		butDark.innerHTML = "light";

		return;

	}

	//root.style.backgroundColor = "#1e1f23";
	document.body.style.color = "teal";
	navMenu.style.backgroundColor = "#fafffa";

	THR.scene.background = new THREE.Color( 0xcce0ff );
	THR.scene.fog.far = THR.radius * 8;

	const summaries = document.querySelectorAll( ".summary-primary" );
	Array.from( summaries ).forEach( sum => sum.style.backgroundColor = "#eee" );

	divPopUp.style.backgroundColor = "#eee";

	butDark.innerHTML = "dark";

};
