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

};


JTV.setMessage = function() {

	if ( !JTV.json ) {

		console.log( "jj", JTV.json );

		divPopUp.innerHTML = "<p>Parsing gbXML data...</p><p>Try again when you see the 'loaded successfully' message";

		setTimeout( JTV.onOpen )

	}
}

JTV.onOpen = function () {


	if ( !JTV.json ) {
		
		const xmlNode = new DOMParser().parseFromString( FOO.string, "text/xml");
		obj = xmlToJson(xmlNode);
		
		JTV.json = obj.gbXML;

		JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, JTV.json, 0 );

		const details = JTVdivJsonTree.querySelectorAll( "details" );

		details[ 0 ].open = true;

		divPopUp.innerHTML = "gbXML parsed to JSON successfully!"

		VT.init() 

	}

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

	//divPopUp.innerHTML += "."

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

	return `<details style="margin: 1ch 0 1ch 1ch;" >
		<summary>${ key } ${ index }: { ${ keys.length } }</summary>${ htm }
	</details>`;

};