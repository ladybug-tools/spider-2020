const VT = {};


VT.init = function () {

	console.log( "JTV.json ", JTV.json );

	VT.surfaces = JTV.json.Campus.Surface;

	const typesArr = VT.surfaces.map( surface => surface[ "@attributes" ].surfaceType );
	VT.surfaceTypes = [ ... new Set( typesArr ) ]
	
	VT.spaces = [].concat( JTV.json.Campus.Building.Space );
	VT.spaceNames = VT.spaces.map( space => space.Name["#text"] );

	stories = Array.isArray(  JTV.json.Campus.Building.BuildingStorey  ) ? 
		JTV.json.Campus.Building.BuildingStorey  : [  JTV.json.Campus.Building.BuildingStorey  ];
	VT.storeyNames = JTV.json.Campus.Building.BuildingStorey ?
		stories.map( storey => storey.Name["#text"] ) : [];
	VT.zones = [].concat( JTV.json.Zone ); // ? JTV.json.Zone : [ JTV.json.Zone ];
	VT.zoneNames = VT.zones.map( zone => zone.Name["#text"] );

	cadObjectIds = VT.surfaces.map( surface => surface.CADObjectId )
		.map( item => item["#text"].replace( / \[.*\]/, "")  );
	VT.cadObjects = [ ... new Set( cadObjectIds ) ]
	//console.log( "cadObjects", VT.cadObjects );

	const htm = `
    <p>
        Select multiple surface types to view. Use cursor keys to scroll through the list.<br>
    </p>
	<p>
		Surface Types (<span>${ VT.surfaceTypes.length }</span> visible):
		<select id=selTypes oninput=VT.showTypes(this.selectedOptions); 
			size=${ VT.surfaceTypes.length < 10 ? VT.surfaceTypes.length : 10 } 
			style=resize:vertical;width:100%; multiple>
			${ VT.surfaceTypes.map(( name, index) => `<option value=${index} >${name}</option>`)}
		</select>
	</p>
	<p>
		Spaces (<span>${ VT.spaceNames.length }</span> visible):
		<select id=selSpaces oninput=VT.showSpaces(this.selectedOptions); 
		size=${ VT.spaceNames.length < 10 ? VT.spaceNames.length : 10 } 
		style=resize:vertical;width:100%; multiple>
			${ VT.spaceNames.map(( name, index) => `<option value=${index} >${name}</option>`) }
		</select>
	</p>

	<p>
		Storeys (<span>${ VT.storeyNames.length }</span> visible):
		<select id=selStoreys oninput=VT.showStoreys(this.selectedOptions); 
		size=${ VT.storeyNames.length < 10 ? VT.storeyNames.length : 10 } style=resize:vertical;width:100%; multiple>
			${ VT.storeyNames.map(( name, index) => `<option value=${index} >${name}</option>`) }
		</select>
	</p>
	<p>
		Zones (<span>${ VT.zoneNames.length }</span> visible):
		<select id=selzones oninput=VT.showZones(this.selectedOptions); 
		size=${ VT.zoneNames.length < 10 ? VT.zoneNames.length : 10 } 
		style=resize:vertical;width:100%; multiple>
			${ VT.zoneNames.map(( name, index) => `<option value=${index} >${name}</option>`) }}
		</select>
	</p>

	<p>
		CAD Objects (<span>${ VT.cadObjects.length }</span> visible):
		<select id=selzones oninput=VT.showCadObjects(this.selectedOptions); 
			size=${ VT.cadObjects.length < 10 ? VT.cadObjects.length : 10 } 
			style=resize:vertical;width:100%; multiple>
			${ VT.cadObjects.map(( name, index) => `<option value=${index} >${name}</option>`) }}
		</select>
	</p>
    <p>
        <button onclick="VT.setAllVisible();" title="Show all surfaces">&sdotb; all visible</button>
    </p>`;

	return htm;
};

VT.showTypes = function (selectedOptions) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {

		VT.surfaces.filter( surface => surface[ "@attributes" ].surfaceType === option.innerText )
			.map( surface => VT.surfaces.indexOf( surface ) )
			.forEach( index => THR.group.children[ index ].visible = true );

	}
};

VT.showSpaces = function (selectedOptions) {

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

		VT.surfaces.filter( surface => surface.CADObjectId["#text"].includes( option.innerText ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].visible = true );

	}	

};
