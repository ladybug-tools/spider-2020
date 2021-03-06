
const source = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-gbxml-viewer";

const version = "v-2020-07-03";

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

	spnVersion.innerHTML = version;

	divDescription.innerHTML = description;


	THR.init();
	THR.animate();

	THR.addLights();

	THR.addGround();

	//THR.group = THR.setSceneNew();

	//THRU.group = THR.setSceneNew();
  
	//THR.updateScene();
	
	//THRR.updateScene();
	
	FOO.init();

	FOO.requestFile( urlGbxml ); 

	THRU.setObjectExplode = VT.setGbxItemsExplode;

};

FOO.onLoadFile = function () {
	//console.log( "string", FOO.string );

	divPopUp.hidden = true;

	THR.group = THR.setSceneNew();
	THR.group.name = "GBXmeshGroup";

	GBX.parseResponse();

	THR.updateScene( THR.group ); 

	THRR.updateScene();

	JTV.init();

};


THRR.getMeshData = function (index) {

	JTV.onOpen();

	detNavMenu.open = true;
	detData.open = true;

	summaries = Array.from( JTVdivJsonTree.querySelectorAll("summary") );
	campus = summaries.find( summary => summary.innerText.includes( "Campus 0"))
	console.log( "campus", campus );
	campus.parentNode.open = true
	
	detSurf = JTVdivJsonTree.querySelector("#JTVdetSurface");
	detSurf.open = true;

	panelsHtml = Array.from( detSurf.children).slice(1);
	panelsHtml.forEach( item => item.className = item.className.replace(" active", "") );
	panelsHtml[index].open = true;

	panelsHtml[index].scrollIntoView();
	panelsHtml[index].className += " active";
	Array.from( panelsHtml[index].children ).forEach( child => child.open = true );


};
