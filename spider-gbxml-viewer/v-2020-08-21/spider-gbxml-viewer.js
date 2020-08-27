
const source = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-gbxml-viewer";

const version = "v-2020-08-21";

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
	"https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/samples-2/18141-M18.xml"
];


function init() {

	aGithub.href = source;

	spnVersion.innerHTML = version;

	divDescription.innerHTML = description;

	MASdivMenuAppSwitch.innerHTML=MAS.getAppSwitch()

	THR.init();

	THR.animate();

	THR.addLights();

	THR.addGround();


	FOO.init();

	if ( !location.hash ) {

		FOO.requestFile( files[ 5 ] );

	}


};



FOO.onLoadFile = function () {
	//console.log( "string", FOO.string );

	divPopUp.hidden = false;
	divPopUp.innerHTML = FOO.messagePopUp;

	THR.group = THR.setSceneNew( THR.group );
	THR.group.name = "GBXmeshGroup";

	THRU.setSceneNew( THRU.group );

	GBX.parseResponse();

	THR.updateScene( THR.group );

	THRR.updateScene();

	detView.open = false;
	VTdivViewTypes.innerHTML = "";

	detData.open = false;
	JTV.json = undefined;
	JTH.init();
	JTF.init();
	JTVdivJsonTreeView.innerHTML = JTV.getMenu();
	JTVdivJsonTree.addEventListener( "contextmenu", JTV.onContextMenu );


};

const MNU = {};

MNU.toggleDarkMode = function( button ) {

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




THRR.getHtm = function ( intersected ) {

	// assume no JSON data yet - there's only the gbXML data to play with

	//console.log( "intersected", intersected );

	divPopUp.hidden = false;
	divPopUp.innerHTML = "<p>Parsing gbXML data...</p><p>Try again when you see the 'loaded successfully' message";


	THRU.removeLines();

	const faceA = intersected.face.a;
	const faceB = intersected.face.b;
	const faceC = intersected.face.c;

	const obj = intersected.object;
	const objGeo = obj.geometry;
	//console.log( "objGeo", objGeo );

	//objGeo = new THREE.Geometry().fromBufferGeometry( intersected.object.geometry );
	const vertexA = objGeo.vertices[ faceA ];
	//console.log( "vertexA", vertexA );


	//THRU.addTellTale().position.copy( vertexA );

	const verticesFace = [ vertexA, objGeo.vertices[ faceB ], objGeo.vertices[ faceC ], vertexA ];
	THRU.addLine( obj, verticesFace, 0xffff0000 );

	THRU.addLine( obj, objGeo.vertices, 0x000000 );

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

	XTJ.init();

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
		JTV.campus = summaries.find( summary => summary.innerText.includes( "Campus 1"))
		//console.log( "campus", campus );
		JTV.campus.parentNode.open = true;

		detSurf = JTVdivJsonTree.querySelector("#JTVdetSurface");
		detSurf.open = true;

		panelsHtml = Array.from( detSurf.children).slice(1);
		panelsHtml.forEach( item => item.className = item.classList.remove("active") );
		panelsHtml.forEach( item => item.open = false );
		panelsHtml[index].open = true;
		panelsHtml[index].scrollIntoView();
		panelsHtml[index].classList.add( "active" );
		Array.from( panelsHtml[index].children ).forEach( child => child.open = true );

	} else {

		// divPopUp.hidden = false;
		// divPopUp.innerHTML = "<p>Parsing gbXML data...</p><p>Try again when you see the 'loaded successfully' message</p>";

	}


};


GBX.toggleSpaceTitles = function() {

	XTJ.init();

	if ( !GBX.texts ) {

		const floors = THR.group.children.filter( mesh => ["InteriorFloor", "RaisedFloor", "SlabOnGrade" ].includes( mesh.userData.type ));
		//console.log( "floors", floors );

		const spaceIds = floors.map( floor => JTV.json.Campus.Surface[ floor.userData.index ].AdjacentSpaceId )
		.map( id => Array.isArray( id ) ? id[ 0 ][ "@attributes"].spaceIdRef : id[ "@attributes"].spaceIdRef)
		//console.log( "spaceIds", spaceIds );

		GBX.texts = floors.map( ( floor, i ) => floor.add( THRU.drawPlacard( spaceIds[ i ], THR.radius / 1000, 0xffffff,
			floor.geometry.boundingSphere.center.add( new THREE.Vector3( 0, 0, 2 ) ) ) ) );

		// texts = floors.map( ( floor, i ) => floor.add( ... THRU.addDoubleSidedText( { text: spaceIds[ i ],
		// 	size: 2,
		// 	position: floor.geometry.boundingSphere.center.add( new THREE.Vector3( 0, 0, 2 ) ) } ) ) );
		//THRU.group.add( ... texts )

	}
};