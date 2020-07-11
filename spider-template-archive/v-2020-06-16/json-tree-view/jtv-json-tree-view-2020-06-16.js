// copyright 2020 Theo Armour. MIT license.
/* global GFO, JTVdivJsonTreeView, JTVdivJsonTree */
// jshint esversion: 6
// jshint loopfunc: true



const JTV = {};

JTV.root = undefined;
JTV.json = undefined;


JTV.onLoad = function () {

	JTV.root = "THR.group userData";
	JTV.json =  THR.group.children.map( child => ( { data: child.userData, geometry: child.geometry, 
		color: child.material.color } ) );
	
	JTH.init();
	JTF.init();
	//JTE.init();
	JTV.count = 0;

	JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, JTV.json, 0 );

	details = JTVdivJsonTree.querySelectorAll( "details" );

	details[ 0 ].open = true;



};



JTV.parseJson = function ( key = "", item = {}, index = 0 ) { //console.log( '', key, item, index );
	const type = typeof item;

	if ( [ "string", "number", "boolean", "null", "bigint" ].includes( type ) || !item ) {

		return `<div>${ key }: <span style=color:blue >${ item }<span></div>`;

	} else if ( type === 'object' ) {

		return Array.isArray( item ) ? JTV.getArray( key, item, index ) : JTV.getObject( key, item, index );

	}

};



JTV.getArray = function ( key, array, index ) { //console.log( 'Array', key, array );

	const htm = array.map( ( item, index ) => JTV.parseJson( key, item, index ) ).join( "" );

	return `<details style="margin: 1ch 0 1ch 1ch;" >
		<summary>${ key } [ ${ array.length } ]</summary>${ htm }
	</details>`;

};



JTV.getObject = function ( key, item, index ) {

	//console.log( 'item:', key, item, index ); 

	let butt = "";
	let id = "";

	if ( key === "THR.group userData") { 
		
		//console.log( "data", key, item, index )
		butt = `<p><button onclick=JTV.showObject(${JTV.count})>highlight object ${ JTV.count + 1 }</button></p>`
		id = ` id=JDTdet${ JTV.count } `;
		JTV.count ++;
	}

	const keys = Object.keys( item );
	const htm = keys.map( key => JTV.parseJson( key, item[ key ] ) ).join( "" );

	return `${ butt }<details ${ id } style="margin: 1ch 0 1ch 1ch;" >
		<summary>${ key } ${ index }: { ${ keys.length } }</summary>${ htm }
	</details>`;

};


JTV.showObject = function( index ) {

	THR.group.children.forEach( ( mesh, i ) => mesh.visible = index === i );

}