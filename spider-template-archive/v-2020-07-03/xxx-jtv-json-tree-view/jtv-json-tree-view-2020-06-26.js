// copyright 2020 Theo Armour. MIT license.
/* global GFO, JTVdivJsonTreeView, JTVdivJsonTree */
// jshint esversion: 6
// jshint loopfunc: true



const JTV = {};

JTV.root = undefined;
JTV.json = undefined;


JTV.init = function() {

	if ( ! JTV.json ) {

		JTV.root = "THR.group userData";
		JTV.json =  THR.group.children.map( child => ( { data: child.userData, geometry: child.geometry, 
			color: child.material.color } ) );
	}

}

JTV.onLoad = function ( index ) {

	if ( !JTVdivJsonTreeView.innerHTML ) {
		JTH.init();
		JTF.init();
		//JTE.init();
		JTV.count = 0;

		JTVdivJsonTreeView.innerHTML = `
		<details id=JTVdetJsonTreeView style="margin: 1ch 0 1ch 1ch;" open>
			<summary>JSON Tree View</summary>
			${ JTV.parseJson( JTV.root, JTV.json, 0 ) }
		</details>`;

	}

	const details = JTVdetJsonTreeView.querySelector( "details" );

	details.open = true;

	//JTVdetJsonTreeView.firstChild.firstChild.open = true

	if( index ) { JTV.showJson( index ); }

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

	return `<details id=JTVdetArr>
		<summary style="padding: 0 0 1ch 0;" >${ key } [ ${ array.length } ]</summary>${ htm }
	</details>`;

};



JTV.getObject = function ( key, item, index ) {

	//console.log( 'item:', key, item, index ); 

	let butt = "";
	let id = "";

	if ( key === "THR.group userData") { 
		
		//console.log( "data", key, item, index )
		butt = `
		<div>
			<button onclick=JTV.showMesh(${JTV.count}) title="show or hide the object" >highlight object ${ JTV.count + 1 }</button>
		</div>`
		id = ` id=JDTdet${ JTV.count } class=JTVdetSurfaces `;
		JTV.count ++;
	}

	const keys = Object.keys( item );
	const htm = keys.map( key => JTV.parseJson( key, item[ key ] ) ).join( "" );

	return `${ butt }<details ${ id } style="margin: 1ch 0 1ch 1ch;" >
		<summary>${ key } ${ index + 1 }: { ${ keys.length }</summary>${ htm }
	</details>`;

};


JTV.showMesh = function( index ) {

	if ( JTV.clicked ) {

		THR.group.children.forEach( ( mesh, i ) => mesh.visible = true );
		
		JTV.clicked = false;
		
	} else {

		THR.group.children.forEach( ( mesh, i ) => mesh.visible = index === i );

		JTV.clicked = true;
	}

};



JTV.showJson = function (index) {

	console.log( "index", index );

	detNavMenu.open = true;
	detData.open = true;

	//JTH.toggleAll(); // default = close all
	JTVdivJsonTreeView.open = true;
	//JTVdetArr.open = true;
	

	details = JTVdivJsonTreeView.querySelectorAll("details");
	//console.log( "details", details );
	details[0].open = true;

	details[ 1 ].open = true;

	// // //details[4].open = true;

	// // //const index = intersected.object.userData.index;

	detSurfs = JTVdivJsonTreeView.querySelectorAll(".JTVdetSurfaces");

	detSurfs.forEach( item => item.className = item.className.replace(" active", "") );

	const surf = detSurfs[index]; 
	surf.open = true;
	Array.from( surf.children).forEach( child => child.open = true )
	surf.scrollIntoView();
	surf.className += " active";

};