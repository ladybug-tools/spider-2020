
const source = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-gbxml-viewer";

const version = "v-2020-09-16";

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


function init () {

	aGithub.href = source;

	spnVersion.innerHTML = version;

	divDescription.innerHTML = description;

	MASdivMenuAppSwitch.innerHTML = MAS.getAppSwitch();

	THR.init();

	THR.animate();

	THR.addLights();

	THR.addGround();


	FOO.init();

	if ( !location.hash ) {

		FOO.requestFile( files[ 14 ] );

	}

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

	detView.open = false;
	VTdivViewTypes.innerHTML = "";

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




THRR.getHtm = function ( intersected ) {

	// assume no JSON data yet - there's only the gbXML data to play with

	console.log( "intersected", intersected );

	divPopUp.hidden = false;
	divPopUp.innerHTML = "<p>Parsing gbXML data...</p><p>Try again when you see the 'loaded successfully' message";


	THRU.removeLines();

	const faceA = intersected.face.a;
	const faceB = intersected.face.b;
	const faceC = intersected.face.c;

	const obj = intersected.object;
	let objGeo = obj.geometry;
	//console.log( "objGeo", objGeo );

	objGeo = new THREE.Geometry().fromBufferGeometry( intersected.object.geometry );
	const vertexA = objGeo.vertices[ faceA ];
	//console.log( "vertexA", vertexA );

	//THRU.addTellTale().position.copy( vertexA );

	const verticesFace = [ vertexA, objGeo.vertices[ faceB ], objGeo.vertices[ faceC ], vertexA ];
	THRU.addLine( obj, verticesFace, 0xffff0000 );

	THRU.addLine( obj, objGeo.vertices, 0x000000 );

	const index = intersected.object.userData.index;
	const surfaceText = GBX.surfaces[ index ];

	const parser = new DOMParser();
	const surfaceXml = parser.parseFromString( surfaceText, "text/xml" );
	//console.log( "surfaceXml", surfaceXml );

	const surface = surfaceXml.firstChild; //[0].childNodes[0].nodeValue;
	//console.log( "surface", surface );

	const attributes = Array.from( surface.attributes ).map( att => `${ att.name }: ${ att.value } <br>` ).join( "" );

	//children = Array.from( surface.children ).map( child => `${ child.tagName }: ${ child.textContent }<br> ` ).join( "" );

	const id = Array.from( surface.getElementsByTagName( "CADObjectId" ) ).pop();

	THRR.getMeshData( index );

	const htm = `
	<div>
		Surface ${ index } attributes:<br> ${ attributes }

		${ id ? "CAD ID: " + id.textContent + "<br>" : "" }

	</div>`;

	// children:<br>${ children }<br>

	return htm;

};



THRR.getMeshData = function ( index ) {

	detNavMenu.open = true;
	detData.open = true;

	GBX.setSurfacesMetadata();

	//if ( !GBX.surfaceTypes ) { GBX.setSurfacesMetadata(); }

	const surface = GBX.surfaces[ index ];
	const mesh = GBX.meshes[ index ];

	const surfaceMeta = GBX.parseElement( surface );
	//console.log( "surfaceMeta", surfaceMeta );

	const space = GBX.spaces.find( space => space.includes( mesh.userData.spaceId ) );
	const spaceMeta = GBX.parseElement( space );

	const storey = GBX.storeys.find( storey => storey.includes( mesh.userData.storeyId ) );
	const storeyMeta = GBX.parseElement( storey );

	const zone = GBX.zones.find( zone => zone.includes( mesh.userData.zoneId ) );
	const zoneMeta = GBX.parseElement( zone );

	//console.log( "zm", zoneMeta );

	const htm = `
		<b>Surface attributes</b><br>${ surfaceMeta.attributesHtm }
		<br>
		<b>Surface elements</b><br>${ surfaceMeta.childrenHtm }
		<br>
		<b>Space attributes</b><br>${ spaceMeta.attributesHtm }
		<br>
		<b>Space elements</b><br>${ spaceMeta.childrenHtm }
		<br>
		<b>Storey attributes</b><br>${ storeyMeta.attributesHtm }
		<br>
		<b>Storey elements</b><br>${ storeyMeta.childrenHtm }
		<br>
		<b>Zone attributes</b><br>${ zoneMeta.attributesHtm }
		<br>
		<b>Zone elements</b><br>${ zoneMeta.childrenHtm }
		<br>
	`;

	THRRdivSurfaceData.scrollIntoView();

	THRRdivSurfaceData.innerHTML = htm;


};

