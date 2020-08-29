const VT = {};


VT.init = function () {

	//console.log( "JTV.json ", JTV.json  );

	//XTJ.init();

	VT.onLoad();

};


VT.onLoad = function() {

	const typesArr = GBX.surfaces.map( surface => surface.match( 'surfaceType="(.*?)"' )[ 1 ] );
	VT.surfaceTypes = [ ... new Set( typesArr ) ];
	//console.log( "VT.surfaceTypes ", VT.surfaceTypes  );

	// VT.spaces = [].concat( JTV.json.Campus.Building.Space );
	// VT.spaceNames = VT.spaces.map( space => space.Name["#text"] );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	VT.storeys = GBX.string.match( reStoreys );
	VT.storeys = Array.isArray( VT.storeys ) ? VT.storeys : [];
	//console.log( 'VT.storeys', VT.storeys );

	VT.storeyNames = VT.storeys.map( storey => storey.match( /<Name>(.*?)<\/Name>/i )[ 1 ] );
	//console.log( "storeyNames", VT.storeyNames );


	VT.spaces = GBX.string.match( /<Space(.*?)<\/Space>/gi );
	VT.spaces = Array.isArray( VT.spaces ) ? VT.spaces : [];
	//console.log( 'VT.spaces', VT.spaces );

	VT.spaceNames = VT.spaces.map( space => space.match( /<Name>(.*?)<\/Name>/i )[ 1 ] );
	//console.log( "spaceNames", VT.spaceNames );

	VT.zones = GBX.string.match( /<Zone(.*?)<\/Zone>/gi );
	VT.zones = Array.isArray( VT.zones ) ? VT.zones : [];
	//console.log( 'VT.zones', VT.zones );

	VT.zoneNames = VT.zones.map( zone => zone.match( /<Name>(.*?)<\/Name>/i )[ 1 ] );
	//console.log( "zoneNames", VT.zoneNames );

	VT.CADObjectIds = GBX.surfaces.map( surface => surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/i ));
	console.log( "VT.CADObjectIds", VT.CADObjectIds );

	VT.CADObjectIds = VT.CADObjectIds.map( text => text ? text: ["", "" ] ).map( text => text[ 1 ].replace( /\[(.*)\]/, "" ) );

	VT.CADObjects = [ ... new Set( VT.CADObjectIds ) ];
	console.log( "VT.CADObjects", VT.CADObjects );


	//THR.group.children.forEach( surface => surface.userData.positionStart = surface.position.clone() );

	const htm = `
	<p>
		Select multiple items to view. Use cursor keys to scroll through the lists.<br>
	</p>
	<p>
		<button onclick="VT.resetAll();" title="Show all surfaces">&sdotb; reset visibility & position</button>
	</p>

	<div id=VTdivStoreys>${ this.innerHTML = VT.getElementSelect( "Surface Types", VT.surfaceTypes ) }</div>

	<div id=VTdivStoreys>${ this.innerHTML = VT.getElementSelect("Storeys",VT.storeyNames) }</div>

	<div id=VTdivSpaces>${ this.innerHTML = VT.getElementSelect( "Spaces", VT.spaceNames ) }</div>

	<div id=VTdivZones>${ this.innerHTML = VT.getElementSelect( "Zones", VT.zoneNames ) }</div>

	<div id=VTdivCadObjects>${ this.innerHTML = VT.getElementSelect( "CAD Objects", VT.CADObjects ) }</div>

	`;



	// const xxx= `

	// <p>
	// 	Spaces (<span>${ VT.spaceNames.length }</span> visible):
	// 	<select id=selSpaces oninput=VT.showSpaces(this.selectedOptions);
	// 	size=${ VT.spaceNames.length < 10 ? VT.spaceNames.length : 10 }
	// 	style=resize:vertical;width:100%; multiple>
	// 		${ VT.spaceNames.map(( name, index) => `<option value=${index} >${name}</option>`) }
	// 	</select>
	// </p>

	// <p>
	// 	Storeys (<span>${ VT.storeyNames.length }</span> visible):
	// 	<select id=selStoreys oninput=VT.showStoreys(this.selectedOptions);
	// 	size=${ VT.storeyNames.length < 10 ? VT.storeyNames.length : 10 } style=resize:vertical;width:100%; multiple>
	// 		${ VT.storeyNames.map(( name, index) => `<option value=${index} >${name}</option>`) }
	// 	</select>

	// 	<label>
	// 		explode: <output id=VToutExplode >1</output>
	// 		<input type=range id="VTrngExplode"
	// 		oninput=VT.setGbxStoreyExplode(this.value);VToutExplode.value=this.value value=1 >
	// 	</label>
	// </p>

	// <p>
	// 	Zones (<span>${ VT.zoneNames.length }</span> visible):
	// 	<select id=selzones oninput=VT.showZones(this.selectedOptions);
	// 	size=${ VT.zoneNames.length < 10 ? VT.zoneNames.length : 10 }
	// 	style=resize:vertical;width:100%; multiple>
	// 		${ VT.zoneNames.map(( name, index) => `<option value=${index} >${name}</option>`) }}
	// 	</select>
	// 	<label>
	// 		explode: <output id=VToutZoneExplode >1</output>
	// 		<input type=range id="VTrngZoneExplode"
	// 		oninput=VT.setGbxZoneExplode(this.value);VToutZoneExplode.value=this.value value=1 >
	// 	</label>
	// </p>

	// <p>
	// 	CAD Objects (<span>${ VT.cadObjects.length }</span> visible):
	// 	<select id=selzones oninput=VT.showCadObjects(this.selectedOptions);
	// 		size=${ VT.cadObjects.length < 10 ? VT.cadObjects.length : 10 }
	// 		style=resize:vertical;width:100%; multiple>
	// 		${ VT.cadObjects.map(( name, index) => `<option value=${index} >${name}</option>`) }}
	// 	</select>

	// 	<label>
	// 		explode: <output id=VToutCadObjectExplode >1</output>
	// 		<input type=range
	// 		oninput=VT.setGbxCadObjectExplode(this.value);VToutCadObjectExplode.value=this.value value=1 >
	// 	</label>
	// </p>`;

	// //return htm;

	VTdivViewTypes.innerHTML = htm;

};


VT.getSurfaceTypes = function () {

	const htm = `
		<p>
			Surface Types (<span>${ VT.surfaceTypes.length }</span>):
			<select id=selTypes oninput=VT.showTypes(this.selectedOptions);
				size=${ VT.surfaceTypes.length < 10 ? VT.surfaceTypes.length : 10 }
				style=resize:vertical;width:100%; multiple>
				${ VT.surfaceTypes.map( ( name, index ) => `<option value=${ index } >${ name }</option>` ) }
			</select>

			<label>
				explode: <output id=VToutSurfaceExplode >1</output>
				<input type=range
				oninput=VT.setGbxSurfaceExplode(this.value);VToutSurfaceExplode.value=this.value value=1 >
			</label>
		</p>`;

	return htm;


};

VT.getStoreys = function() {

	const htm = `
		<p>
			Storeys (<span>${ VT.storeyNamesArr.length }</span>):
			<select id=selStoreys oninput=VT.showTypes(this.selectedOptions);
				size=${ VT.storeyNamesArr.length < 10 ? VT.storeyNamesArr.length : 10 }
				style=resize:vertical;width:100%; multiple>
				${ VT.storeyNamesArr.map( ( name, index ) => `<option value=${ index } >${ name }</option>` ) }
			</select>

			<label>
				explode: <output id=VToutSurfaceExplode >1</output>
				<input type=range
				oninput=VT.setGbxSurfaceExplode(this.value);VToutSurfaceExplode.value=this.value value=1 >
			</label>
		</p>`;

	return htm;


}


VT.getElementSelect = function( title="element", element = [] ) {

	const htm = `
		<p>
			${ title } (<span>${ element.length }</span>):
			<select id=selStoreys oninput=VT.showTypes(this.selectedOptions);
				size=${ element.length < 10 ? element.length : 10 }
				style=resize:vertical;width:100%; multiple>
				${ element.map( ( name, index ) => `<option value=${ index } >${ name }</option>` ) }
			</select>

			<label>
				explode: <output id=VToutSurfaceExplode >1</output>
				<input type=range
				oninput=VT.setGbxSurfaceExplode(this.value);VToutSurfaceExplode.value=this.value value=1 >
			</label>
		</p>`;

	return htm;


}

VT.showTypes = function (selectedOptions) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {

		VT.surfaces.filter( surface => surface[ "@attributes" ].surfaceType === option.innerText )
			.map( surface => VT.surfaces.indexOf( surface ) )
			.forEach( index => THR.group.children[ index ].visible = true );

	}
};

VT.showSpaces = function (selectedOptions) {

	if( !VT.spaces[0].SpaceBoundary) { alert(
		"There is no SpaceBoundary in this file.\n\nThis may be an old file.\n\nIf you really need to view the data the necessary code could be added."); return; }

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {

		VT.spaces[ option.value ].SpaceBoundary.map( item => item["@attributes"].surfaceIdRef )
			.map( id => VT.surfaces.find( surface => surface["@attributes"].id === id ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].visible = true );
	}
};


VT.showStoreys = function( selectedOptions ) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {

		const storeyId = JTV.json.Campus.Building.BuildingStorey[option.value]["@attributes"].id;
		//console.log( "storeyId", storeyId );

		const surfaceIds = VT.spaces.filter( space => space["@attributes"].buildingStoreyIdRef === storeyId )
			.flatMap( space =>
				space.SpaceBoundary.map( item => item["@attributes"].surfaceIdRef )
			);
		//const console.log( "surfaceIds", surfaceIds );

		surfaces = VT.surfaces.filter( surface => surfaceIds.includes( surface["@attributes"].id ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].visible = true );

	}

};



VT.showZones = function( selectedOptions ) {


	if( !VT.spaces[0].SpaceBoundary) {

		alert(  "There is no SpaceBoundary in this file.\n\nThis may be an old file.\n\nIf you really need to view the data the necessary code could be added.");
		return;

	}

	THR.group.children.forEach(mesh => mesh.visible = false );
	for (let option of selectedOptions) {

		const zoneId = JTV.json.Zone[option.value]["@attributes"].id;
		//console.log( "zoneId", zoneId );

		const surfaceIds = VT.spaces.filter( space => space["@attributes"].zoneIdRef === zoneId )
			.flatMap( space =>
				space.SpaceBoundary.map( item => item["@attributes"].surfaceIdRef )
			);
		//const console.log( "surfaceIds", surfaceIds );

		VT.surfaces.filter( surface => surfaceIds.includes( surface["@attributes"].id ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].visible = true );

	}

};

VT.showCadObjects = function( selectedOptions ) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {

		VT.surfacesCadObj.filter( surface => surface.CADObjectId["#text"].includes( option.innerText ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].visible = true );

	}

};


VT.setGbxStoreyExplode = function( value ) {

	THRU.removeLines();

	GBX.toggleSpaceTitles();

	let items = JTV.json.Campus.Building.BuildingStorey;

	items = Array.isArray( items ) ? items : [ items ];
	const itemIds = items.map( item => item["@attributes"].id );
	//console.log( "ids", itemIds);

	itemIds.forEach( (itemId, i ) => {

		const spaces = VT.spaces.filter( space => space["@attributes"].buildingStoreyIdRef === itemId );

		const surfaceIds = spaces.flatMap( space => space.SpaceBoundary.map( item => item["@attributes"].surfaceIdRef ) );
		//console.log( "surfaceIds", surfaceIds );

		surfaces = VT.surfaces.filter( surface => surfaceIds.includes( surface["@attributes"].id ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].position.z = i * value / 5 );


	} );

};


VT.setGbxZoneExplode = function( value ) {

	THRU.removeLines();

	GBX.toggleSpaceTitles();

	let items = JTV.json.Zone;
	items = Array.isArray( items ) ? items : [ items ];
	const itemIds = items.map( item => item["@attributes"].id );
	//console.log( "ids", itemIds);

	itemIds.forEach( (itemId, i ) => {

		const surfaceIds = VT.spaces.filter( space => space["@attributes"].zoneIdRef === itemId )
			.flatMap( space => space.SpaceBoundary.map( item => item["@attributes"].surfaceIdRef ) );
		//console.log( "surfaceIds", surfaceIds );

		surfaces = VT.surfaces.filter( surface => surfaceIds.includes( surface["@attributes"].id ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].position.z = i * value / 5 );

	} );

};

VT.setGbxSurfaceExplode = function( value ) {

	THRU.removeLines();

	GBX.toggleSpaceTitles();

	let items = VT.surfaceTypes;

	items.forEach( (item, i ) => {

		surfaces = VT.surfaces.filter( surface => surface["@attributes"].surfaceType === item)
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].position.z = i * value / 5 );

	} );

};


VT.setGbxCadObjectExplode = function( value ) {

	THRU.removeLines();

	GBX.toggleSpaceTitles();

	let items = VT.cadObjects

	items.forEach( (item, i ) => {

		surfaces = VT.surfacesCadObj.filter( surface => surface.CADObjectId["#text"].includes( item ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].position.z = i * value / 5 );

	} );

};



VT.resetAll = function () {

	THRU.removeLines()

	THR.group.children.forEach(mesh => {

		mesh.visible = true;
		mesh.position.copy( mesh.userData.positionStart);
	 } );

	//THR.group.children.forEach( mesh => mesh.position = mesh.userData.positionStart );

	//VTspnCount.innerText = THR.group.children.length;
};

