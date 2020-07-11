// copyright 2020 Theo Armour. MIT license.
/* global */
// jshint esversion: 6
// jshint loopfunc: true



const JTV = {};


//JTV.target = JTVdivJsonTreeView;
JTV.root = "gbXML";
JTV.json = undefined;



JTV.init = function () {

	JTV.reset();

	if ( FOO.string.length < 3000000 ) {
		setTimeout( 500 );
		requestIdleCallback( JTV.onOpen);

	}

};

JTV.reset = function() {
	
	JTVdivJsonTreeView.innerHTML = JTV.getMenu();

	JTV.json = undefined;
	detView.open = false;
	detData.open = false;
	VTdivViewTypes.innerHTML = "";
	JTVdivJsonTree.innerHTML = "";


};

JTV.onOpen = function () {

	console.log("FOO.string len", FOO.string.length);

	if ( !JTV.json ) {
		
		const xmlNode = new DOMParser().parseFromString( FOO.string, "text/xml");
		obj = xmlToJson(xmlNode);
		
		JTV.json = obj.gbXML;
	}

	if ( JTVdivJsonTree.innerHTML === "") {

		JTH.init();
		JTF.init();
		//JTE.init();

		JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, JTV.json, 0 );

	}

	const details = JTVdivJsonTree.querySelectorAll( "details" );

	details[ 0 ].open = true;

};



JTV.getMenu = function () {

	const htm = `

	<details open >

		<summary class=sumMenuTitle >
			JSON tree view

			<span class="info" >??<span class="infoTooltip" >

				<p>JSON rendered to a tree view using the Spider JSON Tree Viewer script</p>

		</summary>

		<div id="JTVdivJsonTree"></div>

	</details>

`;

	return htm;

};



JTV.parseJson = function ( key = "", item = {}, index = 0 ) { //console.log( '', key, item, index );
	const type = typeof item;

	if ( [ "string", "number", "boolean", "null", "bigint" ].includes( type ) || !item ) {

		//return JTV.getString( key, item, index );

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

	return `<details style="margin: 1ch 0 1ch 1ch;" >
		<summary>${ key } ${ index }: { ${ keys.length } }</summary>${ htm }
	</details>`;

};
