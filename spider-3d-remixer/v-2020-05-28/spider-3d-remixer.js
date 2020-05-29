// copyright 2020 Theo Armour. MIT license.
/* globals aSource, imgIcon, sTitle, sVersion, divContent, divDescription, expandButton, navMenu, THR */
// jshint esversion: 6
// jshint loopfunc: true

const version = "2020-05-28";


aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-3d-remixer/";
//imgIcon.src = "assets/github-mark-32.png";

//sTitle.innerHTML = document.title; // ? document.title : location.href.split( '/' ).pop().slice( 0, - 5 ).replace( /-/g, ' ' );
//const version = document.head.querySelector( "[ name=version ]" );
///sVersion.innerHTML = version ? version.content : "";

description = document.head.querySelector( "[ name=description ]" ).content;



//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/bilt-2019-template.zip";
//urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-fixed.xml";
//urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-down-road-utf16.xml";

//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/warwick-university-5k-surfaces.zip";
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/annapolis-md-single-family-residential-2016.xml"
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/pittsburg-airport.zip";
//urlGbxmlDefault = "https://cdn.jsdelivr.net/gh/GreenBuildingXML/Sample-gbXML-Files@master/gbXML_TRK.xml";
//urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/aspen-co-resort-retail.xml";
urlGbxmlDefault = "https://www.ladybug.tools/spider/gbxml-sample-files/samples-2/Berlin_Office_SAM2017.xml";
//urlGbxmlDefault = "https://GreenBuildingXML.github.io/Sample_gbXML_Files/ChapelHillOffice.xml"



//init();


function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	if ( window.innerWidth < 640 || window.innerHeight < 640 ) {

		toggleNavMenu();

	} else {

		detNavMenu.open = true
	}

	THR.init();
	THR.animate();

}

function toggleNavMenu () {

	navMenu.classList.toggle( 'collapsed' );

}


THR.onLoad = function ( event ) {

	console.log( 'event thr', event );

	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	//THR.addMeshes();

	
	FO.init();
	FRA.init();

	THR.updateGroup( THR.group );

	const target = window.self === window.top ? window : window.parent;

	target.location.hash = urlGbxmlDefault;


};

function requestFile(url, callback, type = "json") {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	//xhr.responseType = "json";
	xhr.onerror = xhr => console.log("error:", xhr);
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = xhr => callback(xhr.target.response);
	xhr.send(null);
}

