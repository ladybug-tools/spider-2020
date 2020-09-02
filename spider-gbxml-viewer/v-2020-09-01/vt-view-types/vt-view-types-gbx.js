const VT = {};


VT.init = function () {

	const typesArr = GBX.surfaces.map( surface => surface.match( 'surfaceType="(.*?)"' )[ 1 ] );
	VT.surfaceTypes = [ ... new Set( typesArr ) ];
	//console.log( "VT.surfaceTypes ", VT.surfaceTypes  );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	VT.storeys = GBX.string.match( reStoreys );
	VT.storeys = Array.isArray( VT.storeys ) ? VT.storeys : [];
	//console.log( 'VT.storeys', VT.storeys );

	VT.storeyNames = VT.storeys.map( storey => storey.match( /<Name>(.*?)<\/Name>/i )[ 1 ] );
	//console.log( "storeyNames", VT.storeyNames );


	VT.spaceStrings = GBX.string.match( /<Space(.*?)<\/Space>/gi );
	VT.spaceStrings = Array.isArray( VT.spaceStrings ) ? VT.spaceStrings : [];
	//console.log( 'VT.spaceStrings', VT.spaceStrings );

	VT.spaceNames = VT.spaceStrings.map( space => space.match( /<Name>(.*?)<\/Name>/i )[ 1 ] );
	//console.log( "spaceNames", VT.spaceNames );


	VT.zones = GBX.string.match( /<Zone(.*?)<\/Zone>/gi );
	VT.zones = Array.isArray( VT.zones ) ? VT.zones : [];
	//console.log( 'VT.zones', VT.zones );

	VT.zoneNames = VT.zones.map( zone => zone.match( /<Name>(.*?)<\/Name>/i )[ 1 ] );
	//console.log( "zoneNames", VT.zoneNames );

	VT.CADObjectIds = GBX.surfaces.map( surface => surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/i ) );
	//console.log( "VT.CADObjectIds", VT.CADObjectIds );

	VT.CADObjectIds = VT.CADObjectIds.map( text => text ? text : [ "", "" ] ).map( text => text[ 1 ].replace( / \[(.*)\]/, "" ) );

	VT.CADObjects = [ ... new Set( VT.CADObjectIds ) ];
	//console.log( "VT.CADObjects", VT.CADObjects );


	THR.group.children.forEach( surface => surface.userData.positionStart = surface.position.clone() );

	const htm = `
	<p>
		Select multiple items to view. Use cursor keys to scroll through the lists.<br>
	</p>
	<p>
		<button onclick="VT.resetAll();" title="Show all surfaces">&sdotb; reset visibility & position</button>
	</p>

	<div id=VTdivSurfaceTypes>${ this.innerHTML = VT.getElementSelect( VT.surfaceTypes, "surfaceType", '<a href="https://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link1A8" target = "_blank" > Surface</a> Types') }</div>

	<div id=VTdivSpaces>${ this.innerHTML = VT.getElementSelect( VT.spaceNames, "spaceName", '<a href="https://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link19D" target="_blank">Spaces</a>' ) }</div>

	<div id=VTdivStoreys>${ this.innerHTML = VT.getElementSelect( VT.storeyNames, "spaceStoreyName", "Storeys" ) }</div>

	<div id=VTdivZones>${ this.innerHTML = VT.getElementSelect( VT.zoneNames, "spaceZoneName", "Zones" ) }</div>

	<div id=VTdivCadObjects>${ this.innerHTML = VT.getElementSelect( VT.CADObjects, "cadObject", "CAD Objects" ) }</div>

	`;

	VTdivViewTypes.innerHTML = htm;

	VT.setMore();

};


VT.setMore = function () {

	VT.spaces = VT.spaceStrings.map( space => {

		const id = space.match( / id="(.*?)"/ )[ 1 ];
		const name = space.match( /<Name>(.*?)<\/Name>/i )[ 1 ];
		const cadObjectId = space.match( /<CADObjectId>(.*?)<\/CADObjectId>/i )[ 1 ];
		const storeyId = space.match( / buildingStoreyIdRef="(.*?)"/i )[ 1 ];
		//console.log( "storeyId", storeyId );

		const storey = VT.storeys.find( storey => storey.includes( storeyId ) );
		//console.log( "storey", storey );
		const storeyName = storey.match( /<Name>(.*?)<\/Name>/i )[ 1 ];
		//console.log( "sname", storeyName );
		const zoneId = space.match( / zoneIdRef="(.*?)"/i )[ 1 ];

		return { id, cadObjectId, name, storeyId, storeyName, zoneId };

	} );
	//console.log( "spaces", VT.spaces );

	GBX.meshes.forEach( ( mesh, index ) => {

		mesh.userData.id = GBX.surfaces[ index ].match( / id="(.*?)"/ )[ 1 ];
		mesh.userData.name = GBX.surfaces[ index ].match( /<Name>(.*?)<\/Name>/i )[ 1 ];
		mesh.userData.cadObjectId = GBX.surfaces[ index ].match( /<CADObjectId>(.*?)<\/CADObjectId>/i )[ 1 ];
		mesh.userData.cadObject = mesh.userData.cadObjectId.replace( / \[.*\]/, "" );

		let spaceId = GBX.surfaces[ index ].match( / spaceIdRef="(.*?)"/ );
		spaceId = spaceId ? spaceId[ 1 ] : "";
		mesh.userData.spaceId = spaceId;
		const space = VT.spaces.find( space => space.id === spaceId );
		//console.log( "space", spaceId, space );
		mesh.userData.spaceName = space ? space.name : "";
		mesh.userData.spaceZone = space ? space.zone : "";
		mesh.userData.spaceStoreyName = space ? space.storeyName : "";

	} );

	//console.log( "data", GBX.meshes[ 9 ].userData );

};



VT.getElementSelect = function ( element = [], dataType = "surfaceType", title = "element" ) {

	const htm = `
		<p>
			${ title } (<span>${ element.length }</span>):
			<select id=VTsel${ dataType }  oninput=VT.showTypes(this.selectedOptions,"${ dataType }");
				size=${ element.length < 10 ? element.length : 10 }
				style=resize:vertical;width:100%; multiple>
				${ element.map( ( name, index ) => `<option value=${ index } >${ name }</option>` ) }
			</select>

			<label>
				explode: <output id=VTout${ dataType } >1</output>
				<input type=range
				oninput=VT.setGbxSurfaceExplode(this.value,"${ dataType }");VTout${ dataType }.value=this.value value=1 >
			</label>
		</p>`;

	return htm;

};



VT.showTypes = function ( selectedOptions = "", dataType = "" ) {
	//console.log( "type", dataType, selectedOptions );

	GBX.meshes.forEach( mesh => mesh.visible = false );

	for ( let option of selectedOptions ) {

		GBX.meshes.filter( surface => surface.userData[ dataType ] === option.innerText )
			.forEach( surface => surface.visible = !surface.visible );

	}

};




VT.setGbxSurfaceExplode = function ( value, dataType = "" ) {

	THRU.removeLines();

	GBX.toggleSpaceTitles();

	let items = VT.surfaceTypes;
	items = dataType === "spaceStoreyName" ? VT.storeyNames : items;
	items = dataType === "spaceName" ? VT.spaceNames : items;
	items = dataType === "cadObject" ? VT.CADObjects : items;
	//console.log( "items", items );

	items.forEach( ( item, i ) => {

		GBX.meshes.filter( surface => surface.userData[ dataType ] === item )
			.forEach( surface => surface.position.z = i * value / 5 );

	} );


};



VT.resetAll = function () {

	THRU.removeLines();

	THR.group.children.forEach( mesh => {

		mesh.visible = true;
		mesh.position.copy( mesh.userData.positionStart );
	} );

	//VTspnCount.innerText = THR.group.children.length;
};
