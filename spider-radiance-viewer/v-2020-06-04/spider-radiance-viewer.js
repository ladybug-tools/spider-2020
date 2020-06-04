
const version = "v-2020-06-04";


aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-radiance-viewer/";

description = document.head.querySelector( "[ name=description ]" ).content;


GFF.items = [

	{
		"user": "ladybug-tools",
		"repo": "/spider-rad-resources",
		"pathRepo": "rad-sample-files/mostapha-sample-files/",
		"title": "RAD sample files",
		"subTitle":
			`Ladybug Tools / Spider
		<a href = "https://www.ladybug.tools/spider/#gbxml-sample-files/" target = "_blank" >sample files</a >
		on GitHub from a variety of sources`
	},
	{
		"user": "ladybug-tools",
		"repo": "/spider-rad-resources",
		"pathRepo": "rad-sample-files/gjward1/",
		"title": "gjward1 sample files",
		"subTitle":
			`Ladybug Tools / Spider
		<a href = "https://www.ladybug.tools/spider/#gbxml-sample-files/" target = "_blank" >sample files</a >
		on GitHub from a variety of sources`
	},
	{
		"user": "ladybug-tools",
		"repo": "/spider-rad-resources",
		"pathRepo": "rad-sample-files/office/furniture/",
		"title": "Office sample files",
		"subTitle":
			`Office 
		<a href = "https://www.ladybug.tools/spider/#gbxml-sample-files/" target = "_blank" >sample files</a >
		on GitHub from a variety of sources`
	},
	{
		"user": "ladybug-tools",
		"repo": "/spider-rad-resources",
		"pathRepo": "rad-sample-files/various-sources/",
		"title": "Various sources sample files",
		"subTitle":
			`Ladybug Tools / Spider
		<a href = "https://www.ladybug.tools/spider/#gbxml-sample-files/" target = "_blank" >sample files</a >
		on GitHub from a variety of sources`
	}

];

GFF.extension = ".rad"


function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	GFFdivGithubFoldersFiles.innerHTML = GFF.getMenuGithubFoldersFiles();

	THR.init();

	THR.animate();

}

THR.onLoad = function ( event ) {

	//console.log( 'event thr', event );

	THR.addLights();

	THR.addGround();

	THR.scene.remove( RAD.meshes, RAD.edges );

	THR.group = THR.setSceneNew();

	//THR.addMeshes()

    
    
	FO.init();
	FO.extension = ".rad";
	FO.callback = onLoadRAD;

	window.addEventListener( "onloadFRT", onLoadRAD, false );

	RAD.json = { 'surfaces': [], 'materials': [], 'other': [] };

	const urlRadDefault = "../DaylightingJSONTestBuilding.rad";
	
	const target = window.self === window.top ? window : window.parent;

	target.location.hash = target.location.hash ? target.location.hash : urlRadDefault ;

	FO.onHashChange();

	//HRT.init();
	
};

function onLoadRAD() {

	THR.scene.remove( RAD.meshes, RAD.edges );

	RAD.json = { 'surfaces': [], 'materials': [], 'other': [] };

	THR.group = THR.setSceneNew();


	//THR.updateGroup( THR.group );

	const json = RAD.addDataFile( FO.string );
	//console.log( 'json', json );
	//js = json

}