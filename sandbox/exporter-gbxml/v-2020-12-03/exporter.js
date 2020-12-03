
const source = "https://github.com/theo-armour/2020/tree/master/lib-template-viewer/";

const version = "v-2020-11-26 slim";

//const description = document.head.querySelector( "[ name=description ]" ).content;

const description = `
Online interactive <a href="https://www.gbxml.org" target="_blank">gbXML</a> in 3D viewer in your browser
designed to be forked, hacked and remixed using the WebGL and the
<a href="https://threejs.org" target="_blank">Three.js</a> JavaScript library`;


files = [
	"https://cdn.jsdelivr.net/gh/ladybug-tools/3d-models@master/gbxml-sample-files/files-open-fast/annapolis-md-single-family-residential-2016.xml",
	"https://cdn.jsdelivr.net/gh/ladybug-tools/3d-models@master/gbxml-sample-files/files-open-fast/8-a.xml",
	"https://cdn.jsdelivr.net/gh/GreenBuildingXML/Sample-gbXML-Files@master/ConferenceCenter%20(Older).xml",
	"https://cdn.jsdelivr.net/gh/GreenBuildingXML/Sample-gbXML-Files@master/gbXML_TRK.xml",
	"https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/bilt-2019-template.zip",
	"https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-fixed.xml",
	"https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-down-road-utf16.xml",
	"https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/warwick-university-5k-surfaces.zip",
	"https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/annapolis-md-single-family-residential-2016.xml",
	"https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/pittsburg-airport.zip",
	"https://www.ladybug.tools/spider/gbxml-sample-files/aspen-co-resort-retail.xml",
	"https://www.ladybug.tools/spider/gbxml-sample-files/samples-2/Berlin_Office_SAM2017.xml",
	"https://GreenBuildingXML.github.io/Sample_gbXML_Files/ChapelHillOffice.xml",
	"https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/samples-2/18141-M18.xml",
	"https://www.ladybug.tools/3d-models/gbxml-sample-files/revit-sample-files/2020_rac_advanced_sample_project.xml"
];

//const urlDefault = "README.md";

function init () {

	aGithub.href = source;

	spnVersion.innerHTML = version;

	divDescription.innerHTML = description;


	THR.init();

	THR.animate();

	THR.addLights();

	THR.addGround();

	// THR.group = THR.setSceneNew();

	// THRU.addMeshes(100);

	// THRR.updateScene();

	FOO.init();

	if ( !location.hash ) {

		FOO.requestFile( files[ 14 ] );

	}

	HRT.init();

};




FOO.onLoadFile = function () {
	//console.log( "string", FOO.string );

	//timeStart = performance.now();

	divPopUp.hidden = false;
	divPopUp.innerHTML = FOO.messagePopUp;

	THR.group = THR.setSceneNew( THR.group );
	THR.group.name = "GBXmeshGroup";

	THRU.setSceneNew( THRU.group );

	GBX.init();

	THR.updateScene( THR.group );

	THRR.updateScene();

	//detView.open = false;
	//VTdivViewTypes.innerHTML = "";

};


function exportObj () {

	const script = document.head.appendChild( document.createElement( "script" ) );

	script.onload = () => {

		const exporter = new THREE.OBJExporter();
		const result = exporter.parse( THR.group );
		extension = "obj";
		//console.log( "obj result", result );
		txtArea.value = result;

	};

	script.src = "https://cdn.rawgit.com/mrdoob/three.js/r123/examples/js/exporters/OBJExporter.js";

}



function exportStl () {

	const script = document.head.appendChild( document.createElement( "script" ) );

	script.onload = () => {

		const exporter = new THREE.STLExporter();
		const result = exporter.parse( THR.group );
		extension = "stl";
		//console.log( "obj result", result );
		txtArea.value = result;

	};

	script.src = "https://cdn.rawgit.com/mrdoob/three.js/r123/examples/js/exporters/STLExporter.js";

}


function exportGltf () {

	const script = document.head.appendChild( document.createElement( "script" ) );

	script.onload = () => {

		const exporter = new THREE.GLTFExporter();
		const result = exporter.parse( THR.group, ( result ) => {
			output = JSON.stringify( result, null, 2 );
			txtArea.value = output;
			console.log( "result", output );
		} );
		extension = "gltf";
		//console.log( "obj result", result );

	};

	script.src = "https://cdn.rawgit.com/mrdoob/three.js/r123/examples/js/exporters/GLTFExporter.js";

}

function saveFile () {

	const blob = new Blob( [ txtArea.value ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = `hello-world-${ new Date().toISOString().slice( 0, 10 ) }.${ extension }`;
	a.click();
	a = null;

}



THRR.vvvgetHtm = function () {

	//console.log( "xxxx intersected", THRR.intersected );
	const mesh = THRR.intersected.object;

	const index = THR.group.children.indexOf( mesh );

	const item = FOO.string[ index ];

	//console.log( "item", item );

	const htm = `
	<div>
		index: ${ index }<br>
		identifier: ${ item.identifier }<br>
		year: ${ item.year } month: ${ item.month } day: ${ item.day }</br>
		hour: ${ item.hour } minute: ${ item.minute }</br>
		inside temperature: ${ item.surface_inside_face_temperature.toLocaleString() }</br>
		outside temperature: ${ item.surface_outside_face_temperature.toLocaleString() }</br>

	</div>`;

	return htm;
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
