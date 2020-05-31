const version = "2020-05-30";

//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/bilt-2019-template.zip";
//urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-fixed.xml";
urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-down-road-utf16.xml";

//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/warwick-university-5k-surfaces.zip";
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/annapolis-md-single-family-residential-2016.xml"
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/pittsburg-airport.zip";
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/GreenBuildingXML/Sample-gbXML-Files@master/gbXML_TRK.xml";
//urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/aspen-co-resort-retail.xml";
//urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/samples-2/Berlin_Office_SAM2017.xml";
//urlGbxmlDefault = "https://GreenBuildingXML.github.io/Sample_gbXML_Files/ChapelHillOffice.xml"

aGithubHref = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-gbxml-viewer";

const description = `
Online interactive <a href="https://www.gbxml.org" target="_blank">gbXML</a> in 3D viewer in your browser 
designed to be forked, hacked and remixed using the WebGL and the 
<a href="https://threejs.org" target="_blank">Three.js</a> JavaScript library
`;

let timeStart;

function init() {
	aGithub.href = aGithubHref;

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	THR.init();

	THR.addLights();

	THR.addGround();

	THR.animate();

	//THR.group = THR.setSceneNew( TMP.group );
	//THR.addMeshes();
	//THR.updateGroup();

	FO.callback = GBX.onLoad;
	FO.init();
	FOZ.init();

	GBX.init();

	const target = window.self === window.top ? window : window.parent;

	target.location.hash = urlGbxmlDefault;

	// EventListener"hashchange" foz & fox

	HRT.initHeart();
}




RAY.getHtm = function ( intersected ) {

	const index = intersected.object.userData.index;
	const surfaceText = GBX.surfaces[ index ]

	const parser = new DOMParser();
	const surfaceXml = parser.parseFromString( surfaceText,"text/xml");
	//console.log( "surfaceXml", surfaceXml );

	const surface = surfaceXml.getElementsByTagName("Surface")[ 0 ]; //.firstChild(); //[0].childNodes[0].nodeValue;
	console.log( "surface", surface );

	const id = Array.from( surface.getElementsByTagName( "CADObjectId") ).pop().textContent;
	//console.log( "id", id );
	const htm = `
	<div>
		type: ${ surface.attributes[ "surfaceType" ].value }<br>
		id: ${ surface[ "id" ] }<br>
		CADobjectId:<br> ${ id }</br>
		<button onclick=GXD.getSurfaceData(${ index }); >view surface data</button>

	</div>`;

	return htm;

};
