
const source = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-gbxml-viewer";

const version = "v-2020-07-01";

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


function init() {

	aGithub.href = source;

	aTitle.innerHTML += ` ${version}`;

	divDescription.innerHTML = description;


	THR.init();
	THR.animate();

	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew( THR.group );

	THRU.group = THR.setSceneNew( THRU.group );
	
	
	FOO.init();

	FOO.requestFile( urlGbxml ); 

	// const target = window.self === window.top ? window : window.parent;

	// if ( target.location.hash === "#README.md" ) { // we are in an iframe and no 3D file called for
		
	//  	FOO.requestFile( urlGbxml ); 
	
	// } else {

	//  	target.location.hash = target.location.hash ? target.location.hash : urlGbxml;

	// }

	THRU.setObjectExplode = VT.setGbxItemsExplode;

};

FOO.onLoadFile = function () {
	//console.log( "string", FOO.string );

	THR.group = THR.setSceneNew( THR.group );
	THR.group.name = "GBXmeshGroup";

	GBX.parseResponse();

	THR.updateScene( THR.group ); 

	RAY.intersectObjects = THR.group.children;

	RAY.addMouseMove();
	// //RAY.addMouseDown();

	JTV.init();

};


RAY.getMeshData = function (index) {

	detNavMenu.open = true;
	detData.open = true;

	JTH.toggleAll(); // default = close all

	// details = JTVdivJsonTree.querySelectorAll("details");

	// details[0].open = true;

	// details[ 2 ].open = true;

	//details[4].open = true;

	//const index = intersected.object.userData.index;

	detSurf = JTVdivJsonTree.querySelector("#JTVdetSurface");

	detSurf.open = true


	panelsHtml = Array.from( detSurf.children).slice(1);

	panelsHtml.forEach( item => item.className = item.className.replace(" active", "") );

	panelsHtml[index].open = true;

	panelsHtml[index].scrollIntoView();

	panelsHtml[index].className += " active";

};



RAY.xxxgetHtm = function ( intersected ) {

	const index = intersected.object.userData.index;

	JTF.findStuff();
	
	const surfaceText = GBX.surfaces[ index ]

	const parser = new DOMParser();
	const surfaceXml = parser.parseFromString( surfaceText,"text/xml");
	//console.log( "surfaceXml", surfaceXml );

	surface = surfaceXml.firstChild; //[0].childNodes[0].nodeValue;
	//console.log( "surface", surface );
	//console.log( "children", surface.children );

	const atts = Array.from(surface.attributes ).map( att => `${ att.name }: ${ att.value } <br>` ).join( "");

	children = Array.from( surface.children ).map( child => `${ child.tagName }: ${ child.textContent }<br> `).join( "" )
	//console.log( "children", children );

	const id = Array.from( surface.getElementsByTagName( "CADObjectId") ).pop().textContent;
	//console.log( "id", id );

	space = surface.getElementsByTagName( "AdjacentSpaceId")
	//console.log( "space", space );

	const htm = `
	<div>
		attributes:<br> ${ atts }<br>
		
		<button onclick=GD.getSurfaceData(${ index }); >view surface data</button>
	</div>`;

	// children:<br>${ children }<br>
	return htm;

};
