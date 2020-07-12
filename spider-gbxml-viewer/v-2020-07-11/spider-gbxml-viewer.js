
const source = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-gbxml-viewer";

const version = "v-2020-07-11";

const description = `
Online interactive <a href="https://www.gbxml.org" target="_blank">gbXML</a> in 3D viewer in your browser 
designed to be forked, hacked and remixed using the WebGL and the 
<a href="https://threejs.org" target="_blank">Three.js</a> JavaScript library
`;

//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/bilt-2019-template.zip";
//urlGbxml = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-fixed.xml";
//urlGbxml = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-down-road-utf16.xml";

//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/warwick-university-5k-surfaces.zip";
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/annapolis-md-single-family-residential-2016.xml"
//urlGbxml = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/pittsburg-airport.zip";
urlGbxml = "https://cdn.jsdelivr.net/gh/GreenBuildingXML/Sample-gbXML-Files@master/gbXML_TRK.xml";
//urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/aspen-co-resort-retail.xml";
//urlGbxml = "https://www.ladybug.tools/spider/gbxml-sample-files/samples-2/Berlin_Office_SAM2017.xml";
//urlGbxmlDefault = "https://GreenBuildingXML.github.io/Sample_gbXML_Files/ChapelHillOffice.xml"
//urlGbxml = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/samples-2/18141-M18.xml"


function init() {

	aGithub.href = source;

	spnVersion.innerHTML = version;

	divDescription.innerHTML = description;


	THR.init();
	
	THR.animate();

	THR.addLights();

	THR.addGround();

	
	FOO.init();

	if ( !location.hash ) {

		FOO.requestFile( urlGbxml ); 

	}


};



function toggleDarkMode( button ) {

	if ( butDark.innerHTML === "dark" ) {

		//root.style.backgroundColor = "#1e1f23";
		document.body.style.color = "#aaa";
		navMenu.style.backgroundColor = "#555";

		THR.scene.background = new THREE.Color(0x222222);
		THR.scene.fog.far = 999999; 

		//const summaries = document.querySelectorAll(".summary-secondary");
		//console.log( "", summaries );

		Array.from( document.querySelectorAll("a") )
		.forEach( a => a.style.color = "#ccc" );

		Array.from( document.querySelectorAll("input,select,option") )
		.forEach( iso => iso.style.backgroundColor = "#bbb" );

		document.documentElement.style.setProperty("--color-2-background", "#888");
		Array.from( document.querySelectorAll(".summary-primary") )
		.forEach( sum => sum.style.backgroundColor = "#888" );
		
		document.documentElement.style.setProperty("--color-3-background", "#bbb");
		Array.from( document.querySelectorAll(".summary-secondary") )
		.forEach( sum => sum.style.backgroundColor = "#bbb" );


		divPopUp.style.backgroundColor = "#333";

		butDark.innerHTML = "light";          

		return;

	} 

	//root.style.backgroundColor = "#1e1f23";
	document.body.style.color = "teal";
	navMenu.style.backgroundColor = "#fafffa";

	THR.scene.background = new THREE.Color(0xcce0ff);
	THR.scene.fog.far = THR.radius * 8;

	const summaries = document.querySelectorAll(".summary-primary");
	Array.from( summaries ).forEach( sum => sum.style.backgroundColor = "#eee" );

	divPopUp.style.backgroundColor = "#eee";

	butDark.innerHTML = "dark";

};


FOO.onLoadFile = function () {
	//console.log( "string", FOO.string );

	//divPopUp.hidden = true;

	addTellTale();

	THR.group = THR.setSceneNew( THR.group );
	THR.group.name = "GBXmeshGroup";

	THRU.setSceneNew( THRU.group );

	GBX.parseResponse();

	THR.updateScene( THR.group ); 

	THRR.updateScene();

	JTV.init();

};


THRR.getHtm = function ( intersected ) {

	// assume no JSON data yet - there's only the gbXML data to play with 

	//console.log( "intersected", intersected );

	const faceA = intersected.face.a;
	const faceB = intersected.face.b;
	const faceC = intersected.face.c;

	const objGeo = intersected.object.geometry;

	//console.log( "objGeo", objGeo );
	//objGeo = new THREE.Geometry().fromBufferGeometry( intersected.object.geometry );
	const vertexA = objGeo.vertices[ faceA ];
	//console.log( "vertexA", vertexA );

	tellTale.position.copy( vertexA );

	const vertices = [ vertexA, objGeo.vertices[ faceB ], objGeo.vertices[ faceC ], vertexA ];
	addLine( vertices );


	const index = intersected.object.userData.index;
	const surfaceText = GBX.surfaces[ index ];

	const parser = new DOMParser();
	const surfaceXml = parser.parseFromString( surfaceText,"text/xml");
	//console.log( "surfaceXml", surfaceXml );

	surface = surfaceXml.firstChild; //[0].childNodes[0].nodeValue;
	//console.log( "surface", surface );

	const atts = Array.from(surface.attributes ).map( att => `${ att.name }: ${ att.value } <br>` ).join( "");

	children = Array.from( surface.children ).map( child => `${ child.tagName }: ${ child.textContent }<br> `).join( "" )
	
	const id = Array.from( surface.getElementsByTagName( "CADObjectId") ).pop()


	const htm = `
	<div>
		Surface attributes:<br> ${ atts }

		${ id ? "CAD ID: " + id.textContent + "<br>" : ""}
		
		<button onclick=THRR.getMeshData(${ index }); >view full surface data</button> &nbsp; right-click: show||hide
	</div>`;

	// children:<br>${ children }<br>
	return htm;

};

THRR.getMeshData = function (index) {

	//JTV.onOpen();

	detNavMenu.open = true;
	detData.open = true;
	
	//console.log( "json", JTV.json );

	if ( JTV.json ) {

		summaries = Array.from( JTVdivJsonTree.querySelectorAll("summary") );
		campus = summaries.find( summary => summary.innerText.includes( "Campus 0"))
		//console.log( "campus", campus );
		campus.parentNode.open = true;
		
		detSurf = JTVdivJsonTree.querySelector("#JTVdetSurface");
		detSurf.open = true;

		panelsHtml = Array.from( detSurf.children).slice(1);
		panelsHtml.forEach( item => item.className = item.className.replace(" active", "") );
		panelsHtml[index].open = true;

		panelsHtml[index].scrollIntoView();
		panelsHtml[index].className += " active";
		Array.from( panelsHtml[index].children ).forEach( child => child.open = true );

	} else {

		// divPopUp.hidden = false;
		// divPopUp.innerHTML = "<p>Parsing gbXML data...</p><p>Try again when you see the 'loaded successfully' message</p>";

	}


};


let size = 1;
let line = new THREE.Line();
let tellTale;

function addTellTale( siz = 0.5 / size) { 

	const geometry = new THREE.BoxBufferGeometry( siz, siz, siz );
	const material = new THREE.MeshNormalMaterial();
	tellTale = new THREE.Mesh( geometry, material );
	scene.add( tellTale );

}


function addLine( vertices ) { // THRR-caster only

	scene.remove( line );
	const geometry = new THREE.Geometry();
	geometry.vertices = vertices;
	const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
	line = new THREE.Line( geometry, material );
	scene.add( line );

}

