// copyright 2020 Theo Armour. MIT license.
/* global */
// jshint esversion: 6
// jshint loopfunc: true



const JTV = {};



JTV.root = "gbXML";
JTV.json = undefined;



JTV.init = function () {
	
	JTV.json = undefined;
	detView.open = false;
	detData.open = false;
	VTdivViewTypes.innerHTML = "";

	JTH.init();
	JTF.init();
	JTVdivJsonTreeView.innerHTML = JTV.getMenu();

	JTVdivJsonTree.addEventListener( "contextmenu", JTV.onContextMenu );

};

JTV.onContextMenu = function( event ) {

	event.preventDefault();

	//console.log( "event", event.srcElement ) 

	JTV.node = event.srcElement.parentNode;
	
	divPopUp.hidden = false;
	divPopUp.style.left = event.clientX + 0 + "px";
	divPopUp.style.top = event.clientY + "px";

	htm = `
	<p>
		<button onclick="JTV.toggleAllHere();" >open all here</button>
		<button onclick="JTV.toggleAllHere(false);" > close all here</button>
		<button onclick="detNavMenu.scrollTo(0,0)" >go to top</button>
	</p>
	`
	divPopUp.innerHTML = htm;
};


JTV.toggleAllHere = function( boole = true ) {

	//console.log( "node", JTV.node );

	JTV.node.open = boole;

	Array.from( JTV.node.querySelectorAll( "details" ) ).forEach( detail => detail.open = boole );

	//JTV.node.children.forEach( detail => detail.open = boole );

	divPopUp.hidden = true;

};


JTV.setMessage = function() {

	if ( !JTV.json ) {

		//console.log( "jj", JTV.json );

		divPopUp.hidden = false;

		divPopUp.innerHTML = "<p>Parsing gbXML data...</p><p>Try again when you see the 'loaded successfully' message";

		setTimeout( JTV.onOpen )

	}
}

JTV.onOpen = function () {

	// if ( !JTV.json ) {
		
	// 	const xmlNode = new DOMParser().parseFromString( FOO.string, "text/xml");
	// 	obj = XTJ.xmlToJson(xmlNode);
		
	// 	JTV.json = obj.gbXML;

	// 	divPopUp.hidden = false;

	// 	divPopUp.innerHTML = "gbXML parsed to JSON successfully!";
		
	// }

	XTJ.init();
	
	// JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, JTV.json, 0 );

	// JTV.details = JTVdivJsonTree.querySelectorAll( "details" );

	// JTV.details[ 0 ].open = true;


};



JTV.getMenu = function () {

	const htm = `

	<details open >

		<summary class=summary-secondary >
			JSON tree view

			<span class="info" >
			<img class=infoImg  src="../../lib/assets/icons/noun_Information_585560.svg"> 
				<span class="infoTooltip gmd-5" >

				<p>JSON rendered to a tree view using the Spider JSON Tree Viewer script</p>
			</span></span>

		</summary>

		<p>Use the (right-click) Context Menu to open and close sections</p>

		<div id="JTVdivJsonTree"></div>

	</details>`;

	return htm;

};



JTV.parseJson = function ( key = "", item = {}, index = 0 ) { 
	//console.log( '', key, item, index );

	const type = typeof item;

	if ( [ "string", "number", "boolean", "null", "bigint" ].includes( type ) || !item ) {

		return `<div>${ key }: <span style=color:blue >${ item }<span></div>`;

	} else if ( type === 'object' ) {

		return Array.isArray( item ) ? JTV.getArray( key, item, index ) : JTV.getObject( key, item, index );

	}

};



JTV.getArray = function ( key, array, index ) { //console.log( 'Array', key, array );

	const htm = array.map( ( item, index ) => JTV.parseJson( key, item, index ) ).join( "" );

	return `<details id=JTVdet${ key } style="margin: 1ch 0 1ch 1ch;" >
		<summary>${ key } [ ${ array.length } ]</summary>${ htm }
	</details>`;

};



JTV.getObject = function ( key, item, index ) {

	//if ( !item ) { console.log( 'error:', key, item, index ); return; }

	const keys = Object.keys( item );
	const htm = keys.map( key => JTV.parseJson( key, item[ key ] ) ).join( "" );

	return `<details onToggle=JTV.setSurfaceActive(${ index }) style="margin: 1ch 0 1ch 1ch;" >
		<summary>${ key } ${ index + 1}: { ${ keys.length } }</summary>${ htm }
	</details>`;

};

JTV.setSurfaceActive = function( index ){

	detSurf = JTVdivJsonTree.querySelector("#JTVdetSurface");
	detSurf.open = true;

	panelsHtml = Array.from( detSurf.children).slice(1);
	panelsHtml.forEach( item => {

		if ( item.open === true ) {

			item.classList.add("active");

		 } else {

			item.classList.remove("active");
		 } 
	} );

};
