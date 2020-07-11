
const version = "v-2020-06-17";

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-gbxml-viewer";

const description = `
Online interactive <a href="https://www.gbxml.org" target="_blank">gbXML</a> in 3D viewer in your browser 
designed to be forked, hacked and remixed using the WebGL and the 
<a href="https://threejs.org" target="_blank">Three.js</a> JavaScript library
`;

//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/bilt-2019-template.zip";
urlGbxml = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-fixed.xml";
//urlGbxmlDefault = "https://ladybug.tools/spider/gbxml-sample-files/bristol-clifton-down-road-utf16.xml";

//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/warwick-university-5k-surfaces.zip";
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/annapolis-md-single-family-residential-2016.xml"
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/pittsburg-airport.zip";
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/GreenBuildingXML/Sample-gbXML-Files@master/gbXML_TRK.xml";
//urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/aspen-co-resort-retail.xml";
//urlGbxml = "https://www.ladybug.tools/spider/gbxml-sample-files/samples-2/Berlin_Office_SAM2017.xml";
//urlGbxmlDefault = "https://GreenBuildingXML.github.io/Sample_gbXML_Files/ChapelHillOffice.xml"


function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	THR.init();
	THR.animate();

	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew( new THREE.Group() );

	FOO.init();
	FOO.doNext = GBX.onLoad;

	FOO.requestFile( urlGbxml ); 

	const target = window.self === window.top ? window : window.parent;

	if ( target.location.hash === "#README.md" ) { // we are in iframe and no 3D file called for
		
	 	FOO.requestFile( urlGbxml ); 
	
	} else {

	 	target.location.hash = target.location.hash ? target.location.hash : urlGbxml;

	}

};

function onLoad() {
	//console.log("response", response);



	//JTV.onLoad();

}




RAY.getHtm = function ( intersected ) {

	const index = intersected.object.userData.index;
	const surfaceText = GBX.surfaces[ index ]

	const parser = new DOMParser();
	const surfaceXml = parser.parseFromString( surfaceText,"text/xml");
	//console.log( "surfaceXml", surfaceXml );

	surface = surfaceXml.firstChild; //[0].childNodes[0].nodeValue;
	//console.log( "surface", surface );

	const atts = Array.from(surface.attributes ).map( att => `${ att.name }: ${ att.value } <br>` ).join( "");

	children = Array.from( surface.children ).map( child => `${ child.tagName }: ${ child.textContent }<br> `).join( "" )
	
	const id = Array.from( surface.getElementsByTagName( "CADObjectId") ).pop().textContent;
	//console.log( "id", id );
	const htm = `
	<div>
		attributes:<br> ${ atts }<br>
		
		<button onclick=GD.getSurfaceData(${ index }); >view surface data</button>
	</div>`;

	// children:<br>${ children }<br>
	return htm;

};
